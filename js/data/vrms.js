/**
 * VRMS copy from TD Profile_2026 (3).pdf — Visitor Registration / Management System.
 */

export const vrmsIntro = {
  marker: "04",
  markerLabel: "VRMS System",
  title: ["VRMS"],
  kicker: "Visitor Registration & Management System",
  body: "VRMS is built to streamline visitor registration and access management for exhibitions and events. It helps organizers manage pre-registration, on-site registration, access control, and meeting coordination in a structured way.",
  punchLabel: "One System.",
  punchLine: "Complete Control.",
};

/** Feature bands derived from PDF capability meaning — titles/text unchanged. */
export const vrmsBands = [
  {
    id: "registration",
    label: "Registration",
    items: [
      {
        title: "Registration",
        text: "Online and on-site registration with seamless process and real-time management.",
        icon: "clipboard",
        cut: "tr",
        featured: true,
      },
      {
        title: "Mobile Based",
        text: "Mobile friendly registration for visitors on the go.",
        icon: "monitor",
        cut: "bl",
      },
      {
        title: "Digital Badge Generation",
        text: "Create, personalize and print digital badges instantly.",
        icon: "file",
        cut: "tr",
      },
    ],
  },
  {
    id: "access",
    label: "Access & identity",
    items: [
      {
        title: "Barcode, QR & RFID",
        text: "Advanced scanning technologies for accurate and fast identification.",
        icon: "grid",
        cut: "bl",
        featured: true,
      },
      {
        title: "Face Recognition",
        text: "Secure and touch-less verification for enhanced event experience.",
        icon: "shield",
        cut: "tr",
      },
      {
        title: "Access Control & Tracking",
        text: "Control and monitor access with real-time tracking and reports.",
        icon: "gear",
        cut: "bl",
      },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    items: [
      {
        title: "B2B Meeting Setup",
        text: "Schedule and manage B2B meetings efficiently.",
        icon: "users",
        cut: "tr",
      },
      {
        title: "Notification via SMS / Email / WhatsApp",
        text: "Instant confirmations and updates through multiple channels.",
        icon: "mail",
        cut: "bl",
      },
      {
        title: "Category Wise Search Exhibitor",
        text: "Advanced search options to find exhibitors by categories easily.",
        icon: "booth",
        cut: "tr",
      },
      {
        title: "Payment Gateway Integration",
        text: "Integrated payment solutions for smooth and secure transactions.",
        icon: "wallet",
        cut: "bl",
      },
    ],
  },
];

export const vrmsKiosk = {
  label: "On-site",
  title: "Self-Registration Kiosk",
  text: "Online and on-site registration with seamless process and real-time management.",
};
