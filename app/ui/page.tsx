import Link from "next/link";

export default function UIHome() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">话到嘴边</h1>
      <p className="text-sm text-zinc-500 mb-6">把不好开口的话，换一种更合适的表达。</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
          <div className="h-14 w-14 bg-purple-200 rounded-lg mb-2" />
          <div className="text-sm">学生沟通</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
          <div className="h-14 w-14 bg-purple-200 rounded-lg mb-2" />
          <div className="text-sm">职场沟通</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
          <div className="h-14 w-14 bg-purple-200 rounded-lg mb-2" />
          <div className="text-sm">社交沟通</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
          <div className="h-14 w-14 bg-purple-200 rounded-lg mb-2" />
          <div className="text-sm">正式事务</div>
        </div>
      </div>

      <Link href="/ui/input" className="block">
        <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-medium">
          开始表达
        </button>
      </Link>
    </div>
  );
}
