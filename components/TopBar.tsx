import Link from "next/link";
import styles from "./TopBar.module.css";

type TopBarProps = {
  title?: string;
  backHref?: string;
};

export function TopBar({ title, backHref }: TopBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.statusBar}>
        <span>9:41</span>
        <div className={styles.statusIcons} aria-hidden="true">
          <span className="signal-bars">
            <i />
            <i />
            <i />
          </span>
          <span className="wifi-mark" />
          <span className="battery-mark" />
        </div>
      </div>

      {title ? (
        <div className={styles.navBar}>
          {backHref ? (
            <Link
              href={backHref}
              className={styles.backButton}
              aria-label="返回"
            >
              ‹
            </Link>
          ) : (
            <span />
          )}
          <h1 className={styles.title}>{title}</h1>
          <span />
        </div>
      ) : null}
    </header>
  );
}
