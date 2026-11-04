# Mindisle Workflow: Execute a Construction Project

Use this workflow to track and execute multi-step in-world construction projects over simulation time.

## Steps

1. **Initialize Project Record**:
   - Create document in `worlds/{worldId}/creationProjects/{projectId}`.
   - Record target location, blueprint, builder ID, and total required steps.

2. **Deduct Committed Resources**:
   - Atomically decrement required materials from builder inventory or surrounding storage crates.

3. **Simulate Construction Labor**:
   - Character performs construction labor actions in the simulation over time.
   - Check stamina, energy depletion, and tool durability at each step.

4. **Handle Mid-Construction Interruptions**:
   - If energy collapses, danger arrives, or tools break:
     - Pause project in `in_progress` state.
     - Emit event and update character memory.

5. **Finalize Construction**:
   - Once all steps succeed:
     - Trigger `/create-world-object`.
     - Update project status to `completed`.
     - Free the construction footprint.

