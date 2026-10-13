import { contactInfo } from "./navigation.js";

export { contactInfo };

export const homeBanner = {
  intervalMs: 5000,
  slides: [
    {
      id: "brand",
      tone: "brand",
      eyebrow: "TEAM DSR Executorrs LLP",
      title: "Exhibitions. Events. Technology.",
      text: "Corporate execution with interactive systems — from planning to show day.",
    },
    {
      id: "systems",
      tone: "systems",
      eyebrow: "Systems",
      title: "Expo ERP + VRMS",
      text: "Visibility, speed, and control across exhibition operations and visitor flow.",
    },
  ],
};

export const homeSolutions = [
  {
    title: "Exhibitions & Events",
    text: "Trade shows and on-ground delivery with attention to detail.",
    href: "/solutions/exhibitions-events",
    icon: "booth",
    cut: "tr",
    featured: true,
  },
  {
    title: "Pre-Event Administration",
    text: "Operations before show day — setup, data, and coordination.",
    href: "/solutions/pre-event-administration",
    icon: "clipboard",
    cut: "bl",
  },
  {
    title: "Display Rental Solution",
    text: "Screens, AV, and technical setup that stay reliable.",
    href: "/solutions/display-rental",
    icon: "monitor",
    cut: "tr",
  },
  {
    title: "IT Services",
    text: "Web, apps, hosting, and digital systems support.",
    href: "/solutions/it-services",
    icon: "cpu",
    cut: "bl",
  },
  {
    title: "Branding & Communications",
    text: "Identity, UI/UX, and campaigns that stay consistent.",
    href: "/solutions/branding-communications",
    icon: "palette",
    cut: "tr",
  },
  {
    title: "Other Events",
    text: "Corporate, launches, and celebrations beyond the expo floor.",
    href: "/solutions/events",
    icon: "calendar",
    cut: "bl",
  },
];

export const homeProcess = [
  { title: "ERP Setup", icon: "gear" },
  { title: "Exhibitors", icon: "users" },
  { title: "Stalls", icon: "grid" },
  { title: "Vendor Docs", icon: "file" },
  { title: "Branding", icon: "pen" },
  { title: "Finance", icon: "wallet" },
];
