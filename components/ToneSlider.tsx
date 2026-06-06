"use client";

import { Slider } from "antd-mobile";
import stylesCss from "./ToneSlider.module.css";

type ToneSliderProps = {
  title: string;
  left: string;
  right: string;
  value: number;
  dark?: boolean;
};

export function ToneSlider({ title, left, right, value, dark = false }: ToneSliderProps) {
  return (
    <section className={`soft-card ${stylesCss.container}`}>
      <h2 className={stylesCss.title}>{title}</h2>
      <div className={stylesCss.sliderRow}>
        <span className={stylesCss.leftLabel}>{left}</span>
        <div className={stylesCss.sliderWrapper}>
          <Slider
            value={value}
            style={{
              "--fill-color": dark ? "#131a32" : "linear-gradient(90deg, #b789f4, #887dff)",
              "--track-height": "6px",
            } as any}
            icon={<div className={`${stylesCss.thumb} ${dark ? stylesCss.thumbDark : ""}`} />}
          />
        </div>
        <span className={stylesCss.rightLabel}>
          {right}
        </span>
      </div>
    </section>
  );
}
