# Mindisle Workflow: Release Check

Run this workflow prior to tagging a phase release or delivering a milestone.

## Release Checklist

1. **Clean Code & Type Check**:
   ```bash
   npm run typecheck
   npm run lint
   ```
   Must exit with 0 errors and 0 warnings.

2. **Automated Test Suite**:
   ```bash
   npm test
   ```
   All unit, scenario, and causality tests must pass. Never claim unrun tests passed.

3. **Production Build**:
   ```bash
   npm run build
   ```
   Next.js App Router must compile all routes cleanly.

4. **Security Audit**:
   - Check that `.env.local` is in `.gitignore`.
   - Verify zero client-side leaks of `GEMINI_API_KEY` or `FIREBASE_ADMIN_PRIVATE_KEY`.

5. **Roadmap & Acceptance Update**:
   - Update `docs/ROADMAP.md` and `docs/PHASE_ACCEPTANCE.md` with honest outcomes and verified acceptance criteria.
