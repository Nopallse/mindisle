import { Character } from '../entities/Character';
import { ProposedAction, CreativeProposal } from '../../types/ai';
import { CollisionSystem } from '../navigation/CollisionSystem';

export interface CausalityAuditRecord {
  id: string;
  timestamp: number;
  characterId: string;
  actionType: string;
  result: 'APPROVED' | 'REJECTED';
  reasonCode: string;
  details: string;
}

export interface CausalityValidationResult {
  valid: boolean;
  code:
    | 'OK'
    | 'OUT_OF_RANGE'
    | 'MISSING_TOOL'
    | 'MISSING_MATERIALS'
    | 'NO_ACTIVE_PROJECT'
    | 'MAGICAL_CREATION_FORBIDDEN'
    | 'COLLISION_BLOCKED'
    | 'INVALID_ACTION';
  reason?: string;
  auditEntry: CausalityAuditRecord;
}

export interface ActiveConstructionProject {
  id: string;
  creatorId: string;
  proposal: CreativeProposal;
  totalSteps: number;
  completedSteps: number;
  depositedMaterials: Record<string, number>;
  targetTile: { x: number; y: number };
}

export class CausalityGateway {
  private static instance: CausalityGateway;
  private auditLog: CausalityAuditRecord[] = [];
  private activeProjects: Map<string, ActiveConstructionProject> = new Map();

  public static getInstance(): CausalityGateway {
    if (!CausalityGateway.instance) {
      CausalityGateway.instance = new CausalityGateway();
    }
    return CausalityGateway.instance;
  }

  public getAuditHistory(): ReadonlyArray<CausalityAuditRecord> {
    return this.auditLog;
  }

  public registerProject(project: ActiveConstructionProject): void {
    this.activeProjects.set(project.id, project);
  }

  public getProject(projectId: string): ActiveConstructionProject | undefined {
    return this.activeProjects.get(projectId);
  }

  public clearProjects(): void {
    this.activeProjects.clear();
  }

  public validateAction(
    character: Character,
    action: ProposedAction,
    collisionSystem: CollisionSystem,
    context?: {
      targetPosition?: { x: number; y: number };
      requiredTool?: string;
      characterInventory?: Record<string, number>;
      activeProjectId?: string;
      isMagicalDeclaration?: boolean;
    }
  ): CausalityValidationResult {
    const timestamp = Date.now();
    const charPos = { x: character.tileX, y: character.tileY };

    // --- Scenario H: Direct magical creation declaration rejection ---
    if (context?.isMagicalDeclaration) {
      const entry: CausalityAuditRecord = {
        id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp,
        characterId: character.id,
        actionType: action.type,
        result: 'REJECTED',
        reasonCode: 'MAGICAL_CREATION_FORBIDDEN',
        details: 'Attempted to materialize an object without causal provenance or physical construction process.',
      };
      this.auditLog.push(entry);
      return {
        valid: false,
        code: 'MAGICAL_CREATION_FORBIDDEN',
        reason: 'Uncaused creation is forbidden. You must propose an invention, gather physical materials, and construct in steps.',
        auditEntry: entry,
      };
    }

    // --- Scenario B: Spatial reachability / distance validation ---
    if (context?.targetPosition) {
      const dx = Math.abs(context.targetPosition.x - charPos.x);
      const dy = Math.abs(context.targetPosition.y - charPos.y);
      const distance = Math.hypot(dx, dy);

      // Max reachable interaction distance is 1.5 tiles (adjacent or diagonal-adjacent)
      if (distance > 1.5 && action.type !== 'MOVE') {
        const entry: CausalityAuditRecord = {
          id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp,
          characterId: character.id,
          actionType: action.type,
          result: 'REJECTED',
          reasonCode: 'OUT_OF_RANGE',
          details: `Target at (${context.targetPosition.x}, ${context.targetPosition.y}) is ${distance.toFixed(1)} tiles away from (${charPos.x}, ${charPos.y}). Must be within 1.5 tiles.`,
        };
        this.auditLog.push(entry);
        return {
          valid: false,
          code: 'OUT_OF_RANGE',
          reason: `Target is out of physical reach (${distance.toFixed(1)} tiles away). Must move closer first.`,
          auditEntry: entry,
        };
      }
    }

    // --- Scenario C: Tool / resource requirements ---
    if (context?.requiredTool) {
      const inventory = context.characterInventory || {};
      if (!inventory[context.requiredTool] || inventory[context.requiredTool] <= 0) {
        const entry: CausalityAuditRecord = {
          id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp,
          characterId: character.id,
          actionType: action.type,
          result: 'REJECTED',
          reasonCode: 'MISSING_TOOL',
          details: `Action ${action.type} requires tool '${context.requiredTool}', but character lacks it in inventory.`,
        };
        this.auditLog.push(entry);
        return {
          valid: false,
          code: 'MISSING_TOOL',
          reason: `Action requires tool '${context.requiredTool}'.`,
          auditEntry: entry,
        };
      }
    }

    // --- Scenario D: Construction step without active project or materials ---
    if (action.type === 'CONSTRUCT_STEP') {
      const projectId = context?.activeProjectId;
      const project = projectId ? this.activeProjects.get(projectId) : undefined;

      if (!project) {
        const entry: CausalityAuditRecord = {
          id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp,
          characterId: character.id,
          actionType: action.type,
          result: 'REJECTED',
          reasonCode: 'NO_ACTIVE_PROJECT',
          details: `Attempted construction step on non-existent or unapproved project '${projectId}'.`,
        };
        this.auditLog.push(entry);
        return {
          valid: false,
          code: 'NO_ACTIVE_PROJECT',
          reason: 'No active approved construction project found at this location.',
          auditEntry: entry,
        };
      }

      // Check materials deposited vs required
      for (const req of project.proposal.estimatedMaterials) {
        const deposited = project.depositedMaterials[req.materialId] || 0;
        if (deposited < req.count) {
          const entry: CausalityAuditRecord = {
            id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp,
            characterId: character.id,
            actionType: action.type,
            result: 'REJECTED',
            reasonCode: 'MISSING_MATERIALS',
            details: `Project requires ${req.count} ${req.materialId}, but only ${deposited} are deposited.`,
          };
          this.auditLog.push(entry);
          return {
            valid: false,
            code: 'MISSING_MATERIALS',
            reason: `Missing required materials: need ${req.count} ${req.materialId}, have ${deposited}.`,
            auditEntry: entry,
          };
        }
      }
    }

    // --- Movement collision check ---
    if (action.type === 'MOVE' && action.targetTile) {
      if (!collisionSystem.isWalkable(action.targetTile.x, action.targetTile.y)) {
        const entry: CausalityAuditRecord = {
          id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp,
          characterId: character.id,
          actionType: action.type,
          result: 'REJECTED',
          reasonCode: 'COLLISION_BLOCKED',
          details: `Tile (${action.targetTile.x}, ${action.targetTile.y}) is solid or impassable.`,
        };
        this.auditLog.push(entry);
        return {
          valid: false,
          code: 'COLLISION_BLOCKED',
          reason: `Target tile (${action.targetTile.x}, ${action.targetTile.y}) is blocked by obstacles.`,
          auditEntry: entry,
        };
      }
    }

    // --- Scenario A: Valid action execution ---
    const approveEntry: CausalityAuditRecord = {
      id: `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      characterId: character.id,
      actionType: action.type,
      result: 'APPROVED',
      reasonCode: 'OK',
      details: `Action ${action.type} validated with causal integrity.`,
    };
    this.auditLog.push(approveEntry);

    return {
      valid: true,
      code: 'OK',
      auditEntry: approveEntry,
    };
  }
}
