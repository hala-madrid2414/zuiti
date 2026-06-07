import { generationPromptCopy } from "@/config";

type PromptVariables = Record<string, string | number | undefined>;

function fillLine(line: string, values: PromptVariables) {
  return line.replace(/\{([^}]+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function formatGenerationPrompt(values: PromptVariables) {
  return {
    system: generationPromptCopy.systemLines.join("\n"),
    human: generationPromptCopy.humanLines.map((line) => fillLine(line, values)).join("\n"),
  };
}
