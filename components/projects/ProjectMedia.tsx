import type { CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./ProjectMedia.module.css";

const DEFAULT_ASPECT_RATIO = "16 / 10";

/* MIME type for the card's local video sources, derived from the file
   extension so both .webm and .mp4 sources can be referenced. */
function videoMime(src: string): string {
  if (src.toLowerCase().endsWith(".webm")) return "video/webm";
  if (src.toLowerCase().endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

export default function ProjectMedia({ project }: { project: Project }) {
  const aspectRatio = project.aspectRatio ?? DEFAULT_ASPECT_RATIO;
  const ratioStyle = { aspectRatio } satisfies CSSProperties;
  /* The inset area adopts the MEDIA's own native ratio (not the outer
     frame's) so the video/image exactly fills its clip box — no
     object-fit letterboxing inside it, which means the 16px clip radius
     rounds the actual visible media corners. */
  const mediaRatioStyle = {
    aspectRatio: project.mediaAspectRatio ?? DEFAULT_ASPECT_RATIO,
  } satisfies CSSProperties;

  /* Real media renders inside the frame's inset area (see module css);
     cards without an asset render the bare frame as before. */
  if (project.mediaType === "image" && project.thumbnail) {
    return (
      <div className={styles.media} data-radius-surface style={ratioStyle}>
        <div
          className={styles.inset}
          data-radius-clip
          data-radius-base="16"
          style={mediaRatioStyle}
        >
          <Image
            src={project.thumbnail}
            alt={project.alt ?? project.title}
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  if (project.mediaType === "video" && project.videoSrc) {
    return (
      <div className={styles.media} data-radius-surface style={ratioStyle}>
        <div
          className={styles.inset}
          data-radius-clip
          data-radius-base="16"
          style={mediaRatioStyle}
        >
          <video
            className={styles.video}
            poster={project.poster}
            preload="none"
            muted
            autoPlay
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={project.videoSrc} type={videoMime(project.videoSrc)} />
          </video>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.media}
      data-radius-surface
      style={ratioStyle}
      aria-hidden="true"
    />
  );
}
