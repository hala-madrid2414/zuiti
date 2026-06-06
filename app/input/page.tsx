"use client";

import { Suspense, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { TextArea } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { scenes, styles } from "@/components/content";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import { getStyleByIndex, getStyleIndex, isScene } from "@/utils/content-mapping";
import stylesCss from "./page.module.css";

const textAreaStyle: CSSProperties & { "--color": string } = {
  "--color": "#30364a",
};

function InputContent() {
  const searchParams = useSearchParams();
  const value = useExpressionFlowStore((state) => state.text);
  const activeStyle = useExpressionFlowStore((state) => state.style);
  const setValue = useExpressionFlowStore((state) => state.setText);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const storeScene = useExpressionFlowStore((state) => state.scene);
  const setScene = useExpressionFlowStore((state) => state.setScene);

  useEffect(() => {
    const sceneKey = searchParams.get("scene");
    if (isScene(sceneKey)) {
      setScene(sceneKey);
    }
  }, [searchParams, setScene]);

  const scene = useMemo(() => {
    const sceneKey = storeScene ?? searchParams.get("scene");
    return scenes.find((item) => item.key === sceneKey);
  }, [searchParams, storeScene]);

  const canContinue = value.trim().length >= 2;

  return (
    <MobileShell className={stylesCss.container}>
      <div className={stylesCss.pageContent}>
        <TopBar
          title="你想说的话"
          backHref="/"
          actions={[
            {
              label: "示例",
              icon: "spark",
              onClick: () => setValue("这个活不是我负责的，别老找我。"),
            },
            { label: "清空", icon: "trash", onClick: () => setValue("") },
          ]}
        />

        <section className={stylesCss.section1}>
          <div className={stylesCss.labelRow}>
            <label
              htmlFor="raw-thought"
              className={stylesCss.label}
            >
              对什么人，说什么话
            </label>
            {scene ? <span>{scene.context}</span> : <span>一句原话，也可以有更好的说法</span>}
          </div>
          <div className={`soft-card ${stylesCss.textAreaContainer}`}>
            <TextArea
              id="raw-thought"
              className={stylesCss.textArea}
              value={value}
              onChange={setValue}
              placeholder={"在这里输入你想说的话...\n\n例如：这个活不是我负责的，别老找我。"}
              maxLength={300}
              showCount
              rows={9}
              style={textAreaStyle}
            />
          </div>
        </section>

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>选择风格</h2>
            <span>左右滑动选择</span>
          </div>
          <div className={stylesCss.cardList}>
            {styles.map((style, index) => (
              <StyleCard
                key={style.key}
                title={style.title}
                detail={style.detail}
                icon={style.icon}
                active={index === getStyleIndex(activeStyle)}
                onClick={() => setStyle(getStyleByIndex(index))}
              />
            ))}
          </div>
        </section>

        <p className={stylesCss.hint}>
          {canContinue ? "左右滑动，选择你喜欢的风格" : "先输入至少 2 个字，再继续生成"}
        </p>
        <div className={stylesCss.buttonWrapper}>
          {canContinue ? (
            <PrimaryButton href="/tone" sparkle>
              开始转换
            </PrimaryButton>
          ) : (
            <button type="button" className="primary-button" disabled>
              <span>开始转换</span>
            </button>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

export default function InputPage() {
  return (
    <Suspense>
      <InputContent />
    </Suspense>
  );
}
