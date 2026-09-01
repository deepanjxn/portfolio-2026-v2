import styles from "./ViewToggle.module.css";

export type ViewMode = "grid" | "single";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

function GridViewIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" />
      <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" />
      <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1" />
      <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SingleViewIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 2.5H15" stroke="currentColor" strokeWidth="1" />
      <path d="M1 6.5H15" stroke="currentColor" strokeWidth="1" />
      <path d="M1 10.5H15" stroke="currentColor" strokeWidth="1" />
      <path d="M1 14.5H15" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div role="group" aria-label="Project view" className={styles.toggle}>
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        className={view === "grid" ? styles.active : undefined}
        onClick={() => onChange("grid")}
      >
        <GridViewIcon />
      </button>
      <button
        type="button"
        aria-label="Single view"
        aria-pressed={view === "single"}
        className={view === "single" ? styles.active : undefined}
        onClick={() => onChange("single")}
      >
        <SingleViewIcon />
      </button>
    </div>
  );
}
