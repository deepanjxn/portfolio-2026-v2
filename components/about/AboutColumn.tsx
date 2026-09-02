import type { AboutListColumn } from "@/data/about";
import styles from "./AboutColumn.module.css";

export default function AboutColumn({ column }: { column: AboutListColumn }) {
  return (
    <section className={`${styles.column} ${styles[column.id]}`}>
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
