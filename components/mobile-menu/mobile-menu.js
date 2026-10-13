import { navigation, isNavBuilt } from "../../js/data/navigation.js";
import { createFocusTrap, onEscape, setBodyLock } from "../../js/utils/a11y.js";

/**
 * @param {HTMLElement} root
 * @param {{ openButton: HTMLElement | null }} options
 */
export function initMobileMenu(root, { openButton }) {
  const menu = root.querySelector("[data-mobile-menu]") || root;
  const panel = root.querySelector("[data-mobile-panel]");
  const nav = root.querySelector("[data-mobile-nav]");
  const closeBtn = root.querySelector("[data-mobile-close]");
  const backdrop = root.querySelector("[data-mobile-backdrop]");

  if (!menu || !nav || !panel) return { open() {}, close() {} };

  let isOpen = false;
  let releaseTrap = null;
  let removeEscape = null;
  let lastFocus = null;

  nav.innerHTML = "";

  navigation.forEach((item) => {
    const group = document.createElement("div");
    group.className = "mobile-menu__panel-group";

    if (item.children?.length) {
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "mobile-menu__accordion-trigger";
      trigger.setAttribute("aria-expanded", "false");
      const panelId = `mobile-acc-${item.id}`;
      trigger.setAttribute("aria-controls", panelId);
      trigger.innerHTML = `${item.label}<span class="mobile-menu__chevron" aria-hidden="true"></span>`;

      const accPanel = document.createElement("div");
      accPanel.className = "mobile-menu__accordion-panel";
      accPanel.id = panelId;

      const childList = document.createElement("ul");
      item.children.forEach((child) => {
        const li = document.createElement("li");
        if (isNavBuilt(child)) {
          const link = document.createElement("a");
          link.className = "mobile-menu__child-link";
          link.href = child.href;
          link.textContent = child.label;
          li.appendChild(link);
        } else {
          const stub = document.createElement("span");
          stub.className = "mobile-menu__child-link mobile-menu__child-link--stub";
          stub.textContent = child.label;
          stub.setAttribute("aria-disabled", "true");
          li.appendChild(stub);
        }
        childList.appendChild(li);
      });
      accPanel.appendChild(childList);

      trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        accPanel.classList.toggle("is-open", !expanded);
      });

      group.append(trigger, accPanel);
    } else {
      const link = document.createElement("a");
      link.className = "mobile-menu__link";
      link.href = item.href;
      link.textContent = item.label;
      group.appendChild(link);
    }

    nav.appendChild(group);
  });

  function close() {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove("is-open");
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
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
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => menu.classList.add("is-open"));
    setBodyLock(true);
    openButton?.setAttribute("aria-expanded", "true");
    releaseTrap = createFocusTrap(panel);
    removeEscape = onEscape(close);
    closeBtn?.focus();
  }

  openButton?.addEventListener("click", () => {
    if (isOpen) close();
    else open();
  });
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) close();
  });

  return { open, close };
}
