import { fallbackSafetyNote } from "@/lib/domain/defaults";
import type { GenerateResult, OutputResult } from "@/lib/domain/enums";
import type { GenerateRequest } from "@/lib/validators/generate";
import { GeneratedResultSchema } from "./schema";

const styleIntents: Record<GenerateRequest["style"], string> = {
  delay: "先争取一点时间",
  refuse: "温和拒绝这个请求",
  boundary: "说明职责边界",
  followup: "礼貌推进对方回复",
  decode: "把潜台词翻译清楚",
  sarcasm: "有态度但不攻击地表达",
};

function outputResult(candidates: [string, string, string], reasons: string[]): OutputResult {
  return {
    candidates,
    recommendedIndex: 0,
    reasons,
  };
}

export function createFallbackResult(request: GenerateRequest, note = fallbackSafetyNote): GenerateResult {
  const intent = styleIntents[request.style];
  const base = request.text.replace(/\s+/g, " ").slice(0, 80);

  return {
    wechat: outputResult(
      [
        `我这边想更稳妥地表达一下：${intent}。关于“${base}”，我建议我们先把事实和下一步对齐。`,
        `这件事我理解你的意思，我这边会按更清楚的方式处理：${intent}，也尽量不让沟通变僵。`,
        `我想换个更合适的说法：先把边界和诉求说清楚，再确认后续怎么推进。`,
      ],
      ["适合即时沟通", "语气有缓冲", "保留清晰诉求"],
    ),
    email: outputResult(
      [
        `您好，关于这件事，我希望以更清晰、稳妥的方式沟通：${intent}。基于目前信息，建议先确认事实、职责范围和下一步安排。`,
        `您好，针对当前事项，我这边的理解是需要先明确沟通目标，并在保持礼貌的前提下表达诉求。`,
        `您好，为避免信息误解，我建议将该事项拆分为事实说明、当前限制和后续建议三部分来沟通。`,
      ],
      ["适合书面留痕", "结构更正式", "降低误解风险"],
    ),
    spoken: outputResult(
      [
        `我换个说法哈，这件事我的重点是${intent}，不是想把沟通弄僵。`,
        `我大概想表达的是：先把现在的情况说清楚，然后我们再看下一步怎么处理。`,
        `我怕直接说会有点硬，所以想用更稳一点的方式表达这个意思。`,
      ],
      ["适合当面表达", "自然但不软弱", "降低冲突感"],
    ),
    assumptions: ["默认对方是仍需继续沟通的关系对象。"],
    safetyNotes: [note],
  };
}

export function normalizeGeneratedResult(value: unknown): GenerateResult | null {
  const parsed = GeneratedResultSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
