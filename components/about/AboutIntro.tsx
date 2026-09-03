import { introParagraphs } from "@/data/about";
import type { CSSProperties } from "react";
import styles from "./AboutIntro.module.css";

export default function AboutIntro() {
  return (
    <section className={styles.intro} aria-label="Introduction">
      {introParagraphs.map((paragraph, paragraphIndex) => {
        const content = paragraph.segments.map((segment, segmentIndex) => {
          if (segment.tone === "muted") {
            return (
              <span
                key={`${paragraphIndex}-${segmentIndex}`}
                className={styles.muted}
              >
                {segment.text}
              </span>
            );
          }
          return (
            <span key={`${paragraphIndex}-${segmentIndex}`}>
              {segment.text}
            </span>
          );
        });

        const className = `type-h1 ${styles.paragraph}`;
        const revealStyle = {
          "--reveal-delay": `${(paragraphIndex + 1) * 100}ms`,
        } as CSSProperties;

        if (paragraphIndex === 0) {
          return (
            <h1 key={paragraphIndex} className={className} data-reveal style={revealStyle}>
              {content}
            </h1>
          );
        }
        return (
          <p key={paragraphIndex} className={className} data-reveal style={revealStyle}>
            {content}
          </p>
        );
      })}
    </section>
  );
}
