---
description: Verify EDEN release readiness, environment configuration, build, tests, security boundaries, and documentation.
---

Read `.agents/AGENTS.md`.

Load:

- quality-gates
- security-and-secrets

Verify required environment variables are documented but not committed.

Run available:

- TypeScript checks.
- Lint.
- Unit tests.
- Integration tests.
- Production build.
- Browser smoke tests.

Verify:

- No Gemini API key is exposed in client bundles.
- Database migrations are safe.
- Persistence works.
- Current phase acceptance criteria are satisfied.
- Documentation is updated.

Do not deploy without explicit user approval.

Do not perform destructive database operations without explicit approval.

Report all checks using:

- PASS
- FAIL
- NOT RUN

