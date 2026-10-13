/**
 * Shared IntersectionObserver reveal for Home / About / Contact.
 */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initReveal(root = document, options = {}) {
  const scope = root instanceof Element ? root : document;
  const selector = options.selector || "[data-reveal]";
  const targets = Array.from(scope.querySelectorAll(selector));
  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: options.rootMargin || "0px 0px -6% 0px",
      threshold: options.threshold ?? 0.12,
    }
  );

  targets.forEach((el, index) => {
    if (!el.style.getPropertyValue("--reveal-delay") && !el.closest("[data-stagger]")) {
      el.style.setProperty("--reveal-delay", `${Math.min(index * 40, 200)}ms`);
    }
    observer.observe(el);
  });
}
