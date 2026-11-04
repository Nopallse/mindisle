import { GridMap } from './GridMap';
import { CharacterId } from '../../types/character';

export interface Positionable {
  id: CharacterId;
  tileX: number;
  tileY: number;
}

export class CollisionSystem {
  private gridMap: GridMap;

  constructor(gridMap: GridMap) {
    this.gridMap = gridMap;
  }

  public canMoveTo(
    x: number,
    y: number,
    occupants: Positionable[] = [],
    movingEntityId?: CharacterId
  ): boolean {
    // 1. Boundary & Terrain Walkability check
    if (!this.gridMap.isWalkable(x, y)) {
      return false;
    }

    // 2. Occupant collision check (another character occupying target tile)
    const isOccupied = occupants.some(
      (occ) => occ.id !== movingEntityId && occ.tileX === x && occ.tileY === y
    );

    return !isOccupied;
  }

  public getWalkableNeighbors(
    x: number,
    y: number,
    occupants: Positionable[] = [],
    movingEntityId?: CharacterId
  ): Array<{ x: number; y: number; dir: 'down' | 'left' | 'right' | 'up' }> {
    const directions: Array<{ dx: number; dy: number; dir: 'down' | 'left' | 'right' | 'up' }> = [
      { dx: 0, dy: 1, dir: 'down' },
      { dx: -1, dy: 0, dir: 'left' },
      { dx: 1, dy: 0, dir: 'right' },
      { dx: 0, dy: -1, dir: 'up' },
    ];

    const neighbors: Array<{ x: number; y: number; dir: 'down' | 'left' | 'right' | 'up' }> = [];

    for (const d of directions) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (this.canMoveTo(nx, ny, occupants, movingEntityId)) {
        neighbors.push({ x: nx, y: ny, dir: d.dir });
      }
    }

    return neighbors;
  }
}

