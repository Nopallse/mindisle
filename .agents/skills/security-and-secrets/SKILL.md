---
name: security-and-secrets
description: Reviews EDEN API security, Gemini key handling, server/client boundaries, request validation, rate limiting, logging, and character-memory privacy.
---

# EDEN Security

## Responsibilities

Protect EDEN's infrastructure, API, secrets, and character privacy.

Use when working on:

- Gemini API endpoints.
- Database APIs.
- Authentication.
- Secrets.
- Logging.
- Memory access.
- Security review.

## Rules

- Gemini API key must remain server-side.
- Never prefix secret variables with NEXT*PUBLIC*.
- Never return secrets in API responses.
- Validate requests with Zod.
- Apply rate limits.
- Limit expensive AI requests.
- Never trust client-supplied authoritative positions.
- Never trust client-supplied action outcomes.
- Load authoritative state on the server.
- Enforce memory ownership.
- Treat AI output as untrusted.
- Avoid arbitrary code execution from AI agents.

## Security Review Checklist

1. Can browser code reveal the Gemini key?
2. Can a client spoof world state?
3. Can Naufal retrieve Lauren's private memory?
4. Can Lauren retrieve Naufal's private memory?
5. Can AI move characters through walls?
6. Can repeated requests exhaust API quota?
7. Do error messages leak secrets?
8. Are private thoughts unnecessarily logged?

## Acceptance

No critical secret exposure, unauthorized memory access, or unvalidated world-state mutation.
