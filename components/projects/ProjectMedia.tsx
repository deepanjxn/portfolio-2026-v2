import type { CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./ProjectMedia.module.css";

const DEFAULT_ASPECT_RATIO = "16 / 10";

export default function ProjectMedia({ project }: { project: Project }) {
  const aspectRatio = project.aspectRatio ?? DEFAULT_ASPECT_RATIO;
  const ratioStyle = { aspectRatio } satisfies CSSProperties;

  if (project.mediaType === "image" && project.thumbnail) {
    return (
      <div className={styles.media} data-radius-surface style={ratioStyle}>
        <Image
          src={project.thumbnail}
          alt={project.alt ?? project.title}
          fill
          sizes="(min-width: 1280px) 50vw, 100vw"
          loading="lazy"
        />
      </div>
    );
  }

  if (project.mediaType === "video" && project.videoSrc) {
    return (
      <div className={styles.media} data-radius-surface style={ratioStyle}>
        <video
          className={styles.video}
          poster={project.poster}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={project.videoSrc} type="video/mp4" />
        </video>
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
