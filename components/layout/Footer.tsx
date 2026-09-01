import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} container`}>
      <p className={styles.copy}>© 2026 Deepanjan Sen. All rights reserved.</p>
      <div className={styles.links}>
        <a className={styles.link} href="#">
          LinkedIn
        </a>
        <a className={styles.link} href="#">
          GitHub
        </a>
        <a className={styles.link} href="#">
          X
        </a>
      </div>
    </footer>
  );
}
