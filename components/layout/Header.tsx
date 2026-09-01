import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`} aria-label="Primary">
        <Link className={`${styles.brand} type-t1`} href="/">
          D-S
        </Link>
        <div className={styles.links}>
          <a className={styles.link} href="#">
            About
          </a>
          <a className={styles.link} href="#">
            Email
          </a>
        </div>
      </nav>
    </header>
  );
}
