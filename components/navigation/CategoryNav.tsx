import { CATEGORY_LABELS } from "@/data/projects";
import type { ProjectCategory } from "@/data/projects";
import styles from "./CategoryNav.module.css";

export const CATEGORIES: ProjectCategory[] = [
  "studies",
  "visuals",
  "explainers",
];

interface CategoryNavProps {
  active: ProjectCategory;
  onChange: (category: ProjectCategory) => void;
}

export default function CategoryNav({ active, onChange }: CategoryNavProps) {
  return (
    <div role="group" aria-label="Filter projects by category" className={styles.nav}>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`type-t1 ${styles.button} ${
            active === category ? styles.active : ""
          }`}
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          [{CATEGORY_LABELS[category]}]
        </button>
      ))}
    </div>
  );
}
