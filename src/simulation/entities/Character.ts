import {
  CharacterActivity,
  CharacterAttributes,
  CharacterId,
  CharacterSnapshot,
  Direction,
} from '../../types/character';
import { CollisionSystem, Positionable } from '../navigation/CollisionSystem';

export class Character implements Positionable {
  public readonly id: CharacterId;
  public readonly name: string;
  public readonly avatarColor: string;
  public tileX: number;
  public tileY: number;
  public worldX: number;
  public worldY: number;
  public direction: Direction = 'down';
  public activity: CharacterActivity = 'idle';
  public attributes: CharacterAttributes;

  // Movement animation interpolation
  public targetTile: { x: number; y: number } | null = null;
  private moveProgress: number = 0; // 0 to 1
  private moveSpeed: number = 2.0; // tiles per second
  private idleTimer: number = 0; // ms until next wander step
  private idleCooldown: number = 2500; // ms between wanders

  private tileSize: number;

  constructor(
    id: CharacterId,
    name: string,
    avatarColor: string,
    initialTileX: number,
    initialTileY: number,
    tileSize = 32,
    attributes?: CharacterAttributes
  ) {
    this.id = id;
    this.name = name;
    this.avatarColor = avatarColor;
    this.tileX = initialTileX;
    this.tileY = initialTileY;
    this.tileSize = tileSize;
    this.worldX = initialTileX * tileSize + tileSize / 2;
    this.worldY = initialTileY * tileSize + tileSize / 2;

    this.attributes = attributes || {
      energy: 90,
      curiosity: 85,
      sociability: 80,
      comfort: 85,
    };

    // Stagger idle timers so characters don't move in sync
    this.idleTimer = id === 'naufal' ? 1000 : 2200;
  }

  public update(
    deltaMs: number,
    collisionSystem: CollisionSystem,
    otherCharacters: Positionable[]
  ): { moved: boolean; prevTile?: { x: number; y: number } } {
    let moved = false;

    // 1. If currently interpolating between tiles
    if (this.targetTile) {
      const stepDelta = (deltaMs / 1000) * this.moveSpeed;
      this.moveProgress += stepDelta;

      const startWorldX = this.tileX * this.tileSize + this.tileSize / 2;
      const startWorldY = this.tileY * this.tileSize + this.tileSize / 2;
      const endWorldX = this.targetTile.x * this.tileSize + this.tileSize / 2;
      const endWorldY = this.targetTile.y * this.tileSize + this.tileSize / 2;

      if (this.moveProgress >= 1.0) {
        // Step finished
        const prev = { x: this.tileX, y: this.tileY };
        this.tileX = this.targetTile.x;
        this.tileY = this.targetTile.y;
        this.worldX = endWorldX;
        this.worldY = endWorldY;
        this.targetTile = null;
        this.moveProgress = 0;
        this.activity = 'idle';
        this.idleTimer = 1500 + Math.random() * 2000;
        return { moved: true, prevTile: prev };
      } else {
        // Interpolating
        this.worldX = startWorldX + (endWorldX - startWorldX) * this.moveProgress;
        this.worldY = startWorldY + (endWorldY - startWorldY) * this.moveProgress;
        this.activity = 'walking';
      }
      return { moved: false };
    }

    // 2. If idle, gently trigger autonomous wandering (Phase 1 basic movement verification)
    this.idleTimer -= deltaMs;
    if (this.idleTimer <= 0) {
      const neighbors = collisionSystem.getWalkableNeighbors(
        this.tileX,
        this.tileY,
        otherCharacters,
        this.id
      );

      if (neighbors.length > 0) {
        // Pick a random valid neighboring tile
        const choice = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.startMoveTo(choice.x, choice.y, choice.dir);
      } else {
        this.idleTimer = 2000;
      }
    }

    return { moved };
  }

  public startMoveTo(targetX: number, targetY: number, dir?: Direction): void {
    this.targetTile = { x: targetX, y: targetY };
    this.moveProgress = 0;
    this.activity = 'walking';

    if (dir) {
      this.direction = dir;
    } else {
      if (targetX > this.tileX) this.direction = 'right';
      else if (targetX < this.tileX) this.direction = 'left';
      else if (targetY > this.tileY) this.direction = 'down';
      else if (targetY < this.tileY) this.direction = 'up';
    }
  }

  public setDirection(dir: Direction): void {
    this.direction = dir;
  }

  public getSnapshot(): CharacterSnapshot {
    return {
      id: this.id,
      name: this.name,
      avatarColor: this.avatarColor,
      tileX: this.tileX,
      tileY: this.tileY,
      worldX: this.worldX,
      worldY: this.worldY,
      direction: this.direction,
      activity: this.activity,
      attributes: { ...this.attributes },
      targetTile: this.targetTile ? { ...this.targetTile } : null,
    };
  }
}

