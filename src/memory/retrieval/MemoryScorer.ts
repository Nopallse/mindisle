import { EpisodicMemory } from '../../types/memory';

export interface RetrievalQuery {
  currentDay: number;
  currentHour: number;
  keywords?: string[];
  locationLandmark?: string;
}

export class MemoryScorer {
  public static readonly WEIGHT_RECENCY = 0.35;
  public static readonly WEIGHT_IMPORTANCE = 0.35;
  public static readonly WEIGHT_RELEVANCE = 0.30;
  public static readonly DECAY_LAMBDA = 0.05; // ~5% decay per simulation hour

  public static calculateScore(memory: EpisodicMemory, query: RetrievalQuery): number {
    // 1. Recency Decay Score
    const memoryElapsedHours =
      (query.currentDay - memory.worldDay) * 24 + (query.currentHour - memory.worldHour);
    const elapsedHours = Math.max(0, memoryElapsedHours);
    const recencyScore = Math.exp(-MemoryScorer.DECAY_LAMBDA * elapsedHours);

    // 2. Normalized Importance Score (1-10 -> 0.1-1.0)
    const importanceScore = Math.min(1.0, Math.max(0.1, memory.importance / 10));

    // 3. Relevance Score
    let relevanceScore = 0.0;
    if (query.keywords && query.keywords.length > 0) {
      const memoryTokens = (memory.content.toLowerCase() + ' ' + memory.tags.join(' ')).split(/\s+/);
      let matchCount = 0;
      for (const kw of query.keywords) {
        const lowerKw = kw.toLowerCase();
        if (memoryTokens.some((t) => t.includes(lowerKw))) {
          matchCount++;
        }
      }
      relevanceScore = matchCount / query.keywords.length;
    } else {
      // Default baseline relevance if no specific keyword query provided
      relevanceScore = 0.5;
    }

    if (query.locationLandmark && memory.location.landmark === query.locationLandmark) {
      relevanceScore = Math.min(1.0, relevanceScore + 0.25);
    }

    // Weighted composite score
    return (
      MemoryScorer.WEIGHT_RECENCY * recencyScore +
      MemoryScorer.WEIGHT_IMPORTANCE * importanceScore +
      MemoryScorer.WEIGHT_RELEVANCE * relevanceScore
    );
  }

  public static rankMemories(
    memories: EpisodicMemory[],
    query: RetrievalQuery,
    limit: number = 5
  ): EpisodicMemory[] {
    const scored = memories.map((m) => ({
      memory: m,
      score: MemoryScorer.calculateScore(m, query),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.memory);
  }
}
