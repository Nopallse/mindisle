import { CharacterId } from '../../types/character';
import { EpisodicMemory, SemanticReflection } from '../../types/memory';
import { MemoryRepository } from '../../firebase/repositories/MemoryRepository';
import { KnowledgeGraph } from '../knowledge/KnowledgeGraph';

export class MemoryConsolidator {
  private repository: MemoryRepository;

  constructor(repository?: MemoryRepository) {
    this.repository = repository || MemoryRepository.getInstance();
  }

  public async consolidateMemories(
    characterId: CharacterId,
    knowledgeGraph: KnowledgeGraph,
    minImportance = 5
  ): Promise<SemanticReflection | null> {
    const memories = await this.repository.getMemories(characterId, characterId, 30);
    const significantMemories = memories.filter((m) => m.importance >= minImportance);

    if (significantMemories.length < 2) {
      return null;
    }

    // Extract common themes, landmarks, and items
    const landmarks = Array.from(new Set(significantMemories.map((m) => m.location.landmark)));
    const topics = Array.from(new Set(significantMemories.flatMap((m) => m.tags)));

    const summary = `Reflective insight for ${characterId}: I have spent meaningful time around ${landmarks.join(
      ', '
    )}, primarily engaged with ${topics.join(', ')}. My understanding of this island continues to deepen.`;

    const reflection: SemanticReflection = {
      id: `refl-${characterId}-${Date.now()}`,
      characterId,
      summary,
      supportingMemoryIds: significantMemories.map((m) => m.id),
      importance: 7,
      createdAt: Date.now(),
    };

    await this.repository.saveReflection(reflection);

    // Reinforce knowledge graph based on repeated observations
    for (const landmark of landmarks) {
      knowledgeGraph.reinforceNode(landmark, 'significance', 0.1);
    }

    return reflection;
  }
}
