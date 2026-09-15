import Image from "next/image";
import type { StudyMedia as StudyMediaData } from "@/data/studies";
import styles from "./StudyMedia.module.css";

/* Renders a real asset inside an editorial media box once one exists.
   Until a study's media entry carries a src or vimeo id, the box itself
   stays a blank placeholder and this component is not rendered at all.

   Three asset kinds share the same box geometry:
   - local videos play muted inline (looping ambient recordings),
   - every other local file renders as a responsive image,
   - a vimeo id renders the hosted Vimeo iframe player (muted autoplay,
     looping, no controls). No Vimeo Player API script is loaded — the
     iframe's own query parameters drive the player.

   All of them absolutely fill the box with the same geometry, so the
   panel never changes size between placeholder and asset. */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

/* Muted autoplay, infinite loop, controls hidden, inline playback on
   mobile. No Player API involved. */
const VIMEO_EMBED_PARAMS =
  "?badge=0&autopause=0&player_id=0&app_id=58479" +
  "&autoplay=1&muted=1&loop=1&controls=0&playsinline=1";

function VimeoEmbed({ media }: { media: StudyMediaData }) {
  const { vimeo, alt } = media;
  if (!vimeo) return null;

  return (
    <>
      <iframe
        className={`${styles.fill} ${styles.embed} ${
          media.cover ? styles.cover : ""
        }`}
        src={`https://player.vimeo.com/video/${vimeo}${VIMEO_EMBED_PARAMS}`}
        title={alt ?? "Embedded video"}
        allow="autoplay; fullscreen; picture-in-picture"
      />
      <div className={styles.vimeoOverlay} aria-hidden="true" />
    </>
  );
}

export default function StudyMedia({ media }: { media: StudyMediaData }) {
  const { src, alt } = media;

  if (media.vimeo) {
    return <VimeoEmbed media={media} />;
  }

  if (!src) return null;

  const isVideo = VIDEO_EXTENSIONS.some((extension) =>
    src.toLowerCase().endsWith(extension),
  );

  if (isVideo) {
    return (
      <video
        className={`${styles.fill} ${styles.asset}`}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      className={`${styles.fill} ${styles.asset}`}
      src={src}
      alt={alt ?? ""}
      fill
      sizes="(min-width: 960px) 912px, 100vw"
    />
  );
}
