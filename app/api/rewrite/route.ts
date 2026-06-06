import { NextRequest, NextResponse } from "next/server";

// Read env vars directly from process.env (Next.js loads .env automatically)
const API_URL = process.env.LLM_URL || "https://api.deepseek.com";
const API_KEY = process.env.LLM_API_KEY || "";
const MODEL = process.env.LLM_MODEL || "deepseek-v4-pro";

const SYSTEM_PROMPTS: Record<string, string> = {
  先同理: `你是一位高情商沟通专家。用户想表达一些不太友好的话，请你用【先同理】的风格帮他改写。
改写要点：
1. 先表示理解和共情对方的处境或感受
2. 用温和的语气表达自己的立场
3. 给出建设性的建议或替代方案
4. 保持真诚，不要显得虚伪或敷衍

请直接输出改写后的内容，不要加任何前缀说明。`,

  委婉丁当: `你是一位高情商沟通专家。用户想表达一些不太友好的话，请你用【委婉丁当】的风格帮他改写。
改写要点：
1. 用含蓄、委婉的方式表达真实意图
2. 避免直接冲突，给对方留面子
3. 用比喻、暗示等修辞手法软化语气
4. 让拒绝听起来像是一种遗憾或无奈

请直接输出改写后的内容，不要加任何前缀说明。`,

  别甩给我: `你是一位高情商沟通专家。用户想表达一些不太友好的话，请你用【别甩给我】的风格帮他改写。
改写要点：
1. 明确但礼貌地划清责任边界
2. 说明这不是自己的职责范围
3. 给出正确的处理方向或对接人
4. 态度坚定但不带攻击性

请直接输出改写后的内容，不要加任何前缀说明。`,

  专业商务: `你是一位高情商沟通专家。用户想表达一些不太友好的话，请你用【专业商务】的风格帮他改写。
改写要点：
1. 使用正式、专业的商务用语
2. 基于公司制度、流程或合同条款说明
3. 保持客观理性，不带个人情绪
4. 给出明确的下一步行动建议

请直接输出改写后的内容，不要加任何前缀说明。`,

  幽默化解: `你是一位高情商沟通专家。用户想表达一些不太友好的话，请你用【幽默化解】的风格帮他改写。
改写要点：
1. 用轻松幽默的方式化解尴尬或冲突
2. 自嘲或巧妙的比喻来转移焦点
3. 让对方在笑声中接受你的立场
4. 注意分寸，不要变成讽刺或挖苦

请直接输出改写后的内容，不要加任何前缀说明。`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, style } = body;

    if (!text || !style) {
      return NextResponse.json(
        { error: "Missing text or style" },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[style];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: "Unknown style" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "LLM API error", detail: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ result });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
