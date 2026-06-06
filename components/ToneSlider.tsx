type ToneSliderProps = {
  title: string;
  left: string;
  right: string;
  value: number;
  dark?: boolean;
};

export function ToneSlider({ title, left, right, value, dark = false }: ToneSliderProps) {
  return (
    <section className="soft-card px-5 py-4">
      <h2 className="text-[17px] font-black">{title}</h2>
      <div className="mt-4 flex items-center gap-4">
        <span className="w-9 text-[12px] font-bold text-[#727b91]">{left}</span>
        <div className="slider-track" aria-hidden="true">
          <span
            className={dark ? "slider-fill dark" : "slider-fill"}
            style={{ width: `${value}%` }}
          />
          <span
            className={dark ? "slider-thumb dark" : "slider-thumb"}
            style={{ left: `${value}%` }}
          />
        </div>
        <span className="w-14 text-right text-[12px] font-bold text-[#727b91]">
          {right}
        </span>
      </div>
    </section>
  );
}
