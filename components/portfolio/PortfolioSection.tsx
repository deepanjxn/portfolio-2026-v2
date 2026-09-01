"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import CategoryNav from "@/components/navigation/CategoryNav";
import ViewToggle from "@/components/navigation/ViewToggle";
import type { ViewMode } from "@/components/navigation/ViewToggle";
import ProjectGrid from "@/components/projects/ProjectGrid";
import styles from "./PortfolioSection.module.css";

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [category, setCategory] = useState<ProjectCategory>("studies");
  const [view, setView] = useState<ViewMode>("grid");

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === category),
    [projects, category],
  );

  return (
    <section aria-label="Portfolio" className={styles.section}>
      <div className={styles.controls}>
        <CategoryNav active={category} onChange={setCategory} />
        <ViewToggle view={view} onChange={setView} />
      </div>
      <ProjectGrid projects={filteredProjects} view={view} />
    </section>
  );
}
