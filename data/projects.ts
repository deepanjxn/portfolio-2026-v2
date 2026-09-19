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

/* The Visuals collection: every image under public/images/
   (deepanjan-visuals-1.png … -91.png). The files share one shape, so
   the entries are generated from the numeric filename range rather than
   written out by hand — all 91 are represented in order, with no
   duplicates. */
const VISUAL_COUNT = 91;

const visualProjects: Project[] = Array.from(
  { length: VISUAL_COUNT },
  (_, index): Project => {
    const number = index + 1;
    const suffix = String(number).padStart(2, "0");
    const label = `Visual ${suffix}`;
    return {
      id: `v${suffix}`,
      slug: `visual-${number}`,
      title: label,
      category: "visuals",
      mediaType: "image",
      thumbnail: `/images/deepanjan-visuals-${number}.png`,
      alt: label,
    };
  },
);

export const projects: Project[] = [
  {
    id: "p01",
    slug: "livestroke",
    title: "LiveStroke",
    category: "studies",
    mediaType: "video",
    videoSrc: "/studies/livestroke/livestroke-intro.webm",
    poster: "/studies/livestroke/livestroke-poster.webp",
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
    videoSrc: "/studies/filterpixel/filterpixel-intro.webm",
    poster: "/studies/filterpixel/filterpixel-poster.webp",
    alt: "FilterPixel AI photo culling and editing interface",
    aspectRatio: "3 / 2",
    mediaAspectRatio: "16 / 9",
    cursorLabel: "FilterPixel",
    cursorColor: "#34C759",
  },
  {
    /* Inserted after FilterPixel so Paperclip is the third Study card.
       Same cover treatment as the other authored studies: webm intro
       inside the shared inset frame, 16:9 like the native asset. */
    id: "p02b",
    slug: "paperclip",
    title: "Paperclip",
    category: "studies",
    mediaType: "video",
    videoSrc: "/studies/paperclip/paperclip-intro.webm",
    poster: "/studies/paperclip/paperclip-poster.webp",
    alt: "Paperclip AI-powered resale marketplace interface",
    aspectRatio: "3 / 2",
    mediaAspectRatio: "16 / 9",
    cursorLabel: "Paperclip",
    cursorColor: "#FF2D55",
  },
  {
    /* Fourth Study card, directly after Paperclip. Same preview
       treatment as the other authored studies: the gallery-6 identity
       animation (16:9 webm) inside the shared inset frame, with
       reevv-poster.webp as the poster. */
    id: "p02c",
    slug: "reevv-research",
    title: "Reevv Research",
    category: "studies",
    mediaType: "video",
    videoSrc: "/studies/reevv/gallery-6.webm",
    poster: "/studies/reevv/reevv-poster.webp",
    alt: "Reevv brand identity and business card mockup",
    aspectRatio: "3 / 2",
    mediaAspectRatio: "16 / 9",
    cursorLabel: "Reevv Research",
    cursorColor: "#6155F5",
  },
  ...visualProjects,
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
