import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyMedia from "@/components/studies/StudyMedia";
import { projects } from "@/data/projects";
import {
  getStudyForSlug,
  studies,
  type StudyBlock,
} from "@/data/studies";
import styles from "./page.module.css";

/* Prerender every authored study plus every Studies-category card on
   the homepage (they render the shared template until their content is
   authored). Unknown slugs 404. */
export function generateStaticParams() {
  const slugs = new Set(studies.map((study) => study.slug));
  for (const project of projects) {
    if (project.category === "studies") slugs.add(project.slug);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudyForSlug(slug);
  if (!study) return {};
  return { title: `${study.title} · Deepanjan Sen` };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getStudyForSlug(slug);
  if (!study) notFound();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={`${styles.editorial} ${styles.header}`}>
          <h1
            className="type-h2"
            data-reveal
            style={{ "--reveal-delay": "100ms" } as CSSProperties}
          >
            {study.title}
          </h1>
          {study.description ? (
            <div
              className={styles.subtitleRow}
              data-reveal
              style={{ "--reveal-delay": "200ms" } as CSSProperties}
            >
              <p className={`type-p1 ${styles.subtitle}`}>
                {study.description}
              </p>
            </div>
          ) : null}
        </div>
        <div className={`${styles.editorial} ${styles.body}`}>
          {study.blocks.map((block, index) => (
            <StudyBlockView
              key={index}
              block={block}
              revealDelayMs={300 + index * 100}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StudyBlockView({
  block,
  revealDelayMs,
}: {
  block: StudyBlock;
  revealDelayMs: number;
}) {
  const revealStyle = {
    "--reveal-delay": `${revealDelayMs}ms`,
  } as CSSProperties;

  if (block.type === "text") {
    return (
      <div className={styles.text} data-reveal style={revealStyle}>
        {block.paragraphs.map((paragraph, index) => (
          <p key={index} className="type-p1">
            {paragraph}
          </p>
        ))}
        {block.link ? (
          <a
            className={`type-h2 ${styles.textLink}`}
            href={block.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.link.label}
          </a>
        ) : null}
      </div>
    );
  }

  if (block.type === "media") {
    const hasMedia = Boolean(block.media?.src || block.media?.vimeo);
    return (
      <div
        className={styles.media}
        data-hover-sound
        data-reveal="media"
        aria-hidden={hasMedia ? undefined : "true"}
        style={revealStyle}
      >
        <div className={styles.hoverSurface}>
          <StudyMedia media={block.media ?? {}} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.cluster} ${
        block.layout === "stack" ? styles.stack : ""
      }`}
      data-reveal="media"
      aria-hidden={block.items.some((item) => item.src) ? undefined : "true"}
      style={revealStyle}
    >
      {block.items.map((item, index) => (
        <div
          key={index}
          className={styles.media}
          data-hover-sound
          aria-hidden={item.src ? undefined : "true"}
        >
          <div className={styles.hoverSurface}>
            <StudyMedia media={item} />
          </div>
        </div>
      ))}
    </div>
  );
}
