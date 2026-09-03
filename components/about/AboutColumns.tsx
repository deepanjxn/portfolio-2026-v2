import { aboutColumns } from "@/data/about";
import AboutColumn from "./AboutColumn";
import styles from "./AboutColumns.module.css";

export default function AboutColumns() {
  return (
    <section className={styles.columns} aria-label="Tools, principles and experience">
      {aboutColumns.map((column, columnIndex) => (
        <AboutColumn
          key={column.heading}
          column={column}
          revealDelayMs={400 + columnIndex * 100}
        />
      ))}
    </section>
  );
}
