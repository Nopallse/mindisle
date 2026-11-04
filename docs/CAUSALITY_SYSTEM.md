# Mindisle — Causality Engine Specification

## 1. Overview & Purpose

The **Causality Engine** is the core architectural subsystem responsible for maintaining logical consistency in the living world. It enforces the fundamental rule:

> **"Characters may imagine anything, but they cannot automatically materialize anything."**

No object, structure, or material change may occur without a verifiable, unbroken sequence of physical and cognitive causes.

---

## 2. The 14-Step Causal Creation Sequence

When an autonomous character conceives, designs, and builds an object (e.g. Naufal building a wooden chair), the system advances through 14 explicit states:

```text
[1. Need / Motivation] ──> [2. Observation] ──> [3. Inspiration] ──> [4. Project Plan]
                                                                            │
┌───────────────────────────────────────────────────────────────────────────┘
▼
[5. Knowledge Check] ──> [6. Tool & Material Verification] ──> [7. Resource Gathering]
                                                                      │
┌─────────────────────────────────────────────────────────────────────┘
▼
[8. Construction Labor Steps] ──> [9. Step Validation] ──> [10. Physical Instantiation]
                                                                  │
┌─────────────────────────────────────────────────────────────────┘
▼
[11. Pixel Asset Binding] ──> [12. Firebase Persistence] ──> [13. Provenance & Memory]
                                                                  │
┌─────────────────────────────────────────────────────────────────┘
▼
[14. Shared World Recognition]
```

### Detailed Sequence Breakdown

1. **Need / Motivation Emergence**: The character experiences a physiological, psychological, or social urge (e.g., energy fatigue creates a desire to rest off the cold ground).
2. **Environmental Observation**: The character perceives surrounding terrain, resources, or landmarks (e.g., spots fallen branches or logs near a tree).
3. **Inspiration & Idea Formation**: The motivation intersects with the observation, generating a creative idea (e.g., *"I can carve wood into an elevated chair"*).
4. **Project Planning & Blueprint**: The character proposes a `CreationProject` with an `ObjectSpecification` specifying dimensions, materials, and labor steps.
5. **Knowledge & Skill Verification**: The engine checks if the character possesses the required craft knowledge with confidence $\ge 0.5$.
6. **Tool & Material Verification**: The engine asserts that required tools (e.g., adze) exist and that raw materials are available.
7. **Resource Gathering**: The character physically travels to resource locations, harvests materials, and places them into inventory or a project stash.
8. **Construction Labor Steps**: The character executes discrete labor actions over simulation ticks, consuming stamina and tool durability.
9. **Step Validation by Simulation Engine**: At each step, the engine asserts that the character is adjacent, uninterrupted, and has sufficient energy.
10. **Physical Object Instantiation**: Upon 100% completion, the engine places the `WorldObject` on the grid map and updates tile collision.
11. **Pixel Art Asset Binding**: The visual pixel matrix or sprite is validated and registered into the rendering pipeline.
12. **Firebase Persistence**: The object is written to Firestore and the asset binary is stored in Firebase Storage.
13. **Provenance Recording & Memory Formation**: An immutable `ObjectProvenance` record is created, and the character stores an episodic memory of the craft.
14. **Shared World Recognition**: The new object is visible to other characters, who can inspect, use, or learn from it through in-world perception.

---

## 3. Failure & Consequence Handling

Failure is a first-class outcome in Mindisle. If any requirement in the causal sequence is unsatisfied, the Causality Engine halts execution and enforces realistic consequences:

| Failure Mode | Trigger Condition | Engine Consequence | Character Consequence |
| :--- | :--- | :--- | :--- |
| **Missing Materials** | Required resources < inventory count | Action rejected; project remains in `planning` state. | Character experiences frustration; updates goal to "Gather wood" or abandons idea. |
| **Missing Knowledge** | Craft recipe confidence < 0.5 | Action blocked at validation gate. | Character cannot proceed; must experiment, read a book, or observe a peer. |
| **Tool Breakdown** | Tool durability reaches 0 mid-craft | Step interrupted; project paused in `in_progress` state. | Character must repair or craft a new tool before resuming. |
| **Physical Exhaustion** | Energy reaches 0 during labor step | Construction halted; character collapses into sleep/rest. | Project sits unfinished; character stores memory of exhaustion. |
| **Magical Claim** | LLM claims object was spawned without steps | Complete rejection of world mutation. | Zero world state change; audit warning logged. |

---

## 4. API & Integration Contracts

The Causality Engine exposes methods invoked by the simulation orchestrator:

```typescript
export interface CausalityEngine {
  validateProjectProposal(characterId: string, spec: ObjectSpecification): ValidationResult;
  verifyStepExecution(characterId: string, projectId: string, currentStep: number): StepVerificationResult;
  finalizeConstruction(projectId: string): Promise<WorldObjectInstance>;
  rejectMagicalMutation(claim: unknown): void;
}
```

