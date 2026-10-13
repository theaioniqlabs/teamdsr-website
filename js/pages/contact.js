import { contactPage } from "../data/contact.js";
import { icon } from "../utils/icons.js";
import { initReveal, prefersReducedMotion } from "../utils/reveal.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderChannels(root) {
  if (!root) return;
  root.setAttribute("data-stagger", "");
  root.innerHTML = contactPage.channels
    .map((item) => {
      const rel = item.external ? ' rel="noopener noreferrer"' : "";
      const target = item.external ? ' target="_blank"' : "";
      return `
        <li data-reveal>
          <a class="contact-channels__link" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.aria)}"${rel}${target}>
            <span class="td-icon contact-channels__icon">${icon(item.icon)}</span>
            <span class="contact-channels__label">${escapeHtml(item.label)}</span>
          </a>
        </li>
      `;
    })
    .join("");
}

function renderPillars(root) {
  if (!root) return;
  root.setAttribute("data-stagger", "");
  root.innerHTML = contactPage.pillars
    .map(
      (item) => `
      <li class="contact-pillars__item" data-reveal>
        <span class="td-icon contact-pillars__icon">${icon(item.icon)}</span>
        <span class="contact-pillars__label">${escapeHtml(item.label)}</span>
      </li>
    `
    )
    .join("");
}

function setError(input, message) {
  const error = document.getElementById(`error-${input.name}`);
  if (!error) return;
  if (message) {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
  } else {
    error.textContent = "";
    error.hidden = true;
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateField(input) {
  const value = input.value.trim();
  if (input.name === "name") {
    if (!value) {
      setError(input, "Please enter your name.");
      return false;
    }
  }
  if (input.name === "email") {
    if (!value) {
      setError(input, "Please enter your email.");
      return false;
    }
    if (!validateEmail(value)) {
      setError(input, "Enter a valid email address.");
      return false;
    }
  }
  if (input.name === "message") {
    if (!value) {
      setError(input, "Please enter a message.");
      return false;
    }
  }
  setError(input, "");
  return true;
}

function initForm() {
  const form = document.querySelector("[data-contact-form]");
  const formPanel = document.querySelector("[data-form-panel]");
  const successPanel = document.querySelector("[data-success-panel]");
  const submit = document.querySelector("[data-submit]");
  const reset = document.querySelector("[data-reset-form]");
  if (!form || !formPanel || !successPanel || !submit) return;

  const watched = ["name", "email", "message"]
    .map((name) => form.elements.namedItem(name))
    .filter(Boolean);

  watched.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = watched.every((input) => validateField(input));
    if (!valid) {
      const firstInvalid = watched.find((input) => input.getAttribute("aria-invalid") === "true");
      firstInvalid?.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";

    window.setTimeout(() => {
      formPanel.hidden = true;
      successPanel.hidden = false;
      successPanel.classList.add("is-visible");
      successPanel.focus?.();
      submit.disabled = false;
      submit.textContent = contactPage.submitLabel;
    }, prefersReducedMotion() ? 0 : 320);
  });

  reset?.addEventListener("click", () => {
    form.reset();
    watched.forEach((input) => setError(input, ""));
    successPanel.hidden = true;
    successPanel.classList.remove("is-visible");
    formPanel.hidden = false;
    form.elements.namedItem("name")?.focus();
  });
}

function bootstrap() {
  renderChannels(document.querySelector("[data-contact-channels]"));
  renderPillars(document.querySelector("[data-contact-pillars]"));
  initReveal(document.querySelector(".contact-page") || document);
  initForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
