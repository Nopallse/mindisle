# Mindisle Workflow: Test Persistence

Use this workflow to test that world state, objects, visual assets, and character memories survive restarts (Scenario F).

## Test Checklist

1. **World State Serialization**:
   - Save active world snapshot (time, weather, characters, objects) to Firestore emulator/mock.
   - Assert: All fields serialize cleanly without circular references.

2. **Asset Recovery**:
   - Upload pixel matrix and asset definition.
   - Assert: Storage URL and metadata reload properly into Phaser textures.

3. **Restart Simulation (Scenario F)**:
   - Construct an object in the world.
   - Teardown WorldState instance and re-initialize from persistence.
   - Assert: Object exists at exact coordinates with identical provenance and visual asset link.

