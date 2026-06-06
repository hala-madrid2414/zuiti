import Link from "next/link";

export default function InputPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">对什么人说什么话</h2>
      <p className="text-sm text-zinc-500 mb-4">输入想说的话并选择风格</p>

      <textarea
        placeholder="输入你想说的话..."
        className="w-full rounded-lg border border-zinc-200 p-3 mb-4 h-24 resize-none"
      />

      <div className="flex gap-3 mb-4">
        <button className="flex-1 py-2 rounded-lg bg-purple-50">先同理</button>
        <button className="flex-1 py-2 rounded-lg bg-purple-50">委婉丁当</button>
        <button className="flex-1 py-2 rounded-lg bg-purple-50">别那么强硬</button>
      </div>

      <Link href="/ui/dashboard">
        <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white">
          开始转换
        </button>
      </Link>
    </div>
  );
}
