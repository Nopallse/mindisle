import { CharacterId } from '../../types/character';
import { AgentPerceptionContext, AgentDecisionProposal } from '../../types/ai';
import { WorldState } from '../../simulation/world/WorldState';
import { Character } from '../../simulation/entities/Character';
import { CausalityGateway } from '../../simulation/causality/CausalityGateway';
import { GeminiBrainClient, IGeminiClient } from '../gemini/client';

export interface DeliberationTelemetry {
  characterId: CharacterId;
  requestId: string;
  latencyMs: number;
  model: string;
  isFallback: boolean;
  actionType: string;
  causalityValid: boolean;
  causalityCode: string;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private client: IGeminiClient;
  private causalityGateway: CausalityGateway;
  private activeDeliberations = new Set<CharacterId>();
  private deliberationIntervalMs = 6000; // Deliberate every 6-8 seconds per character
  private timers = new Map<CharacterId, number>();
  private latestTelemetry = new Map<CharacterId, DeliberationTelemetry>();

  constructor(client?: IGeminiClient) {
    this.client = client || new GeminiBrainClient();
    this.causalityGateway = CausalityGateway.getInstance();
  }

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  public getLatestTelemetry(characterId: CharacterId): DeliberationTelemetry | undefined {
    return this.latestTelemetry.get(characterId);
  }

  public update(deltaMs: number, worldState: WorldState): void {
    for (const [charId, character] of worldState.characters.entries()) {
      // Don't deliberate if character is actively interpolating movement
      if (character.targetTile) {
        continue;
      }

      // Check timer
      const currentTimer = (this.timers.get(charId) || 0) + deltaMs;
      this.timers.set(charId, currentTimer);

      if (currentTimer >= this.deliberationIntervalMs && !this.activeDeliberations.has(charId)) {
        this.timers.set(charId, 0);
        this.triggerDeliberation(character, worldState);
      }
    }
  }

  public async triggerDeliberation(
    character: Character,
    worldState: WorldState
  ): Promise<AgentDecisionProposal | null> {
    const charId = character.id;
    if (this.activeDeliberations.has(charId)) {
      return null;
    }

    this.activeDeliberations.add(charId);

    try {
      const context = this.buildPerceptionContext(character, worldState);
      const decisionResult = await this.client.decide(context);
      const proposal = decisionResult.proposal;

      // Validate through Causality Gateway
      const validation = this.causalityGateway.validateAction(
        character,
        proposal.action,
        worldState.collisionSystem,
        {
          targetPosition: proposal.action.targetTile,
        }
      );

      // Record Telemetry
      this.latestTelemetry.set(charId, {
        characterId: charId,
        requestId: proposal.requestId,
        latencyMs: decisionResult.latencyMs,
        model: decisionResult.model,
        isFallback: decisionResult.isFallback,
        actionType: proposal.action.type,
        causalityValid: validation.valid,
        causalityCode: validation.code,
      });

      if (validation.valid) {
        // Execute validated action in world simulation
        this.applyValidatedAction(character, proposal, worldState);
      } else {
        worldState.eventBus.emit('worldEvent', {
          id: `causality-${Date.now()}`,
          timestamp: Date.now(),
          type: 'CAUSALITY_VIOLATION',
          description: `[Causality Gateway] Blocked ${character.name}'s action ${proposal.action.type}: ${validation.reason}`,
          characterId: charId,
        });
      }

      return proposal;
    } finally {
      this.activeDeliberations.delete(charId);
    }
  }

  public buildPerceptionContext(
    character: Character,
    worldState: WorldState
  ): AgentPerceptionContext {
    const clock = worldState.clock.getTime();
    const landmarks = [
      { name: 'Campfire', x: 12, y: 10 },
      { name: 'Stone Well', x: 7, y: 5 },
      { name: 'Fenced Garden', x: 22, y: 5 },
      { name: 'Water Pond', x: 20, y: 14 },
      { name: 'Wooden Pier', x: 17, y: 14 },
    ];

    // Calculate nearest landmark
    let nearestLandmark = 'Wild Grass';
    let minLandmarkDist = Infinity;
    const visibleLandmarks = landmarks.map((l) => {
      const dist = Math.hypot(l.x - character.tileX, l.y - character.tileY);
      if (dist < minLandmarkDist) {
        minLandmarkDist = dist;
        nearestLandmark = l.name;
      }
      return { ...l, distance: dist };
    });

    // Nearby characters (excluding self) within vision radius of 8 tiles
    const nearbyCharacters: AgentPerceptionContext['nearbyCharacters'] = [];
    for (const [otherId, otherChar] of worldState.characters.entries()) {
      if (otherId === character.id) continue;
      const dist = Math.hypot(otherChar.tileX - character.tileX, otherChar.tileY - character.tileY);
      if (dist <= 8) {
        nearbyCharacters.push({
          name: otherChar.name,
          x: otherChar.tileX,
          y: otherChar.tileY,
          distance: dist,
          activity: otherChar.activity,
        });
      }
    }

    return {
      characterId: character.id,
      name: character.name,
      worldTime: {
        day: clock.day,
        hour: clock.hour,
        minute: clock.minute,
        isNight: clock.hour < 6 || clock.hour >= 20,
      },
      currentPosition: {
        x: character.tileX,
        y: character.tileY,
        landmark: nearestLandmark,
      },
      facingDirection: character.direction,
      needs: {
        energy: character.attributes.energy,
        curiosity: character.attributes.curiosity,
        comfort: 80,
        sociability: character.attributes.sociability,
      },
      emotionalState: {
        valence: 0.3,
        arousal: 0.2,
        label: 'calm',
      },
      inventory: [],
      visibleLandmarks,
      nearbyCharacters,
      nearbyObjects: [],
      recentMemories: [
        `Woke up near ${nearestLandmark} on Day ${clock.day}.`,
      ],
      knownRecipes: ['wood_stick', 'stone_mortar'],
    };
  }

  private applyValidatedAction(
    character: Character,
    proposal: AgentDecisionProposal,
    worldState: WorldState
  ): void {
    const action = proposal.action;

    // Log character internal thought to event stream for observers
    worldState.eventBus.emit('worldEvent', {
      id: `thought-${Date.now()}`,
      timestamp: Date.now(),
      type: 'AGENT_THOUGHT',
      description: `${character.name} reflects: "${proposal.internalThought}"`,
      characterId: character.id,
    });

    if (action.type === 'MOVE' && action.targetTile) {
      // Find walkable neighbor or direct step
      const neighbors = worldState.collisionSystem.getWalkableNeighbors(
        character.tileX,
        character.tileY
      );
      if (neighbors.length > 0) {
        // Choose neighbor closest to target tile
        neighbors.sort((a, b) => {
          const distA = Math.hypot(a.x - action.targetTile!.x, a.y - action.targetTile!.y);
          const distB = Math.hypot(b.x - action.targetTile!.x, b.y - action.targetTile!.y);
          return distA - distB;
        });
        character.startMoveTo(neighbors[0].x, neighbors[0].y, neighbors[0].dir);
      }
    } else if (action.type === 'SPEAK' && action.dialogue) {
      character.activity = 'speaking';
      worldState.eventBus.emit('worldEvent', {
        id: `dialogue-${Date.now()}`,
        timestamp: Date.now(),
        type: 'DIALOGUE',
        description: `${character.name}: "${action.dialogue}"`,
        characterId: character.id,
      });
    } else if (action.type === 'INSPECT') {
      character.activity = 'inspecting';
      worldState.eventBus.emit('worldEvent', {
        id: `inspect-${Date.now()}`,
        timestamp: Date.now(),
        type: 'INSPECTION',
        description: `${character.name} is inspecting surroundings with motivation: ${proposal.activeMotivation}`,
        characterId: character.id,
      });
    }
  }
}
