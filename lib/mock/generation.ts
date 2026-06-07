import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GenerateResult, ResolvedLanguage } from "@/lib/domain/enums";
import { buildMockGenerationResult, type MockGenerationFile } from "@/lib/mock/build-generation";
import type { GenerateRequest } from "@/lib/validators/generate";

let cachedMock: MockGenerationFile | null = null;

async function readMockGenerationFile(): Promise<MockGenerationFile> {
  if (cachedMock) {
    return cachedMock;
  }

  const filePath = path.join(process.cwd(), "mock", "generation-results.json");
  const raw = await readFile(filePath, "utf8");
  cachedMock = JSON.parse(raw) as MockGenerationFile;
  return cachedMock;
}

export async function createMockGenerationResult(
  request: GenerateRequest,
  language: ResolvedLanguage,
): Promise<GenerateResult> {
  const mock = await readMockGenerationFile();
  return buildMockGenerationResult(mock, request, language);
}
