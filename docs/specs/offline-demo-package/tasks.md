# Offline Demo Package Tasks

## P0 - Critical

- [x] Create or verify `spec.md`, `design.md`, `tasks.md`, and `checklist.md`.
- [x] Read relevant Next.js static export docs in `node_modules/next/dist/docs/` and confirm the offline demo will not alter the existing BFF architecture.
- [x] Define the standalone `demo/` source structure and output target `demo/dist/`.

## P1 - Backend / Data

- [x] Add local mock data for the offline demo with 20 records covering all six expression styles.
- [x] Implement local result matching logic that prefers the selected scene and style, then falls back gracefully.

## P2 - Frontend / UI

- [x] Create static offline pages for `/`, `/input`, `/tone`, and `/results` under `demo/src/`.
- [x] Implement browser-local draft persistence for scene, text, style, and tone sliders.
- [x] Render offline result cards, local feedback hints, and demo-only explanatory copy without any network requests.

## P3 - Testing / Verification

- [x] Run the demo build command and verify `demo/dist/` is created with the expected files.
- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Manually inspect the offline demo routes in a local static server and confirm the home page opens in the browser snapshot.

## P4 - Documentation / Cleanup

- [x] Update README with offline demo purpose, build command, and output directory.
- [x] Ignore generated demo build output if it should not be committed.
- [x] Summarize completed tasks, skipped checks, and remaining maintenance risks.

## Dependencies

- P0 must complete before implementation tasks.
- P1 provides the local data contract consumed by P2.
- P3 runs after all implementation tasks are complete.
- P4 completes after implementation and verification details are known.
