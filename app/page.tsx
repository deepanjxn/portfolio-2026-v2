import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container">
        <section className={styles.intro} aria-label="Introduction">
          <h1 className="type-h1">
            Hi, I&apos;m Deepanjan Sen. I design products, direct projects and
            help companies build design-driven solutions.
          </h1>
          <p className={`type-h3 ${styles.workplace}`}>Currently at Layer</p>
        </section>
        <PortfolioSection projects={projects} />
      </main>
      <Footer />
    </>
  );
}
