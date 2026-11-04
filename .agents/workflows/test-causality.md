# Mindisle Workflow: Test Causality

Use this workflow to test that the Causality Engine strictly enforces logical prerequisites and prevents magical object emergence.

## Test Checklist

1. **Test Scenario A (Valid Creation)**:
   - Provide character with all materials, tools, and craft knowledge.
   - Assert: Object is instantiated and provenance is recorded.

2. **Test Scenario B (Insufficient Resources)**:
   - Provide character with knowledge and tools, but 0 wood.
   - Assert: Creation is rejected, wood is not negative, object does not appear.

3. **Test Scenario C (Insufficient Knowledge)**:
   - Provide materials and tools, but remove craft recipe from knowledge graph.
   - Assert: Action is blocked, character cannot proceed.

4. **Test Scenario D (Failed Construction)**:
   - Trigger mid-construction failure (simulated tool breakage).
   - Assert: No completed object appears; failure memory is stored.

5. **Test Scenario H (No Magical Creation)**:
   - Inject mocked Gemini response claiming an object was magically spawned.
   - Assert: Simulation engine rejects world mutation.

Run tests:
```bash
npm test tests/causality.test.ts
```

