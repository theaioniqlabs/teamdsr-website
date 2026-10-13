/**
 * Expo ERP copy from TD Profile_2026 (3).pdf, pages 7–8.
 */

export const expoErpIntro = {
  marker: "05",
  markerLabel: "Expo ERP",
  title: ["Expo", "ERP"],
  kicker: "Online Exhibition Data Management System",
  body: "Expo ERP is designed to manage exhibition operations with better visibility, speed, and control. It supports the core workflow of organizers, exhibitors, vendors, management team and fabricators through a single digital system.",
};

export const capabilityGroups = [
  {
    title: "Core Operations",
    icon: "gear",
    cut: "tr",
    items: [
      "Production Module",
      "Exhibitor Module",
      "Vendor Module",
      "Fabricator Module",
    ],
  },
  {
    title: "Event Management",
    icon: "calendar",
    cut: "bl",
    items: [
      "Dynamic Layout Creation",
      "Stall Booking",
      "Management Team Module",
      "Interested Visitor",
    ],
  },
  {
    title: "Document & Support",
    icon: "file",
    cut: "tr",
    items: [
      "Data Management",
      "Dynamic Possession Letter",
      "Gate Pass Creation",
      "Extra Furniture Ordering System",
    ],
  },
  {
    title: "Marketing & Communication",
    icon: "mail",
    cut: "bl",
    items: [
      "Dynamic Promotional Image & Videos Creation",
      "Email & SMS Integration",
    ],
  },
  {
    title: "Financial Management",
    icon: "wallet",
    cut: "tr",
    items: [
      "Online Payment Integration",
      "PI & Invoice Generation",
      "Account Management",
    ],
  },
];

export const expoModules = [
  {
    number: "01",
    title: "Exhibitor Management",
    icon: "users",
    cut: "tr",
    items: [
      "Exhibitor Onboarding",
      "Exhibitor Login",
      "Company Profile Management",
      "Upload Company Logo",
      "Upload Product Catalogue",
      "Upload Social Media Links",
      "Directory Information",
      "View Complimentary Product List",
      "Download Exhibitor Manual",
    ],
  },
  {
    number: "02",
    title: "Stall Booking & Allocation",
    icon: "grid",
    cut: "bl",
    items: [
      "Book / Block Stall",
      "View Stall Availability",
      "Select Booth",
      "Generate Allotment Letter",
      "Stall Payment Management",
      "Download Possession Letter",
    ],
  },
  {
    number: "03",
    title: "Payments & Accounts",
    icon: "wallet",
    cut: "tr",
    items: [
      "Online Payment",
      "Banking & Accounting",
      "Payment Entry",
      "Payment Follow-ups",
      "Challan (Print / Digital)",
    ],
  },
  {
    number: "04",
    title: "Badge & Pass Management",
    icon: "shield",
    cut: "bl",
    items: [
      {
        label: "Badges",
        children: ["Owner Badge", "Staff Badge", "Temporary Staff Badge"],
      },
      {
        label: "Passes",
        children: ["Fabricator Pass", "Car Pass", "Food Pass"],
      },
    ],
  },
  {
    number: "05",
    title: "Service Orders",
    icon: "clipboard",
    cut: "tr",
    items: ["Extra Furniture", "Extra Electricity", "Vendor Services"],
  },
  {
    number: "06",
    title: "Fabricator Management",
    icon: "pen",
    cut: "bl",
    items: [
      "Select Fabricator",
      "Stall Design Submission",
      "Stall Design Status",
      "Download Design Approval Letter",
      "Fabricator Entry Passes",
    ],
  },
  {
    number: "07",
    title: "Visitor Engagement",
    icon: "users",
    cut: "tr",
    items: [
      "Dynamic Visitor Registration Links",
      "Exhibitor Branding Registration Page",
      "VIP Invitations",
      "Visitor Inquiry Management",
    ],
  },
  {
    number: "08",
    title: "Marketing Tools",
    icon: "palette",
    cut: "bl",
    items: [
      "Promotional Image Downloads",
      "Bulk WhatsApp Campaigns",
      "Exhibitor Branding Assets",
    ],
  },
  {
    number: "09",
    title: "Team Dashboard",
    icon: "monitor",
    cut: "tr",
    items: [
      {
        label: "Vendor Login",
        children: ["Assigned Work", "Reports"],
      },
      {
        label: "Management Login",
        children: ["Reports", "Dashboard"],
      },
      {
        label: "Marketing Login",
        children: ["Campaign Reports", "Lead Reports"],
      },
    ],
  },
  {
    number: "10",
    title: "Reports & Analytics",
    icon: "file",
    cut: "bl",
    items: [
      "Exhibitor Reports",
      "Sales Reports",
      "Payment Reports",
      "Visitor Reports",
      "Vendor Reports",
      "Management Dashboard",
    ],
  },
];
