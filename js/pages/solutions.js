import { pages, solutionsHub } from "../data/solutions.js";
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

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderIntro(page) {
  const stack = (page.title || [])
    .map((line) => `<span class="sol-page__title-line">${escapeHtml(line)}</span>`)
    .join("");
  const kicker = page.kicker
    ? `<p class="sol-page__kicker">${escapeHtml(page.kicker)}</p>`
    : "";
  const body = page.body
    ? `<p class="sol-page__body">${escapeHtml(page.body)}</p>`
    : "";

  return `
    <header class="sol-intro" data-reveal>
      <p class="sol-page__marker">
        <span class="sol-page__marker-label">${escapeHtml(page.markerLabel)}</span>
      </p>
      <h1 class="sol-page__title">
        <span class="sol-page__title-stack">${stack}</span>
      </h1>
      ${kicker}
      ${body}
    </header>
  `;
}

function renderEnquiry(compact = false) {
  return `
    <section class="sol-enquiry${compact ? " sol-enquiry--compact" : ""}" aria-labelledby="sol-enquiry-title">
      <div class="sol-enquiry__band mod mod--xl mod--cut-bl" data-reveal>
        <div>
          <p class="sol-enquiry__marker">Contact</p>
          <h2 id="sol-enquiry-title" class="td-display">Ready to plan the next show?</h2>
          <p>Tell us about your exhibition, event, or technology need.</p>
        </div>
        <a class="sol-enquiry__btn" href="/contact">Send enquiry</a>
      </div>
    </section>
  `;
}

function renderPreEvent(page) {
  const steps = `
    <section class="sol-section sol-spine" aria-label="Process steps">
      <ol class="sol-spine__list" data-stagger>
        ${page.cards
          .map(
            (card, index) => `
          <li class="sol-spine__step" data-reveal>
            <span class="sol-spine__num" aria-hidden="true">${pad(index + 1)}</span>
            <div class="sol-spine__body">
              <header class="sol-spine__head">
                <span class="td-icon">${icon(card.icon)}</span>
                <h2 class="sol-card__title">${escapeHtml(card.title)}</h2>
              </header>
              <ul class="sol-card__list">${listItems(card.items)}</ul>
            </div>
          </li>
        `
          )
          .join("")}
      </ol>
    </section>
  `;
  return `${renderIntro(page)}${steps}${renderEnquiry(true)}`;
}

function renderExhibitions(page) {
  const formats = `
    <ul class="sol-formats" data-reveal aria-label="Event formats">
      ${page.formats.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
    </ul>
  `;
  const punch = `
    <div class="sol-punch" data-reveal>
      <p class="sol-punch__text">${escapeHtml(page.kicker)}</p>
    </div>
  `;
  const services = `
    <section class="sol-section" aria-label="Services">
      <div class="sol-bento" data-stagger>
        ${page.services
          .map(
            (item, index) => `
          <article class="sol-bento__item sol-bento__item--${item.span} mod mod--cut-${item.cut}${index === 0 ? " sol-bento__item--featured" : ""}" data-reveal>
            <span class="td-icon">${icon(item.icon)}</span>
            <h2 class="sol-card__title">${escapeHtml(item.title)}</h2>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
  return `${renderIntro({ ...page, kicker: "" })}${formats}${punch}${services}${renderEnquiry(true)}`;
}

function renderDisplay(page) {
  const groups = ["Displays", "Computing", "Support"];
  const story = `
    <div class="sol-story" data-reveal>
      <article class="sol-story__primary mod--cut-tr">
        <p>${escapeHtml(page.punch[0])}</p>
        <p class="sol-story__punch">${escapeHtml(page.punch[1])}</p>
      </article>
      <ul class="sol-story__support sol-story__support--strong" aria-label="Support">
        ${page.support.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
  const inventory = `
    <section class="sol-section" aria-labelledby="sol-inventory-title">
      <h2 id="sol-inventory-title" class="sol-section__title td-display" data-reveal>Rental inventory</h2>
      <div class="sol-inventory-groups" data-stagger>
        ${groups
          .map((group) => {
            const items = page.inventory.filter((item) => item.group === group);
            if (!items.length) return "";
            return `
              <div class="sol-inventory-group" data-reveal>
                <h3 class="sol-inventory-group__title">${escapeHtml(group)}</h3>
                <ul class="sol-inventory sol-inventory--rows">
                  ${items
                    .map(
                      (item) => `
                    <li class="sol-inventory__item">
                      <span class="td-icon">${icon(item.icon)}</span>
                      <span>${escapeHtml(item.title)}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
  return `${renderIntro(page)}${story}${inventory}${renderEnquiry(true)}`;
}

function renderIt(page) {
  const aside = page.punchAside
    ? `<p class="sol-page__aside" data-reveal>${escapeHtml(page.punchAside)}</p>`
    : "";
  const featuredTitles = new Set(["Application Development", "ERP Development"]);
  const featured = page.tiles.filter((t) => featuredTitles.has(t.title));
  const compact = page.tiles.filter((t) => !featuredTitles.has(t.title));

  const grid = `
    <section class="sol-section" aria-label="IT services">
      <div class="sol-it" data-stagger>
        <div class="sol-it__featured">
          ${featured
            .map(
              (item) => `
            <article class="sol-card sol-card--text sol-card--featured mod mod--cut-${item.cut}" data-reveal>
              <header class="sol-card__head">
                <span class="td-icon">${icon(item.icon)}</span>
                <h2 class="sol-card__title">${escapeHtml(item.title)}</h2>
              </header>
              <p class="sol-card__text">${escapeHtml(item.text)}</p>
            </article>
          `
            )
            .join("")}
        </div>
        <div class="sol-it__compact">
          ${compact
            .map(
              (item) => `
            <article class="sol-card sol-card--text sol-card--compact mod mod--cut-${item.cut}" data-reveal>
              <header class="sol-card__head">
                <span class="td-icon">${icon(item.icon)}</span>
                <h2 class="sol-card__title">${escapeHtml(item.title)}</h2>
              </header>
              <p class="sol-card__text">${escapeHtml(item.text)}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
  return `${renderIntro(page)}${aside}${grid}${renderEnquiry(true)}`;
}

function renderBranding(page) {
  return `
    ${renderIntro(page)}
    <section class="sol-section sol-section--band sol-branding-band" aria-label="Pillars">
      <div class="sol-cards sol-cards--2 sol-cards--editorial" data-stagger>
        ${page.pillars
          .map(
            (item) => `
          <article class="sol-card sol-card--text sol-card--editorial mod mod--cut-${item.cut}" data-reveal>
            <header class="sol-card__head">
              <span class="td-icon">${icon(item.icon)}</span>
              <h2 class="sol-card__title">${escapeHtml(item.title)}</h2>
            </header>
            <p class="sol-card__text">${escapeHtml(item.text)}</p>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
    ${renderEnquiry(true)}
  `;
}

function renderEvents(page) {
  const bandOrder = ["Celebration", "Business", "Support"];
  const bands = bandOrder
    .map((band) => {
      const items = page.categories.filter((c) => c.band === band);
      if (!items.length) return "";
      return `
        <div class="sol-event-band" data-reveal>
          <h2 class="sol-event-band__title">${escapeHtml(band)}</h2>
          <div class="sol-cards sol-cards--2" data-stagger>
            ${items
              .map(
                (item) => `
              <article class="sol-card sol-card--text mod mod--cut-${item.cut}" data-reveal>
                <header class="sol-card__head">
                  <span class="td-icon">${icon(item.icon)}</span>
                  <h2 class="sol-card__title">${escapeHtml(item.title)}</h2>
                </header>
                <p class="sol-card__text">${escapeHtml(item.text)}</p>
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    ${renderIntro(page)}
    <section class="sol-section sol-event-bands" aria-label="Event categories">
      ${bands}
    </section>
    ${renderEnquiry(true)}
  `;
}

function renderHub() {
  const page = solutionsHub;
  const stack = page.title
    .map((line) => `<span class="sol-page__title-line">${escapeHtml(line)}</span>`)
    .join("");
  const featured = page.items.find((item) => item.featured) || page.items[0];
  const rest = page.items.filter((item) => item !== featured);

  return `
    <header class="sol-intro" data-reveal>
      <p class="sol-page__marker">
        <span class="sol-page__marker-label">${escapeHtml(page.markerLabel)}</span>
      </p>
      <h1 class="sol-page__title">
        <span class="sol-page__title-stack">${stack}</span>
      </h1>
      <p class="sol-page__body">${escapeHtml(page.lede)}</p>
    </header>
    <section class="sol-section sol-directory" aria-label="Solutions">
      <a class="sol-directory__featured mod mod--cut-${featured.cut}" data-reveal href="${escapeHtml(featured.href)}">
        <span class="td-icon">${icon(featured.icon)}</span>
        <div>
          <h2 class="sol-card__title">${escapeHtml(featured.title)}</h2>
          <p class="sol-card__text">${escapeHtml(featured.text)}</p>
        </div>
        <span class="sol-card__cta">Explore <span aria-hidden="true">→</span></span>
      </a>
      <ul class="sol-directory__rows" data-stagger>
        ${rest
          .map(
            (item) => `
          <li data-reveal>
            <a class="sol-directory__row" href="${escapeHtml(item.href)}">
              <span class="td-icon">${icon(item.icon)}</span>
              <span class="sol-directory__row-copy">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.text)}</span>
              </span>
              <span class="sol-directory__arrow" aria-hidden="true">→</span>
            </a>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
    ${renderEnquiry(false)}
  `;
}

const renderers = {
  hub: renderHub,
  "pre-event": renderPreEvent,
  exhibitions: renderExhibitions,
  display: renderDisplay,
  it: renderIt,
  branding: renderBranding,
  events: renderEvents,
};

function initSolutions() {
  const mount = document.querySelector("[data-solutions-page]");
  if (!mount) return;

  const id = mount.getAttribute("data-solutions-page");
  const renderer = renderers[id];
  if (!renderer) {
    console.error(`Unknown solutions page: ${id}`);
    return;
  }

  const page = id === "hub" ? null : pages[id];
  if (id !== "hub" && !page) {
    console.error(`Missing solutions data: ${id}`);
    return;
  }

  const pageRoot = document.querySelector(".sol-page");
  if (pageRoot && id !== "hub") {
    pageRoot.classList.add("sol-page--quiet");
  }

  mount.innerHTML = id === "hub" ? renderer() : renderer(page);
  initReveal(pageRoot || document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSolutions);
} else {
  initSolutions();
}
