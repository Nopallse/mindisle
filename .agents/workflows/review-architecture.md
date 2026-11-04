# Mindisle Workflow: Review Architecture

Use this workflow before completing architectural changes, merging significant subsystems, or advancing phase milestones.

## Review Steps

1. **Check Boundary Invariants**:
   - Is Phaser strictly rendering, without prompt logic or DB queries?
   - Does React UI observe via snapshots without owning authoritative simulation state?
   - Are Gemini keys and Firebase Admin credentials strictly server-side?

2. **Verify Causality & Creative Systems**:
   - Does every world object creation obey the Causality Engine?
   - Can characters invent new things via the Creative Engine without fixed catalog limits?
   - Is pixel art represented as actual structured data?

3. **Verify Firebase Schema Compliance**:
   - Are subcollections properly scoped to `worlds/{worldId}`?
   - Are private memories protected in `characters/{characterId}/memories`?
   - Are binary assets placed in Firebase Storage rather than Firestore documents?

4. **Verify Documentation Coherence**:
   - Do all documents in `docs/` agree on Mindisle terminology, Firebase, and Causality rules?
   - Does `docs/ROADMAP.md` reflect verified phase milestones?

