import { Tile, TileType } from '../../types/world';

export class GridMap {
  public readonly width: number;
  public readonly height: number;
  public readonly tileSize: number;
  private tiles: Tile[][];

  constructor(width = 30, height = 20, tileSize = 32) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tiles = [];
    this.generateMap();
  }

  private generateMap(): void {
    this.tiles = [];

    // Specific object coordinates map
    const props = new Map<string, { type: TileType; walkable: boolean }>();

    // 1. Northern Area: Stone Well, Flowerbeds, Signpost & Lantern
    props.set('10,3', { type: 'well', walkable: false });
    props.set('9,3', { type: 'grass_flowers', walkable: true });
    props.set('11,3', { type: 'grass_flowers', walkable: true });
    props.set('11,5', { type: 'signpost', walkable: false });
    props.set('12,4', { type: 'lantern', walkable: false });

    // 2. Ancient Sun Shrine (North-West Glade)
    props.set('5,3', { type: 'shrine', walkable: false });

    // 3. Campfire Gathering Area & Traveler Tent (South Center)
    props.set('10,14', { type: 'campfire', walkable: false });
    props.set('8,14', { type: 'bench', walkable: true });
    props.set('12,14', { type: 'bench', walkable: true });
    props.set('9,13', { type: 'lantern', walkable: false });
    props.set('12,16', { type: 'tent', walkable: false });

    // 4. Vegetable Garden Plot (South-West Meadow)
    props.set('3,13', { type: 'garden', walkable: true });
    props.set('4,13', { type: 'garden', walkable: true });
    props.set('5,13', { type: 'garden', walkable: true });
    props.set('3,14', { type: 'garden', walkable: true });
    props.set('4,14', { type: 'garden', walkable: true });
    props.set('5,14', { type: 'garden', walkable: true });

    // 5. Wooden Fences in Western Meadow
    props.set('3,7', { type: 'fence', walkable: false });
    props.set('4,7', { type: 'fence', walkable: false });
    props.set('5,7', { type: 'fence', walkable: false });
    props.set('4,9', { type: 'bench', walkable: true });

    // 6. Eastern Pond Vista Bench & Fishing Pier
    props.set('26,10', { type: 'bench', walkable: true });
    props.set('24,8', { type: 'pier', walkable: true });
    props.set('23,8', { type: 'pier', walkable: true });

    // 7. Sandy Shoreline buffer around pond
    const sandCoords = [
      '17,8', '17,9', '17,11', '17,12',
      '18,6', '19,6', '23,6', '24,6',
      '18,14', '19,14', '23,14', '24,14',
      '25,8', '25,12'
    ];
    for (const sc of sandCoords) {
      props.set(sc, { type: 'sand', walkable: true });
    }

    // 8. Rocks / Boulder Formations
    const rockCoords = [
      '7,8', '8,8', '6,16', '7,16',
      '25,4', '26,4', '22,4',
      '26,14', '27,14', '15,16'
    ];
    for (const rc of rockCoords) {
      props.set(rc, { type: 'rock', walkable: false });
    }

    // 9. Bushes (Berry & Flowering)
    const bushCoords = [
      '3,11', '6,12', '14,7', '16,12',
      '26,7', '27,12', '16,4', '8,6'
    ];
    for (const bc of bushCoords) {
      props.set(bc, { type: 'bush', walkable: false });
    }

    // 10. Tree Clusters (Inside Island)
    const treeCoords = [
      '4,4', '5,4', '4,5',
      '14,3', '15,3', '15,4',
      '25,5', '26,5',
      '4,15', '5,15', '4,16',
      '16,16', '17,16',
      '26,13', '27,13'
    ];
    for (const tc of treeCoords) {
      props.set(tc, { type: 'tree', walkable: false });
    }

    // 11. Flower Patches & Dense Clover Grass
    const flowerCoords = [
      '2,3', '3,2', '7,3', '8,4',
      '2,13', '3,14', '7,11',
      '12,8', '13,12', '13,13',
      '21,2', '22,2', '27,4', '27,15'
    ];
    for (const fc of flowerCoords) {
      props.set(fc, { type: 'grass_flowers', walkable: true });
    }

    const denseGrassCoords = [
      '2,8', '5,9', '6,8',
      '8,12', '9,12', '11,12',
      '14,9', '15,9',
      '25,9', '25,11', '26,11'
    ];
    for (const dc of denseGrassCoords) {
      props.set(dc, { type: 'grass_dense', walkable: true });
    }

    for (let y = 0; y < this.height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < this.width; x++) {
        const key = `${x},${y}`;

        // Perimeter borders: natural tree border
        const isBorder = x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
        if (isBorder) {
          row.push({ x, y, type: 'tree', walkable: false });
          continue;
        }

        // Pond in the right-center region (x: 18 to 24, y: 7 to 13)
        if (x >= 18 && x <= 24 && y >= 7 && y <= 13) {
          // Bridge across the pond at y: 10
          if (y === 10 && x >= 18 && x <= 24) {
            row.push({ x, y, type: 'bridge', walkable: true });
          } else {
            row.push({ x, y, type: 'water', walkable: false });
          }
          continue;
        }

        // Specific Props and Flora
        if (props.has(key)) {
          const prop = props.get(key)!;
          row.push({ x, y, type: prop.type, walkable: prop.walkable });
          continue;
        }

        // Cobblestone Main Pathways
        // Horizontal main path connecting west to east
        if (y === 10 && (x >= 1 && x <= 28)) {
          row.push({ x, y, type: 'path', walkable: true });
          continue;
        }
        // Vertical path leading north to well & south to campfire
        if (x === 10 && (y >= 1 && y <= 18)) {
          row.push({ x, y, type: 'path', walkable: true });
          continue;
        }

        // Default open meadow grass
        row.push({ x, y, type: 'grass', walkable: true });
      }
      this.tiles.push(row);
    }
  }

  public getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  public isWalkable(x: number, y: number): boolean {
    const tile = this.getTile(x, y);
    return tile !== null && tile.walkable;
  }

  public getAllTiles(): Tile[][] {
    return this.tiles;
  }
}
