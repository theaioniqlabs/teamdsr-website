import { loadComponent } from "./utils/load-component.js";
import { initHeader } from "../components/header/header.js";
import { initMegaMenu } from "../components/mega-menu/mega-menu.js";
import { initMobileMenu } from "../components/mobile-menu/mobile-menu.js";
import { initSearch } from "../components/search/search.js";
import { initFooter } from "../components/footer/footer.js";

async function bootstrap() {
  const headerMount = document.querySelector("#site-header");
  const searchMount = document.querySelector("#site-search");
  const footerMount = document.querySelector("#site-footer");

  if (!headerMount || !searchMount || !footerMount) {
    console.error("Shell mount points missing.");
    return;
  }

  await loadComponent({ name: "header", mount: headerMount });
  const headerApi = initHeader(headerMount);

  const megaSlot = headerApi?.getMegaSlot?.();
  const mobileSlot = headerApi?.getMobileSlot?.();

  if (megaSlot) {
    await loadComponent({ name: "mega-menu", mount: megaSlot });
    initMegaMenu(megaSlot, {
      triggers: headerApi.getMegaTriggers(),
    });
  }

  if (mobileSlot) {
    await loadComponent({ name: "mobile-menu", mount: mobileSlot });
    initMobileMenu(mobileSlot, {
      openButton: headerApi.getMobileOpen(),
    });
  }

  await loadComponent({ name: "search", mount: searchMount });
  initSearch(searchMount, {
    openButton: headerApi?.getSearchOpen?.() ?? null,
  });

  await loadComponent({ name: "footer", mount: footerMount });
  initFooter(footerMount);
}

bootstrap().catch((error) => {
  console.error("Failed to initialize Team DSR shell:", error);
});
