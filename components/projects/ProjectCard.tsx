import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  revealDelayMs?: number;
}

export default function ProjectCard({
  project,
  revealDelayMs,
}: ProjectCardProps) {
  return (
    <article
      className={styles.card}
      data-hover-sound
      data-project-id={project.id}
      data-reveal="media"
      style={
        revealDelayMs === undefined
          ? undefined
          : ({ "--reveal-delay": `${revealDelayMs}ms` } as CSSProperties)
      }
    >
      <ProjectMedia project={project} />
    </article>
  );
}
