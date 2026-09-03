import type { CSSProperties } from "react";
import type { AboutListColumn } from "@/data/about";
import styles from "./AboutColumn.module.css";

interface AboutColumnProps {
  column: AboutListColumn;
  revealDelayMs?: number;
}

export default function AboutColumn({ column, revealDelayMs }: AboutColumnProps) {
  return (
    <section
      className={`${styles.column} ${styles[column.id]}`}
      data-reveal
      style={
        revealDelayMs === undefined
          ? undefined
          : ({ "--reveal-delay": `${revealDelayMs}ms` } as CSSProperties)
      }
    >
      <h2 className={`type-t1 ${styles.heading}`}>{column.heading}</h2>
      <ul className={styles.list}>
        {column.items.map((item) => (
          <li key={item} className={`type-h3 ${styles.item}`}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
