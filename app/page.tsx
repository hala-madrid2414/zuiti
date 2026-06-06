import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SceneCard } from "@/components/SceneCard";
import { TopBar } from "@/components/TopBar";
import { scenes } from "@/components/content";
import styles from "./page.module.css";

export default function Home() {
  return (
    <MobileShell className={styles.container}>
      <TopBar />

      <section className={styles.heroSection}>
        <div>
          <h1 className={styles.title}>
            话到嘴边
          </h1>
          <p className={styles.subtitle}>
            把不好开口的话，
            <br />
            换一种更合适的表达
          </p>
        </div>
        <div className={styles.iconWrapper}>
          <DecorativeIcon kind="spark" size="hero" />
        </div>
      </section>

      <section className={styles.gridSection}>
        {scenes.map((scene) => (
          <SceneCard key={scene.title} {...scene} />
        ))}
      </section>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href="/input">开始表达</PrimaryButton>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
