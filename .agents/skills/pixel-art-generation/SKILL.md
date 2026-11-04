---
name: pixel-art-generation
description: Programmatically generates, manipulates, and transforms raw pixel-art data, pixel matrices, RGBA buffers, color palette swaps, layered sprite composition, and sprite sheet slicing for Mindisle.
---

# Pixel Art Generation

Responsible for treating pixel art as structured data rather than static opaque images.

## Core Data Structures

### 1. 2D Pixel Matrix
Pixel art can be represented as a 2D array of palette indices or hex color strings:
```typescript
interface PixelMatrixData {
  width: number;
  height: number;
  palette: string[]; // e.g., ["#00000000", "#78350f", "#92400e", "#fde68a"]
  data: number[][];  // 2D grid of indices pointing into palette
}
```

### 2. RGBA Pixel Buffer
For fast hardware rendering and PNG encoding:
```typescript
interface RgbaBufferData {
  width: number;
  height: number;
  pixels: Uint8ClampedArray; // [R, G, B, A, R, G, B, A, ...]
}
```

### 3. Layered Composition
Objects are synthesized by layering structured components:
- **Base Shadow Layer**: Soft elliptical ground contact shadow (`rgba(15, 23, 42, 0.4)`).
- **Structural Core**: Wood, stone, or metal framing.
- **Surface Texture & Details**: Wood grains, nails, fabric blankets, carvings.
- **Lighting Highlights**: Warm top-left sunlight glints.

## Pixel Manipulation Capabilities

1. **Procedural Geometry**: Drawing crisp orthogonal rounded cuboids, cylinders, planks, and foliage clusters.
2. **Palette Shifting**: Swapping wood tones (e.g., Oak $\rightarrow$ Birch $\rightarrow$ Dark Walnut) by remapping index tables without re-drawing shapes.
3. **Run-Length Encoding (RLE)**: Compacting repetitive pixel matrices into compact strings for efficient Firestore storage.
4. **Canvas / Image Conversion**: Encoding raw pixel data to PNG blobs for Firebase Storage and HTMLCanvasElement for WebGL textures.

## Dependencies

- Coordinates with: `creative-engine`, `phaser-pixel-art`, `firebase-asset-persistence`.

