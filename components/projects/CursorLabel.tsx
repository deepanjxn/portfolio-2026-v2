/* Cursor pill shown beside the mouse pointer while hovering homepage
   Study cards. One shared, delegated implementation: pointerover on any
   [data-project-id] card looks the project up in the data and shows a
   small rounded label (title + per-study color) that tracks the cursor.
   Movement is lerped in a rAF loop into refs (no React state per move);
   the pill is position: fixed + pointer-events: none, so it never
   captures input, affects layout, or is clipped by a card.

   Desktop mouse only: the pill requires (hover: hover) and
   (pointer: fine) capability, only reacts to real mouse pointer events,
   and suppresses while a touch is active or recent (touch scroll/tap on
   hybrids must never summon it). It performs no sound and applies no
   transform to any card. */
"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import styles from "./CursorLabel.module.css";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const CARD_SELECTOR = "[data-project-id]";
/* Where the pill sits relative to the pointer: right and slightly
   below, with the label padding keeping the text clear of the cursor. */
const CURSOR_OFFSET_X = 16;
const CURSOR_OFFSET_Y = 12;
const FOLLOW_RATE = 0.45;
const TOUCH_SUPPRESSION_MS = 800;
/* Intentional-but-responsive reveal delay: the pill appears shortly
   after the pointer settles on a Study card, positioned at the cursor's
   CURRENT position (tracked through the delay), never a stale one. */
const REVEAL_DELAY_MS = 150;
const HIDE_DELAY_MS = 60;

const DEFAULT_CURSOR_COLOR = "#171717";

interface CursorPill {
  label: string;
  color: string;
}

export default function CursorLabel() {
  const [pill, setPill] = useState<CursorPill | null>(null);
  const pillElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pillEl = pillElRef.current;
    if (!pillEl) return;

    let touchActive = false;
    let lastTouchAt = 0;
    let hideTimer: number | null = null;
    let revealTimer: number | null = null;
    let raf: number | null = null;
    let visible = false;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const stopFollow = () => {
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const cancelReveal = () => {
      if (revealTimer !== null) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }
    };

    const setVisible = (next: boolean) => {
      if (next === visible) return;
      visible = next;
      pillEl.style.opacity = next ? "1" : "0";
      pillEl.style.transform = next ? "scale(1)" : "scale(0.92)";
      if (next) {
        if (raf === null) {
          /* Anchor the entrance to the cursor's position right now —
             the pointer keeps being tracked during the reveal delay, so
             this is never stale. */
          cursorX = mouseX;
          cursorY = mouseY;
          const tick = () => {
            const step = reducedMotion ? 1 : FOLLOW_RATE;
            cursorX += (mouseX - cursorX) * step;
            cursorY += (mouseY - cursorY) * step;
            pillEl.style.left = `${Math.round(cursorX + CURSOR_OFFSET_X)}px`;
            pillEl.style.top = `${Math.round(cursorY + CURSOR_OFFSET_Y)}px`;
            raf = window.requestAnimationFrame(tick);
          };
          raf = window.requestAnimationFrame(tick);
        }
      } else {
        stopFollow();
      }
    };

    const scheduleHide = () => {
      cancelReveal();
      if (hideTimer !== null) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        hideTimer = null;
        setVisible(false);
      }, HIDE_DELAY_MS);
    };

    const isTouchRecent = () => {
      if (touchActive) return true;
      return performance.now() - lastTouchAt < TOUCH_SUPPRESSION_MS;
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (isTouchRecent()) return;
      const node = event.target;
      if (!(node instanceof Element)) return;
      const card = node.closest<HTMLElement>(CARD_SELECTOR);
      /* Over anything that is not a Study card the pill must leave. */
      if (!card) {
        scheduleHide();
        return;
      }
      const project = projects.find((p) => p.id === card.dataset.projectId);
      if (!project || project.category !== "studies") {
        scheduleHide();
        return;
      }
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      const next = {
        label: project.cursorLabel ?? project.title,
        color: project.cursorColor ?? DEFAULT_CURSOR_COLOR,
      };
      setPill((current) =>
        current?.label === next.label && current?.color === next.color
          ? current
          : next,
      );
      /* Reveal after the short delay. The pointer position keeps being
         tracked meanwhile; leaving before the timer fires cancels it. */
      cancelReveal();
      revealTimer = window.setTimeout(() => {
        revealTimer = null;
        setVisible(true);
      }, REVEAL_DELAY_MS);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const node = event.target;
      if (!(node instanceof Element)) return;
      if (!node.closest(CARD_SELECTOR)) return;
      /* Moving straight onto another card: the next pointerover cancels
         the pending hide, so the pill swaps labels without flickering. */
      const next = event.relatedTarget;
      if (next instanceof Element && next.closest(CARD_SELECTOR)) return;
      scheduleHide();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const markTouch = () => {
      touchActive = true;
      lastTouchAt = performance.now();
      scheduleHide();
    };
    const clearTouch = () => {
      touchActive = false;
      lastTouchAt = performance.now();
    };
    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut, {
      passive: true,
    });
    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("touchstart", markTouch, { passive: true });
    document.addEventListener("touchend", clearTouch, { passive: true });
    document.addEventListener("touchcancel", clearTouch, { passive: true });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("touchstart", markTouch);
      document.removeEventListener("touchend", clearTouch);
      document.removeEventListener("touchcancel", clearTouch);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
      cancelReveal();
      stopFollow();
    };
  }, []);

  /* Apply the per-study background color to the pill element. */
  useEffect(() => {
    const pillEl = pillElRef.current;
    if (pillEl && pill) pillEl.style.backgroundColor = pill.color;
  }, [pill]);

  return (
    <div
      ref={pillElRef}
      className={styles.pill}
      role="presentation"
      aria-hidden="true"
    >
      <span className={`type-h3 ${styles.label}`}>{pill?.label}</span>
    </div>
  );
}
