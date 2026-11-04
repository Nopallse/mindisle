import { describe, it, expect, beforeEach } from 'vitest';
import { PerceptionSystem } from '../src/simulation/perception/PerceptionSystem';
import { DialogueSystem } from '../src/simulation/dialogue/DialogueSystem';
import { Character } from '../src/simulation/entities/Character';
import { GridMap } from '../src/simulation/navigation/GridMap';
import { EventBus } from '../src/simulation/events/EventBus';

describe('Phase 3 — Perception, Dialogue & Social Knowledge Transfer', () => {
  let gridMap: GridMap;
  let dialogueSystem: DialogueSystem;
  let eventBus: EventBus;
  let naufal: Character;
  let lauren: Character;

  beforeEach(() => {
    gridMap = new GridMap(30, 20, 32);
    dialogueSystem = DialogueSystem.getInstance();
    dialogueSystem.clearHistory();
    eventBus = EventBus.getInstance();

    naufal = new Character('naufal', 'Naufal', '#3b82f6', 10, 10, 32);
    lauren = new Character('lauren', 'Lauren', '#10b981', 13, 10, 32); // 3 tiles away
  });

  describe('1. Perception System Bounded Vision', () => {
    it('detects landmarks within 6 tiles and ignores landmarks beyond 6 tiles', () => {
      const landmarks = [
        { name: 'Campfire', x: 12, y: 10 }, // 2 tiles away (visible)
        { name: 'Far Pond', x: 22, y: 10 }, // 12 tiles away (invisible)
      ];

      const visible = PerceptionSystem.getVisibleEntities(naufal, [naufal, lauren], gridMap, landmarks);
      const landmarkNames = visible.filter((v) => v.type === 'landmark').map((v) => v.name);

      expect(landmarkNames).toContain('Campfire');
      expect(landmarkNames).not.toContain('Far Pond');
    });

    it('detects another character within 6 tiles and ignores distant characters', () => {
      // Lauren at (13, 10) is 3 tiles away
      const visibleClose = PerceptionSystem.getVisibleEntities(naufal, [naufal, lauren], gridMap, []);
      expect(visibleClose.some((c) => c.id === 'lauren')).toBe(true);

      // Move Lauren far away to (25, 10) (15 tiles away)
      lauren.tileX = 25;
      const visibleFar = PerceptionSystem.getVisibleEntities(naufal, [naufal, lauren], gridMap, []);
      expect(visibleFar.some((c) => c.id === 'lauren')).toBe(false);
    });
  });

  describe('2. Hearing Pipeline & Audibility Radius (4 tiles)', () => {
    it('allows a listener within 4 tiles to hear spoken dialogue', () => {
      naufal.tileX = 10;
      naufal.tileY = 10;
      lauren.tileX = 13;
      lauren.tileY = 10; // Distance 3.0 tiles (<= 4.0)

      const result = dialogueSystem.executeSpeech(naufal, 'Halo Lauren!', [naufal, lauren]);
      expect(result.executed).toBe(true);
      expect(result.listeners.some((l) => l.id === 'lauren')).toBe(true);
      expect(dialogueSystem.getHeardSpeech('lauren')).toContain('Naufal said: "Halo Lauren!"');
    });

    it('prevents a character outside hearing range (>4 tiles) from hearing speech', () => {
      naufal.tileX = 10;
      naufal.tileY = 10;
      lauren.tileX = 16;
      lauren.tileY = 10; // Distance 6.0 tiles (> 4.0)

      const result = dialogueSystem.executeSpeech(naufal, 'Bisa dengar saya?', [naufal, lauren]);
      expect(result.executed).toBe(true);
      expect(result.listeners.length).toBe(0);
      expect(dialogueSystem.getHeardSpeech('lauren').length).toBe(0);
    });

    it('enforces conversational cooldown to prevent rapid dialogue looping', () => {
      naufal.tileX = 10;
      naufal.tileY = 10;
      lauren.tileX = 12;
      lauren.tileY = 10;

      const first = dialogueSystem.executeSpeech(naufal, 'First message', [naufal, lauren]);
      expect(first.executed).toBe(true);

      // Immediate second message should be rejected due to cooldown
      const second = dialogueSystem.executeSpeech(naufal, 'Second immediate message', [naufal, lauren]);
      expect(second.executed).toBe(false);
      expect(second.reason).toContain('cooldown');
    });
  });

  describe('3. Scenario G — Social Knowledge Transfer & Privacy', () => {
    it('transfers environmental knowledge to a listener through spoken dialogue', () => {
      naufal.tileX = 10;
      naufal.tileY = 10;
      lauren.tileX = 12;
      lauren.tileY = 10;

      // Naufal tells Lauren about sakura blossoms near the pond
      dialogueSystem.executeSpeech(
        naufal,
        'Aku baru saja melihat bunga ceri mekar indah di dekat kolam air.',
        [naufal, lauren]
      );

      const laurenKnowledge = dialogueSystem.getCharacterKnowledge('lauren');
      expect(laurenKnowledge.length).toBeGreaterThan(0);
      expect(laurenKnowledge[0].subject).toBe('sakura_tree');
      expect(laurenKnowledge[0].source).toBe('heard_from_naufal');
      expect(laurenKnowledge[0].confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('never broadcasts private thoughts in the public dialogue event stream', () => {
      let broadcastText = '';
      const unsubscribe = eventBus.on('dialogueSpoken', (data: any) => {
        broadcastText = data.text;
      });

      const privateThought = 'I am secretly worried about our food supply.';
      const spokenSpeech = 'Cuaca hari ini cukup cerah ya!';

      dialogueSystem.executeSpeech(naufal, spokenSpeech, [naufal, lauren]);

      expect(broadcastText).toBe(spokenSpeech);
      expect(broadcastText).not.toContain(privateThought);
    });
  });
});
