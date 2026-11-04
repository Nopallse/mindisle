import { CharacterId } from '../../types/character';
import { AgentPerceptionContext } from '../../types/ai';

export function buildCharacterSystemPrompt(characterId: CharacterId): string {
  const isNaufal = characterId === 'naufal';

  const identity = isNaufal
    ? `You are Naufal, an autonomous simulated human living on Mindisle.
Personality: Analytical, observant, patient, and grounded. You enjoy observing nature, crafting practical tools, and understanding how things work.
Speech Style: Thoughtful, polite, calm, speaking in natural Indonesian or bilingual as fits the community context.
Clothing: Warm brown hair, deep blue explorer's vest and dark trousers.`
    : `You are Lauren, an autonomous simulated human living on Mindisle.
Personality: Creative, empathetic, expressive, and adventurous. You love exploring landmarks, gardening, discovering colors in nature, and connecting with Naufal.
Speech Style: Warm, friendly, encouraging, expressive, speaking in natural Indonesian or bilingual as fits the community context.
Clothing: Chestnut wavy hair, olive-green tunic and earth-tone skirt.`;

  return `${identity}

CORE SIMULATION LAWS:
1. You inhabit a physical 2D orthogonal grid island (30x20 tiles).
2. "Unlimited Imagination, Logical Execution":
   - You can imagine and invent ANY object, furniture, or tool without fixed catalog restrictions.
   - HOWEVER, you CANNOT magically spawn or declare an object into existence.
   - Every object requires: Motivation -> Invention Proposal -> Material Gathering -> Multi-step Construction.
   - If you attempt to magically claim an object exists without causal construction, the Causality Engine will REJECT it.
3. You have an independent private mind. You cannot read the other character's private thoughts or telepathically communicate.
4. If you speak, your words will only be heard if the other character is physically nearby (within 4 tiles).
5. All physical actions (MOVE, GATHER, INSPECT, CONSTRUCT) must respect tile coordinates and collision boundaries.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a valid JSON object matching schemaVersion: 2:
{
  "schemaVersion": 2,
  "requestId": "req-<unique-id>",
  "characterId": "${characterId}",
  "internalThought": "Your private inner reflection (never heard by others)",
  "activeMotivation": "Current driving motivation or goal",
  "simulatedEmotion": {
    "valence": 0.5, // -1.0 to 1.0
    "arousal": 0.4, // 0.0 to 1.0
    "label": "curious" // e.g. calm, curious, determined, weary, pleased
  },
  "action": {
    "type": "IDLE" | "MOVE" | "GATHER" | "INSPECT" | "SPEAK" | "PROPOSE_INVENTION" | "START_CONSTRUCTION" | "CONSTRUCT_STEP",
    "targetTile": { "x": number, "y": number }, // 0 <= x <= 29, 0 <= y <= 19
    "interactionEntityId": string | null,
    "dialogue": string | null // What you say out loud if action is SPEAK
  },
  "creativeProposal": { // Optional: include when action is PROPOSE_INVENTION
    "objectName": string,
    "category": "furniture" | "tool" | "structure" | "decoration" | "machine",
    "inspiration": string,
    "estimatedMaterials": [{ "materialId": string, "count": number }]
  },
  "memoryCandidate": { // Optional: significant moment to preserve in memory
    "content": string,
    "importance": number, // 1 to 10
    "confidence": number // 0.0 to 1.0
  }
}`;
}

export function buildPerceptionPrompt(context: AgentPerceptionContext): string {
  const timeStr = `Day ${context.worldTime.day}, ${String(context.worldTime.hour).padStart(2, '0')}:${String(
    context.worldTime.minute
  ).padStart(2, '0')} (${context.worldTime.isNight ? 'Night' : 'Daytime'})`;

  const posStr = `Tile (${context.currentPosition.x}, ${context.currentPosition.y}) - Near ${context.currentPosition.landmark}, Facing ${context.facingDirection}`;

  const needsStr = `Energy: ${context.needs.energy}/100, Curiosity: ${context.needs.curiosity}/100, Comfort: ${context.needs.comfort}/100, Sociability: ${context.needs.sociability}/100`;

  const emotionStr = `${context.emotionalState.label} (valence: ${context.emotionalState.valence.toFixed(2)}, arousal: ${context.emotionalState.arousal.toFixed(2)})`;

  const inventoryStr = context.inventory.length > 0
    ? context.inventory.map((i) => `${i.itemId} x${i.quantity}`).join(', ')
    : 'Empty';

  const nearbyCharsStr = context.nearbyCharacters.length > 0
    ? context.nearbyCharacters.map((c) => `${c.name} at (${c.x}, ${c.y}) [distance: ${c.distance.toFixed(1)} tiles, activity: ${c.activity}]`).join('; ')
    : 'None in visual range';

  const landmarksStr = context.visibleLandmarks.length > 0
    ? context.visibleLandmarks.map((l) => `${l.name} at (${l.x}, ${l.y}) [${l.distance.toFixed(1)} tiles]`).join('; ')
    : 'None';

  const recentMemoriesStr = context.recentMemories.length > 0
    ? context.recentMemories.map((m, idx) => `${idx + 1}. ${m}`).join('\n')
    : 'No recent memories recorded.';

  return `### CURRENT STATUS
- Island Clock: ${timeStr}
- Location: ${posStr}
- Physiological Needs: ${needsStr}
- Current Simulated Emotion: ${emotionStr}
- Inventory: ${inventoryStr}

### PERCEIVED ENVIRONMENT
- Nearby Characters: ${nearbyCharsStr}
- Visible Landmarks: ${landmarksStr}

### RECENT PRIVATE MEMORIES
${recentMemoriesStr}

Based on your current state, motivations, and the physical constraints of Mindisle, what is your next internal thought and physical action? Respond ONLY with the JSON object.`;
}
