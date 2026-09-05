"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import type { ViewMode } from "@/components/navigation/ViewToggle";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
  view: ViewMode;
}

/* Rectangle in document coordinates (viewport rect + scroll offsets).
   Deltas between two rects measured at different scroll positions are
   only valid in document space — viewport-space deltas would park the
   cards at the wrong offsets and produce the stepped geometry. */
interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/* Split view (two columns) <-> single view (one column) layout
   transition.

   The CSS grid always switches instantly to the target layout; the card
   DOM nodes never move or remount. This component layers a pure visual
   FLIP on top:

   1. FIRST  - after React commits the new view (layout effect, before
               paint) the cards' CURRENT visual rectangles are read in
               document space. If the previous transition is still
               running, getBoundingClientRect includes the live transform,
               i.e. the exact boxes on screen right now; otherwise these
               are the settled layout boxes of the previous view. This is
               always fresh, so interrupted transitions restart seamlessly
               and scroll/viewport changes can never go stale.
   2. LAST   - the inline flip styles are cleared and the new LAYOUT
               rectangles are measured.
   3. INVERT - each card gets transform: translate(dx, dy) scale(sx, sy)
               with transform-origin: 0 0, where dx/dy/sx/sy map the new
               layout rect onto the old visual rect, so the card is still
               visually exactly where it was.
   4. PLAY   - after a forced style recalc the transition is registered
               and the transform is removed; the card then morphs along a
               straight rect-to-rect path to its natural final position.

   Corner radius: the card's own scale transform would visually scale the
   12px border-radius of the media surface with it (e.g. ~24px at the
   single->split start), so while a flip runs a rAF loop reads the card's
   current computed scale (sx, sy) and writes the surface's local radius
   as 12/sx / 12/sy. The rendered radius therefore stays 12px in every
   frame from first to last, and the inline radius is removed again once
   the scale reaches 1 (resting border-radius stays 12px in both views).

   The underlying CSS layout and all card geometry are untouched; the
   transform is a temporary visual layer removed after the animation. */
const FLIP_TRANSITION = "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)";
const FLIP_CLEANUP_MS = 480;

/* The grid is two columns in split view and one in single view (the same
   split the CSS enforces). Cards stagger by row so the entrance reads
   top-to-bottom; media reveals are slower than text. */
function mediaDelayFor(index: number, view: ViewMode): number {
  const columns = view === "grid" ? 2 : 1;
  const row = Math.floor(index / columns);
  return 400 + row * 100;
}

function readCards(container: HTMLDivElement): Map<string, HTMLElement> {
  const cards = new Map<string, HTMLElement>();
  for (const card of container.querySelectorAll<HTMLElement>(
    "[data-project-id]",
  )) {
    const id = card.dataset.projectId;
    if (id) cards.set(id, card);
  }
  return cards;
}

/* Current 2D matrix (scale + translation) of an element. */
function readMatrix(card: HTMLElement): { sx: number; sy: number } {
  const matrix = getComputedStyle(card).transform;
  if (matrix && matrix !== "none") {
    const match = matrix.match(/matrix\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(",").map(parseFloat);
      return { sx: values[0], sy: values[3] };
    }
    const match3d = matrix.match(/matrix3d\(([^)]+)\)/);
    if (match3d) {
      const values = match3d[1].split(",").map(parseFloat);
      return { sx: values[0], sy: values[5] };
    }
  }
  return { sx: 1, sy: 1 };
}

/* Visual rects in document space, including any live transition
   transform. */
function snapshotVisualRects(
  container: HTMLDivElement,
): Map<string, CardRect> {
  const rects = new Map<string, CardRect>();
  for (const [id, card] of readCards(container)) {
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    rects.set(id, {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  }
  return rects;
}

/* Layout rects in document space, immune to any active transform: the
   current CSS matrix is parsed back out of the visual rect. Valid even
   while a transition is mid-flight (e.g. on window resize). */
function layoutRectOf(card: HTMLElement): CardRect {
  const rect = card.getBoundingClientRect();
  const { sx, sy } = readMatrix(card);
  /* The transform is a translate followed by a scale about the top-left
     origin, so its translation components are the matrix's e/f (2D) or
     12/13 (3D) entries. */
  const matrix = getComputedStyle(card).transform;
  let dx = 0;
  let dy = 0;
  if (matrix && matrix !== "none") {
    const match = matrix.match(/matrix\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(",").map(parseFloat);
      dx = values[4];
      dy = values[5];
    } else {
      const match3d = matrix.match(/matrix3d\(([^)]+)\)/);
      if (match3d) {
        const values = match3d[1].split(",").map(parseFloat);
        dx = values[12];
        dy = values[13];
      }
    }
  }
  return {
    left: rect.left - dx + window.scrollX,
    top: rect.top - dy + window.scrollY,
    width: sx !== 0 ? rect.width / sx : 0,
    height: sy !== 0 ? rect.height / sy : 0,
  };
}

function snapshotLayoutRects(
  container: HTMLDivElement,
): Map<string, CardRect> {
  const rects = new Map<string, CardRect>();
  for (const [id, card] of readCards(container)) {
    const rect = layoutRectOf(card);
    if (rect.width === 0 && rect.height === 0) continue;
    rects.set(id, rect);
  }
  return rects;
}

function clearFlipStyles(container: HTMLDivElement) {
  for (const card of readCards(container).values()) {
    card.style.removeProperty("transform");
    card.style.removeProperty("transform-origin");
    card.style.removeProperty("transition");
    const surface = card.querySelector<HTMLElement>("[data-radius-surface]");
    if (surface) {
      surface.style.removeProperty("border-radius");
    }
  }
}

export default function ProjectGrid({ projects, view }: ProjectGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const settledRectsRef = useRef<Map<string, CardRect> | null>(null);
  const previousViewRef = useRef<ViewMode | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);
  const radiusLoopRef = useRef<number | null>(null);
  const baseRadiusRef = useRef<number | null>(null);

  const stopRadiusLoop = useCallback(() => {
    if (radiusLoopRef.current !== null) {
      window.cancelAnimationFrame(radiusLoopRef.current);
      radiusLoopRef.current = null;
    }
  }, []);

  /* While the cards are scaled by (sx, sy), the surface's local corner
     radius must be 12/sx / 12/sy so the RENDERED radius stays a constant
     12px every frame. Reads the live computed scale each frame; the
     resting radius is never touched (scale 1 => radius removed again). */
  const startRadiusCompensation = useCallback(
    (moving: Array<{ card: HTMLElement }>) => {
      stopRadiusLoop();
      const surfaces: Array<{ card: HTMLElement; surface: HTMLElement }> =
        [];
      for (const { card } of moving) {
        const surface = card.querySelector<HTMLElement>(
          "[data-radius-surface]",
        );
        if (surface) surfaces.push({ card, surface });
      }
      if (surfaces.length === 0) return;

      const baseRadius = baseRadiusRef.current ?? 12;

      const tick = () => {
        for (const { card, surface } of surfaces) {
          const { sx, sy } = readMatrix(card);
          const atRest =
            Math.abs(sx - 1) < 0.002 && Math.abs(sy - 1) < 0.002;
          if (atRest) {
            surface.style.removeProperty("border-radius");
          } else if (sx !== 0 && sy !== 0) {
            surface.style.borderRadius = `${baseRadius / sx}px / ${
              baseRadius / sy
            }px`;
          }
        }
        radiusLoopRef.current = window.requestAnimationFrame(tick);
      };
      radiusLoopRef.current = window.requestAnimationFrame(tick);
    },
    [stopRadiusLoop],
  );

  useLayoutEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    stopRadiusLoop();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const entranceActive = document.body.classList.contains(
      "reveal-entering",
    );
    const viewChanged =
      previousViewRef.current !== null && previousViewRef.current !== view;

    const cardsById = readCards(container);
    const hasLiveTransform = [...cardsById.values()].some(
      (card) => card.style.transform !== "",
    );

    /* FIRST: a mid-flight restart starts from the boxes currently on
       screen (live transition transform included); otherwise from the
       settled layout snapshot of the previous commit — the DOM is
       already in the new layout at this point, so the old geometry only
       survives in that snapshot (or in a live transform). */
    const firstRects = hasLiveTransform
      ? snapshotVisualRects(container)
      : settledRectsRef.current;

    clearFlipStyles(container);

    /* Cache the resting surface radius once, from a pristine state, so
       the compensation always targets the true CSS radius (12px). */
    if (baseRadiusRef.current === null) {
      const sample = container.querySelector<HTMLElement>(
        "[data-radius-surface]",
      );
      if (sample) {
        baseRadiusRef.current =
          parseFloat(getComputedStyle(sample).borderRadius) || 12;
      }
    }

    const nextRects = snapshotLayoutRects(container);

    if (viewChanged && !reducedMotion && !entranceActive) {
      const moving: Array<{
        card: HTMLElement;
        dx: number;
        dy: number;
        sx: number;
        sy: number;
      }> = [];

      if (firstRects && firstRects.size > 0) {
        for (const [id, from] of firstRects) {
          const to = nextRects.get(id);
          const card = cardsById.get(id);
          if (!to || !card) continue;

          /* Mid-flight restarts read live visual rects. Their valid
             values always lie inside the union of the two layouts, so
             clamp against it — any resolved value outside that union is
             a style-resolution ghost and would otherwise start the
             restart from a broken rectangle. */
          let fromLeft = from.left;
          let fromTop = from.top;
          let fromWidth = from.width;
          let fromHeight = from.height;
          if (hasLiveTransform) {
            const settled = settledRectsRef.current?.get(id);
            if (settled) {
              const minLeft = Math.min(settled.left, to.left);
              const maxLeft = Math.max(settled.left, to.left);
              const minTop = Math.min(settled.top, to.top);
              const maxTop = Math.max(settled.top, to.top);
              const minWidth = Math.min(settled.width, to.width);
              const maxWidth = Math.max(settled.width, to.width);
              const minHeight = Math.min(settled.height, to.height);
              const maxHeight = Math.max(settled.height, to.height);
              fromLeft = Math.min(
                Math.max(from.left, minLeft - 2),
                maxLeft + 2,
              );
              fromTop = Math.min(Math.max(from.top, minTop - 2), maxTop + 2);
              fromWidth = Math.min(
                Math.max(from.width, minWidth),
                maxWidth,
              );
              fromHeight = Math.min(
                Math.max(from.height, minHeight),
                maxHeight,
              );
            }
          }

          const dx = fromLeft - to.left;
          const dy = fromTop - to.top;
          const sx = fromWidth / to.width;
          const sy = fromHeight / to.height;
          if (
            Math.abs(dx) < 0.5 &&
            Math.abs(dy) < 0.5 &&
            Math.abs(sx - 1) < 0.001 &&
            Math.abs(sy - 1) < 0.001
          ) {
            continue;
          }
          moving.push({ card, dx, dy, sx, sy });
        }
      }

      if (moving.length > 0) {
        /* INVERT: place every card visually back onto its old rect,
           before the browser paints the new layout. Also compensate the
           surface radius synchronously for the initial scale — the first
           painted frame happens before the rAF compensation loop's first
           tick, so a loop-only approach would show one unscaled-radius
           frame. */
        const baseRadius = baseRadiusRef.current ?? 12;
        for (const { card, dx, dy, sx, sy } of moving) {
          card.style.transformOrigin = "0 0";
          card.style.transition = "none";
          card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
          if (sx !== 0 && sy !== 0) {
            const surface = card.querySelector<HTMLElement>(
              "[data-radius-surface]",
            );
            if (surface) {
              surface.style.borderRadius = `${baseRadius / sx}px / ${
                baseRadius / sy
              }px`;
            }
          }
        }
        void container.offsetWidth;

        /* PLAY: register the transition on a recalc'd base state, then
           release the inverse transform. */
        for (const { card } of moving) {
          card.style.transition = FLIP_TRANSITION;
          void card.offsetWidth;
        }
        for (const { card } of moving) {
          card.style.transform = "none";
        }

        startRadiusCompensation(moving);

        cleanupTimerRef.current = window.setTimeout(() => {
          cleanupTimerRef.current = null;
          stopRadiusLoop();
          clearFlipStyles(container);
        }, FLIP_CLEANUP_MS);

        settledRectsRef.current = nextRects;
        previousViewRef.current = view;
        return;
      }
    }

    settledRectsRef.current = nextRects;
    previousViewRef.current = view;
  }, [view, projects, stopRadiusLoop, startRadiusCompensation]);

  /* A viewport resize reflows the grid without a view/project commit, so
     the settled snapshot would otherwise go stale (wrong FIRST rects on
     the next flip). Refresh it whenever the window resizes; transform-
     aware layout measurement keeps this valid even mid-transition. */
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;
    const handleResize = () => {
      settledRectsRef.current = snapshotLayoutRects(container);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }
      stopRadiusLoop();
    };
  }, [stopRadiusLoop]);

  return (
    <div
      ref={gridRef}
      className={`${styles.grid} ${view === "single" ? styles.single : ""}`}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          href={
            project.category === "studies"
              ? `/studies/${project.slug}`
              : undefined
          }
          revealDelayMs={mediaDelayFor(index, view)}
        />
      ))}
    </div>
  );
}
