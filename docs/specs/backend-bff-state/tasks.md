# Backend BFF + Frontend State Tasks

## P0 - Critical

- [x] T001 Create `docs/specs/backend-bff-state/spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- [x] T002 Read Next.js Route Handler docs in `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `01-app/03-api-reference/03-file-conventions/route.md`.
- [x] T003 Install required dependencies: `zod`, `zustand`, `@langchain/core`, `@langchain/openai`.

## P1 - Backend / Data

- [x] T004 Create domain enums/defaults/errors in `lib/domain/**`.
- [x] T005 Create zod schemas for generate, feedback, track in `lib/validators/**`.
- [x] T006 Create model factory in `lib/llm/model.ts` using `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.
- [x] T007 Create prompt/schema/pipeline/normalize modules in `lib/llm/**`.
- [x] T008 Create context builder in `lib/context/build-context.ts`.
- [x] T009 Create safety policy and post-check modules in `lib/safety/**`.
- [x] T010 Create analytics event/logger modules in `lib/analytics/**`.
- [x] T011 Create generate use case in `lib/use-cases/generate-expression.ts`.
- [x] T012 Create feedback and track use cases in `lib/use-cases/**`.
- [x] T013 Create `app/api/generate/route.ts`.
- [x] T014 Create `app/api/feedback/route.ts`.
- [x] T015 Create `app/api/track/route.ts`.
- [x] T016 Update `.env.example` with documented AI env vars.

## P2 - Frontend / UI

- [x] T017 Add Zustand flow store for scene, text, style, sliders, session, generation state.
- [x] T018 Add frontend API client utilities for generate, feedback, and track.
- [x] T019 Add mapping utils from existing content display data to backend enum values.
- [x] T020 Update `components/content.ts` to expose stable enum keys without breaking existing UI.
- [x] T021 Update home page scene actions to write selected scene before navigation.
- [x] T022 Update input page to read/write raw text and style from store.
- [x] T023 Update tone page to read/write sliders from store.
- [x] T024 Update results page to call generate API and render loading/success/fail/refused states.
- [x] T025 Wire result actions to copy/track/feedback where currently shown in UI.

## P3 - Testing / Verification

- [x] T026 Verify `/api/generate` with valid request.
- [x] T027 Verify `/api/generate` invalid request returns `INVALID_INPUT`.
- [x] T028 Verify safety refusal returns `SAFETY_REFUSED`.
- [x] T029 Verify `/api/feedback` and `/api/track` return stable success.
- [x] T030 Run `npm run lint`.
- [x] T031 Run `npm run build`.
- [ ] T032 Manually inspect `/`, `/input`, `/tone`, `/results` at `375 x 750`.

## P4 - Documentation / Cleanup

- [x] T033 Update related docs if public contracts differ from `docs/backend-architecture.md`.
- [x] T034 Mark completed tasks in this file during implementation.
- [x] T035 Update checklist items only after verification evidence exists.
- [x] T036 Summarize changed files, verification, limitations, and follow-up work.

## Verification Notes

- T026-T029 verified against `next start` on local port 3213 using Node `fetch`; safety refusal was verified with Unicode-escaped Chinese input to avoid PowerShell source encoding loss.
- T032 remains open because no Browser tool is available in this session and Playwright is not installed locally.

## Dependencies

- P0 must complete before implementation.
- Backend contract tasks T004-T015 must complete before frontend API integration T018/T024.
- Store tasks T017-T020 must complete before page wiring T021-T025.
- Verification runs after implementation tasks.
