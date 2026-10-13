import { homeBanner, homeSolutions, homeProcess, contactInfo } from "../data/home.js";
import { resolveSitePath } from "../utils/site-root.js";
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

function renderBanner(root) {
  const mount = root.querySelector("[data-home-banner]");
  if (!mount) return null;

  const slides = homeBanner.slides;
  const track = document.createElement("div");
  track.className = "home-banner__track";
  track.setAttribute("aria-live", "polite");

  track.innerHTML = slides
    .map((slide, index) => {
      const isPhoto = slide.tone === "photo" && slide.image;
      const media = isPhoto
        ? `<div class="home-banner__media">
            <img src="${escapeHtml(resolveSitePath(slide.image))}" alt="${escapeHtml(slide.imageAlt || "")}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
          </div>`
        : `<div class="home-banner__panel home-banner__panel--${escapeHtml(slide.tone)}" aria-hidden="true"></div>`;

      const TitleTag = index === 0 ? "h1" : "h2";

      return `
        <div
          class="home-banner__slide home-banner__slide--${escapeHtml(slide.tone)}${index === 0 ? " is-active" : ""}"
          data-banner-slide
          id="home-banner-slide-${index}"
          role="group"
          aria-roledescription="slide"
          aria-label="${index + 1} of ${slides.length}"
          ${index === 0 ? "" : 'aria-hidden="true"'}
        >
          ${media}
          <div class="home-banner__shade" aria-hidden="true"></div>
          <div class="home-banner__rail">
            <div class="home-banner__content">
            <p class="home-banner__eyebrow" data-banner-anim>${escapeHtml(slide.eyebrow)}</p>
            <${TitleTag} class="home-banner__title td-display" data-banner-anim>${escapeHtml(slide.title)}</${TitleTag}>
            <p class="home-banner__text" data-banner-anim>${escapeHtml(slide.text)}</p>
            <div class="home-banner__actions" data-banner-anim>
              <a class="home-banner__btn home-banner__btn--primary" href="${escapeHtml(resolveSitePath("contact/"))}">Send enquiry</a>
              <a class="home-banner__btn home-banner__btn--ghost" href="#solutions">Explore solutions</a>
            </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const controls = document.createElement("div");
  controls.className = "home-banner__controls";
  controls.innerHTML = `
    <span class="home-banner__index" data-banner-index aria-hidden="true">${pad(1)} / ${pad(slides.length)}</span>
    <button type="button" class="home-banner__nav" data-banner-prev aria-label="Previous slide">
      ${icon("chevronLeft")}
    </button>
    <ol class="home-banner__dots" data-banner-dots></ol>
    <button type="button" class="home-banner__nav" data-banner-next aria-label="Next slide">
      ${icon("chevronRight")}
    </button>
  `;

  const dots = controls.querySelector("[data-banner-dots]");
  slides.forEach((_, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `home-banner__dot${index === 0 ? " is-active" : ""}`;
    btn.setAttribute("aria-label", `Go to slide ${index + 1}`);
    btn.setAttribute("aria-controls", `home-banner-slide-${index}`);
    if (index === 0) btn.setAttribute("aria-current", "true");
    btn.dataset.bannerDot = String(index);
    li.appendChild(btn);
    dots.appendChild(li);
  });

  const progress = document.createElement("div");
  progress.className = "home-banner__progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = `<div class="home-banner__progress-bar" data-banner-progress></div>`;

  mount.append(track, controls, progress);
  mount.setAttribute("aria-roledescription", "carousel");
  mount.setAttribute("aria-label", "Team DSR highlights");

  return {
    root: mount,
    slides: Array.from(track.querySelectorAll("[data-banner-slide]")),
    dots: Array.from(dots.querySelectorAll("[data-banner-dot]")),
    prev: controls.querySelector("[data-banner-prev]"),
    next: controls.querySelector("[data-banner-next]"),
    indexEl: controls.querySelector("[data-banner-index]"),
    progressBar: progress.querySelector("[data-banner-progress]"),
    count: slides.length,
    intervalMs: homeBanner.intervalMs,
  };
}

function initBanner(banner) {
  if (!banner || !banner.count) return;

  let index = 0;
  let timer = null;
  let paused = false;
  const reduced = prefersReducedMotion();

  function setActive(nextIndex, direction = 1) {
    const prev = index;
    index = (nextIndex + banner.count) % banner.count;
    if (prev === index && banner.slides[index].classList.contains("is-active")) {
      restartProgress();
      return;
    }

    banner.slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.remove("is-enter-next", "is-enter-prev", "is-exit-next", "is-exit-prev");

      if (i === prev && prev !== index) {
        slide.classList.add(direction > 0 ? "is-exit-next" : "is-exit-prev");
      }
      if (active && prev !== index) {
        slide.classList.add(direction > 0 ? "is-enter-next" : "is-enter-prev");
      }

      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.querySelectorAll("a, button").forEach((el) => {
        if (active) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", "-1");
      });
    });

    banner.dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    if (banner.indexEl) {
      banner.indexEl.textContent = `${pad(index + 1)} / ${pad(banner.count)}`;
    }

    restartProgress();
  }

  function restartProgress() {
    if (!banner.progressBar) return;
    banner.progressBar.classList.remove("is-running");
    void banner.progressBar.offsetWidth;
    if (!reduced && !paused) {
      banner.progressBar.style.animationDuration = `${banner.intervalMs}ms`;
      banner.progressBar.classList.add("is-running");
    }
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (reduced || paused) return;
    timer = window.setInterval(() => setActive(index + 1, 1), banner.intervalMs);
    restartProgress();
  }

  function pause() {
    paused = true;
    banner.root.classList.add("is-paused");
    stopTimer();
    if (banner.progressBar) banner.progressBar.classList.remove("is-running");
  }

  function resume() {
    paused = false;
    banner.root.classList.remove("is-paused");
    startTimer();
  }

  banner.prev?.addEventListener("click", () => {
    setActive(index - 1, -1);
    if (!paused && !reduced) startTimer();
  });

  banner.next?.addEventListener("click", () => {
    setActive(index + 1, 1);
    if (!paused && !reduced) startTimer();
  });

  banner.dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.bannerDot);
      setActive(target, target >= index ? 1 : -1);
      if (!paused && !reduced) startTimer();
    });
  });

  banner.root.addEventListener("mouseenter", pause);
  banner.root.addEventListener("mouseleave", resume);
  banner.root.addEventListener("focusin", pause);
  banner.root.addEventListener("focusout", (event) => {
    if (!banner.root.contains(event.relatedTarget)) resume();
  });

  banner.root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActive(index - 1, -1);
      if (!paused && !reduced) startTimer();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActive(index + 1, 1);
      if (!paused && !reduced) startTimer();
    }
  });

  setActive(0, 1);
  startTimer();
}

function renderSolutions(root) {
  const grid = root.querySelector("[data-home-solutions]");
  if (!grid) return;

  grid.setAttribute("data-stagger", "");
  grid.innerHTML = homeSolutions
    .map(
      (item) => `
      <a class="home-sol-card mod mod--cut-${item.cut} td-card-surface${item.featured ? " home-sol-card--featured" : ""}" data-reveal href="${escapeHtml(resolveSitePath(item.href.replace(/^\//, "")))}">
        <span class="td-icon home-sol-card__icon">${icon(item.icon)}</span>
        <h3 class="td-display">${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <span class="home-sol-card__more">View <span class="td-link__arrow" aria-hidden="true">→</span></span>
      </a>
    `
    )
    .join("");
}

function renderProcess(root) {
  const rail = root.querySelector("[data-home-process]");
  if (!rail) return;

  rail.setAttribute("data-stagger", "");
  rail.innerHTML = homeProcess
    .map(
      (item, i) => `
      <li class="home-process__step" data-reveal>
        <span class="home-process__num" aria-hidden="true">${pad(i + 1)}</span>
        <span class="home-process__label">${escapeHtml(item.title)}</span>
      </li>
    `
    )
    .join("");
}

function fillContact(root) {
  const phone = root.querySelector("[data-home-phone]");
  const email = root.querySelector("[data-home-email]");
  if (phone) {
    phone.href = contactInfo.phoneHref;
    phone.innerHTML = `<span class="td-icon">${icon("phone")}</span><span>${escapeHtml(contactInfo.phone)}</span>`;
  }
  if (email) {
    email.href = contactInfo.emailHref;
    email.innerHTML = `<span class="td-icon">${icon("mail")}</span><span>${escapeHtml(contactInfo.email)}</span>`;
  }
}

function initHome() {
  const root = document.querySelector(".home-page");
  if (!root) return;

  renderSolutions(root);
  renderProcess(root);
  fillContact(root);

  const banner = renderBanner(root);
  initBanner(banner);
  initReveal(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHome);
} else {
  initHome();
}
