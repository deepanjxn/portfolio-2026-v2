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
  /* Native aspect ratio of the real media asset (e.g. "16 / 9" for the
     webm). The inset media area adopts it so the media exactly fills
     its clip box and rounded corners land on the visible media. */
  mediaAspectRatio?: string;
  /* Study-card cursor pill: the label shown next to the pointer while
     hovering the card and the pill's background color. Cards without a
     cursorColor fall back to a neutral default. */
  cursorLabel?: string;
  cursorColor?: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  studies: "Studies",
  visuals: "Visuals",
  explainers: "Explainers",
};

export const projects: Project[] = [
  {
    id: "p01",
    slug: "livestroke",
    title: "LiveStroke",
    category: "studies",
    mediaType: "video",
    videoSrc: "/studies/livestroke/livestroke-intro.webm",
    poster: "/studies/livestroke/livestroke-poster.png",
    alt: "LiveStroke animated gradient border around a button",
    aspectRatio: "3 / 2",
    mediaAspectRatio: "16 / 9",
    cursorLabel: "LiveStroke",
    cursorColor: "var(--color-accent-blue)",
  },
  {
    id: "p02",
    slug: "filterpixel",
    title: "FilterPixel",
    category: "studies",
    mediaType: "video",
    videoSrc: "/studies/filterpixel/filterpixel-intro-2.webm",
    alt: "FilterPixel AI photo culling and editing interface",
    aspectRatio: "3 / 2",
    mediaAspectRatio: "16 / 9",
    cursorLabel: "FilterPixel",
    cursorColor: "#34C759",
  },
  {
    id: "p03",
    slug: "healthcare-scheduling",
    title: "Designing a healthcare scheduling product",
    category: "studies",
    mediaType: "image",
    aspectRatio: "3 / 2",
  },
  {
    id: "p04",
    slug: "saas-design-system",
    title: "Building a design system for a SaaS suite",
    category: "studies",
    mediaType: "image",
    aspectRatio: "3 / 2",
  },
  {
    id: "p05",
    slug: "accessibility-audit",
    title: "Accessibility audit of a travel booking flow",
    category: "studies",
    mediaType: "image",
    aspectRatio: "3 / 2",
  },
  {
    id: "p06",
    slug: "visual-identity-exploration",
    title: "Visual identity exploration",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p07",
    slug: "campaign-stills",
    title: "Campaign stills — product launch",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p08",
    slug: "poster-series",
    title: "Poster series — design principles",
    category: "visuals",
    mediaType: "image",
  },
  {
    id: "p09",
    slug: "explainer-how-it-works",
    title: "Explainer — how the platform works",
    category: "explainers",
    mediaType: "video",
  },
  {
    id: "p10",
    slug: "explainer-payments",
    title: "Explainer — payments architecture",
    category: "explainers",
    mediaType: "video",
  },
  {
    id: "p11",
    slug: "explainer-mobile-app",
    title: "Explainer — mobile app tour",
    category: "explainers",
    mediaType: "video",
  },
];
