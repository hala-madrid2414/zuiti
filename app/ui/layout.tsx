import Link from "next/link";

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white text-zinc-900 font-sans">
      <div className="mx-auto max-w-md w-full min-h-screen px-4 py-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          {children}
        </div>
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex justify-between items-center px-4 py-2">
            <Link href="/ui" className="text-sm font-medium">首页</Link>
            <Link href="/ui/input" className="text-sm font-medium">输入</Link>
            <Link href="/ui/dashboard" className="text-sm font-medium">仪表盘</Link>
            <Link href="/ui/result" className="text-sm font-medium">结果</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
