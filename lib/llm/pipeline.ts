import type { GenerationContext } from "@/lib/context/build-context";
import type { GenerateResult } from "@/lib/domain/enums";
import { createMockGenerationResult } from "@/lib/mock/generation";
import type { GenerateRequest } from "@/lib/validators/generate";

export async function generateWithLlmOrFallback(
  request: GenerateRequest,
  context: GenerationContext,
): Promise<GenerateResult> {
  return createMockGenerationResult(request, context.language);
}
