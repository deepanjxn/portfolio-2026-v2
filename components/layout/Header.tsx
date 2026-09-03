"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  return (
    <header className={styles.header} data-reveal>
      <nav className={`${styles.nav} container`} aria-label="Primary">
        <Link className={`${styles.brand} type-h3`} href="/">
          D-S
        </Link>
        <div className={styles.links}>
          <Link
            className={`${styles.link} type-h3`}
            href="/about"
            aria-current={isAbout ? "page" : undefined}
          >
            About
          </Link>
          <a className={`${styles.link} type-h3`} href="#">
            Email
          </a>
        </div>
      </nav>
    </header>
  );
}
