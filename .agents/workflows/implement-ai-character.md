# Mindisle Workflow: Implement an AI Character

Use this workflow to implement or refine autonomous character brains, decision loops, and personalities (Naufal & Lauren).

## Steps

1. **Configure Isolated Character Profile**:
   - Define personality archetype, behavioral traits, and motivation priorities.
   - Set up separate system instructions in `src/ai/prompts/`.
   - Ensure mental context isolation: Naufal cannot inspect Lauren's thoughts.

2. **Define Structured Output Schema (Zod)**:
   - Separate internal reasoning from executable action proposals.
   - Include action type, target tile, interaction parameters, and confidence.

3. **Wire Decision Pipeline**:
   - Perception filters $\rightarrow$ Memory recall $\rightarrow$ Gemini request $\rightarrow$ Zod parse $\rightarrow$ Causality Engine validation $\rightarrow$ Simulation execution $\rightarrow$ Grounded memory storage.

4. **Add Safe Fallback**:
   - Guarantee character adopts safe behavior (look around, rest) if Gemini times out or errors.

5. **Test Autonomous Behavior**:
   - Execute `/test-autonomous-behavior` and `/test-causality`.

