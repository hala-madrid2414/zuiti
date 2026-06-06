# Codex Agent Rules - Spec Driven Development (SDD)

## Core Principle

This repository follows Spec Driven Development (SDD).

The agent must never start implementation immediately after receiving a feature request.

Every non-trivial task must follow the workflow below:

Requirements
→ Spec
→ Design
→ Tasks
→ Validation Checklist
→ Implementation
→ Verification

Code is the final artifact, not the first artifact.

---

## Mandatory Workflow

For every new feature, refactor, migration, or architectural change:

### Phase 1 - Specification

Create:

/docs/specs/<feature-name>/spec.md

Required structure:

# Problem

Describe the current problem.

# Goal

Describe the expected outcome.

# Non Goals

Explicitly define what is out of scope.

# User Stories

List user-facing scenarios.

# Acceptance Criteria

Define measurable success conditions.

# Edge Cases

Document boundary conditions and failure cases.

Do NOT generate code during this phase.

---

### Phase 2 - Design

Create:

/docs/specs/<feature-name>/design.md

Required structure:

# Architecture

# Data Flow

# Data Model

# API Design

# Security Considerations

# Performance Considerations

# Risks

# Alternatives Considered

Do NOT implement code during this phase.

---

### Phase 3 - Tasks

Create:

/docs/specs/<feature-name>/tasks.md

Required structure:

P0

* Critical tasks

P1

* Backend tasks

P2

* Frontend tasks

P3

* Testing tasks

P4

* Documentation tasks

Tasks must be ordered by dependency.

Each task must be independently verifiable.

---

### Phase 4 - Validation Checklist

Create:

/docs/specs/<feature-name>/checklist.md

Required structure:

[ ] Acceptance criteria satisfied

[ ] Unit tests added

[ ] Integration tests added

[ ] E2E tests added (if applicable)

[ ] Lint passes

[ ] Build passes

[ ] Security review completed

[ ] Documentation updated

[ ] Breaking changes documented

---

### Phase 5 - Review Gate

Before implementation:

1. Verify spec.md exists
2. Verify design.md exists
3. Verify tasks.md exists
4. Verify checklist.md exists

If any document is missing:

STOP.

Generate the missing documents first.

---

### Phase 6 - Implementation

Implement tasks sequentially.

Never implement tasks not defined in tasks.md.

Update progress after every completed task.

Mark completed tasks in tasks.md.

---

### Phase 7 - Verification

Before declaring completion:

Run:

* lint
* type check
* unit tests
* integration tests
* build validation

Verify every checklist item.

Only mark the feature complete when all checklist items pass.

---

## Planning Rules

When the user asks for a plan:

DO NOT create a generic implementation plan.

Instead generate:

1. spec.md
2. design.md
3. tasks.md
4. checklist.md

This repository treats planning as specification generation.

---

## Refactoring Rules

For refactors:

Create:

refactor-spec.md

Include:

* Current Architecture
* Proposed Architecture
* Migration Strategy
* Rollback Strategy
* Risk Analysis

Before modifying production code.

---

## Large Task Rules

If estimated work exceeds:

* 5 files changed
* 300 lines modified
* multiple subsystems

The task must be decomposed into multiple task groups.

Never execute large changes as a single step.

---

## Completion Criteria

A task is complete only when:

* Acceptance criteria pass
* Tests pass
* Build passes
* Checklist is fully completed
* Documentation is updated

Implementation alone is not completion.
