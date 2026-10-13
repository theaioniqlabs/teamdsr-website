import { contactInfo } from "./navigation.js";

export { contactInfo };

export const contactPage = {
  title: "Contact",
  heading: "Get in touch",
  intro: "Tell us about your exhibition, event, or technology need — we’ll respond with clarity.",
  successTitle: "Thank you",
  successMessage: "We’ve received your enquiry. Our team will get back to you shortly.",
  submitLabel: "Send enquiry",
  qrCaption: "Scan to visit www.teamdsr.co.in",
  channels: [
    {
      id: "phone",
      label: contactInfo.phone,
      href: contactInfo.phoneHref,
      icon: "phone",
      aria: `Call ${contactInfo.phone}`,
    },
    {
      id: "email",
      label: contactInfo.email,
      href: contactInfo.emailHref,
      icon: "mail",
      aria: `Email ${contactInfo.email}`,
    },
    {
      id: "web",
      label: contactInfo.website,
      href: contactInfo.websiteHref,
      icon: "grid",
      aria: `Visit ${contactInfo.website}`,
      external: true,
    },
  ],
  pillars: [
    { id: "exhibitions", label: "Exhibitions", icon: "booth" },
    { id: "events", label: "Events", icon: "calendar" },
    { id: "technology", label: "Technology", icon: "cpu" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true, autocomplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
    { name: "phone", label: "Phone", type: "tel", required: false, autocomplete: "tel" },
    { name: "company", label: "Company", type: "text", required: false, autocomplete: "organization" },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
      rows: 4,
      autocomplete: "off",
    },
  ],
};
