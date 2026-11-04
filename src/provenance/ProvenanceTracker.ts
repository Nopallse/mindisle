import { CharacterId } from '../types/character';
import { ObjectProvenance } from '../types/creative';

export class ProvenanceTracker {
  private static instance: ProvenanceTracker;
  private provenanceLog: Map<string, ObjectProvenance> = new Map();

  public static getInstance(): ProvenanceTracker {
    if (!ProvenanceTracker.instance) {
      ProvenanceTracker.instance = new ProvenanceTracker();
    }
    return ProvenanceTracker.instance;
  }

  public recordProvenance(provenance: ObjectProvenance): void {
    if (this.provenanceLog.has(provenance.objectId)) {
      throw new Error(`Immutable Error: Provenance for object '${provenance.objectId}' already recorded.`);
    }
    this.provenanceLog.set(provenance.objectId, Object.freeze({ ...provenance }));
  }

  public getProvenance(objectId: string): ObjectProvenance | undefined {
    return this.provenanceLog.get(objectId);
  }

  public getAllRecords(): ObjectProvenance[] {
    return Array.from(this.provenanceLog.values());
  }

  public getRecordsByCreator(creatorId: CharacterId): ObjectProvenance[] {
    return this.getAllRecords().filter((r) => r.creatorId === creatorId);
  }

  public clear(): void {
    this.provenanceLog.clear();
  }
}
