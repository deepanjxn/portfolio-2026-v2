"use client";

import { useEffect, useRef } from "react";

/* Plays a short click sound once per hover-enter of a hyperlink, a
   button (category filters / view toggle) or any element flagged
   data-hover-sound (project cards), and a distinct click-enter sound
   when a hyperlink or button is clicked. One delegated
   pointerover/click listener pair covers every target on the site,
   including targets added later. The browser only allows audio playback
   after a user gesture, so the first pointerdown anywhere silently warms
   both Audio elements up (volume 0) — after that, hovers/clicks can
   sound. */
const HOVER_SOUND_SRC = "/sfx/click-sound.m4a";
const ENTER_SOUND_SRC = "/sfx/click-enter.m4a";
const HOVER_TARGET_SELECTOR = 'a[href], button:not(:disabled), [data-hover-sound]';
const CLICK_TARGET_SELECTOR = "a[href], button:not(:disabled)";

export default function SoundEffects() {
  const lastTargetRef = useRef<Element | null>(null);
  const lastClickAtRef = useRef(0);

  useEffect(() => {
    let hoverAudio: HTMLAudioElement | null = null;
    let enterAudio: HTMLAudioElement | null = null;

    const getHoverAudio = () => {
      if (!hoverAudio) {
        hoverAudio = new Audio(HOVER_SOUND_SRC);
        hoverAudio.preload = "auto";
      }
      return hoverAudio;
    };

    const getEnterAudio = () => {
      if (!enterAudio) {
        enterAudio = new Audio(ENTER_SOUND_SRC);
        enterAudio.preload = "auto";
      }
      return enterAudio;
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      /* After a click navigates, the freshly mounted page can re-fire
         pointerover on the link under the stationary cursor; skip the
         hover sound briefly so only the enter sound plays on click. */
      if (performance.now() - lastClickAtRef.current < 300) return;
      const node = event.target;
      if (!(node instanceof Element)) return;
      const target = node.closest(HOVER_TARGET_SELECTOR);
      if (target === lastTargetRef.current) return;
      lastTargetRef.current = target;
      if (!target) return;
      const el = getHoverAudio();
      if (el.volume === 0) el.volume = 1;
      el.currentTime = 0;
      el.play().catch(() => {});
    };

    const handleClick = (event: MouseEvent) => {
      const node = event.target;
      if (!(node instanceof Element)) return;
      if (!node.closest(CLICK_TARGET_SELECTOR)) return;
      lastClickAtRef.current = performance.now();
      const el = getEnterAudio();
      el.volume = 1;
      el.currentTime = 0;
      el.play().catch(() => {});
    };

    const handlePointerDown = () => {
      const hover = getHoverAudio();
      hover.volume = 0;
      hover.currentTime = 0;
      hover.play().catch(() => {});
      const enter = getEnterAudio();
      enter.volume = 0;
      enter.currentTime = 0;
      enter.play().catch(() => {});
    };

    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handlePointerDown);
      hoverAudio?.pause();
      enterAudio?.pause();
    };
  }, []);

  return null;
}
