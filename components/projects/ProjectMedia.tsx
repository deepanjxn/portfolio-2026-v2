"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./ProjectMedia.module.css";

const DEFAULT_ASPECT_RATIO = "16 / 10";

/* Cards further than this from the viewport keep their video source
   detached; crossing the threshold attaches the existing <source> and
   the browser then loads and autoplays the video natively. */
const VIDEO_ROOT_MARGIN = "200px 0px";

/* MIME type for the card's local video sources, derived from the file
   extension so both .webm and .mp4 sources can be referenced. */
function videoMime(src: string): string {
  if (src.toLowerCase().endsWith(".webm")) return "video/webm";
  if (src.toLowerCase().endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

export default function ProjectMedia({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isVideo = project.mediaType === "video" && Boolean(project.videoSrc);

  /* The video element and its native poster render from the start; only
     the source waits for the observer. The observer disconnects on the
     first intersection, so re-renders never create another one and
     scrolling away never unloads the source. */
  useEffect(() => {
    if (!isVideo || shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
        }
      },
      { rootMargin: VIDEO_ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [isVideo, shouldLoadVideo]);

  /* Custom property rather than an inline aspect-ratio so a stylesheet
     media query can override it on mobile (inline styles always win). */
  const ratioStyle = {
    "--card-aspect": project.aspectRatio ?? DEFAULT_ASPECT_RATIO,
  } as CSSProperties;
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
    /* Visuals fill the whole 16:10 placeholder: the cover image is
       clipped by the card's own overflow + 12px radius, and native lazy
       loading keeps the gray placeholder visible until it is ready. */
    if (project.category === "visuals") {
      return (
        <div
          className={styles.media}
          data-radius-surface
          data-visual
          style={ratioStyle}
        >
          <Image
            className={styles.cover}
            src={project.thumbnail}
            alt={project.alt ?? project.title}
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div
        className={styles.media}
        data-radius-surface
        data-square-mobile={project.category === "studies" || undefined}
        data-desktop-4x3
        style={ratioStyle}
      >
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
      <div
        className={styles.media}
        data-radius-surface
        data-square-mobile={project.category === "studies" || undefined}
        data-desktop-4x3
        style={ratioStyle}
      >
        <div
          className={styles.inset}
          data-radius-clip
          data-radius-base="16"
          style={mediaRatioStyle}
        >
          <video
            ref={videoRef}
            className={styles.video}
            poster={project.poster}
            preload="none"
            muted
            autoPlay
            loop
            playsInline
            aria-hidden="true"
          >
            {shouldLoadVideo && (
              <source
                src={project.videoSrc}
                type={videoMime(project.videoSrc)}
              />
            )}
          </video>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.media}
      data-radius-surface
      data-square-mobile={project.category === "studies" || undefined}
      data-desktop-4x3
      style={ratioStyle}
      aria-hidden="true"
    />
  );
}
