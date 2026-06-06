import { MobileShell } from "@/components/MobileShell";
import { ResultCard } from "@/components/ResultCard";
import { TopBar } from "@/components/TopBar";
import { results } from "@/components/content";
import styles from "./page.module.css";

export default function ResultsPage() {
  return (
    <MobileShell className={styles.container}>
      <TopBar title="为何生成 3 种表达" backHref="/tone" />

      <div className={styles.originalText}>
        这个话不是我负责的，别老找我。
      </div>

      <section className={styles.resultsList}>
        {results.map((result) => (
          <ResultCard key={result.label} {...result} />
        ))}
      </section>
    </MobileShell>
  );
}
