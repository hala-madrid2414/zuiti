"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import { defaultSliders, useExpressionFlowStore } from "@/stores/expression-flow-store";
import styles from "./page.module.css";

export default function TonePage() {
  const text = useExpressionFlowStore((state) => state.text);
  const scene = useExpressionFlowStore((state) => state.scene);
  const sliders = useExpressionFlowStore((state) => state.sliders);
  const setSlider = useExpressionFlowStore((state) => state.setSlider);
  const setSliders = useExpressionFlowStore((state) => state.setSliders);
  const polite = sliders.politeness;
  const formal = sliders.formality;
  const distance = sliders.distance;
  const hasDraft = Boolean(scene && text.trim().length >= 2);

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
      <TopBar
        title="语气仪表盘"
        subtitle="微调语气，让表达更贴近你的意图"
        backHref="/input"
        actions={[{ label: "重置", icon: "reset", onClick: () => setSliders(defaultSliders) }]}
      />

      <div className={styles.content}>
        {!hasDraft ? (
          <section className={`soft-card ${styles.previewSection}`}>
            <div className={styles.previewCopy}>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>还差一句原话</h2>
                <span>待补充</span>
              </div>
              <p className={styles.previewText}>
                先回到输入页，选择场景并写下你想表达的真实想法。
              </p>
            </div>
          </section>
        ) : null}
        <section className={`soft-card ${styles.previewSection}`}>
          <div className={styles.previewCopy}>
            <div className={styles.previewHeader}>
              <h2 className={styles.previewTitle}>表达预览</h2>
              <span>实时预览</span>
            </div>
            <p className={styles.previewText}>
              {preview}
            </p>
          </div>
          <div className={styles.previewVisual}>
            <div className={styles.backgroundRadar} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className={styles.liveDot} style={radarDotStyle} aria-hidden="true" />
            <span className={styles.previewSpark} aria-hidden="true" />
          </div>
        </section>

        <div className={styles.sliderContainer}>
          <ToneSlider
            title="礼貌程度"
            left="直接"
            right="礼貌"
            value={polite}
            hint="语气更礼貌，表达更照顾对方感受"
            onChange={(value) => setSlider("politeness", value)}
          />
          <ToneSlider
            title="正式程度"
            left="日常"
            right="正式"
            value={formal}
            hint="表达更正式，适合书面或职场场景"
            onChange={(value) => setSlider("formality", value)}
          />
          <ToneSlider
            title="关系距离"
            left="熟人"
            right="陌生/上级"
            value={distance}
            hint="保持适当距离，表达更得体"
            onChange={(value) => setSlider("distance", value)}
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href={hasDraft ? "/results" : "/input"} sparkle>
          {hasDraft ? "生成结果" : "返回输入"}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
