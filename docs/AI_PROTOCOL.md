# EDEN — AI Agent Protocol

## Agent Isolation

Naufal and Lauren are separate AI agents.

Each agent has its own:

- System instruction.
- Personality.
- Memory namespace.
- Goals.
- State.
- Decision history.

Shared world facts are passed as observations.

They do not share hidden cognition.

## Decision Output

Use a versioned JSON schema.

Example:

{
"schemaVersion": 1,
"internalThought": "I noticed Lauren near the flowers and want to greet her.",
"emotion": {
"label": "curious",
"intensity": 0.55
},
"action": {
"type": "move_to",
"target": {
"x": 12,
"y": 8
}
},
"speech": null,
"goalUpdate": {
"type": "keep",
"description": null
},
"memoryCandidates": [
{
"content": "I noticed Lauren near the flowers.",
"importance": 0.35,
"kind": "observation"
}
]
}

This is a conceptual contract.

Implement the actual Zod schema and adjust it to the selected Gemini structured-output capabilities.

## Output Rules

1. Internal thought is private.
2. Internal thought must never automatically become spoken dialogue.
3. Speech becomes public only after execution.
4. Memory candidates must be grounded in actual observations.
5. Only supported actions are allowed.
6. Coordinates must be inside map boundaries.
7. Characters cannot bypass collision.
8. Characters cannot modify another character's private state.
9. Empty or null speech is valid.
10. Invalid output must be rejected.

## Memory Quality

Store memories from:

- Real observations.
- Executed actions.
- Public events the character could perceive.

Prefer compact and meaningful episodic records.

Include:

- Character ownership.
- Source event.
- Timestamp.
- Location.
- Importance.
- Visibility/access metadata.

## Decision Prompting

Ask the agent to:

1. Consider current needs.
2. Consider active goals.
3. Use only supplied observations.
4. Retrieve relevant memories.
5. Choose one immediate action.
6. Avoid repeating failed actions.
7. Speak only when appropriate.
8. Return structured output only.

Do not ask the model to generate arbitrary code.
