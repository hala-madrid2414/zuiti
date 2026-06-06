type ResultCardProps = {
  label: string;
  text: string;
  tone: "lavender" | "blue" | "pink";
};

const toneClass = {
  lavender: "bg-[#e9ddff] text-[#5a45ad]",
  blue: "bg-[#dfeaff] text-[#4365a8]",
  pink: "bg-[#ffd9f1] text-[#a33f88]",
};

export function ResultCard({ label, text, tone }: ResultCardProps) {
  return (
    <article className="soft-card px-5 py-4">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-black ${toneClass[tone]}`}
      >
        {label}
      </span>
      <p className="mt-4 whitespace-pre-line text-[15px] font-bold leading-7 text-[#22283a]">
        {text}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 text-[12px] font-bold text-[#43495e]">
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
          再换一版
        </button>
      </div>
    </article>
  );
}
