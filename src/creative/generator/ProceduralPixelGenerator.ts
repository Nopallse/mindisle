import { PixelMatrix, ObjectSpecification } from '../../types/creative';

export class ProceduralPixelGenerator {
  /**
   * Generates a wooden chair/stool 16x16 pixel matrix
   */
  public static generateWoodenChair(): ObjectSpecification {
    const palette = [
      '#000000', // 0: transparent
      '#78350f', // 1: dark wood border
      '#b45309', // 2: primary wood plank
      '#d97706', // 3: warm wood highlight
      '#451a03', // 4: wood shadow
    ];

    const w = 16;
    const h = 16;
    const data: number[][] = Array(h).fill(0).map(() => Array(w).fill(0));

    // Draw chair backrest (y: 2-7, x: 4-11)
    for (let y = 2; y <= 7; y++) {
      for (let x = 4; x <= 11; x++) {
        if (x === 4 || x === 11 || y === 2) {
          data[y][x] = 1; // border
        } else if (y === 3) {
          data[y][x] = 3; // highlight
        } else {
          data[y][x] = 2; // wood
        }
      }
    }

    // Draw chair seat (y: 8-10, x: 3-12)
    for (let y = 8; y <= 10; y++) {
      for (let x = 3; x <= 12; x++) {
        if (x === 3 || x === 12 || y === 10) {
          data[y][x] = 1;
        } else if (y === 8) {
          data[y][x] = 3;
        } else {
          data[y][x] = 2;
        }
      }
    }

    // Draw chair legs (y: 11-14, x: 4, 11)
    for (let y = 11; y <= 14; y++) {
      data[y][4] = 4; // shadow leg
      data[y][5] = 1;
      data[y][10] = 4;
      data[y][11] = 1;
    }

    const pixelMatrix: PixelMatrix = {
      width: w,
      height: h,
      palette,
      data,
    };

    return {
      name: 'Handcrafted Wooden Stool',
      category: 'furniture',
      pixelWidth: w,
      pixelHeight: h,
      materials: [{ materialId: 'wood_log', count: 2 }],
      collision: {
        solid: true,
        width: 0.8,
        height: 0.8,
      },
      interaction: 'rest',
      pixelMatrix,
    };
  }

  /**
   * Converts a PixelMatrix to an RGBA Uint8ClampedArray
   */
  public static matrixToRgba(matrix: PixelMatrix): Uint8ClampedArray {
    const { width, height, palette, data } = matrix;
    const rgba = new Uint8ClampedArray(width * height * 4);

    // Pre-parse hex palette to [r, g, b]
    const rgbPalette = palette.map((hex, idx) => {
      if (idx === 0) return [0, 0, 0, 0]; // Index 0 is transparent
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return [r, g, b, 255];
    });

    let ptr = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const palIdx = data[y]?.[x] ?? 0;
        const [r, g, b, a] = rgbPalette[palIdx] || [0, 0, 0, 0];
        rgba[ptr++] = r;
        rgba[ptr++] = g;
        rgba[ptr++] = b;
        rgba[ptr++] = a;
      }
    }

    return rgba;
  }
}
