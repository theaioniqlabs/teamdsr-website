import {
  nationalCities,
  globalRegions,
  getGlobalCities,
} from "../data/expansion.js";
import { resolveSitePath } from "../utils/site-root.js";
import { initReveal } from "../utils/reveal.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function waitForLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      if (window.L) {
        clearInterval(id);
        resolve(window.L);
      } else if (tries > 80) {
        clearInterval(id);
        reject(new Error("Leaflet failed to load"));
      }
    }, 50);
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createPulseIcon(L, index, { active = false } = {}) {
  const delay = ((index % 8) * 0.28).toFixed(2);
  const reduced = prefersReducedMotion() ? " exp-marker--static" : "";
  const activeClass = active ? " is-active" : "";
  return L.divIcon({
    className: "exp-marker-wrap",
    html: `<span class="exp-marker${reduced}${activeClass}" style="--exp-delay:${delay}s" aria-hidden="true"><span class="exp-marker__ring"></span><span class="exp-marker__core"></span></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -10],
  });
}

function addBasemapTiles(L, map) {
  /* Esri Light Gray — free light canvas (Carto Positron now requires an API key). */
  return L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS',
      maxZoom: 16,
    }
  ).addTo(map);
}

async function loadIndiaGeoJson(L, map) {
  try {
    const response = await fetch(resolveSitePath("assets/geo/india.json"));
    if (!response.ok) return null;
    const geo = await response.json();
    const layer = L.geoJSON(geo, {
      style: {
        color: "#b51224",
        weight: 1.5,
        opacity: 0.85,
        fillColor: "#b51224",
        fillOpacity: 0.08,
      },
      interactive: false,
    }).addTo(map);
    return layer;
  } catch {
    return null;
  }
}

function renderNationalChips(root) {
  if (!root) return;
  root.innerHTML = nationalCities
    .map(
      (city) => `
      <li>
        <button type="button" class="exp-chip" data-city="${escapeHtml(city.name)}">${escapeHtml(city.name)}</button>
      </li>
    `
    )
    .join("");
}

function renderGlobalRegions(root) {
  if (!root) return;
  root.innerHTML = globalRegions
    .map(
      (region) => `
      <article class="exp-region" data-region="${escapeHtml(region.country)}">
        <h3 class="exp-region__country">${escapeHtml(region.country)}</h3>
        <ul class="exp-chips">
          ${region.cities
            .map(
              (city) => `
            <li>
              <button type="button" class="exp-chip" data-city="${escapeHtml(city.name)}" data-country="${escapeHtml(region.country)}">${escapeHtml(city.name)}</button>
            </li>
          `
            )
            .join("")}
        </ul>
      </article>
    `
    )
    .join("");
}

function syncActive(page, cityName, on) {
  page.querySelectorAll(".exp-chip").forEach((chip) => {
    chip.classList.toggle("is-active", on && chip.dataset.city === cityName);
  });
}

function wireChipSync(page, markerByCity) {
  page.querySelectorAll(".exp-chip[data-city]").forEach((chip) => {
    const activate = () => {
      const city = chip.dataset.city;
      syncActive(page, city, true);
      const entry = markerByCity.get(city);
      if (!entry) return;
      entry.marker.setIcon(createPulseIcon(window.L, entry.index, { active: true }));
      entry.marker.openPopup();
      entry.map.panTo(entry.marker.getLatLng(), { animate: !prefersReducedMotion() });
    };

    const deactivate = () => {
      const city = chip.dataset.city;
      syncActive(page, city, false);
      const entry = markerByCity.get(city);
      if (!entry) return;
      entry.marker.setIcon(createPulseIcon(window.L, entry.index, { active: false }));
      entry.marker.closePopup();
    };

    chip.addEventListener("mouseenter", activate);
    chip.addEventListener("focus", activate);
    chip.addEventListener("mouseleave", deactivate);
    chip.addEventListener("blur", deactivate);
    chip.addEventListener("click", (event) => {
      event.preventDefault();
      activate();
    });
  });
}

async function initIndiaMap(page, markerByCity) {
  const L = await waitForLeaflet();
  const el = page.querySelector("#exp-map-india");
  if (!el) return;

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false,
  });

  addBasemapTiles(L, map);
  const indiaLayer = await loadIndiaGeoJson(L, map);

  const bounds = [];
  nationalCities.forEach((city, index) => {
    const marker = L.marker([city.lat, city.lng], {
      icon: createPulseIcon(L, index),
      keyboard: true,
      title: city.name,
      riseOnHover: true,
    }).addTo(map);

    marker.bindPopup(`<strong>${escapeHtml(city.name)}</strong>`, {
      closeButton: false,
      className: "exp-popup",
    });

    marker.on("mouseover", () => {
      syncActive(page, city.name, true);
      marker.setIcon(createPulseIcon(L, index, { active: true }));
      marker.openPopup();
    });
    marker.on("mouseout", () => {
      syncActive(page, city.name, false);
      marker.setIcon(createPulseIcon(L, index, { active: false }));
      marker.closePopup();
    });

    markerByCity.set(city.name, { marker, index, map });
    bounds.push([city.lat, city.lng]);
  });

  if (indiaLayer) {
    map.fitBounds(indiaLayer.getBounds(), { padding: [28, 28], maxZoom: 5 });
  } else if (bounds.length) {
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }

  el._leaflet_map = map;
  requestAnimationFrame(() => {
    map.invalidateSize();
    if (indiaLayer) {
      map.fitBounds(indiaLayer.getBounds(), { padding: [28, 28], maxZoom: 5 });
    } else if (bounds.length) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
    }
  });
  return map;
}

async function initWorldMap(page, markerByCity) {
  const L = await waitForLeaflet();
  const el = page.querySelector("#exp-map-world");
  if (!el) return;

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false,
    worldCopyJump: true,
  });

  addBasemapTiles(L, map);

  const cities = getGlobalCities();
  const bounds = [];
  const offset = nationalCities.length;

  cities.forEach((city, i) => {
    const index = offset + i;
    const marker = L.marker([city.lat, city.lng], {
      icon: createPulseIcon(L, index),
      keyboard: true,
      title: `${city.name}, ${city.country}`,
      riseOnHover: true,
    }).addTo(map);

    marker.bindPopup(
      `<strong>${escapeHtml(city.name)}</strong><br><span>${escapeHtml(city.country)}</span>`,
      { closeButton: false, className: "exp-popup" }
    );

    marker.on("mouseover", () => {
      syncActive(page, city.name, true);
      marker.setIcon(createPulseIcon(L, index, { active: true }));
      marker.openPopup();
    });
    marker.on("mouseout", () => {
      syncActive(page, city.name, false);
      marker.setIcon(createPulseIcon(L, index, { active: false }));
      marker.closePopup();
    });

    markerByCity.set(city.name, { marker, index, map });
    bounds.push([city.lat, city.lng]);
  });

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 3 });
  }

  el._leaflet_map = map;
  requestAnimationFrame(() => {
    map.invalidateSize();
    if (bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 3 });
    }
  });
  return map;
}

async function initExpansion() {
  const page = document.querySelector(".exp-page");
  if (!page) return;

  const nationalCount = page.querySelector("[data-exp-national-count]");
  const globalCount = page.querySelector("[data-exp-global-count]");
  if (nationalCount) {
    nationalCount.innerHTML = `<strong>${nationalCities.length}</strong> cities across India`;
  }
  if (globalCount) {
    const cityCount = getGlobalCities().length;
    globalCount.innerHTML = `<strong>${globalRegions.length}</strong> countries · <strong>${cityCount}</strong> cities`;
  }

  renderNationalChips(page.querySelector("[data-exp-national-chips]"));
  renderGlobalRegions(page.querySelector("[data-exp-global-regions]"));

  const markerByCity = new Map();

  try {
    await initIndiaMap(page, markerByCity);
    await initWorldMap(page, markerByCity);
    wireChipSync(page, markerByCity);
  } catch (error) {
    console.error(error);
  }

  initReveal(page);

  window.addEventListener(
    "resize",
    () => {
      page.querySelectorAll(".exp-leaflet").forEach((node) => {
        if (node._leaflet_id && window.L) {
          const map = node._leaflet_map;
          map?.invalidateSize?.();
        }
      });
    },
    { passive: true }
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExpansion);
} else {
  initExpansion();
}
