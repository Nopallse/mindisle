---
name: security-and-secrets
description: Reviews Mindisle API security, Gemini key handling, Firebase Admin service account protection, Firestore/Storage security rules, rate limiting, and character-memory privacy boundaries.
---

# Mindisle Security & Secrets

Responsible for protecting system infrastructure, API keys, Firebase service accounts, character privacy, and preventing prompt-injection world mutations.

## Core Security Invariants

1. **Server-Side Secret Isolation**:
   - `GEMINI_API_KEY` and `FIREBASE_ADMIN_PRIVATE_KEY` must never be prefixed with `NEXT_PUBLIC_` and must never be referenced in browser components or Phaser scenes.
   - Administrative database writes and Gemini invocations occur exclusively in Next.js Server Actions or API routes.
2. **Untrusted Model Output**:
   - All AI output is treated as untrusted user input.
   - Run Zod validation on every response.
   - The Creative Engine sanitizes and validates all design specifications to prevent arbitrary code execution, script injection in SVG/text, or out-of-bounds geometries.
3. **Firestore & Storage Security Rules**:
   - Web clients cannot overwrite world state, bypass collision, or modify another character's private memories directly.
   - Public clients have read-only access to sanitized world state and asset storage.
4. **Character Epistemic Privacy**:
   - A character's thoughts and private memories are confidential. They must never be exposed via public world events or leaked into another character's decision context.

## Pre-Release Security Checklist

- [ ] Does any client bundle expose `GEMINI_API_KEY` or `FIREBASE_ADMIN_PRIVATE_KEY`?
- [ ] Can an observer client spoof player positions or force an object creation without server validation?
- [ ] Are Firestore rules enforcing read-only access for unauthenticated observer clients?
- [ ] Can Naufal retrieve Lauren's private memories through any public API route?
- [ ] Are API error logs scrubbed of private keys and environment tokens?

## Dependencies

- Coordinates with: `firebase-world-database`, `firebase-asset-persistence`, `quality-gates`, `gemini-agent-engineering`.
