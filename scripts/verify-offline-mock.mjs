import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "mock/generation-results.json",
  "lib/mock/generation.ts",
  "lib/llm/pipeline.ts",
  "lib/use-cases/generate-expression.ts",
];

const failures = [];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(root, relativePath))) {
    failures.push(`Missing required offline file: ${relativePath}`);
  }
}

const pipelinePath = join(root, "lib/llm/pipeline.ts");
if (existsSync(pipelinePath)) {
  const pipeline = readFileSync(pipelinePath, "utf8");
  if (pipeline.includes("createChatModel") || pipeline.includes("./model")) {
    failures.push("lib/llm/pipeline.ts still imports or uses the model factory");
  }
  if (pipeline.includes("@langchain/openai")) {
    failures.push("lib/llm/pipeline.ts still references @langchain/openai");
  }
}

const modelPath = join(root, "lib/llm/model.ts");
if (existsSync(modelPath)) {
  const model = readFileSync(modelPath, "utf8");
  if (model.includes("@langchain/openai") || model.includes("AI_API_KEY")) {
    failures.push("lib/llm/model.ts still contains external model credentials or OpenAI client code");
  }
}

const clientApiPath = join(root, "utils/expression-api.ts");
if (existsSync(clientApiPath)) {
  const clientApi = readFileSync(clientApiPath, "utf8");
  if (clientApi.includes("fetch(")) {
    failures.push("utils/expression-api.ts still performs browser network requests");
  }
}

const mockPath = join(root, "mock/generation-results.json");
if (existsSync(mockPath)) {
  const parsed = JSON.parse(readFileSync(mockPath, "utf8"));
  for (const language of ["zh-CN", "en", "ja", "ko"]) {
    if (!parsed.languages?.[language]) {
      failures.push(`Missing mock language bundle: ${language}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Offline mock generation contract is satisfied.");
