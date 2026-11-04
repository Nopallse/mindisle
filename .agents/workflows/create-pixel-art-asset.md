# Mindisle Workflow: Create a Pixel-Art Asset

Use this workflow when generating, assembling, or integrating a visual pixel-art asset.

## Steps

1. **Verify Asset Specification**:
   - Check category (`furniture`, `structure`, `tool`, `decoration`).
   - Check dimensions in tiles (e.g. 1×1, 2×1, 2×2) and pixels (e.g. 32×32, 64×32).

2. **Generate Pixel Art Data**:
   - Synthesize pixel matrix / layered RGBA buffers using `pixel-art-generation`.
   - Adhere to true top-down orthogonal perspective and harmonious palette.

3. **Validate Visual Quality**:
   - Automated check: No blurred anti-aliasing; crisp nearest-neighbor pixels.
   - Transparency: Clean alpha mask on background pixels.
   - Palette check: Colors match Mindisle palette tables.

4. **Persist to Firebase**:
   - Encode PNG/WebP and upload to Firebase Storage bucket.
   - Store metadata, dimensions, and compact matrix in Firestore `assetDefinitions`.

5. **Register into Phaser**:
   - Load image / canvas into Phaser TextureManager.
   - Verify depth sorting in the scene (`worldY + offset`).

