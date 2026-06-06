import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SceneCard } from "@/components/SceneCard";
import { TopBar } from "@/components/TopBar";
import { scenes, styles as toneStyles } from "@/components/content";
import styles from "./page.module.css";

export default function Home() {
  return (
    <MobileShell className={styles.container}>
      <TopBar />
      <a href="/results" className={styles.profileButton} aria-label="我的收藏">
        <span aria-hidden="true" />
      </a>

      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <h1 className={styles.title}>
            话到嘴边
            <span className={styles.titleSpark} aria-hidden="true" />
          </h1>
          <p className={styles.subtitle}>
            把不好开口的话，
            换一种更合适的表达
          </p>
          <p className={styles.description}>
            帮你把真实想法，转成适合不同对象、不同场景的表达版本
          </p>
        </div>
        <div className={styles.iconWrapper} aria-hidden="true">
          <DecorativeIcon kind="spark" size="hero" />
          <span className={styles.whiteBubble} />
          <span className={styles.blueRing} />
          <span className={styles.floatDot} />
          <span className={styles.floatDot} />
          <span className={styles.floatDot} />
        </div>
      </section>

      <section className={styles.gridSection}>
        {scenes.map((scene) => (
          <SceneCard key={scene.title} {...scene} />
        ))}
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>最近使用</h2>
          <a href="/results">查看全部</a>
        </div>
        <a className={`soft-card ${styles.recentCard}`} href="/results">
          <DecorativeIcon kind="spark" size="sm" />
          <div>
            <strong>关于周末活动分工的沟通</strong>
            <span>职场沟通 · 别甩给我</span>
          </div>
          <span className={styles.recentMeta}>刚刚</span>
        </a>
      </section>

      <section className={styles.hotSection}>
        <h2>热门风格</h2>
        <div className={styles.hotList}>
          {toneStyles.map((style) => (
            <a key={style.title} className={styles.hotItem} href="/input">
              <DecorativeIcon kind={style.icon} size="sm" />
              <span>{style.title}</span>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href="/input" sparkle>开始转换</PrimaryButton>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
