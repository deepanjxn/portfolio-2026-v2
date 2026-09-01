import type { Project } from "@/data/projects";
import type { ViewMode } from "@/components/navigation/ViewToggle";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
  view: ViewMode;
}

export default function ProjectGrid({ projects, view }: ProjectGridProps) {
  return (
    <div className={`${styles.grid} ${view === "single" ? styles.single : ""}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
