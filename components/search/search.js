import { navigation, isNavBuilt } from "../../js/data/navigation.js";
import { createFocusTrap, onEscape, setBodyLock } from "../../js/utils/a11y.js";

/**
 * @param {HTMLElement} root
 * @param {{ openButton: HTMLElement | null }} options
 */
export function initSearch(root, { openButton }) {
  const overlay = root.querySelector("[data-search-overlay]") || root;
  const dialog = root.querySelector("[data-search-dialog]");
  const input = root.querySelector("[data-search-input]");
  const form = root.querySelector("[data-search-form]");
  const closeBtn = root.querySelector("[data-search-close]");
  const backdrop = root.querySelector("[data-search-backdrop]");
  const suggested = root.querySelector("[data-search-suggested]");

  if (!overlay || !dialog) return { open() {}, close() {} };

  let isOpen = false;
  let releaseTrap = null;
  let removeEscape = null;
  let lastFocus = null;

  if (suggested) {
    suggested.innerHTML = "";
    navigation.filter(isNavBuilt).forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.className = "search-overlay__suggest-link";
      link.href = item.href;
      link.textContent = item.label;
      li.appendChild(link);
      suggested.appendChild(li);
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    setBodyLock(false);
    openButton?.setAttribute("aria-expanded", "false");
    if (releaseTrap) {
      releaseTrap();
      releaseTrap = null;
    }
    if (removeEscape) {
      removeEscape();
      removeEscape = null;
    }
    lastFocus?.focus();
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    setBodyLock(true);
    openButton?.setAttribute("aria-expanded", "true");
    releaseTrap = createFocusTrap(dialog);
    removeEscape = onEscape(close);
    input?.focus();
  }

  openButton?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isOpen) close();
      else open();
    }
  });

  return { open, close };
}
