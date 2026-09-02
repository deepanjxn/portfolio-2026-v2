import { useEffect, useSyncExternalStore } from "react";
import styles from "./ViewToggle.module.css";

export type ViewMode = "grid" | "single";

/* Matches the grid's single-column breakpoint (ProjectGrid.module.css):
   below 768px only Single View is available; from tablet up (768px+)
   both Single and Split View are available. */
const SINGLE_COLUMN_QUERY = "(max-width: 767px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(SINGLE_COLUMN_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(SINGLE_COLUMN_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  const isSingleColumnLayout = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (isSingleColumnLayout && view === "grid") {
      onChange("single");
    }
  }, [isSingleColumnLayout, view, onChange]);

  const splitDisabled = isSingleColumnLayout;
  const effectiveView: ViewMode = splitDisabled ? "single" : view;

  return (
    <div role="group" aria-label="Project view" className={styles.toggle}>
      <button
        type="button"
        aria-label="Single view"
        aria-pressed={effectiveView === "single"}
        className={effectiveView === "single" ? styles.active : undefined}
        onClick={() => onChange("single")}
      >
        <span className={`${styles.icon} ${styles.iconSingle}`} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Split view"
        aria-pressed={effectiveView === "grid"}
        className={effectiveView === "grid" ? styles.active : undefined}
        disabled={splitDisabled}
        onClick={() => onChange("grid")}
      >
        <span className={`${styles.icon} ${styles.iconSplit}`} aria-hidden="true" />
      </button>
    </div>
  );
}
