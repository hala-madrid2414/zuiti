import type { GenerateRequest } from "@/lib/validators/generate";

const sceneLabels: Record<GenerateRequest["scene"], string> = {
  student: "学生沟通：老师、同学、课程或校园事务",
  work: "职场沟通：同事、上级、协作与边界",
  social: "社交沟通：朋友、合作方、熟人关系",
  formal: "正式事务：机构、行政、书面沟通",
};

const styleLabels: Record<GenerateRequest["style"], string> = {
  delay: "体面延期",
  refuse: "柔和拒绝",
  boundary: "清晰边界",
  followup: "礼貌推进",
  decode: "翻译潜台词或语气",
  sarcasm: "轻微反差但不攻击",
};

export type GenerationContext = {
  sceneLabel: string;
  styleLabel: string;
  toneSummary: string;
  sessionId?: string;
  previousContext: string;
};

export function buildGenerationContext(request: GenerateRequest): GenerationContext {
  return {
    sceneLabel: sceneLabels[request.scene],
    styleLabel: styleLabels[request.style],
    toneSummary: [
      `礼貌度 ${request.sliders.politeness}/100`,
      `正式度 ${request.sliders.formality}/100`,
      `距离感 ${request.sliders.distance}/100`,
    ].join("，"),
    sessionId: request.context?.sessionId,
    previousContext: request.context?.prev ? JSON.stringify(request.context.prev).slice(0, 800) : "无",
  };
}
