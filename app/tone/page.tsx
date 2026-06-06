import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";

export default function TonePage() {
  return (
    <MobileShell className="px-6 py-6">
      <TopBar title="语气仪表盘" backHref="/input" />

      <section className="soft-card relative mt-7 min-h-52 overflow-hidden px-5 py-5">
        <h2 className="text-[16px] font-black">表达预览</h2>
        <div className="mt-5 flex items-center gap-2">
          <span className="rounded-full bg-[#eadfff] px-3 py-1 text-[12px] font-black text-[#624cb1]">
            婉拒了当
          </span>
          <span className="rounded-full bg-[#f0f1fa] px-3 py-1 text-[12px] font-black text-[#6b7287]">
            预览
          </span>
        </div>
        <p className="mt-5 max-w-[220px] text-[15px] font-bold leading-7 text-[#252b3f]">
          这件事我不是负责的同事，建议你联系负责的同事，他会更清楚哦～
        </p>
        <div className="absolute bottom-2 right-5">
          <DecorativeIcon kind="spark" size="hero" />
        </div>
      </section>

      <div className="mt-5 space-y-4">
        <ToneSlider title="礼貌程度" left="直接" right="礼貌" value={76} />
        <ToneSlider title="正式程度" left="日常" right="正式" value={70} dark />
        <ToneSlider title="关系距离" left="熟人" right="陌生/上级" value={58} />
      </div>

      <div className="mt-auto pt-7">
        <PrimaryButton href="/results" sparkle>
          生成结果
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
