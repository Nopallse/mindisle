import { Character } from '../entities/Character';
import { GridMap } from '../navigation/GridMap';

export interface PerceivedEntity {
  id: string;
  name: string;
  type: 'character' | 'object' | 'landmark';
  tileX: number;
  tileY: number;
  distance: number;
  visible: boolean;
}

export class PerceptionSystem {
  public static readonly VISION_RADIUS = 6.0; // 6 tiles maximum sight radius
  public static readonly HEARING_RADIUS = 4.0; // 4 tiles maximum speech audibility

  public static getVisibleEntities(
    observer: Character,
    allCharacters: Character[],
    gridMap: GridMap,
    landmarks: Array<{ name: string; x: number; y: number }>
  ): PerceivedEntity[] {
    const visible: PerceivedEntity[] = [];
    const ox = observer.tileX;
    const oy = observer.tileY;

    // 1. Check other characters within vision radius
    for (const other of allCharacters) {
      if (other.id === observer.id) continue;

      const dist = Math.hypot(other.tileX - ox, other.tileY - oy);
      if (dist <= PerceptionSystem.VISION_RADIUS) {
        visible.push({
          id: other.id,
          name: other.name,
          type: 'character',
          tileX: other.tileX,
          tileY: other.tileY,
          distance: dist,
          visible: true,
        });
      }
    }

    // 2. Check landmarks within vision radius
    for (const landmark of landmarks) {
      const dist = Math.hypot(landmark.x - ox, landmark.y - oy);
      if (dist <= PerceptionSystem.VISION_RADIUS) {
        visible.push({
          id: `landmark-${landmark.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: landmark.name,
          type: 'landmark',
          tileX: landmark.x,
          tileY: landmark.y,
          distance: dist,
          visible: true,
        });
      }
    }

    return visible;
  }

  public static isWithinHearingRange(speaker: Character, listener: Character): boolean {
    const dist = Math.hypot(speaker.tileX - listener.tileX, speaker.tileY - listener.tileY);
    return dist <= PerceptionSystem.HEARING_RADIUS;
  }

  public static calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.hypot(x2 - x1, y2 - y1);
  }
}
