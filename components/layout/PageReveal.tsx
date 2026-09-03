"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* Longest entrance (media delay 700ms + 950ms media duration) plus
   margin. Once this elapses the body class is dropped so content
   re-renders (category filtering, view toggling) never replay the
   entrance animation. */
const REVEAL_SETTLE_MS = 2600;

export default function PageReveal() {
  const pathname = usePathname();
  const settleTimeout = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    /* Applied before paint so newly mounted page content starts hidden
       and animates in; safe to re-add if already present. */
    document.body.classList.add("reveal-entering");

    if (settleTimeout.current !== null) {
      window.clearTimeout(settleTimeout.current);
    }
    settleTimeout.current = window.setTimeout(() => {
      document.body.classList.remove("reveal-entering");
      settleTimeout.current = null;
    }, REVEAL_SETTLE_MS);

    return () => {
      if (settleTimeout.current !== null) {
        window.clearTimeout(settleTimeout.current);
        settleTimeout.current = null;
      }
    };
  }, [pathname]);

  return null;
}
