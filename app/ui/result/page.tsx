export default function ResultPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">为你生成 3 种表达</h2>
      <p className="text-sm text-zinc-500 mb-4">选择适合的表达并复制或收藏</p>

      <div className="space-y-3">
        <div className="p-3 bg-purple-50 rounded-xl">
          <div className="font-medium">委婉丁当版</div>
          <div className="text-sm text-zinc-600 mt-2">这件事我不负责哦，建议你联系负责的同事，他们会更清楚流程~</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-zinc-100">
          <div className="font-medium">邮件正式版</div>
          <div className="text-sm text-zinc-600 mt-2">您好，关于该事项建议联系相关负责人处理，谢谢。</div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-zinc-100">
          <div className="font-medium">幽默缓和版</div>
          <div className="text-sm text-zinc-600 mt-2">我理解这个情况，不过建议向负责的同事询问，他们会提供更准确的信息。</div>
        </div>
      </div>
    </div>
  );
}
