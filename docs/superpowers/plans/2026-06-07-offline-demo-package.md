# Offline Demo Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone offline demo package under `demo/` with four static pages, 20 local mock records, and a dedicated `demo/dist/` build output.

**Architecture:** Keep the current Next.js BFF app unchanged and add a separate static demo source tree under `demo/src/`. Use one lightweight Node build script to copy the offline assets into `demo/dist/`, so the uploadable package never depends on `/api/*`, server runtime, or remote assets.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js file system APIs, existing npm scripts

---

### Task 1: Spec And File Boundaries

**Files:**
- Create: `docs/specs/offline-demo-package/spec.md`
- Create: `docs/specs/offline-demo-package/design.md`
- Create: `docs/specs/offline-demo-package/tasks.md`
- Create: `docs/specs/offline-demo-package/checklist.md`

- [ ] Confirm the offline demo keeps the main `app/**` and `app/api/**` flow untouched.
- [ ] Record the `demo/src/` and `demo/dist/` boundary in the spec and design docs.

### Task 2: Offline Demo Source

**Files:**
- Create: `demo/src/index.html`
- Create: `demo/src/input.html`
- Create: `demo/src/tone.html`
- Create: `demo/src/results.html`
- Create: `demo/src/styles.css`
- Create: `demo/src/app.js`
- Create: `demo/src/mock-data.js`

- [ ] Implement the four static pages with relative links only.
- [ ] Add browser-local draft state and result matching logic.
- [ ] Add 20 mock records covering all six styles.

### Task 3: Build And Docs

**Files:**
- Create: `scripts/build-demo.mjs`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] Add `npm run build:demo` to generate `demo/dist/`.
- [ ] Clean old demo output before copying new files.
- [ ] Document how the offline package differs from the full app.

### Task 4: Verification

**Files:**
- Modify: `docs/specs/offline-demo-package/tasks.md`
- Modify: `docs/specs/offline-demo-package/checklist.md`

- [ ] Run `npm run build:demo` and verify `demo/dist/`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Mark completed tasks and checklist items with actual evidence.
