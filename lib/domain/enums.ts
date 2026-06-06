export const scenes = ["student", "work", "social", "formal"] as const;
export type Scene = (typeof scenes)[number];

export const expressionStyles = [
  "delay",
  "refuse",
  "boundary",
  "followup",
  "decode",
  "sarcasm",
] as const;
export type ExpressionStyle = (typeof expressionStyles)[number];

export const outputModes = ["wechat", "email", "spoken"] as const;
export type OutputMode = (typeof outputModes)[number];

export const operations = ["generate", "regenerate", "edit"] as const;
export type Operation = (typeof operations)[number];

export type ToneSliders = {
  politeness: number;
  formality: number;
  distance: number;
};

export type OutputResult = {
  candidates: [string, string, string];
  recommendedIndex: 0 | 1 | 2;
  reasons: string[];
};

export type GenerateResult = Record<OutputMode, OutputResult> & {
  assumptions: string[];
  safetyNotes: string[];
};
