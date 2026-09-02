"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cursorMediaSource } from "@/data/about";
import styles from "./CursorMedia.module.css";

export default function CursorMedia() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { poster, videoSrc } = cursorMediaSource;

  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const media = mediaRef.current;
    if (!media) return;

    const computed = getComputedStyle(media);
    const offsetX =
      parseFloat(computed.getPropertyValue("--cursor-media-offset-x")) || 24;
    const offsetY =
      parseFloat(computed.getPropertyValue("--cursor-media-offset-y")) || 24;

    const video = media.querySelector("video");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number | null = null;
    let hasPointerPosition = false;
    let allowReveal = false;

    const applyPosition = (x: number, y: number) => {
      media.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0)`;
    };

    const tick = () => {
      const deltaX = targetX - currentX;
      const deltaY = targetY - currentY;

      if (Math.hypot(deltaX, deltaY) < 0.1) {
        currentX = targetX;
        currentY = targetY;
        applyPosition(currentX, currentY);
        rafId = null;
        return;
      }

      currentX += deltaX * 0.18;
      currentY += deltaY * 0.18;
      applyPosition(currentX, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      hasPointerPosition = true;
      if (allowReveal) {
        if (media.classList.contains(styles.hidden)) {
          currentX = targetX;
          currentY = targetY;
        }
        reveal();
      }
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
      play();
    };

    const reveal = () => {
      media.classList.remove(styles.hidden);
    };

    const play = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    const handlePointerLeave = () => {
      media.classList.add(styles.hidden);
      stopLoop();
      if (video) {
        video.pause();
      }
    };

    /* Subtle entrance: wait 500ms after the About page renders, then
       reveal the video already positioned beside the cursor's current
       location. If the pointer has never moved, stay hidden until the
       first mouse move. Cursor tracking itself is never delayed. */
    const entranceTimer = window.setTimeout(() => {
      allowReveal = true;
      if (hasPointerPosition) {
        currentX = targetX;
        currentY = targetY;
        applyPosition(targetX, targetY);
        reveal();
        play();
      }
    }, 500);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.clearTimeout(entranceTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave,
      );
      stopLoop();
      if (video) {
        video.pause();
      }
    };
  }, []);

  if (videoSrc) {
    return (
      <div
        ref={mediaRef}
        className={`${styles.window} ${styles.hidden}`}
        aria-hidden="true"
      >
        <video
          className={styles.media}
          poster={poster}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      </div>
    );
  }

  if (poster) {
    return (
      <div ref={mediaRef} className={styles.window} aria-hidden="true">
        <Image
          className={styles.media}
          src={poster}
          alt=""
          fill
          sizes="280px"
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}
