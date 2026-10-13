import { navigation, getPrimaryCta } from "../../js/data/navigation.js";
import { resolveSitePath } from "../../js/utils/site-root.js";

/**
 * Resolve data-site-asset images to absolute site-root URLs.
 * @param {ParentNode} root
 */
function resolveSiteAssets(root) {
  root.querySelectorAll("[data-site-asset]").forEach((img) => {
    const path = img.getAttribute("data-site-asset");
    if (path) img.setAttribute("src", resolveSitePath(path));
  });
}

/**
 * @param {HTMLElement} root
 */
export function initHeader(root) {
  const header = root.querySelector("[data-header]");
  const nav = root.querySelector("[data-primary-nav]");
  const cta = root.querySelector("[data-header-cta]");
  if (!header || !nav) return;

  resolveSiteAssets(root);

  const primaryCta = getPrimaryCta();
  if (cta && primaryCta) {
    cta.href = primaryCta.href;
    cta.textContent = primaryCta.label;
  }

  nav.innerHTML = "";
  navigation.forEach((item) => {
    if (item.children?.length) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "site-header__link";
      button.dataset.megaTrigger = item.id;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `mega-panel-${item.id}`);
      button.innerHTML = `${item.label}<span class="site-header__chevron" aria-hidden="true"></span>`;
      nav.appendChild(button);
    } else {
      const link = document.createElement("a");
      link.className = "site-header__link";
      link.href = item.href;
      link.textContent = item.label;
      nav.appendChild(link);
    }
  });

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    header,
    getMegaTriggers: () => Array.from(nav.querySelectorAll("[data-mega-trigger]")),
    getSearchOpen: () => root.querySelector("[data-search-open]"),
    getMobileOpen: () => root.querySelector("[data-mobile-open]"),
    getMegaSlot: () => root.querySelector("[data-mega-slot]"),
    getMobileSlot: () => root.querySelector("[data-mobile-slot]"),
  };
}
