---
name: gemini-agent-engineering
description: Implements EDEN's Gemini-powered autonomous character brains, prompts, structured outputs, function calling, server-side SDK integration, and decision orchestration.
---

# Gemini Agent Engineering

## Responsibilities

Build the AI Brain for Naufal and Lauren.

Gemini is the ONLY LLM provider.

Use:

- Google Gemini API.
- Official @google/genai SDK.
- Structured output.
- Function calling where appropriate.

Do not integrate:

- OpenAI.
- Anthropic.
- Claude.
- Other LLM providers.

## Security

- API key must be server-side.
- Use GEMINI_API_KEY.
- Use GEMINI_MODEL for model selection.
- Never expose credentials to Phaser or browser code.

## Agent Isolation

Create independent configurations for Naufal and Lauren.

Each character has:

- System instructions.
- Personality.
- Goals.
- Private memory.
- Current state.
- Decision history.

Never share private thoughts or memories.

## Decision Pipeline

1. Build perception context.
2. Retrieve relevant memories.
3. Construct bounded prompt.
4. Send request to Gemini.
5. Receive structured output.
6. Validate using Zod.
7. Validate world action.
8. Execute accepted action.
9. Record actual result.
10. Update memory.

## Prompt Engineering

Each decision should:

- Consider personality.
- Consider current needs.
- Consider active goals.
- Use available observations.
- Use relevant memories.
- Select one immediate action.
- Avoid repetitive behavior.
- Avoid inventing facts.

Internal thought must be separated from public dialogue.

## Reliability

Implement:

- Request timeout.
- Bounded retries.
- Exponential backoff for transient errors.
- Request IDs.
- Stale-result rejection.
- Per-character cooldown.
- Safe fallback.

Do not call Gemini every frame.

## Testing

Test:

- Valid output.
- Invalid JSON.
- Unsupported action.
- Out-of-range target.
- Timeout.
- Rate limit.
- Stale response.
- Private memory leakage.

Mock Gemini responses during ordinary tests.

Live Gemini tests must be optional.
