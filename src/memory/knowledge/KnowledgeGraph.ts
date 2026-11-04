import { CharacterId } from '../../types/character';
import { EpistemicNode, EpistemicNodeType } from '../../types/memory';

export class KnowledgeGraph {
  public readonly characterId: CharacterId;
  private nodes: Map<string, EpistemicNode> = new Map();

  constructor(characterId: CharacterId) {
    this.characterId = characterId;
  }

  public static determineType(confidence: number): EpistemicNodeType {
    if (confidence >= 0.9) return 'fact';
    if (confidence >= 0.5) return 'belief';
    return 'suspicion';
  }

  private makeKey(subject: string, predicate: string): string {
    return `${subject.toLowerCase()}::${predicate.toLowerCase()}`;
  }

  public addOrUpdateNode(
    subject: string,
    predicate: string,
    object: string,
    confidence: number,
    source: string
  ): EpistemicNode {
    const key = this.makeKey(subject, predicate);
    const clampedConfidence = Math.max(0.0, Math.min(1.0, confidence));
    const now = Date.now();

    const existing = this.nodes.get(key);
    if (existing) {
      existing.object = object;
      existing.confidence = clampedConfidence;
      existing.type = KnowledgeGraph.determineType(clampedConfidence);
      existing.source = source;
      existing.lastValidatedAt = now;
      return existing;
    }

    const newNode: EpistemicNode = {
      id: `node-${this.characterId}-${now}-${Math.random().toString(36).substring(2, 6)}`,
      characterId: this.characterId,
      subject,
      predicate,
      object,
      confidence: clampedConfidence,
      type: KnowledgeGraph.determineType(clampedConfidence),
      source,
      createdAt: now,
      lastValidatedAt: now,
    };

    this.nodes.set(key, newNode);
    return newNode;
  }

  public reinforceNode(subject: string, predicate: string, boost = 0.15): EpistemicNode | undefined {
    const key = this.makeKey(subject, predicate);
    const node = this.nodes.get(key);
    if (!node) return undefined;

    node.confidence = Math.min(1.0, node.confidence + boost);
    node.type = KnowledgeGraph.determineType(node.confidence);
    node.lastValidatedAt = Date.now();
    return node;
  }

  public contradictNode(subject: string, predicate: string, penalty = 0.3): EpistemicNode | undefined {
    const key = this.makeKey(subject, predicate);
    const node = this.nodes.get(key);
    if (!node) return undefined;

    node.confidence = Math.max(0.0, node.confidence - penalty);
    node.type = KnowledgeGraph.determineType(node.confidence);
    node.lastValidatedAt = Date.now();
    return node;
  }

  public getNode(subject: string, predicate: string): EpistemicNode | undefined {
    return this.nodes.get(this.makeKey(subject, predicate));
  }

  public getAllNodes(): EpistemicNode[] {
    return Array.from(this.nodes.values());
  }

  public getFacts(): EpistemicNode[] {
    return this.getAllNodes().filter((n) => n.type === 'fact');
  }

  public getBeliefs(): EpistemicNode[] {
    return this.getAllNodes().filter((n) => n.type === 'belief');
  }

  public getSuspicions(): EpistemicNode[] {
    return this.getAllNodes().filter((n) => n.type === 'suspicion');
  }

  public exportGraph(): EpistemicNode[] {
    return Array.from(this.nodes.values());
  }

  public loadGraph(nodes: EpistemicNode[]): void {
    this.nodes.clear();
    for (const node of nodes) {
      if (node.characterId === this.characterId) {
        this.nodes.set(this.makeKey(node.subject, node.predicate), { ...node });
      }
    }
  }

  public clear(): void {
    this.nodes.clear();
  }
}
