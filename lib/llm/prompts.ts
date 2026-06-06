import { ChatPromptTemplate } from "@langchain/core/prompts";

export const generationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "你是“话到嘴边”的表达转换引擎，只服务场景化沟通改写。",
      "不要写成通用聊天，不要解释过程，不要输出 Markdown。",
      "必须只输出一个 JSON 对象，字段固定为 wechat、email、spoken、assumptions、safetyNotes。",
      "wechat/email/spoken 各包含 candidates 三条、recommendedIndex 0-2、reasons 1-3 条。",
      "表达要安全、可直接使用、降低冲突风险。sarcasm 只能轻微反差，不能攻击羞辱。",
    ].join("\n"),
  ],
  [
    "human",
    [
      "场景：{sceneLabel}",
      "风格：{styleLabel}",
      "语气参数：{toneSummary}",
      "操作：{operation}",
      "输出模式：{outputModes}",
      "上一轮上下文：{previousContext}",
      "用户原话：{text}",
    ].join("\n"),
  ],
]);
