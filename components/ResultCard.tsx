import styles from "./ResultCard.module.css";

type ResultCardProps = {
  label: string;
  text: string;
  tone: "lavender" | "blue" | "pink";
};

const toneClass = {
  lavender: styles.lavender,
  blue: styles.blue,
  pink: styles.pink,
};

export function ResultCard({ label, text, tone }: ResultCardProps) {
  return (
    <article className={`soft-card ${styles.container}`}>
      <span className={`${styles.label} ${toneClass[tone]}`}>
        {label}
      </span>
      <p className={styles.text}>
        {text}
      </p>
      <div className={styles.actions}>
        <button type="button" className="result-action">
          <span className="action-icon copy" aria-hidden="true" />
          复制
        </button>
        <button type="button" className="result-action">
          <span className="action-icon star" aria-hidden="true" />
          收藏
        </button>
        <button type="button" className="result-action">
          <span className="action-icon refresh" aria-hidden="true" />
          再换一版
        </button>
      </div>
    </article>
  );
}
