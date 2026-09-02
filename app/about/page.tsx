import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import AboutIntro from "@/components/about/AboutIntro";
import AboutColumns from "@/components/about/AboutColumns";
import CursorMedia from "@/components/about/CursorMedia";
import { cursorMediaSource } from "@/data/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Deepanjan Sen",
  description:
    "A little more about Deepanjan Sen, his work, principles, tools and experience.",
};

export default function AboutPage() {
  const hasCursorMedia = Boolean(
    cursorMediaSource.poster || cursorMediaSource.videoSrc,
  );

  return (
    <div className={`theme-dark ${styles.page}`}>
      <Header />
      <main>
        <PageContainer>
          <AboutIntro />
          <AboutColumns />
        </PageContainer>
      </main>
      <Footer />
      {hasCursorMedia ? <CursorMedia /> : null}
    </div>
  );
}
