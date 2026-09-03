import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import { projects } from "@/data/projects";
import type { CSSProperties } from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <PageContainer>
          <section className={styles.intro} aria-label="Introduction">
            <h1
              className="type-h1"
              data-reveal
              style={{ "--reveal-delay": "100ms" } as CSSProperties}
            >
              Hi, I&apos;m Deepanjan Sen. I design products, direct projects and
              help companies build design-driven solutions.
            </h1>
            <p
              className={`type-h3 ${styles.workplace}`}
              data-reveal
              style={{ "--reveal-delay": "200ms" } as CSSProperties}
            >
              Currently at Layer
            </p>
          </section>
          <PortfolioSection projects={projects} />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
