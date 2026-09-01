export type ProjectCategory = "studies" | "visuals" | "explainers";

export type ProjectMediaType = "image" | "video";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  mediaType: ProjectMediaType;
  thumbnail?: string;
  videoSrc?: string;
  poster?: string;
  alt?: string;
  aspectRatio?: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  studies: "Studies",
  visuals: "Visuals",
  explainers: "Explainers",
};

export const projects: Project[] = [
  {
    id: "p01",
    slug: "fintech-onboarding",
    title: "Redesigning fintech onboarding",
    category: "studies",
    mediaType: "image",
  },
  {
    id: "p02",
    slug: "healthcare-scheduling",
    title: "Designing a healthcare scheduling product",
    category: "studies",
    mediaType: "image",
  },
  {
    id: "p03",
    slug: "saas-design-system",
    title: "Building a design system for a SaaS suite",
    category: "studies",
    mediaType: "image",
  },
  {
    id: "p04",
    slug: "accessibility-audit",
    title: "Accessibility audit of a travel booking flow",
    category: "studies",
    mediaType: "image",
  },
  {
    id: "p05",
    slug: "visual-identity-exploration",
    title: "Visual identity exploration",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p06",
    slug: "campaign-stills",
    title: "Campaign stills — product launch",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p07",
    slug: "poster-series",
    title: "Poster series — design principles",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p08",
    slug: "explainer-how-it-works",
    title: "Explainer — how the platform works",
    category: "explainers",
    mediaType: "video",
  },
  {
    id: "p09",
    slug: "explainer-payments",
    title: "Explainer — payments architecture",
    category: "explainers",
    mediaType: "video",
  },
  {
    id: "p10",
    slug: "explainer-mobile-app",
    title: "Explainer — mobile app tour",
    category: "explainers",
    mediaType: "video",
  },
];
