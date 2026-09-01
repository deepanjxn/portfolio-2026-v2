import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <ProjectMedia project={project} />
    </article>
  );
}
