import { CharacterId } from '../../types/character';
import { ObjectSpecification, ObjectProvenance } from '../../types/creative';
import { ProvenanceTracker } from '../../provenance/ProvenanceTracker';

export type ProjectStatus = 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ConstructionProject {
  id: string;
  creatorId: CharacterId;
  specification: ObjectSpecification;
  location: { x: number; y: number };
  motivation: string;
  inspiration: string;
  status: ProjectStatus;
  totalSteps: number;
  completedSteps: number;
  depositedMaterials: Record<string, number>;
  createdAt: number;
  completedAt?: number;
}

export class ConstructionProjectManager {
  private static instance: ConstructionProjectManager;
  private projects: Map<string, ConstructionProject> = new Map();
  private provenanceTracker: ProvenanceTracker;

  constructor() {
    this.provenanceTracker = ProvenanceTracker.getInstance();
  }

  public static getInstance(): ConstructionProjectManager {
    if (!ConstructionProjectManager.instance) {
      ConstructionProjectManager.instance = new ConstructionProjectManager();
    }
    return ConstructionProjectManager.instance;
  }

  public clearProjects(): void {
    this.projects.clear();
  }

  public proposeProject(
    creatorId: CharacterId,
    specification: ObjectSpecification,
    location: { x: number; y: number },
    motivation: string,
    inspiration: string
  ): ConstructionProject {
    const id = `proj-${creatorId}-${Date.now()}`;
    const totalSteps = specification.materials.reduce((acc, m) => acc + m.count, 0) + 1;

    const project: ConstructionProject = {
      id,
      creatorId,
      specification,
      location,
      motivation,
      inspiration,
      status: 'APPROVED',
      totalSteps,
      completedSteps: 0,
      depositedMaterials: {},
      createdAt: Date.now(),
    };

    this.projects.set(id, project);
    return project;
  }

  public depositMaterials(projectId: string, materialId: string, count: number): boolean {
    const project = this.projects.get(projectId);
    if (!project || project.status === 'COMPLETED' || project.status === 'CANCELLED') {
      return false;
    }

    const current = project.depositedMaterials[materialId] || 0;
    project.depositedMaterials[materialId] = current + count;
    project.status = 'IN_PROGRESS';
    return true;
  }

  public performConstructionStep(
    projectId: string,
    currentDay: number,
    currentHour: number
  ): { complete: boolean; progress: number; provenance?: ObjectProvenance } {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found.`);
    }

    project.completedSteps += 1;
    const progress = Math.min(1.0, project.completedSteps / project.totalSteps);

    if (project.completedSteps >= project.totalSteps) {
      project.status = 'COMPLETED';
      project.completedAt = Date.now();

      const objectId = `obj-${project.creatorId}-${Date.now()}`;
      const provenance: ObjectProvenance = {
        objectId,
        objectName: project.specification.name,
        creatorId: project.creatorId,
        inspiration: project.inspiration,
        motivation: project.motivation,
        materialsUsed: project.specification.materials,
        location: { ...project.location },
        completedAtDay: currentDay,
        completedAtHour: currentHour,
        assetId: `asset-${project.specification.name.toLowerCase().replace(/\s+/g, '_')}`,
        version: 1,
      };

      this.provenanceTracker.recordProvenance(provenance);
      return { complete: true, progress: 1.0, provenance };
    }

    return { complete: false, progress };
  }

  public getProject(id: string): ConstructionProject | undefined {
    return this.projects.get(id);
  }
}
