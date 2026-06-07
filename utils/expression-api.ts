import mockGenerationData from "@/mock/generation-results.json";
import { inferPrimaryLanguage } from "@/lib/context/infer-language";
import { buildMockGenerationResult, type MockGenerationFile } from "@/lib/mock/build-generation";
import type { GenerateDraft, GenerateResult } from "@/stores/expression-flow-store";

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  code: string;
  message: string;
  data?: unknown;
};

export type GenerateApiResponse = ApiSuccess<GenerateResult> | ApiFailure;

type FeedbackPayload = {
  sessionId: string;
  resultId: string;
  useful: boolean;
  reasonTags?: string[];
};

type TrackPayload = {
  sessionId: string;
  event: string;
  payload?: Record<string, unknown>;
};

const offlineMock = mockGenerationData as unknown as MockGenerationFile;

export async function generateExpression(draft: GenerateDraft): Promise<GenerateApiResponse> {
  return {
    ok: true,
    data: buildMockGenerationResult(offlineMock, draft, inferPrimaryLanguage(draft.text)),
  };
}

export async function sendFeedback(payload: FeedbackPayload): Promise<ApiSuccess<{ received: boolean }>> {
  void payload;
  return {
    ok: true,
    data: { received: true },
  };
}

export async function trackEvent(payload: TrackPayload): Promise<ApiSuccess<{ received: boolean }>> {
  void payload;
  return {
    ok: true,
    data: { received: true },
  };
}
