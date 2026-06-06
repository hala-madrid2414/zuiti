"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import styles from "./page.module.css";

export default function TonePage() {
  const [polite, setPolite] = useState(76);
  const [formal, setFormal] = useState(58);
  const [distance, setDistance] = useState(62);

  const preview = useMemo(() => {
    if (formal > 72) {
      return "您好，关于您提到的事项目前不在我的负责范围内，建议联系对应负责人确认，我会尽力配合需要的信息。";
    }

    if (distance < 45) {
      return "这个我不太负责诶，可能找对应同事更合适，我可以帮你问问该找谁～";
    }

    if (polite > 80) {
      return "这件事我这边可能不太负责，建议你联系对应同事确认一下，会更准确一些。";
    }

    return "我理解你的需求，这个部分目前不在我的负责范围内，我可以帮你确认负责的同事是谁～";
  }, [polite, formal, distance]);

  const radarDotStyle: CSSProperties & {
    "--x": string;
    "--y": string;
  } = {
    "--x": `${polite}%`,
    "--y": `${100 - formal}%`,
  };

  return (
    <MobileShell className={styles.container}>
      <div className={styles.backgroundRadar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <TopBar
        title="语气仪表盘"
        subtitle="微调语气，让表达更贴近你的意图"
        backHref="/input"
        actions={[{ label: "重置", icon: "reset" }]}
      />

      <section className={`soft-card ${styles.previewSection}`}>
        <span className={styles.liveDot} style={radarDotStyle} aria-hidden="true" />
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>表达预览</h2>
          <span>实时预览</span>
        </div>
        <p className={styles.previewText}>
          {preview}
        </p>
        <span className={styles.previewSpark} aria-hidden="true" />
      </section>

      <div className={styles.sliderContainer}>
        <ToneSlider
          title="礼貌程度"
          left="直接"
          right="礼貌"
          value={polite}
          hint="语气更礼貌，表达更照顾对方感受"
          onChange={setPolite}
        />
        <ToneSlider
          title="正式程度"
          left="日常"
          right="正式"
          value={formal}
          hint="表达更正式，适合书面或职场场景"
          onChange={setFormal}
        />
        <ToneSlider
          title="关系距离"
          left="熟人"
          right="陌生/上级"
          value={distance}
          hint="保持适当距离，表达更得体"
          onChange={setDistance}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href="/results" sparkle>
          生成结果
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
