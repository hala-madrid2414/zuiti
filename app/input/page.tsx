"use client";

import type { CSSProperties } from "react";
import { TextArea } from "antd-mobile";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { styles } from "@/components/content";
import stylesCss from "./page.module.css";

const textAreaStyle: CSSProperties & { "--color": string } = {
  "--color": "#30364a",
};

export default function InputPage() {
  return (
    <MobileShell className={stylesCss.container}>
      <TopBar title="对什么人说什么话" backHref="/" />

      <section className={stylesCss.section1}>
        <label
          htmlFor="raw-thought"
          className={stylesCss.label}
        >
          你想说的话
        </label>
        <div className={`soft-card ${stylesCss.textAreaContainer}`}>
          <TextArea
            id="raw-thought"
            className={stylesCss.textArea}
            defaultValue="这个活不是我负责的，别老找我。"
            maxLength={300}
            showCount
            rows={4}
            style={textAreaStyle}
          />
        </div>
      </section>

      <section className={stylesCss.section2}>
        <h2 className={stylesCss.sectionTitle}>选择风格</h2>
        <div className={stylesCss.cardList}>
          {styles.map((style, index) => (
            <StyleCard
              key={style.title}
              {...style}
              active={index === 1}
            />
          ))}
        </div>
        <div className={stylesCss.indicators} aria-hidden="true">
          <span className={stylesCss.indicatorActive} />
          <span className={stylesCss.indicatorInactive} />
          <span className={stylesCss.indicatorInactive} />
        </div>
      </section>

      <p className={stylesCss.hint}>
        左右滑动，选择你喜欢的风格
      </p>
      <div className={stylesCss.buttonWrapper}>
        <PrimaryButton href="/tone" sparkle>
          开始转换
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
