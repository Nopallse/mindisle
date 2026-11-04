# Mindisle Workflow: Implement a Simulation System

Use this workflow when creating or modifying authoritative simulation logic, physics, navigation, clock, needs, or causality validators.

## Steps

1. **Verify Boundary Invariant**:
   - Simulation state must be deterministic and reside in `src/simulation/`.
   - Never import Phaser, React components, or raw LLM client calls into simulation modules.

2. **Design Data Contracts & Types**:
   - Define domain interfaces in `src/types/`.
   - Ensure all state transitions are explicit and serializable.

3. **Implement Deterministic Logic**:
   - Write authoritative logic with controlled step delta time.
   - Enforce grid boundaries, walkability, collision, and range checks.
   - Emit typed events via `EventBus` for observers.

4. **Add Unit & Scenario Tests**:
   - Write tests in `tests/` verifying nominal paths, edge cases, out-of-bounds inputs, and failure recovery.

5. **Run Verification Gates**:
   ```bash
   npm run typecheck
   npm test
   ```

