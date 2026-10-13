import { vrmsBands, vrmsKiosk } from "../data/vrms.js";
import { icon } from "../utils/icons.js";
import { initReveal } from "../utils/reveal.js";

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

function featureCard(feature, index, globalIndex) {
  const featured = feature.featured ? " vrms-card--featured" : "";
  const compact = !feature.featured ? " vrms-card--compact" : "";
  return `
    <article
      class="vrms-card mod mod--cut-${feature.cut}${featured}${compact}"
      data-reveal
    >
      <header class="vrms-card__head">
        <span class="vrms-card__num" aria-hidden="true">${pad(globalIndex)}</span>
        <span class="td-icon vrms-card__icon">${icon(feature.icon)}</span>
        <h3 class="vrms-card__title">${escapeHtml(feature.title)}</h3>
      </header>
      <p class="vrms-card__text">${escapeHtml(feature.text)}</p>
    </article>
  `;
}

function renderBands(root) {
  if (!root) return;

  let counter = 0;
  root.innerHTML = vrmsBands
    .map((band) => {
      const cards = band.items
        .map((item) => {
          counter += 1;
          return featureCard(item, counter - 1, counter);
        })
        .join("");

      return `
        <section class="vrms-band" data-band="${escapeHtml(band.id)}" aria-labelledby="vrms-band-${escapeHtml(band.id)}">
          <h3 id="vrms-band-${escapeHtml(band.id)}" class="vrms-band__label" data-reveal>
            ${escapeHtml(band.label)}
          </h3>
          <div class="vrms-band__grid vrms-band__grid--${escapeHtml(band.id)}" data-stagger>
            ${cards}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderKiosk(root) {
  if (!root) return;
  root.innerHTML = `
    <div class="vrms-kiosk__inner mod mod--cut-bl" data-reveal>
      <div class="vrms-kiosk__copy">
        <p class="vrms-kiosk__eyebrow">${escapeHtml(vrmsKiosk.label)}</p>
        <h2 id="vrms-kiosk-title" class="td-display">${escapeHtml(vrmsKiosk.title)}</h2>
        <p class="vrms-kiosk__text">${escapeHtml(vrmsKiosk.text)}</p>
      </div>
      <span class="vrms-kiosk__mark" aria-hidden="true">
        <span class="td-icon">${icon("organized")}</span>
      </span>
    </div>
  `;
}

function initVrms() {
  const page = document.querySelector(".vrms-page");
  if (!page) return;

  renderBands(page.querySelector("[data-vrms-bands]"));
  renderKiosk(page.querySelector("[data-vrms-kiosk]"));
  initReveal(page);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVrms);
} else {
  initVrms();
}
