import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { styles } from "@/components/content";

export default function InputPage() {
  return (
    <MobileShell className="px-6 py-6">
      <TopBar title="对什么人说什么话" backHref="/" />

      <section className="mt-7">
        <label
          htmlFor="raw-thought"
          className="text-[15px] font-black text-[#2b3144]"
        >
          你想说的话
        </label>
        <div className="soft-card mt-3 min-h-32 px-4 py-4">
          <textarea
            id="raw-thought"
            className="h-24 w-full resize-none bg-transparent text-[14px] font-bold leading-6 text-[#30364a] outline-none placeholder:text-[#a6adbf]"
            defaultValue="这个活不是我负责的，别老找我。"
            maxLength={300}
            aria-describedby="raw-thought-count"
          />
          <div
            id="raw-thought-count"
            className="text-right text-[12px] font-black text-[#8d94a8]"
          >
            18/300
          </div>
        </div>
      </section>

      <section className="mt-9">
        <h2 className="text-[15px] font-black text-[#2b3144]">选择风格</h2>
        <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-3">
          {styles.map((style, index) => (
            <StyleCard
              key={style.title}
              {...style}
              active={index === 1}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#8a86ff]" />
          <span className="size-2 rounded-full bg-[#d8dcf0]" />
          <span className="size-2 rounded-full bg-[#d8dcf0]" />
        </div>
      </section>

      <p className="mt-auto text-center text-[12px] font-bold text-[#7d8496]">
        左右滑动，选择你喜欢的风格
      </p>
      <div className="mt-7">
        <PrimaryButton href="/tone" sparkle>
          开始转换
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
