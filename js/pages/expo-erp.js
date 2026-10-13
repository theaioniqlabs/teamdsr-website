import { capabilityGroups, expoModules } from "../data/expo-erp.js";
import { icon } from "../utils/icons.js";
import { initReveal, prefersReducedMotion } from "../utils/reveal.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function renderItems(items) {
  return items
    .map((item) => {
      if (typeof item === "string") {
        return `<li>${escapeHtml(item)}</li>`;
      }
      const children = (item.children || [])
        .map((child) => `<li>${escapeHtml(child)}</li>`)
        .join("");
      return `
        <li class="expo-card__group">
          <span class="expo-card__group-label">${escapeHtml(item.label)}</span>
          <ul>${children}</ul>
        </li>
      `;
    })
    .join("");
}

function renderGroups(root) {
  if (!root) return;
  root.innerHTML = capabilityGroups
    .map(
      (group, index) => `
      <article
        class="expo-card expo-card--group mod mod--cut-${group.cut}${index === 0 ? " expo-card--featured" : ""}"
        data-reveal
      >
        <header class="expo-card__head">
          <span class="td-icon">${icon(group.icon)}</span>
          <div>
            <p class="expo-card__eyebrow">${pad(index + 1)}</p>
            <h3 class="expo-card__title">${escapeHtml(group.title)}</h3>
          </div>
        </header>
        <ul class="expo-card__list">${renderItems(group.items)}</ul>
      </article>
    `
    )
    .join("");
}

function getPerView() {
  return window.matchMedia("(min-width: 720px)").matches ? 2 : 1;
}

function moduleCardHtml(module, index) {
  return `
    <article
      class="expo-card expo-card--module mod mod--cut-${module.cut}${index % 2 === 0 ? " expo-card--featured" : ""}"
      id="module-${escapeHtml(module.number)}"
      data-expo-module-card
      data-module-index="${index}"
    >
      <header class="expo-card__head">
        <span class="expo-card__num">${escapeHtml(module.number)}</span>
        <span class="td-icon">${icon(module.icon)}</span>
        <h3 class="expo-card__title">${escapeHtml(module.title)}</h3>
      </header>
      <ul class="expo-card__list">${renderItems(module.items)}</ul>
    </article>
  `;
}

function renderModulesCarousel(root) {
  if (!root) return null;

  const track = root.querySelector("[data-expo-carousel-track]");
  const controls = document.querySelector("[data-expo-carousel-controls]");
  const dotsRoot = document.querySelector("[data-expo-carousel-dots]");
  const indexEl = document.querySelector("[data-expo-carousel-index]");
  const prevBtn = document.querySelector("[data-expo-carousel-prev]");
  const nextBtn = document.querySelector("[data-expo-carousel-next]");

  if (!track || !controls || !dotsRoot || !prevBtn || !nextBtn) return null;

  prevBtn.innerHTML = icon("chevronLeft");
  nextBtn.innerHTML = icon("chevronRight");
  controls.hidden = false;

  return {
    root,
    track,
    controls,
    dotsRoot,
    indexEl,
    prevBtn,
    nextBtn,
  };
}

function buildPages(track, perView) {
  const pages = [];
  for (let i = 0; i < expoModules.length; i += perView) {
    const slice = expoModules.slice(i, i + perView);
    const start = i + 1;
    const end = i + slice.length;
    pages.push(`
      <div
        class="expo-carousel__page"
        data-expo-carousel-page
        role="group"
        aria-roledescription="slide"
        aria-label="${start === end ? `Module ${start}` : `Modules ${start} to ${end}`} of ${expoModules.length}"
      >
        ${slice.map((module, offset) => moduleCardHtml(module, i + offset)).join("")}
      </div>
    `);
  }
  track.innerHTML = pages.join("");
  return Array.from(track.querySelectorAll("[data-expo-carousel-page]"));
}

function initModulesCarousel(carousel) {
  if (!carousel) return null;

  let page = 0;
  let perView = getPerView();
  let pages = buildPages(carousel.track, perView);
  const reduced = prefersReducedMotion();

  function rebuildDots() {
    carousel.dotsRoot.innerHTML = "";
    pages.forEach((_, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "expo-carousel__dot";
      btn.setAttribute("aria-label", `Go to modules page ${i + 1}`);
      btn.dataset.expoCarouselDot = String(i);
      li.appendChild(btn);
      carousel.dotsRoot.appendChild(li);
    });
  }

  function sync() {
    if (reduced) {
      carousel.track.style.transition = "none";
    } else {
      carousel.track.style.transition = "";
    }

    carousel.track.style.transform = `translateX(-${page * 100}%)`;

    pages.forEach((el, i) => {
      const active = i === page;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-hidden", active ? "false" : "true");
    });

    const start = page * perView + 1;
    const end = Math.min(start + perView - 1, expoModules.length);
    if (carousel.indexEl) {
      carousel.indexEl.textContent =
        start === end
          ? `${pad(start)} / ${pad(expoModules.length)}`
          : `${pad(start)}–${pad(end)} / ${pad(expoModules.length)}`;
    }

    Array.from(carousel.dotsRoot.querySelectorAll("[data-expo-carousel-dot]")).forEach((dot, i) => {
      const active = i === page;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    carousel.prevBtn.disabled = page === 0;
    carousel.nextBtn.disabled = page >= pages.length - 1;
  }

  function goTo(nextPage) {
    page = Math.max(0, Math.min(pages.length - 1, nextPage));
    sync();
  }

  function goToModuleNumber(number) {
    const index = expoModules.findIndex((module) => module.number === number);
    if (index < 0) return false;
    goTo(Math.floor(index / perView));
    return true;
  }

  function refreshLayout(preferredNumber) {
    const currentCard = carousel.track.querySelector(".expo-carousel__page.is-active [data-expo-module-card]");
    const keep =
      preferredNumber ||
      currentCard?.id?.replace("module-", "") ||
      expoModules[page * perView]?.number;

    perView = getPerView();
    pages = buildPages(carousel.track, perView);
    rebuildDots();
    if (keep) goToModuleNumber(keep);
    else goTo(0);
  }

  rebuildDots();
  sync();

  carousel.prevBtn.addEventListener("click", () => goTo(page - 1));
  carousel.nextBtn.addEventListener("click", () => goTo(page + 1));
  carousel.dotsRoot.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-expo-carousel-dot]");
    if (!dot) return;
    goTo(Number(dot.dataset.expoCarouselDot));
  });

  carousel.root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(page - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(page + 1);
    }
  });
  carousel.root.setAttribute("tabindex", "0");

  let startX = 0;
  let deltaX = 0;
  carousel.root.addEventListener(
    "touchstart",
    (event) => {
      startX = event.touches[0].clientX;
      deltaX = 0;
    },
    { passive: true }
  );
  carousel.root.addEventListener(
    "touchmove",
    (event) => {
      deltaX = event.touches[0].clientX - startX;
    },
    { passive: true }
  );
  carousel.root.addEventListener("touchend", () => {
    if (Math.abs(deltaX) < 48) return;
    if (deltaX < 0) goTo(page + 1);
    else goTo(page - 1);
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => refreshLayout(), 140);
  });

  return { goToModuleNumber, refreshLayout };
}

function scrollToHash(carouselApi) {
  const id = window.location.hash.replace("#", "");
  if (!id) return;

  if (id.startsWith("module-") && carouselApi) {
    const number = id.replace("module-", "");
    carouselApi.goToModuleNumber(number);
    document.getElementById("modules")?.scrollIntoView();
    return;
  }

  const target = document.getElementById(id);
  if (target) target.scrollIntoView();
}

function initExpoErp() {
  const page = document.querySelector(".expo-page");
  renderGroups(document.querySelector("[data-expo-groups]"));
  const carousel = renderModulesCarousel(document.querySelector("[data-expo-modules]"));
  const carouselApi = initModulesCarousel(carousel);
  initReveal(page || document);
  scrollToHash(carouselApi);
  window.addEventListener("hashchange", () => scrollToHash(carouselApi));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExpoErp);
} else {
  initExpoErp();
}
