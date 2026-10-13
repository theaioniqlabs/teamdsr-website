/**
 * Site root URL (always ends with /), derived from this module path.
 * Works for nested pages like /about/ without hard-coding "/".
 */
export function getSiteRoot() {
  // .../js/utils/site-root.js → .../
  return new URL("../../", import.meta.url).href;
}

/**
 * Resolve a path relative to the site root.
 * @param {string} path e.g. "assets/logo/TD-Logo.png" or "./components"
 */
export function resolveSitePath(path) {
  const clean = String(path).replace(/^\.\//, "").replace(/^\//, "");
  return new URL(clean, getSiteRoot()).href;
}
