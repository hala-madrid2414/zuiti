import Link from "next/link";

function RangeRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <div>{label}</div>
        <div className="text-zinc-500 text-xs">{value ?? ''}</div>
      </div>
      <input type="range" className="w-full" />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">语气仪表盘</h2>
      <p className="text-sm text-zinc-500 mb-4">通过滑块调整礼貌度、正式度和关系距离</p>

      <RangeRow label="礼貌程度" value="礼貌" />
      <RangeRow label="正式程度" value="正式" />
      <RangeRow label="关系距离" value="陌生/上级" />

      <Link href="/ui/result">
        <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white">
          生成结果
        </button>
      </Link>
    </div>
  );
}
