/**
 * Single source of truth for shell navigation labels and hrefs.
 * Descriptions are structural one-liners for mega menu UI only.
 * Routes with built: false render as non-link labels until pages exist.
 */

export const contactInfo = {
  phone: "+91 88666 65566",
  phoneHref: "tel:+918866665566",
  email: "shail@teamdsr.co.in",
  emailHref: "mailto:shail@teamdsr.co.in",
  website: "www.teamdsr.co.in",
  websiteHref: "https://www.teamdsr.co.in",
  legalName: "TEAM DSR Executorrs LLP",
  tagline: "Corporate Website × Interactive Experience",
  reach: "Across India · Across the Globe",
};

export const navigation = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    children: [
      {
        id: "about-overview",
        label: "Overview",
        href: "/about",
        description: "Who we are and how we execute",
      },
      {
        id: "about-expansion",
        label: "Our Expansion",
        href: "/about/expansion",
        description: "National and global footprint",
      },
      {
        id: "about-values",
        label: "Values",
        href: "/about#values",
        description: "Collaborative, organized, reliable",
      },
    ],
  },
  {
    id: "solutions",
    label: "Solutions",
    href: "/solutions",
    children: [
      {
        id: "sol-pre-event",
        label: "Pre-Event Administration",
        href: "/solutions/pre-event-administration",
        description: "Operations before show day",
      },
      {
        id: "sol-exhibitions",
        label: "Exhibitions & Events",
        href: "/solutions/exhibitions-events",
        description: "Trade shows and on-ground delivery",
      },
      {
        id: "sol-display",
        label: "Display Rental Solution",
        href: "/solutions/display-rental",
        description: "Screens, AV, and technical setup",
      },
      {
        id: "sol-it",
        label: "IT Services",
        href: "/solutions/it-services",
        description: "Web, apps, hosting, and ERP",
      },
      {
        id: "sol-branding",
        label: "Branding & Communications",
        href: "/solutions/branding-communications",
        description: "Identity, UI/UX, and campaigns",
      },
      {
        id: "sol-events",
        label: "Other Events",
        href: "/solutions/events",
        description: "Corporate, launches, and celebrations",
      },
    ],
  },
  {
    id: "systems",
    label: "Systems",
    href: "/systems/expo-erp",
    children: [
      {
        id: "sys-expo",
        label: "Expo ERP",
        href: "/systems/expo-erp",
        description: "Exhibition lifecycle platform",
      },
      {
        id: "sys-expo-modules",
        label: "Expo ERP Modules",
        href: "/systems/expo-erp#modules",
        description: "Deep module-by-module control",
      },
      {
        id: "sys-vrms",
        label: "VRMS",
        href: "/systems/vrms",
        description: "Visitor registration and access",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    built: false,
    children: [
      {
        id: "proj-clients",
        label: "Clients",
        href: "/projects/clients",
        description: "Organizations we have worked with",
        built: false,
      },
      {
        id: "proj-portfolio",
        label: "Portfolio",
        href: "/projects/portfolio",
        description: "Selected execution and delivery",
        built: false,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
  },
];

/** @param {{ built?: boolean }} item */
export function isNavBuilt(item) {
  return item.built !== false;
}

export function getItemsWithChildren() {
  return navigation.filter((item) => item.children?.length);
}

export function getPrimaryCta() {
  return navigation.find((item) => item.id === "contact");
}
