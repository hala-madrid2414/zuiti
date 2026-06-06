import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResultCard } from "@/components/ResultCard";
import { TopBar } from "@/components/TopBar";
import { results } from "@/components/content";
import styles from "./page.module.css";

export default function ResultsPage() {
  return (
    <MobileShell className={styles.container}>
      <TopBar
        title="转换结果"
        subtitle="已为你生成 3 种表达版本"
        backHref="/tone"
        actions={[
          { label: "收藏", icon: "star" },
          { label: "分享", icon: "share" },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.originalCard}`}>
          <span>原话</span>
          <p>这个话不是我负责的，别老找我。</p>
        </section>

        <section className={styles.resultsList}>
          {results.map((result, index) => (
            <ResultCard key={result.label} {...result} index={index} />
          ))}
        </section>

        <button type="button" className={styles.compareButton}>
          <span aria-hidden="true" />
          查看“原话 → 优化版”的变化点
        </button>
      </div>

      <div className={styles.bottomActions}>
        <a href="/tone" className={styles.secondaryButton}>
          再调整语气
        </a>
        <PrimaryButton href="/input" sparkle>
          换一种风格
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
