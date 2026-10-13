import { initReveal } from "../utils/reveal.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initReveal(document.querySelector(".about-page") || document));
} else {
  initReveal(document.querySelector(".about-page") || document);
}
