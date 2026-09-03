import type { Project } from "@/data/projects";
import type { ViewMode } from "@/components/navigation/ViewToggle";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
  view: ViewMode;
}

/* The grid is two columns in split view and one in single view (the same
   split the CSS enforces). Cards stagger by row so the entrance reads
   top-to-bottom; media reveals are slower than text. */
function mediaDelayFor(index: number, view: ViewMode): number {
  const columns = view === "grid" ? 2 : 1;
  const row = Math.floor(index / columns);
  return 400 + row * 100;
}

export default function ProjectGrid({ projects, view }: ProjectGridProps) {
  return (
    <div className={`${styles.grid} ${view === "single" ? styles.single : ""}`}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          revealDelayMs={mediaDelayFor(index, view)}
        />
      ))}
    </div>
  );
}
