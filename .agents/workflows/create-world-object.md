# Mindisle Workflow: Create a World Object

Use this workflow whenever an AI character or construction project creates an object in the world.

## The Mandatory 14-Step Causal Verification Chain

Every object creation must pass every verification step:

1. **Motivation & Need**: Verify that the character had an active physiological, aesthetic, or social need driving the creation.
2. **Observation**: Verify that the character observed relevant materials or environmental context.
3. **Idea & Inspiration**: Record the initial creative idea and inspiration source.
4. **Project Planning**: Verify that a `CreationProject` was initiated with a valid `ObjectSpecification`.
5. **Knowledge Verification**: Assert that the character possesses the required knowledge item with confidence $\ge 0.5$. If not, block creation.
6. **Tool Availability**: Assert that required tools exist in inventory or within adjacent workbench reach.
7. **Resource Availability**: Assert that required materials (wood, stone, fiber) exist and are physically consumed from inventory/world.
8. **Construction Execution**: Validate that physical labor steps were performed over simulation time (not instantaneous).
9. **Step Validation**: Causality Engine validates that character remained within interaction range during construction.
10. **Physical Instantiation**: Create the `WorldObject` instance with tile coordinates and collision bounding box.
11. **Visual Asset Binding**: Link or generate the visual pixel-art asset via `/create-pixel-art-asset`.
12. **Firebase Persistence**: Atomically save the object to Firestore and asset binary to Firebase Storage.
13. **Provenance Recording**: Generate an immutable `ObjectProvenance` record linking creator, tools, materials, and timestamps.
14. **Grounded Memory**: Store an episodic memory in the creator's private memory log.

If ANY step fails, abort physical object instantiation and record the failure consequence.

