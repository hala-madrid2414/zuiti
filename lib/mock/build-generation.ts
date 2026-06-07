import type {
  ExpressionStyle,
  GenerateResult,
  OutputMode,
  OutputResult,
  ResolvedLanguage,
} from "@/lib/domain/enums";
import { GeneratedResultSchema } from "@/lib/llm/schema";
import type { GenerateRequest } from "@/lib/validators/generate";

export type MockMode = {
  candidates: [string, string, string];
  recommendedIndex?: 0 | 1 | 2;
  reasons: string[];
};

export type MockLanguageBundle = {
  safetyNote: string;
  assumptions: string[];
  styleIntents: Record<ExpressionStyle, string>;
  modes: Record<OutputMode, MockMode>;
};

export type MockGenerationFile = {
  languages: Record<ResolvedLanguage, MockLanguageBundle>;
};

function cleanInputText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120);
}

function fillTemplate(template: string, values: { text: string; intent: string }) {
  return template.replaceAll("{text}", values.text).replaceAll("{intent}", values.intent);
}

function buildOutput(mode: MockMode, values: { text: string; intent: string }): OutputResult {
  return {
    candidates: mode.candidates.map((candidate) => fillTemplate(candidate, values)) as [
      string,
      string,
      string,
    ],
    recommendedIndex: mode.recommendedIndex ?? 0,
    reasons: mode.reasons,
  };
}

export function buildMockGenerationResult(
  mock: MockGenerationFile,
  request: GenerateRequest,
  language: ResolvedLanguage,
): GenerateResult {
  const bundle = mock.languages[language] ?? mock.languages["zh-CN"];
  const values = {
    text: cleanInputText(request.text),
    intent: bundle.styleIntents[request.style],
  };

  const resultWithoutMeta = {
    wechat: buildOutput(bundle.modes.wechat, values),
    email: buildOutput(bundle.modes.email, values),
    spoken: buildOutput(bundle.modes.spoken, values),
    assumptions: bundle.assumptions,
    safetyNotes: [bundle.safetyNote],
  };
  const parsed = GeneratedResultSchema.parse(resultWithoutMeta);

  return {
    ...parsed,
    meta: {
      source: "fallback",
      language,
    },
  };
}
