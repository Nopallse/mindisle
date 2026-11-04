import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryScorer } from '../src/memory/retrieval/MemoryScorer';
import { KnowledgeGraph } from '../src/memory/knowledge/KnowledgeGraph';
import { MemoryRepository } from '../src/firebase/repositories/MemoryRepository';
import { MemoryConsolidator } from '../src/memory/consolidation/MemoryConsolidator';
import { EpisodicMemory } from '../src/types/memory';

describe('Phase 4 — Persistent Memory & Firebase Firestore', () => {
  let memoryRepository: MemoryRepository;
  let naufalGraph: KnowledgeGraph;
  let laurenGraph: KnowledgeGraph;
  let consolidator: MemoryConsolidator;

  beforeEach(() => {
    memoryRepository = MemoryRepository.getInstance();
    memoryRepository.clearAll();

    naufalGraph = new KnowledgeGraph('naufal');
    laurenGraph = new KnowledgeGraph('lauren');
    consolidator = new MemoryConsolidator(memoryRepository);
  });

  describe('1. Contextual Memory Retrieval Algorithm', () => {
    it('applies exponential recency decay to older memories', () => {
      const recentMemory: EpisodicMemory = {
        id: 'mem-1',
        characterId: 'naufal',
        content: 'Saw firewood by the campfire.',
        importance: 5,
        emotionalValence: 0.2,
        timestamp: Date.now() - 3600 * 1000,
        worldDay: 1,
        worldHour: 10,
        location: { x: 12, y: 10, landmark: 'Campfire' },
        tags: ['campfire', 'wood'],
      };

      const oldMemory: EpisodicMemory = {
        id: 'mem-2',
        characterId: 'naufal',
        content: 'Saw firewood by the campfire.',
        importance: 5,
        emotionalValence: 0.2,
        timestamp: Date.now() - 86400 * 1000,
        worldDay: 1,
        worldHour: 1, // 9 hours earlier
        location: { x: 12, y: 10, landmark: 'Campfire' },
        tags: ['campfire', 'wood'],
      };

      const query = { currentDay: 1, currentHour: 11, keywords: ['campfire'] };
      const scoreRecent = MemoryScorer.calculateScore(recentMemory, query);
      const scoreOld = MemoryScorer.calculateScore(oldMemory, query);

      expect(scoreRecent).toBeGreaterThan(scoreOld);
    });

    it('ranks relevant keyword matches higher', () => {
      const irrelevantMem: EpisodicMemory = {
        id: 'mem-irr',
        characterId: 'naufal',
        content: 'Stood watching the clouds drift by in silence.',
        importance: 4,
        emotionalValence: 0.0,
        timestamp: Date.now(),
        worldDay: 1,
        worldHour: 8,
        location: { x: 5, y: 5, landmark: 'Wild Grass' },
        tags: ['clouds'],
      };

      const relevantMem: EpisodicMemory = {
        id: 'mem-rel',
        characterId: 'naufal',
        content: 'Found a stash of cobblestone near the pier.',
        importance: 4,
        emotionalValence: 0.4,
        timestamp: Date.now(),
        worldDay: 1,
        worldHour: 8,
        location: { x: 17, y: 14, landmark: 'Wooden Pier' },
        tags: ['cobblestone', 'pier'],
      };

      const ranked = MemoryScorer.rankMemories(
        [irrelevantMem, relevantMem],
        { currentDay: 1, currentHour: 8, keywords: ['cobblestone'] },
        2
      );

      expect(ranked[0].id).toBe('mem-rel');
    });
  });

  describe('2. Epistemic Knowledge Graph', () => {
    it('accurately categorizes facts, beliefs, and suspicions based on confidence', () => {
      naufalGraph.addOrUpdateNode('stone_well', 'resource', 'fresh_water', 0.95, 'observation');
      naufalGraph.addOrUpdateNode('pond', 'contains', 'rare_fish', 0.70, 'heard_from_lauren');
      naufalGraph.addOrUpdateNode('dark_forest', 'danger', 'wild_animals', 0.35, 'rumor');

      const facts = naufalGraph.getFacts();
      const beliefs = naufalGraph.getBeliefs();
      const suspicions = naufalGraph.getSuspicions();

      expect(facts.length).toBe(1);
      expect(facts[0].subject).toBe('stone_well');
      expect(facts[0].type).toBe('fact');

      expect(beliefs.length).toBe(1);
      expect(beliefs[0].subject).toBe('pond');
      expect(beliefs[0].type).toBe('belief');

      expect(suspicions.length).toBe(1);
      expect(suspicions[0].subject).toBe('dark_forest');
      expect(suspicions[0].type).toBe('suspicion');
    });

    it('promotes a belief to fact upon repeated reinforcement', () => {
      naufalGraph.addOrUpdateNode('campfire', 'safety', 'warmth', 0.80, 'observation');
      expect(naufalGraph.getNode('campfire', 'safety')?.type).toBe('belief');

      naufalGraph.reinforceNode('campfire', 'safety', 0.15); // 0.80 + 0.15 = 0.95 -> fact
      expect(naufalGraph.getNode('campfire', 'safety')?.type).toBe('fact');
      expect(naufalGraph.getNode('campfire', 'safety')?.confidence).toBeCloseTo(0.95);
    });

    it('demotes a belief upon contradictory evidence', () => {
      naufalGraph.addOrUpdateNode('dry_tree', 'drops', 'sweet_fruit', 0.60, 'guess');
      expect(naufalGraph.getNode('dry_tree', 'drops')?.type).toBe('belief');

      naufalGraph.contradictNode('dry_tree', 'drops', 0.25); // 0.60 - 0.25 = 0.35 -> suspicion
      expect(naufalGraph.getNode('dry_tree', 'drops')?.type).toBe('suspicion');
    });
  });

  describe('3. Character Privacy Boundary Enforcement', () => {
    it('throws a Privacy Violation when Naufal attempts to access Lauren private memories', async () => {
      await memoryRepository.saveMemory({
        id: 'lauren-secret-1',
        characterId: 'lauren',
        content: 'I want to build a flower garden near the pond tomorrow.',
        importance: 8,
        emotionalValence: 0.8,
        timestamp: Date.now(),
        worldDay: 1,
        worldHour: 14,
        location: { x: 20, y: 14, landmark: 'Water Pond' },
        tags: ['garden', 'plans'],
      });

      // Lauren querying her own memories succeeds
      const laurenMemories = await memoryRepository.getMemories('lauren', 'lauren');
      expect(laurenMemories.length).toBe(1);

      // Naufal querying Lauren's memories throws privacy violation
      await expect(memoryRepository.getMemories('lauren', 'naufal')).rejects.toThrow(
        /Privacy Violation/
      );
    });
  });

  describe('4. Scenario F — Simulation Restart Recall & Consolidation', () => {
    it('persists and restores episodic memories and knowledge graphs across sessions', async () => {
      // 1. Session 1: Characters accumulate memories and knowledge
      const session1Memory: EpisodicMemory = {
        id: 'naufal-exp-1',
        characterId: 'naufal',
        content: 'Crafted a sturdy wooden stick near the campfire.',
        importance: 7,
        emotionalValence: 0.6,
        timestamp: Date.now(),
        worldDay: 1,
        worldHour: 12,
        location: { x: 12, y: 10, landmark: 'Campfire' },
        tags: ['crafting', 'wood'],
      };

      await memoryRepository.saveMemory(session1Memory);

      naufalGraph.addOrUpdateNode('wood_log', 'yields', 'wood_stick', 0.95, 'personal_experiment');
      await memoryRepository.saveKnowledgeNodes('naufal', naufalGraph.exportGraph());

      // 2. Simulate Server Restart: New session with fresh instances
      const session2NaufalGraph = new KnowledgeGraph('naufal');
      const loadedNodes = await memoryRepository.getKnowledgeNodes('naufal', 'naufal');
      session2NaufalGraph.loadGraph(loadedNodes);

      const recalledMemories = await memoryRepository.getMemories('naufal', 'naufal');

      // 3. Verify accurate zero-loss recall
      expect(recalledMemories.length).toBe(1);
      expect(recalledMemories[0].content).toBe('Crafted a sturdy wooden stick near the campfire.');
      expect(session2NaufalGraph.getFacts().length).toBe(1);
      expect(session2NaufalGraph.getNode('wood_log', 'yields')?.type).toBe('fact');
    });

    it('consolidates clusters of significant memories into semantic reflections', async () => {
      await memoryRepository.saveMemory({
        id: 'mem-cons-1',
        characterId: 'naufal',
        content: 'Explored the pier and observed calm water waves.',
        importance: 6,
        emotionalValence: 0.5,
        timestamp: Date.now() - 5000,
        worldDay: 1,
        worldHour: 10,
        location: { x: 17, y: 14, landmark: 'Wooden Pier' },
        tags: ['pier', 'water'],
      });

      await memoryRepository.saveMemory({
        id: 'mem-cons-2',
        characterId: 'naufal',
        content: 'Found smooth river pebbles along the wooden pier shoreline.',
        importance: 7,
        emotionalValence: 0.6,
        timestamp: Date.now(),
        worldDay: 1,
        worldHour: 12,
        location: { x: 17, y: 14, landmark: 'Wooden Pier' },
        tags: ['pier', 'pebbles'],
      });

      const reflection = await consolidator.consolidateMemories('naufal', naufalGraph, 6);
      expect(reflection).not.toBeNull();
      expect(reflection?.summary).toContain('Wooden Pier');
      expect(reflection?.supportingMemoryIds.length).toBe(2);

      const savedReflections = await memoryRepository.getReflections('naufal', 'naufal');
      expect(savedReflections.length).toBe(1);
    });
  });
});
