# Mindisle Workflow: Test Autonomous Behavior

Use this workflow to test character autonomy, decision selection, personality emergence, and error recovery.

## Test Checklist

1. **Perception Limits**:
   - Assert: Character cannot observe entities beyond vision radius (6 tiles).
   - Assert: Character cannot hear dialogue beyond hearing radius (4 tiles).

2. **Personality Distinctiveness**:
   - Seed identical world contexts for Naufal and Lauren.
   - Assert: Naufal prioritizes physical exploration/tinkering; Lauren prioritizes flora observation/reflection.

3. **Error Recovery**:
   - Command movement into blocked boulder tile.
   - Assert: Movement is rejected; character re-evaluates goal without freezing.

4. **Absence of Infinite Decision Loops**:
   - Run simulation for 100 virtual ticks.
   - Assert: Characters vary actions and do not enter oscillatory movement loops.

