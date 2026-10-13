import { getItemsWithChildren, isNavBuilt } from "../../js/data/navigation.js";
import { onEscape } from "../../js/utils/a11y.js";

/**
 * @param {HTMLElement} root - mega menu mount (inside header mega slot)
 * @param {{ triggers: HTMLElement[] }} options
 */
export function initMegaMenu(root, { triggers }) {
  const menu = root.querySelector("[data-mega-menu]") || root;
  const items = getItemsWithChildren();
  let openId = null;
  let removeEscape = null;

  menu.hidden = false;
  menu.classList.add("mega-menu");
  menu.setAttribute("data-mega-menu", "");
  menu.innerHTML = "";

  items.forEach((item) => {
    const panel = document.createElement("div");
    panel.className = "mega-menu__panel";
    panel.id = `mega-panel-${item.id}`;
    panel.dataset.megaPanel = item.id;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", `${item.label} menu`);

    const title = document.createElement("p");
    title.className = "mega-menu__title";
    title.textContent = item.label;

    const list = document.createElement("ul");
    list.className = "mega-menu__list";

    item.children.forEach((child) => {
      const li = document.createElement("li");
      const built = isNavBuilt(child);
      const entry = document.createElement(built ? "a" : "span");
      entry.className = built ? "mega-menu__link" : "mega-menu__link mega-menu__link--stub";
      if (built) entry.href = child.href;
      else entry.setAttribute("aria-disabled", "true");

      const label = document.createElement("span");
      label.className = "mega-menu__label";
      label.textContent = child.label;
      entry.appendChild(label);

      if (child.description) {
        const desc = document.createElement("span");
        desc.className = "mega-menu__desc";
        desc.textContent = child.description;
        entry.appendChild(desc);
      }

      li.appendChild(entry);
      list.appendChild(li);
    });

    panel.append(title, list);
    menu.appendChild(panel);
  });

  function setTriggerState(id, expanded) {
    triggers.forEach((btn) => {
      const match = btn.dataset.megaTrigger === id;
      btn.setAttribute("aria-expanded", match && expanded ? "true" : "false");
    });
  }

  function close() {
    openId = null;
    menu.querySelectorAll("[data-mega-panel]").forEach((panel) => {
      panel.classList.remove("is-open");
    });
    setTriggerState(null, false);
    if (removeEscape) {
      removeEscape();
      removeEscape = null;
    }
  }

  function open(id) {
    if (openId === id) {
      close();
      return;
    }
    openId = id;
    menu.querySelectorAll("[data-mega-panel]").forEach((panel) => {
      panel.classList.toggle("is-open", panel.dataset.megaPanel === id);
    });
    setTriggerState(id, true);
    if (removeEscape) removeEscape();
    removeEscape = onEscape(close);
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      open(btn.dataset.megaTrigger);
    });
  });

  document.addEventListener("click", (event) => {
    if (!openId) return;
    const target = event.target;
    if (menu.contains(target)) return;
    if (triggers.some((btn) => btn.contains(target))) return;
    close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1024) close();
  });

  return { open, close, getOpenId: () => openId };
}
