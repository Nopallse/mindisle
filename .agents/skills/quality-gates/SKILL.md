---
name: quality-gates
description: Runs Mindisle engineering quality checks including TypeScript typechecks, ESLint linting, Vitest scenario tests (Scenarios A through H), Firebase security rules validation, and production build verification.
---

# Mindisle Quality Gates

Responsible for enforcing engineering standards, type safety, test suites, and phase acceptance verification.

## Mandatory Quality Checks

Every non-trivial PR or phase increment must pass:

```bash
# 1. Type Safety
npm run typecheck      # tsc --noEmit: zero errors allowed

# 2. Code Standards
npm run lint           # next lint: zero warnings, zero errors

# 3. Automated Simulation & Causality Tests
npm test               # vitest run: all unit & scenario tests pass

# 4. Production Build Verification
npm run build          # next build: App Router compiles clean static/dynamic routes
```

## AI & Causality Quality Verifications

- **Schema Strictness**: Zod validates all Gemini outputs; malformed outputs fall back to safe deterministic actions.
- **Causality Enforcement (Scenarios A–H)**:
  - Scenario A: Valid creation with all resources succeeds.
  - Scenario B: Creation without resources fails.
  - Scenario C: Creation without knowledge fails.
  - Scenario D: Failed construction leaves consequences and memory.
  - Scenario E: New invention without predefined catalog succeeds via Creative Engine.
  - Scenario F: World state and assets survive restart.
  - Scenario G: Shared discovery transfers knowledge only through in-world perception.
  - Scenario H: Hallucinated creations without execution history are rejected.
- **Privacy Gate**: Assert that Naufal's context cannot query Lauren's private memories and vice versa.
- **Credentials Gate**: Assert that `GEMINI_API_KEY` and Firebase service account keys are never imported into browser or Phaser bundles.

## Reporting Format

- Status must be clearly reported as `PASS`, `FAIL`, or `NOT RUN`.
- Never claim unrun tests passed.

## Dependencies

- Coordinates with: `test-ai-simulation`, `security-and-secrets`, `eden-orchestrator`.
