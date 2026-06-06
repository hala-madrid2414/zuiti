import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import styles from "./page.module.css";

export default function TonePage() {
  return (
    <MobileShell className={styles.container}>
      <TopBar title="语气仪表盘" backHref="/input" />

      <section className={`soft-card ${styles.previewSection}`}>
        <h2 className={styles.previewTitle}>表达预览</h2>
        <div className={styles.tagsRow}>
          <span className={styles.tagPrimary}>
            婉拒了当
          </span>
          <span className={styles.tagSecondary}>
            预览
          </span>
        </div>
        <p className={styles.previewText}>
          这件事我不是负责的同事，建议你联系负责的同事，他会更清楚哦～
        </p>
        <div className={styles.iconWrapper}>
          <DecorativeIcon kind="spark" size="hero" />
        </div>
      </section>

      <div className={styles.sliderContainer}>
        <ToneSlider title="礼貌程度" left="直接" right="礼貌" value={76} />
        <ToneSlider title="正式程度" left="日常" right="正式" value={70} dark />
        <ToneSlider title="关系距离" left="熟人" right="陌生/上级" value={58} />
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href="/results" sparkle>
          生成结果
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
