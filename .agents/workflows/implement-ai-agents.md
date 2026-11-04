---
description: Implement or improve Naufal and Lauren's independent Gemini-powered brains and autonomous decision loop.
---

Read:

- .agents/AGENTS.md
- docs/AI_PROTOCOL.md
- docs/ARCHITECTURE.md

Load skills:

- gemini-agent-engineering
- autonomous-agent-behavior
- simulation-systems
- memory-systems
- security-and-secrets
- test-ai-simulation

Verify the current official @google/genai API and supported Gemini model configuration.

Implement server-side Gemini integration only.

Keep Naufal and Lauren contexts isolated.

Use structured output and Zod validation.

Route all decisions through deterministic action validation.

Add mocked tests for:

- Valid decisions.
- Malformed output.
- Unsupported actions.
- Stale decisions.
- Timeout.
- Privacy leakage.

Never call Gemini from browser or Phaser code.
