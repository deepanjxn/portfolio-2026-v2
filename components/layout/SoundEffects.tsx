"use client";

import { useEffect, useRef } from "react";

/* Plays a short click sound once per hover-enter of a hyperlink, a
   button (category filters / view toggle) or any element flagged
   data-hover-sound (project cards), and a distinct click-enter sound
   when a hyperlink or button is clicked. One delegated
   pointerover/click listener pair covers every target on the site,
   including targets added later. Hover sound is restricted to REAL
   mouse hovers: the device must report a hover-capable fine pointer,
   and the event itself must not be derived from a touch interaction —
   Chrome synthesizes compatibility pointerover events (pointerType
   "mouse") from touch scrolls/taps on hybrid devices (touch laptops,
   tablets with a pointer), so capability checks alone are not enough.
   Coarse / non-hovering devices react to an explicit click or tap only.
   The browser only allows audio playback after a user gesture, so the
   first pointerdown anywhere silently warms both Audio elements up
   (volume 0) — after that, hovers/clicks can sound. */
const HOVER_SOUND_SRC = "/sfx/click-sound.m4a";
const ENTER_SOUND_SRC = "/sfx/click-enter.m4a";
const HOVER_TARGET_SELECTOR = 'a[href], button:not(:disabled), [data-hover-sound]';
const CLICK_TARGET_SELECTOR = "a[href], button:not(:disabled)";
/* Hover sounds exist only where hover is a real, fine-pointer
   capability (desktop mouse). Coarse-pointer / non-hovering devices
   (tablet, mobile) must react to an explicit click or tap only. */
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
/* After a touch ends, browsers may still synthesize a compatibility
   mouseover (tap-hover emulation). This window swallows those so a tap
   or the tail of a scroll can never sound like a hover. */
const TOUCH_SUPPRESSION_MS = 800;

export default function SoundEffects() {
  const lastTargetRef = useRef<Element | null>(null);
  const lastClickAtRef = useRef(0);

  useEffect(() => {
    let hoverAudio: HTMLAudioElement | null = null;
    let enterAudio: HTMLAudioElement | null = null;
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    /* Touch interaction state: set while fingers are down (a scroll or
       drag is in flight) and stamped on touch end so hover-eligible
       pointerover events can be rejected when they were actually
       produced by touch input on a fine-pointer hybrid device. */
    let touchActive = false;
    let lastTouchAt = 0;

    const markTouch = () => {
      touchActive = true;
      lastTouchAt = performance.now();
    };

    const clearTouch = () => {
      touchActive = false;
      lastTouchAt = performance.now();
    };

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

    const isTouchDerivedPointer = (event: PointerEvent) => {
      const capabilities = (
        event as PointerEvent & {
          sourceCapabilities?: { firesTouchEvents?: boolean };
        }
      ).sourceCapabilities;
      if (capabilities?.firesTouchEvents) return true;
      return false;
    };

    const handlePointerOver = (event: PointerEvent) => {
      /* Only genuine mouse pointers qualify; compatibility mouse events
         synthesised from touch never carry a real "mouse" source. */
      if (event.pointerType !== "mouse") return;
      /* No hover sound without an actual hover-capable fine pointer —
         covers touch/coarse devices even when they synthesize mouse-ish
         pointer events. */
      if (!finePointer.matches) return;
      /* Reject hover events derived from an active or recent touch
         (touch scroll/drag on hybrids, tap-hover emulation). */
      if (touchActive) return;
      if (performance.now() - lastTouchAt < TOUCH_SUPPRESSION_MS) return;
      if (isTouchDerivedPointer(event)) return;
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

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        markTouch();
      }
      const hover = getHoverAudio();
      hover.volume = 0;
      hover.currentTime = 0;
      hover.play().catch(() => {});
      const enter = getEnterAudio();
      enter.volume = 0;
      enter.currentTime = 0;
      enter.play().catch(() => {});
    };

    const handleTouchStart = () => markTouch();
    const handleTouchEnd = () => clearTouch();
    const handleTouchCancel = () => clearTouch();

    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
    document.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
      hoverAudio?.pause();
      enterAudio?.pause();
    };
  }, []);

  return null;
}
