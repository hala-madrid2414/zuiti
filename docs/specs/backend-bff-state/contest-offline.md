# Contest Offline Deployment Override

For the Douyin AI Creator competition submission, the demo build must not depend on external model services or browser API requests during the user flow.

- Generation copy is stored in root `mock/generation-results.json`.
- Server-side `/api/generate` remains available and reads the same root mock data through `lib/mock/**`.
- The browser flow uses `utils/expression-api.ts` to generate from bundled mock data directly, so `/results` does not call `fetch('/api/generate')`.
- Feedback and tracking actions resolve locally for the contest build instead of calling `/api/feedback` or `/api/track`.
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, `@langchain/core`, and `@langchain/openai` are not required for the contest build.
