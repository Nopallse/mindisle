---
name: gemini-agent-engineering
description: Implements Mindisle's Gemini-powered autonomous character brains, prompts, structured outputs, function calling, server-side @google/genai SDK integration, creative proposals, and decision orchestration.
---

# Gemini Agent Engineering

Responsible for the AI brain, reasoning loop, creative ideation, and structured proposals for autonomous characters.

Google Gemini API is the sole LLM reasoning provider. Do not integrate OpenAI, Anthropic, or other third-party LLMs.

## Responsibilities

- Server-side Gemini API client integration using the official `@google/genai` JavaScript SDK.
- Character-specific prompt construction and private epistemic context bounding.
- Structured output enforcement via versioned Zod schemas.
- Distinguishing **Creative Reasoning** (inventing ideas, proposing design specs) from **Physical Action Selection** (`MOVE`, `GATHER`, `CONSTRUCT`, `SPEAK`).
- Robust handling of latency, timeouts, rate limits, and deterministic safe fallbacks.
- Recording usage telemetry (latency, tokens, model ID, status).

## Architectural Rules

1. **Server-Side Only**: `GEMINI_API_KEY` and client instances must never be imported into React client components or Phaser scenes.
2. **Untrusted Proposer**: Gemini is a proposal generator. The Causality Engine and simulation engine have authoritative veto power over every action.
3. **No Direct World Mutation**: Gemini cannot declare that an object has appeared, that materials have materialized, or that a character has teleported. It proposes *intentions*.
4. **Separate Reasoning from Image Generation**: Text/reasoning models and image-generation models have distinct endpoints and capabilities. Do not assume all Gemini models output images directly.
5. **No Per-Frame Invocations**: Trigger decisions via event bus subscriptions, schedule intervals, or when an action finishes.
6. **Strict Isolation**: Naufal and Lauren receive strictly isolated system instructions, private perceptions, private memories, and private beliefs.
7. **Mockable in Tests**: All Gemini API calls must be wrapped in an interface allowing deterministic mocking in automated test suites (Scenarios A through H).

## Dependencies

- Coordinates with: `causality-engine`, `creative-engine`, `memory-systems`, `autonomous-agent-behavior`, `security-and-secrets`.
