import { ObjectSpecification } from '../../types/creative';

export interface AssetValidationResult {
  valid: boolean;
  code: 'OK' | 'INVALID_DIMENSIONS' | 'INSUFFICIENT_TRANSPARENCY' | 'PALETTE_OVERFLOW' | 'DATA_MISMATCH';
  reason?: string;
  transparencyRatio: number;
}

export class AssetValidator {
  public static readonly MIN_TRANSPARENCY_RATIO = 0.15; // At least 15% transparent pixels
  public static readonly MAX_PALETTE_COLORS = 16; // Retro pixel art harmony

  public static validate(spec: ObjectSpecification): AssetValidationResult {
    const { pixelMatrix, pixelWidth, pixelHeight } = spec;

    // 1. Dimension validation
    if (pixelMatrix.width !== pixelWidth || pixelMatrix.height !== pixelHeight) {
      return {
        valid: false,
        code: 'INVALID_DIMENSIONS',
        reason: `Matrix dimensions (${pixelMatrix.width}x${pixelMatrix.height}) do not match spec dimensions (${pixelWidth}x${pixelHeight}).`,
        transparencyRatio: 0,
      };
    }

    if (pixelWidth < 8 || pixelWidth > 64 || pixelHeight < 8 || pixelHeight > 64) {
      return {
        valid: false,
        code: 'INVALID_DIMENSIONS',
        reason: `Dimensions ${pixelWidth}x${pixelHeight} outside valid range [8, 64].`,
        transparencyRatio: 0,
      };
    }

    // 2. Palette harmony validation
    if (pixelMatrix.palette.length > AssetValidator.MAX_PALETTE_COLORS) {
      return {
        valid: false,
        code: 'PALETTE_OVERFLOW',
        reason: `Palette has ${pixelMatrix.palette.length} colors; maximum allowed for retro pixel consistency is ${AssetValidator.MAX_PALETTE_COLORS}.`,
        transparencyRatio: 0,
      };
    }

    // 3. Transparency mask verification (check index 0 count)
    let transparentCount = 0;
    const totalPixels = pixelWidth * pixelHeight;

    if (pixelMatrix.data.length !== pixelHeight) {
      return {
        valid: false,
        code: 'DATA_MISMATCH',
        reason: `Data row count (${pixelMatrix.data.length}) does not match height (${pixelHeight}).`,
        transparencyRatio: 0,
      };
    }

    for (let y = 0; y < pixelHeight; y++) {
      const row = pixelMatrix.data[y];
      if (row.length !== pixelWidth) {
        return {
          valid: false,
          code: 'DATA_MISMATCH',
          reason: `Data column count at row ${y} (${row.length}) does not match width (${pixelWidth}).`,
          transparencyRatio: 0,
        };
      }
      for (let x = 0; x < pixelWidth; x++) {
        if (row[x] === 0) {
          transparentCount++;
        }
      }
    }

    const transparencyRatio = transparentCount / totalPixels;
    if (transparencyRatio < AssetValidator.MIN_TRANSPARENCY_RATIO) {
      return {
        valid: false,
        code: 'INSUFFICIENT_TRANSPARENCY',
        reason: `Sprite has only ${(transparencyRatio * 100).toFixed(1)}% transparent pixels. Must have at least ${(AssetValidator.MIN_TRANSPARENCY_RATIO * 100).toFixed(0)}% to avoid opaque blocks.`,
        transparencyRatio,
      };
    }

    return {
      valid: true,
      code: 'OK',
      transparencyRatio,
    };
  }
}
