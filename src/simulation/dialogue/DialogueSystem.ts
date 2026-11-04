import { CharacterId } from '../../types/character';
import { Character } from '../entities/Character';
import { PerceptionSystem } from '../perception/PerceptionSystem';
import { EventBus } from '../events/EventBus';

export interface DialogueEventData {
  speakerId: CharacterId;
  speakerName: string;
  text: string;
  listenerIds: CharacterId[];
  speakerPosition: { x: number; y: number };
  timestamp: number;
}

export interface SocialKnowledgeItem {
  subject: string;
  predicate: string;
  object: string;
  source: string;
  confidence: number;
}

export class DialogueSystem {
  private static instance: DialogueSystem;
  private eventBus: EventBus;
  private lastSpokenTime: Map<CharacterId, number> = new Map();
  private speechCooldownMs = 3000; // 3 seconds cooldown between speeches
  private recentConversations: DialogueEventData[] = [];
  private characterHeardSpeech: Map<CharacterId, string[]> = new Map();
  private characterKnowledge: Map<CharacterId, SocialKnowledgeItem[]> = new Map();

  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  public static getInstance(): DialogueSystem {
    if (!DialogueSystem.instance) {
      DialogueSystem.instance = new DialogueSystem();
    }
    return DialogueSystem.instance;
  }

  public getHeardSpeech(characterId: CharacterId): string[] {
    return this.characterHeardSpeech.get(characterId) || [];
  }

  public getCharacterKnowledge(characterId: CharacterId): SocialKnowledgeItem[] {
    return this.characterKnowledge.get(characterId) || [];
  }

  public getRecentConversations(): ReadonlyArray<DialogueEventData> {
    return this.recentConversations;
  }

  public clearHistory(): void {
    this.recentConversations = [];
    this.lastSpokenTime.clear();
    this.characterHeardSpeech.clear();
    this.characterKnowledge.clear();
  }

  public executeSpeech(
    speaker: Character,
    dialogueText: string,
    allCharacters: Character[]
  ): { executed: boolean; listeners: Character[]; reason?: string } {
    const now = Date.now();
    const lastTime = this.lastSpokenTime.get(speaker.id) || 0;

    // Conversational cooldown check
    if (now - lastTime < this.speechCooldownMs) {
      return {
        executed: false,
        listeners: [],
        reason: `Conversational cooldown active (${((this.speechCooldownMs - (now - lastTime)) / 1000).toFixed(1)}s remaining).`,
      };
    }

    // Determine listeners who are physically within hearing radius (<= 4 tiles)
    const listeners: Character[] = [];
    for (const other of allCharacters) {
      if (other.id === speaker.id) continue;
      if (PerceptionSystem.isWithinHearingRange(speaker, other)) {
        listeners.push(other);
      }
    }

    this.lastSpokenTime.set(speaker.id, now);

    const eventData: DialogueEventData = {
      speakerId: speaker.id,
      speakerName: speaker.name,
      text: dialogueText,
      listenerIds: listeners.map((l) => l.id),
      speakerPosition: { x: speaker.tileX, y: speaker.tileY },
      timestamp: now,
    };

    this.recentConversations.push(eventData);

    // Record heard speech and learned social knowledge for each listener
    const learnedKnowledge = this.extractSocialKnowledge(dialogueText, speaker.name);
    for (const listener of listeners) {
      const heard = this.characterHeardSpeech.get(listener.id) || [];
      heard.push(`${speaker.name} said: "${dialogueText}"`);
      if (heard.length > 5) heard.shift();
      this.characterHeardSpeech.set(listener.id, heard);

      if (learnedKnowledge.length > 0) {
        const existingKnowledge = this.characterKnowledge.get(listener.id) || [];
        for (const item of learnedKnowledge) {
          if (!existingKnowledge.some((k) => k.subject === item.subject && k.predicate === item.predicate)) {
            existingKnowledge.push(item);
          }
        }
        this.characterKnowledge.set(listener.id, existingKnowledge);
      }
    }

    // Emit dialogue spoken event for Phaser speech bubbles and observer UI
    this.eventBus.emit('dialogueSpoken', eventData);

    // Emit standard simulation event
    this.eventBus.emit('worldEvent', {
      id: `dialogue-${now}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      type: 'DIALOGUE',
      description: `${speaker.name}: "${dialogueText}"`,
      characterId: speaker.id,
    });

    return {
      executed: true,
      listeners,
    };
  }

  /**
   * Scenario G: Extracts knowledge statements from dialogue for social learning
   */
  public extractSocialKnowledge(dialogueText: string, speakerName: string): SocialKnowledgeItem[] {
    const knowledgeItems: SocialKnowledgeItem[] = [];
    const lower = dialogueText.toLowerCase();

    // Check for cherry blossom / sakura mention
    if (lower.includes('ceri') || lower.includes('sakura') || lower.includes('bunga')) {
      knowledgeItems.push({
        subject: 'sakura_tree',
        predicate: 'location',
        object: 'near_pond',
        source: `heard_from_${speakerName.toLowerCase()}`,
        confidence: 0.85,
      });
    }

    // Check for campfire mention
    if (lower.includes('api unggun') || lower.includes('campfire')) {
      knowledgeItems.push({
        subject: 'campfire',
        predicate: 'status',
        object: 'warm_and_safe',
        source: `heard_from_${speakerName.toLowerCase()}`,
        confidence: 0.9,
      });
    }

    // Check for water / well mention
    if (lower.includes('sumur') || lower.includes('air') || lower.includes('well')) {
      knowledgeItems.push({
        subject: 'stone_well',
        predicate: 'resource',
        object: 'fresh_water',
        source: `heard_from_${speakerName.toLowerCase()}`,
        confidence: 0.9,
      });
    }

    return knowledgeItems;
  }
}
