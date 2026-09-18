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
      "Because most of the application lives outside Odoo, the surface area affected by Odoo upgrades is significantly smaller than a heavily customized Odoo frontend. API compatibility still needs to be maintained.",
  },
  {
    question: "Can the app update Odoo?",
    answer:
      "Yes. Depending on the project, applications can both read from and write to Odoo.",
  },
  {
    question: "Will it work on phones?",
    answer:
      "Yes. Mobile usability should be considered a core requirement for every application unless the use case is specifically desktop-only.",
  },
  {
    question: "How much does an app cost?",
    answer:
      "Small applications can start at a few hundred dollars. More sophisticated workflows are quoted based on scope.",
  },
  {
    question: "Can you build anything?",
    answer:
      "No. That's intentional. We focus on narrow applications that make a specific workflow dramatically easier. If the project starts becoming another ERP, Odoo itself is probably the better place for it.",
  },
];
