import type { CSSProperties } from "react";
import styles from "./ResultCard.module.css";

type ResultCardProps = {
  label: string;
  text: string;
  tone: "lavender" | "blue" | "pink";
  icon: "wechat" | "mail" | "face";
  fit: string;
  tags: readonly string[];
  index?: number;
};

const toneClass = {
  lavender: styles.lavender,
  blue: styles.blue,
  pink: styles.pink,
};

const resultIconClass = {
  wechat: styles.wechat,
  mail: styles.mail,
  face: styles.face,
};

type ResultStyle = CSSProperties & {
  "--delay": string;
};

export function ResultCard({
  label,
  text,
  tone,
  icon,
  fit,
  tags,
  index = 0,
}: ResultCardProps) {
  const resultStyle: ResultStyle = {
    "--delay": `${index * 90}ms`,
  };

  return (
    <article
      className={`soft-card ${styles.container}`}
      style={resultStyle}
    >
      <header className={styles.header}>
        <span className={`${styles.iconPill} ${toneClass[tone]}`}>
          <span className={`${styles.resultIcon} ${resultIconClass[icon]}`} aria-hidden="true" />
        </span>
        <div>
          <span className={`${styles.label} ${toneClass[tone]}`}>
            {label}
          </span>
          <p className={styles.fit}>{fit}</p>
        </div>
        <span className={styles.chevron} aria-hidden="true" />
      </header>
      <p className={styles.text}>
        {text}
      </p>
      <div className={styles.tags} aria-label="表达标签">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
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
          再润色
        </button>
        <button type="button" className="result-action">
          <span className="action-icon switch" aria-hidden="true" />
          换风格
        </button>
      </div>
    </article>
  );
}
