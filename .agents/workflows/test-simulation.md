---
description: Run EDEN simulation scenario tests for autonomy, perception, memory, action validity, and agent privacy.
---

Read `.agents/AGENTS.md`.

Load:

- test-ai-simulation
- quality-gates

Inspect the current simulation implementation.

Build or run deterministic scenarios using mocked Gemini decisions.

Verify:

- World invariants.
- Character isolation.
- Perception limits.
- Action validity.
- Cooldowns.
- Failure recovery.
- Persistence.

If a live Gemini test is useful, ask for explicit configuration and approval.

Keep live API tests budget-limited.

Report:

- PASS.
- FAIL.
- NOT RUN.

Include evidence for every result.

