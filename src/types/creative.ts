import { CharacterId } from './character';

export interface PixelMatrix {
  width: number;
  height: number;
  palette: string[]; // hex color strings, index 0 is transparent null
  data: number[][]; // [y][x] indices into palette
}

export interface ObjectSpecification {
  name: string;
  category: 'furniture' | 'tool' | 'structure' | 'decoration' | 'machine';
  pixelWidth: number;
  pixelHeight: number;
  materials: Array<{ materialId: string; count: number }>;
  collision: {
    solid: boolean;
    width: number;
    height: number;
  };
  interaction: 'rest' | 'inspect' | 'harvest' | 'shelter' | 'none';
  pixelMatrix: PixelMatrix;
}

export interface ObjectProvenance {
  objectId: string;
  objectName: string;
  creatorId: CharacterId;
  inspiration: string;
  motivation: string;
  materialsUsed: Array<{ materialId: string; count: number }>;
  location: { x: number; y: number };
  completedAtDay: number;
  completedAtHour: number;
  assetId: string;
  version: number;
}
