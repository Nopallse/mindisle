---
name: quality-gates
description: Runs EDEN engineering quality checks including TypeScript, lint, unit tests, integration tests, browser smoke tests, and phase acceptance verification.
---

# EDEN Quality Gates

## Responsibilities

Verify implementation quality.

Use:

- Before marking a phase complete.
- After substantial code changes.
- During regression investigation.
- Before release.

## Checks

1. Inspect package scripts.
2. Run formatting and lint.
3. Run TypeScript typecheck.
4. Run relevant unit tests.
5. Run integration tests.
6. Run production build.
7. Run browser smoke tests if configured.
8. Verify phase acceptance criteria.
9. Report exact outcomes.

## AI-Specific Checks

- Malformed JSON is rejected.
- Zod schema is enforced.
- Unsupported actions are rejected.
- Out-of-bounds movement is rejected.
- Stale decisions are ignored.
- Duplicate requests are prevented.
- Timeout is handled.
- Rate limits are handled.
- API key is not exposed.
- Naufal and Lauren memory isolation works.
- Private thoughts are not emitted as dialogue.
- Unit tests do not require a live Gemini API key.

## Reporting Format

Use:

PASS
FAIL
NOT RUN

Never say all tests passed if some tests were not executed.

Include remaining risks and reproduction steps.
