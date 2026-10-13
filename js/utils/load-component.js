import { resolveSitePath } from "./site-root.js";

const loadedStyles = new Set();

/**
 * Inject a stylesheet once by href.
 * @param {string} href
 */
export function loadStylesheet(href) {
  if (loadedStyles.has(href)) return;
  loadedStyles.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Fetch an HTML partial and place it into a mount node.
 * @param {string} url
 * @param {HTMLElement} mount
 * @returns {Promise<HTMLElement>}
 */
export async function loadHTML(url, mount) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load component: ${url} (${response.status})`);
  }
  const html = await response.text();
  mount.innerHTML = html;
  return mount;
}

/**
 * Load HTML + CSS for a component folder.
 * @param {{ name: string, mount: HTMLElement, basePath?: string }} options
 */
export async function loadComponent({ name, mount, basePath } = {}) {
  const root = basePath ?? resolveSitePath("components");
  const dir = `${root.replace(/\/$/, "")}/${name}`;
  loadStylesheet(`${dir}/${name}.css`);
  await loadHTML(`${dir}/${name}.html`, mount);
  return mount;
}
