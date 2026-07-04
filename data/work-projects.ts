export interface WorkProject {
  slug: string;
  title: string;
  tag: string;
  description: string;
  thumbnail: string;
  pdf: string;
  accent: string;
}

export const workProjects: WorkProject[] = [
  {
    slug: "trend-coins",
    title: "Trend Coins",
    tag: "NEWME · 0→1",
    description:
      "Turning one-time buyers into repeat customers — without discounting our way there. Designed NEWME's unified rewards currency to fix flat M3 retention.",
    thumbnail: "/case-studies/thumbs/trend-coins-pm-case-study.png",
    pdf: "/case-studies/trend-coins-pm-case-study.pdf",
    accent: "#ec1f7a",
  },
  {
    slug: "npos",
    title: "NPOS",
    tag: "NEWME · Platform · 0→1",
    description:
      "Building NEWME's own point-of-sale — the operating system for offline retail, replacing a costly third-party tool with no inventory integration.",
    thumbnail: "/case-studies/thumbs/npos-pm-case-study.png",
    pdf: "/case-studies/npos-pm-case-study.pdf",
    accent: "#1a8a3d",
  },
  {
    slug: "referrals",
    title: "Referrals",
    tag: "NEWME · Growth",
    description:
      "Turning GenZ word-of-mouth into an acquisition channel — a two-sided referral loop built to lower rising CAC on paid channels.",
    thumbnail: "/case-studies/thumbs/referrals-pm-case-study.png",
    pdf: "/case-studies/referrals-pm-case-study.pdf",
    accent: "#e8c400",
  },
  {
    slug: "ims",
    title: "IMS",
    tag: "NEWME · Retail Inventory Management",
    description:
      "One brain for offline inventory — planning, purchasing, and replenishment for NEWME's store network, replacing manual ARS gap-filling.",
    thumbnail: "/case-studies/thumbs/ims-pm-case-study.png",
    pdf: "/case-studies/ims-pm-case-study.pdf",
    accent: "#1a8a3d",
  },
];
