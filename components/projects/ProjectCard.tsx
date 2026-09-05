import type { CSSProperties } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectMedia from "./ProjectMedia";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  href?: string;
  revealDelayMs?: number;
}

/* The card root stays the FLIP element (matched via data-project-id, tag
   agnostic) whether it is a plain article or, for studies, the link that
   opens the detail page. The anchor keeps the same class and data
   attributes so the hover surface, FLIP, radius compensation, reveal and
   sounds are identical either way. */
export default function ProjectCard({
  project,
  href,
  revealDelayMs,
}: ProjectCardProps) {
  const revealStyle =
    revealDelayMs === undefined
      ? undefined
      : ({ "--reveal-delay": `${revealDelayMs}ms` } as CSSProperties);

  const media = (
    <div className={styles.hoverSurface}>
      <ProjectMedia project={project} />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={styles.card}
        data-hover-sound
        data-project-id={project.id}
        data-reveal="media"
        aria-label={project.title}
        style={revealStyle}
      >
        {media}
      </Link>
    );
  }

  return (
    <article
      className={styles.card}
      data-hover-sound
      data-project-id={project.id}
      data-reveal="media"
      style={revealStyle}
    >
      {media}
    </article>
  );
}
