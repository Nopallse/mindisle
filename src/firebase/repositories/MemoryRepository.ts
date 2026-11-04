import { CharacterId } from '../../types/character';
import { EpisodicMemory, EpistemicNode, SemanticReflection } from '../../types/memory';
import { getFirebaseConfig } from '../config';

export class MemoryRepository {
  private static instance: MemoryRepository;

  // In-memory backing stores for local deterministic simulation and test verification
  private episodicStore: Map<CharacterId, Map<string, EpisodicMemory>> = new Map();
  private knowledgeStore: Map<CharacterId, Map<string, EpistemicNode>> = new Map();
  private reflectionStore: Map<CharacterId, Map<string, SemanticReflection>> = new Map();

  constructor() {
    this.episodicStore.set('naufal', new Map());
    this.episodicStore.set('lauren', new Map());
    this.knowledgeStore.set('naufal', new Map());
    this.knowledgeStore.set('lauren', new Map());
    this.reflectionStore.set('naufal', new Map());
    this.reflectionStore.set('lauren', new Map());
  }

  public static getInstance(): MemoryRepository {
    if (!MemoryRepository.instance) {
      MemoryRepository.instance = new MemoryRepository();
    }
    return MemoryRepository.instance;
  }

  public clearAll(): void {
    for (const map of this.episodicStore.values()) map.clear();
    for (const map of this.knowledgeStore.values()) map.clear();
    for (const map of this.reflectionStore.values()) map.clear();
  }

  /**
   * Asserts character privacy: character A cannot read character B's private thoughts or memories
   */
  private assertPrivacy(targetId: CharacterId, accessorId: CharacterId): void {
    if (accessorId !== targetId) {
      throw new Error(
        `Privacy Violation: Character '${accessorId}' attempted to access private memories of character '${targetId}'.`
      );
    }
  }

  public async saveMemory(memory: EpisodicMemory): Promise<void> {
    const charStore = this.episodicStore.get(memory.characterId);
    if (charStore) {
      charStore.set(memory.id, { ...memory });
    }
  }

  public async getMemories(
    targetCharacterId: CharacterId,
    accessorId: CharacterId,
    limit: number = 20
  ): Promise<EpisodicMemory[]> {
    this.assertPrivacy(targetCharacterId, accessorId);

    const charStore = this.episodicStore.get(targetCharacterId);
    if (!charStore) return [];

    const list = Array.from(charStore.values());
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list.slice(0, limit);
  }

  public async saveKnowledgeNodes(characterId: CharacterId, nodes: EpistemicNode[]): Promise<void> {
    const charStore = this.knowledgeStore.get(characterId);
    if (!charStore) return;

    for (const node of nodes) {
      charStore.set(node.id, { ...node });
    }
  }

  public async getKnowledgeNodes(
    targetCharacterId: CharacterId,
    accessorId: CharacterId
  ): Promise<EpistemicNode[]> {
    this.assertPrivacy(targetCharacterId, accessorId);

    const charStore = this.knowledgeStore.get(targetCharacterId);
    if (!charStore) return [];

    return Array.from(charStore.values());
  }

  public async saveReflection(reflection: SemanticReflection): Promise<void> {
    const charStore = this.reflectionStore.get(reflection.characterId);
    if (charStore) {
      charStore.set(reflection.id, { ...reflection });
    }
  }

  public async getReflections(
    targetCharacterId: CharacterId,
    accessorId: CharacterId
  ): Promise<SemanticReflection[]> {
    this.assertPrivacy(targetCharacterId, accessorId);

    const charStore = this.reflectionStore.get(targetCharacterId);
    if (!charStore) return [];

    const list = Array.from(charStore.values());
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }
}
