export type ModelFactoryResult = {
  configured: boolean;
};

export function createChatModel(): ModelFactoryResult {
  return { configured: false };
}
