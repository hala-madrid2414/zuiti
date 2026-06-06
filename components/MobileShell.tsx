import type { ReactNode } from "react";
import styles from "./MobileShell.module.css";

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <main className={styles.main}>
      <section className={`mobile-shell ${className}`}>{children}</section>
    </main>
  );
}
