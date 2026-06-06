import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SceneCard } from "@/components/SceneCard";
import { TopBar } from "@/components/TopBar";
import { scenes } from "@/components/content";

export default function Home() {
  return (
    <MobileShell className="overflow-hidden px-6 pt-6">
      <TopBar />

      <section className="relative mt-12">
        <div>
          <h1 className="text-[38px] font-black leading-none tracking-[-0.04em] text-[#11182d]">
            话到嘴边
          </h1>
          <p className="mt-4 text-[15px] font-bold leading-6 text-[#7a8192]">
            把不好开口的话，
            <br />
            换一种更合适的表达
          </p>
        </div>
        <div className="absolute -right-1 -top-2">
          <DecorativeIcon kind="spark" size="hero" />
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-4">
        {scenes.map((scene) => (
          <SceneCard key={scene.title} {...scene} />
        ))}
      </section>

      <div className="mt-7">
        <PrimaryButton href="/input">开始表达</PrimaryButton>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
