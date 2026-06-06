import { MobileShell } from "@/components/MobileShell";
import { ResultCard } from "@/components/ResultCard";
import { TopBar } from "@/components/TopBar";
import { results } from "@/components/content";

export default function ResultsPage() {
  return (
    <MobileShell className="px-6 py-6">
      <TopBar title="为何生成 3 种表达" backHref="/tone" />

      <div className="mt-6 rounded-3xl bg-[#f8f7ff] px-4 py-3 text-[13px] font-bold text-[#777f93] shadow-[inset_0_8px_24px_rgba(147,132,211,0.12)]">
        这个话不是我负责的，别老找我。
      </div>

      <section className="mt-6 space-y-4 overflow-y-auto pb-3">
        {results.map((result) => (
          <ResultCard key={result.label} {...result} />
        ))}
      </section>
    </MobileShell>
  );
}
