import {
  navigation,
  contactInfo,
  getPrimaryCta,
  isNavBuilt,
} from "../../js/data/navigation.js";
import { resolveSitePath } from "../../js/utils/site-root.js";

const ICON_PHONE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 4.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3A2 2 0 0 1 17.5 19.5 13 13 0 0 1 4.5 6.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`;
const ICON_MAIL = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 4 3 11.2l7.2 1.8L14.5 21 21 4Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="m10.2 13 3.6-3.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`;
const ICON_WEB = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 11 8-7 8 7v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-9Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M9.5 21.5v-7h5v7" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`;

/**
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
export function initFooter(root) {
  const tagline = root.querySelector("[data-footer-tagline]");
  const cta = root.querySelector("[data-footer-cta]");
  const sitemap = root.querySelector("[data-footer-sitemap]");
  const contact = root.querySelector("[data-footer-contact]");
  const reach = root.querySelector("[data-footer-reach]");
  const copy = root.querySelector("[data-footer-copy]");
  const icons = root.querySelector("[data-footer-icons]");

  resolveSiteAssets(root);

  if (tagline) {
    tagline.textContent =
      "End-to-end exhibition, event, and technology execution.";
  }
  if (reach) reach.textContent = contactInfo.reach;

  const primaryCta = getPrimaryCta();
  if (cta && primaryCta) {
    cta.href = primaryCta.href;
    cta.textContent = primaryCta.label;
  }

  if (icons) {
    icons.innerHTML = `
      <li>
        <a class="site-footer__icon-link" href="${contactInfo.phoneHref}" aria-label="Call ${contactInfo.phone}">
          ${ICON_PHONE}
        </a>
      </li>
      <li>
        <a class="site-footer__icon-link" href="${contactInfo.emailHref}" aria-label="Email ${contactInfo.email}">
          ${ICON_MAIL}
        </a>
      </li>
      <li>
        <a class="site-footer__icon-link" href="${contactInfo.websiteHref}" rel="noopener noreferrer" aria-label="Visit ${contactInfo.website}">
          ${ICON_WEB}
        </a>
      </li>
    `;
  }

  if (sitemap) {
    sitemap.innerHTML = "";
    navigation
      .filter((item) => item.id !== "home" && item.id !== "contact")
      .forEach((item) => {
        const col = document.createElement("div");
        col.className = "site-footer__col";

        const heading = document.createElement("h2");
        heading.className = "site-footer__heading";
        heading.textContent = item.label;

        const list = document.createElement("ul");
        list.className = "site-footer__list";

        const links = item.children?.length
          ? item.children
          : [{ label: item.label, href: item.href }];

        links.forEach((child) => {
          const li = document.createElement("li");
          if (isNavBuilt(child) && isNavBuilt(item)) {
            const link = document.createElement("a");
            link.className = "site-footer__link";
            link.href = child.href;
            link.textContent = child.label;
            li.appendChild(link);
          } else {
            const stub = document.createElement("span");
            stub.className = "site-footer__link site-footer__link--stub";
            stub.textContent = child.label;
            stub.setAttribute("aria-disabled", "true");
            li.appendChild(stub);
          }
          list.appendChild(li);
        });

        col.append(heading, list);
        sitemap.appendChild(col);
      });
  }

  if (contact) {
    contact.innerHTML = `
      <h2 class="site-footer__heading">Contact</h2>
      <ul class="site-footer__contact-list">
        <li class="site-footer__contact-item">
          <span class="site-footer__contact-icon">${ICON_PHONE}</span>
          <a class="site-footer__link" href="${contactInfo.phoneHref}">${contactInfo.phone}</a>
        </li>
        <li class="site-footer__contact-item">
          <span class="site-footer__contact-icon">${ICON_MAIL}</span>
          <a class="site-footer__link" href="${contactInfo.emailHref}">${contactInfo.email}</a>
        </li>
        <li class="site-footer__contact-item">
          <span class="site-footer__contact-icon">${ICON_WEB}</span>
          <a class="site-footer__link" href="${contactInfo.websiteHref}" rel="noopener noreferrer">${contactInfo.website}</a>
        </li>
      </ul>
    `;
  }

  if (copy) {
    const year = new Date().getFullYear();
    copy.textContent = `© ${year} ${contactInfo.legalName}. All rights reserved.`;
  }
}
