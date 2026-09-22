export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you replace Odoo?",
    answer:
      "No. Odoo stays at the center of the business. Our applications connect to it.",
  },
  {
    question: "Do I need to install an Odoo module?",
    answer:
      "Usually not. Most apps communicate through Odoo's API. Some workflows may require additional Odoo-side functionality, which would be discussed before starting.",
  },
  {
    question: "Will this break when Odoo is upgraded?",
    answer:
      "Much less likely to than an in-Odoo customization. The app lives entirely outside Odoo and never changes Odoo's own code, so there's no custom module installed in your database that can clash with another module or fail during an upgrade. API compatibility still needs to be maintained, but that's a far smaller surface area to check than a heavily customized Odoo frontend.",
  },
  {
    question: "Can the app update Odoo?",
    answer:
      "Yes. Depending on the project, applications can both read from and write to Odoo.",
  },
  {
    question: "Will it work on phones?",
    answer:
      "Yes. Mobile usability is a core requirement for every app unless the use case is specifically desktop-only.",
  },
  {
    question: "How much does an app cost?",
    answer:
      "Small applications can start at a few hundred dollars. More sophisticated workflows are quoted based on scope.",
  },
  {
    question: "Can you build anything?",
    answer:
      "No. That's intentional. We focus on narrow applications that make a specific workflow noticeably easier. If the project starts becoming another ERP, Odoo itself is probably the better place for it.",
  },
];
