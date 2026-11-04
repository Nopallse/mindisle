import { describe, it, expect, beforeEach } from 'vitest';
import {
  AgentDecisionProposalSchema,
  parseDecisionProposal,
} from '../src/ai/schemas/decision';
import { CausalityGateway } from '../src/simulation/causality/CausalityGateway';
import { Character } from '../src/simulation/entities/Character';
import { CollisionSystem } from '../src/simulation/navigation/CollisionSystem';
import { GridMap } from '../src/simulation/navigation/GridMap';
import { GeminiBrainClient } from '../src/ai/gemini/client';
import { AgentOrchestrator } from '../src/ai/orchestrator/AgentOrchestrator';
import { WorldState } from '../src/simulation/world/WorldState';
import { AgentDecisionProposal, AgentPerceptionContext } from '../src/types/ai';

describe('Phase 2 — Gemini Brain & Causality Gateway', () => {
  let gridMap: GridMap;
  let collisionSystem: CollisionSystem;
  let causalityGateway: CausalityGateway;
  let naufal: Character;
  let lauren: Character;

  beforeEach(() => {
    gridMap = new GridMap(30, 20, 32);
    collisionSystem = new CollisionSystem(gridMap);
    causalityGateway = CausalityGateway.getInstance();
    causalityGateway.clearProjects();

    naufal = new Character('naufal', 'Naufal', '#3b82f6', 10, 10, 32);
    lauren = new Character('lauren', 'Lauren', '#10b981', 14, 10, 32);
  });

  describe('1. Zod Decision Schema Validation', () => {
    it('should validate a compliant agent decision proposal', () => {
      const validProposal: AgentDecisionProposal = {
        schemaVersion: 2,
        requestId: 'req-test-123',
        characterId: 'naufal',
        internalThought: 'I feel like resting by the campfire after a long walk.',
        activeMotivation: 'Restore physical energy',
        simulatedEmotion: {
          valence: 0.4,
          arousal: 0.2,
          label: 'calm',
        },
        action: {
          type: 'MOVE',
          targetTile: { x: 11, y: 10 },
          dialogue: null,
        },
      };

      const result = parseDecisionProposal(validProposal);
      expect(result.success).toBe(true);
      expect(result.data?.requestId).toBe('req-test-123');
    });

    it('should reject invalid proposals with missing fields or out-of-range coordinates', () => {
      const invalidProposal = {
        schemaVersion: 2,
        characterId: 'naufal',
        // missing internalThought
        simulatedEmotion: {
          valence: 5.0, // Invalid: exceeds max 1.0
          arousal: 0.2,
          label: 'calm',
        },
        action: {
          type: 'INVALID_ACTION',
          targetTile: { x: 999, y: 999 }, // Invalid: outside 30x20
        },
      };

      const result = parseDecisionProposal(invalidProposal);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('2. Causality Gateway Invariant Enforcement', () => {
    it('Scenario A: Approves a valid action to an adjacent reachable tile', () => {
      const action = {
        type: 'MOVE' as const,
        targetTile: { x: 11, y: 10 },
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        targetPosition: { x: 11, y: 10 },
      });

      expect(result.valid).toBe(true);
      expect(result.code).toBe('OK');
      expect(result.auditEntry.result).toBe('APPROVED');
    });

    it('Scenario B: Rejects physical interaction when target is out of physical reach (>1.5 tiles)', () => {
      const action = {
        type: 'GATHER' as const,
        targetTile: { x: 18, y: 10 }, // 8 tiles away
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        targetPosition: { x: 18, y: 10 },
      });

      expect(result.valid).toBe(false);
      expect(result.code).toBe('OUT_OF_RANGE');
      expect(result.reason).toContain('out of physical reach');
    });

    it('Scenario C: Rejects an action when required tool is missing from character inventory', () => {
      const action = {
        type: 'GATHER' as const,
        interactionEntityId: 'oak_tree',
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        targetPosition: { x: 10, y: 11 },
        requiredTool: 'iron_axe',
        characterInventory: { wood_stick: 2 }, // No iron_axe
      });

      expect(result.valid).toBe(false);
      expect(result.code).toBe('MISSING_TOOL');
      expect(result.reason).toContain('iron_axe');
    });

    it('Scenario D: Rejects construction step without an active approved project', () => {
      const action = {
        type: 'CONSTRUCT_STEP' as const,
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        targetPosition: { x: 10, y: 11 },
        activeProjectId: 'non-existent-proj',
      });

      expect(result.valid).toBe(false);
      expect(result.code).toBe('NO_ACTIVE_PROJECT');
    });

    it('Scenario D: Rejects construction step if deposited materials are insufficient', () => {
      causalityGateway.registerProject({
        id: 'proj-chair-1',
        creatorId: 'naufal',
        proposal: {
          objectName: 'Wooden Stool',
          category: 'furniture',
          inspiration: 'Rest near campfire',
          estimatedMaterials: [{ materialId: 'wood_log', count: 3 }],
        },
        totalSteps: 3,
        completedSteps: 0,
        depositedMaterials: { wood_log: 1 }, // Needs 3, only has 1
        targetTile: { x: 10, y: 11 },
      });

      const action = {
        type: 'CONSTRUCT_STEP' as const,
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        targetPosition: { x: 10, y: 11 },
        activeProjectId: 'proj-chair-1',
      });

      expect(result.valid).toBe(false);
      expect(result.code).toBe('MISSING_MATERIALS');
    });

    it('Scenario H: Rejects direct uncaused magical creation declaration', () => {
      const action = {
        type: 'INSPECT' as const,
      };

      const result = causalityGateway.validateAction(naufal, action, collisionSystem, {
        isMagicalDeclaration: true,
      });

      expect(result.valid).toBe(false);
      expect(result.code).toBe('MAGICAL_CREATION_FORBIDDEN');
      expect(result.reason).toContain('Uncaused creation is forbidden');
    });
  });

  describe('3. Deterministic Fallback & Privacy Boundary', () => {
    it('produces safe deterministic proposals when running offline or without API key', async () => {
      const brainClient = new GeminiBrainClient(undefined, 'deterministic-test');
      const mockContext: AgentPerceptionContext = {
        characterId: 'naufal',
        name: 'Naufal',
        worldTime: { day: 1, hour: 14, minute: 30, isNight: false },
        currentPosition: { x: 10, y: 10, landmark: 'Campfire' },
        facingDirection: 'down',
        needs: { energy: 20, curiosity: 50, comfort: 40, sociability: 30 },
        emotionalState: { valence: 0.1, arousal: 0.2, label: 'weary' },
        inventory: [],
        visibleLandmarks: [{ name: 'Campfire', x: 12, y: 10, distance: 2 }],
        nearbyCharacters: [],
        nearbyObjects: [],
        recentMemories: ['Walked past the well.'],
        knownRecipes: [],
      };

      const decision = await brainClient.decide(mockContext);
      expect(decision.isFallback).toBe(true);
      expect(decision.proposal.schemaVersion).toBe(2);
      expect(decision.proposal.characterId).toBe('naufal');
      expect(decision.proposal.action.type).toBe('MOVE');
    });

    it('strictly preserves character memory and thought privacy', () => {
      const worldState = WorldState.getInstance();
      const orchestrator = AgentOrchestrator.getInstance();

      const naufalContext = orchestrator.buildPerceptionContext(naufal, worldState);
      const laurenContext = orchestrator.buildPerceptionContext(lauren, worldState);

      // Verify Naufal's context has only Naufal's identity and no private Lauren thought leaks
      expect(naufalContext.characterId).toBe('naufal');
      expect(laurenContext.characterId).toBe('lauren');
      expect(naufalContext.recentMemories.every((m) => !m.includes('Lauren internal thought'))).toBe(true);
      expect(laurenContext.recentMemories.every((m) => !m.includes('Naufal internal thought'))).toBe(true);
    });
  });
});
