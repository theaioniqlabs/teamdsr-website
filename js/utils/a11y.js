const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

/**
 * Trap focus within a container while active.
 * @param {HTMLElement} container
 * @returns {() => void} cleanup
 */
export function createFocusTrap(container) {
  function onKeyDown(event) {
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements(container);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", onKeyDown);
  return () => container.removeEventListener("keydown", onKeyDown);
}

/**
 * Lock / unlock body scroll.
 * @param {boolean} locked
 */
export function setBodyLock(locked) {
  document.body.classList.toggle("is-locked", locked);
}

/**
 * Register Escape handler; returns cleanup.
 * @param {() => void} callback
 */
export function onEscape(callback) {
  function handler(event) {
    if (event.key === "Escape") callback();
  }
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
