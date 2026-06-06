import { jsonError } from "@/lib/domain/responses";
import { submitFeedback } from "@/lib/use-cases/submit-feedback";
import { FeedbackRequestSchema } from "@/lib/validators/feedback";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = FeedbackRequestSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("INVALID_INPUT", "请求参数不合法。", 400);
    }

    const result = await submitFeedback(parsed.data);
    return Response.json(result, { status: 200 });
  } catch {
    return jsonError("INTERNAL_ERROR", "服务暂时不可用，请稍后重试。", 500);
  }
}
