import * as Phaser from 'phaser';

/**
 * Procedurally generates high-quality top-down pixel-art tiles and expressive 4-direction
 * character spritesheets directly into Phaser's TextureManager.
 */
export function generatePixelArtAssets(scene: Phaser.Scene): void {
  const tileSize = 32;

  // Helper to create a single 32x32 canvas tile
  const createTile = (key: string, drawFn: (ctx: CanvasRenderingContext2D) => void) => {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx);
    const tex = scene.textures.addCanvas(key, canvas);
    if (tex) {
      tex.refresh();
    }
  };

  // =========================================================================
  // 1. TERRAIN & GROUND TILES
  // =========================================================================

  // TILE_GRASS: Rich organic meadow
  createTile('tile_grass', (ctx) => {
    // Base lush green
    ctx.fillStyle = '#419234';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Subtle grass blade shading & speckles
    ctx.fillStyle = '#377e2c';
    for (let i = 0; i < 20; i++) {
      const rx = (i * 7 + 4) % tileSize;
      const ry = (i * 11 + 6) % tileSize;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Bright blade highlights
    ctx.fillStyle = '#52aa41';
    for (let i = 0; i < 14; i++) {
      const rx = (i * 13 + 9) % tileSize;
      const ry = (i * 5 + 3) % tileSize;
      ctx.fillRect(rx, ry, 2, 3);
      ctx.fillRect(rx, ry - 1, 1, 1);
    }
  });

  // TILE_GRASS_DENSE: Thick clover tufts & taller blades
  createTile('tile_grass_dense', (ctx) => {
    ctx.fillStyle = '#3a872e';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Deep shade under tufts
    ctx.fillStyle = '#2d6d24';
    ctx.fillRect(6, 10, 8, 3);
    ctx.fillRect(18, 22, 9, 3);

    // Clover leaves
    ctx.fillStyle = '#5cb749';
    // Clover 1
    ctx.fillRect(7, 8, 3, 3);
    ctx.fillRect(10, 8, 3, 3);
    ctx.fillRect(8, 6, 4, 3);
    // Clover 2
    ctx.fillRect(19, 19, 3, 3);
    ctx.fillRect(23, 19, 3, 3);
    ctx.fillRect(21, 17, 4, 3);

    // Golden seed dots
    ctx.fillStyle = '#a3e635';
    ctx.fillRect(9, 8, 2, 2);
    ctx.fillRect(22, 19, 2, 2);
  });

  // TILE_GRASS_FLOWERS: Multi-colored vibrant blossoms
  createTile('tile_grass_flowers', (ctx) => {
    ctx.fillStyle = '#419234';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Flower 1: Golden Buttercup
    ctx.fillStyle = '#166534';
    ctx.fillRect(6, 10, 2, 5); // Stem
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(4, 7, 6, 4);
    ctx.fillRect(5, 6, 4, 6);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(6, 8, 2, 2); // Center

    // Flower 2: Wild Lavender
    ctx.fillStyle = '#166534';
    ctx.fillRect(22, 12, 2, 6); // Stem
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(21, 8, 4, 5);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(22, 7, 2, 3);

    // Flower 3: Red Poppy
    ctx.fillStyle = '#166534';
    ctx.fillRect(14, 22, 2, 5); // Stem
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, 19, 6, 4);
    ctx.fillRect(13, 18, 4, 6);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(14, 20, 2, 2); // Center

    // Flower 4: White Daisy
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(24, 23, 4, 4);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(25, 24, 2, 2);
  });

  // TILE_PATH: Warm cobblestone trail
  createTile('tile_path', (ctx) => {
    // Dirt base
    ctx.fillStyle = '#a58260';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Cobblestone stones
    const drawStone = (x: number, y: number, w: number, h: number) => {
      // Dark crevice
      ctx.fillStyle = '#6b4f35';
      ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
      // Main stone
      ctx.fillStyle = '#8f6f4d';
      ctx.fillRect(x, y, w, h);
      // Top highlight
      ctx.fillStyle = '#bda07e';
      ctx.fillRect(x + 1, y + 1, w - 2, 2);
    };

    drawStone(2, 2, 11, 8);
    drawStone(15, 3, 14, 9);
    drawStone(3, 13, 12, 10);
    drawStone(17, 14, 12, 9);
    drawStone(7, 25, 16, 5);

    // Tiny moss tufts in crevices
    ctx.fillStyle = '#3f7c32';
    ctx.fillRect(13, 11, 2, 2);
    ctx.fillRect(15, 12, 2, 2);
    ctx.fillRect(4, 23, 2, 2);
  });

  // TILE_WATER: Serene pond with water ripples and lily pad
  createTile('tile_water', (ctx) => {
    // Deep water
    ctx.fillStyle = '#1d5fa0';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Water depth contours
    ctx.fillStyle = '#164d84';
    ctx.fillRect(4, 4, 24, 24);

    // Turquoise highlight ripples
    ctx.fillStyle = '#4299e1';
    ctx.fillRect(6, 8, 8, 2);
    ctx.fillRect(18, 14, 10, 2);
    ctx.fillRect(4, 22, 12, 2);

    // Foam shimmer
    ctx.fillStyle = '#90cdf4';
    ctx.fillRect(8, 9, 4, 1);
    ctx.fillRect(20, 15, 5, 1);

    // Floating Lily Pad with blossom
    ctx.fillStyle = '#22543d'; // Lily pad shadow
    ctx.fillRect(11, 14, 9, 8);
    ctx.fillStyle = '#38a169'; // Green pad
    ctx.fillRect(10, 13, 9, 8);
    ctx.fillStyle = '#1d5fa0'; // Notch cut
    ctx.fillRect(14, 13, 2, 3);

    // Pink Lotus flower
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(13, 15, 4, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(14, 16, 2, 2);
  });

  // TILE_BRIDGE: Timber wood walkway
  createTile('tile_bridge', (ctx) => {
    // Underlying water
    ctx.fillStyle = '#164d84';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Wooden planks
    ctx.fillStyle = '#854d24';
    ctx.fillRect(1, 0, tileSize - 2, tileSize);

    for (let y = 0; y < tileSize; y += 8) {
      // Plank division shadow
      ctx.fillStyle = '#522b10';
      ctx.fillRect(1, y, tileSize - 2, 2);
      // Plank highlight
      ctx.fillStyle = '#a66938';
      ctx.fillRect(1, y + 2, tileSize - 2, 1);
      // Iron nails
      ctx.fillStyle = '#27272a';
      ctx.fillRect(4, y + 4, 1, 1);
      ctx.fillRect(tileSize - 5, y + 4, 1, 1);
    }

    // Heavy side railings
    ctx.fillStyle = '#3d1e08';
    ctx.fillRect(1, 0, 3, tileSize);
    ctx.fillRect(tileSize - 4, 0, 3, tileSize);
    // Railing top highlight
    ctx.fillStyle = '#7a421b';
    ctx.fillRect(2, 0, 1, tileSize);
    ctx.fillRect(tileSize - 3, 0, 1, tileSize);
  });

  // =========================================================================
  // 2. WORLD PROPS & DECORATIONS
  // =========================================================================

  // TILE_TREE: Volumetric organic tree canopy
  createTile('tile_tree', (ctx) => {
    // Ground drop shadow
    ctx.fillStyle = 'rgba(15, 30, 10, 0.45)';
    ctx.beginPath();
    ctx.ellipse(16, 22, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wood trunk glimpse
    ctx.fillStyle = '#5c3317';
    ctx.fillRect(14, 18, 4, 7);
    ctx.fillStyle = '#3d1d07';
    ctx.fillRect(16, 19, 2, 6);

    // Deep shadow foliage (bottom right)
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(16, 14, 13, 0, Math.PI * 2);
    ctx.fill();

    // Mid-tone foliage clumps
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(12, 15, 8, 0, Math.PI * 2);
    ctx.arc(20, 15, 8, 0, Math.PI * 2);
    ctx.arc(16, 10, 9, 0, Math.PI * 2);
    ctx.fill();

    // Highlight canopy (top left light source)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(13, 10, 6, 0, Math.PI * 2);
    ctx.arc(17, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Leaf cluster highlights
    ctx.fillStyle = '#86efac';
    ctx.fillRect(11, 7, 4, 2);
    ctx.fillRect(16, 6, 3, 2);
    ctx.fillRect(9, 11, 3, 2);
  });

  // TILE_ROCK: Chiseled mossy boulder
  createTile('tile_rock', (ctx) => {
    // Ground shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(17, 23, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base rock outline
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.ellipse(15, 17, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mid grey facet
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.ellipse(14, 15, 10, 7, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Light facet
    ctx.fillStyle = '#71717a';
    ctx.beginPath();
    ctx.ellipse(12, 13, 7, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Highlight edge
    ctx.fillStyle = '#a1a1aa';
    ctx.fillRect(8, 11, 6, 2);

    // Crevice lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, 13);
    ctx.lineTo(16, 17);
    ctx.lineTo(15, 22);
    ctx.stroke();

    // Green moss patch
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(18, 17, 5, 4);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(19, 18, 3, 2);
  });

  // TILE_BUSH: Lush round shrub with red berries
  createTile('tile_bush', (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(16, 23, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bush foliage clumps
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(11, 16, 8, 0, Math.PI * 2);
    ctx.arc(21, 16, 8, 0, Math.PI * 2);
    ctx.arc(16, 12, 7, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(11, 10, 4, 3);
    ctx.fillRect(19, 12, 4, 3);
    ctx.fillRect(14, 8, 4, 2);

    // Red berries
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(8, 14, 3, 3);
    ctx.fillRect(15, 17, 3, 3);
    ctx.fillRect(22, 14, 3, 3);
    ctx.fillRect(13, 11, 3, 3);

    // Berry white shine
    ctx.fillStyle = '#fecaca';
    ctx.fillRect(9, 14, 1, 1);
    ctx.fillRect(16, 17, 1, 1);
    ctx.fillRect(23, 14, 1, 1);
    ctx.fillRect(14, 11, 1, 1);
  });

  // TILE_CAMPFIRE: Stone fire pit with burning logs & flames
  createTile('tile_campfire', (ctx) => {
    // Ground ash circle
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(16, 17, 12, 0, Math.PI * 2);
    ctx.fill();

    // Stone ring around fire
    const stones = [
      { x: 7, y: 15 }, { x: 10, y: 22 }, { x: 16, y: 24 },
      { x: 22, y: 22 }, { x: 25, y: 15 }, { x: 22, y: 8 },
      { x: 16, y: 6 }, { x: 10, y: 8 }
    ];
    for (const s of stones) {
      ctx.fillStyle = '#71717a';
      ctx.fillRect(s.x, s.y, 4, 4);
      ctx.fillStyle = '#a1a1aa';
      ctx.fillRect(s.x, s.y, 2, 2);
    }

    // Charred wooden logs (criss-cross)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(10, 16, 12, 3);
    ctx.fillRect(14, 12, 3, 11);

    // Burning glowing coals
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(13, 15, 6, 5);

    // Outer flame (Orange)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(11, 18);
    ctx.lineTo(16, 7);
    ctx.lineTo(21, 18);
    ctx.fill();

    // Inner flame (Bright Yellow)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(13, 17);
    ctx.lineTo(16, 10);
    ctx.lineTo(19, 17);
    ctx.fill();

    // Flame Core (White-hot)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 14, 2, 3);
  });

  // TILE_WELL: Stone water well with wooden roof
  createTile('tile_well', (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(16, 23, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone well basin
    ctx.fillStyle = '#52525b';
    ctx.fillRect(6, 14, 20, 11);
    ctx.fillStyle = '#71717a';
    ctx.fillRect(7, 15, 18, 9);

    // Water reflection inside
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(9, 16, 14, 5);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(11, 17, 6, 1);

    // Wooden vertical posts
    ctx.fillStyle = '#78350f';
    ctx.fillRect(7, 5, 3, 11);
    ctx.fillRect(22, 5, 3, 11);

    // Timber tiled roof
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(4, 8);
    ctx.lineTo(16, 2);
    ctx.lineTo(28, 8);
    ctx.lineTo(26, 10);
    ctx.lineTo(6, 10);
    ctx.fill();

    // Roof ridge highlight
    ctx.fillStyle = '#b45309';
    ctx.fillRect(6, 7, 20, 2);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(15, 3, 2, 3);

    // Bucket rope
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(15, 9, 2, 5);
  });

  // TILE_BENCH: Cozy wooden park/garden bench
  createTile('tile_bench', (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(4, 22, 24, 4);

    // Wooden legs
    ctx.fillStyle = '#451a03';
    ctx.fillRect(5, 16, 3, 8);
    ctx.fillRect(24, 16, 3, 8);

    // Seat plank
    ctx.fillStyle = '#78350f';
    ctx.fillRect(3, 16, 26, 4);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(3, 16, 26, 2);

    // Backrest slats
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, 9, 24, 3);
    ctx.fillRect(4, 13, 24, 2);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, 9, 24, 1);

    // Armrests
    ctx.fillStyle = '#92400e';
    ctx.fillRect(3, 12, 2, 5);
    ctx.fillRect(27, 12, 2, 5);
  });

  // TILE_FENCE: Rustic wooden post and rail
  createTile('tile_fence', (ctx) => {
    // Post shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(12, 23, 8, 3);

    // Horizontal rails
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 11, tileSize, 3);
    ctx.fillRect(0, 17, tileSize, 3);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 11, tileSize, 1);
    ctx.fillRect(0, 17, tileSize, 1);

    // Center vertical fence post
    ctx.fillStyle = '#451a03';
    ctx.fillRect(13, 7, 6, 17);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 8, 4, 15);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(14, 8, 2, 15);
    // Pointed post top
    ctx.fillStyle = '#451a03';
    ctx.fillRect(15, 6, 2, 1);
  });

  // TILE_SIGNPOST: Wooden pointer signpost
  createTile('tile_signpost', (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(13, 23, 8, 3);

    // Vertical post
    ctx.fillStyle = '#451a03';
    ctx.fillRect(14, 10, 4, 14);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(15, 10, 2, 14);

    // Wooden arrow sign board
    ctx.fillStyle = '#92400e';
    ctx.fillRect(6, 8, 16, 7);
    ctx.fillStyle = '#78350f';
    // Pointer arrow point (pointing east)
    ctx.beginPath();
    ctx.moveTo(22, 7);
    ctx.lineTo(26, 11);
    ctx.lineTo(22, 16);
    ctx.fill();

    // Sign text line carvings
    ctx.fillStyle = '#451a03';
    ctx.fillRect(8, 10, 10, 1);
    ctx.fillRect(8, 13, 7, 1);
  });

  // TILE_SAND: Warm golden pond shoreline with wet sand & smooth pebbles
  createTile('tile_sand', (ctx) => {
    // Warm golden sand base
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Warm undertone
    ctx.fillStyle = '#ca8a04';
    for (let i = 0; i < 18; i++) {
      const rx = (i * 9 + 3) % tileSize;
      const ry = (i * 13 + 5) % tileSize;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Wet shoreline edge shimmer
    ctx.fillStyle = '#a16207';
    ctx.fillRect(26, 0, 6, tileSize);
    ctx.fillStyle = '#713f12';
    ctx.fillRect(29, 0, 3, tileSize);

    // Bright shell / quartz specks
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5, 7, 2, 2);
    ctx.fillRect(16, 19, 2, 2);
    ctx.fillRect(11, 25, 2, 2);

    // Smooth grey river pebbles
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(8, 14, 3, 2);
    ctx.fillRect(19, 9, 3, 2);
  });

  // TILE_GARDEN: Fertile furrowed vegetable patch with carrots and cabbages
  createTile('tile_garden', (ctx) => {
    // Rich dark tilled soil base
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Furrow mounds
    ctx.fillStyle = '#542307';
    ctx.fillRect(2, 4, 28, 6);
    ctx.fillRect(2, 13, 28, 6);
    ctx.fillRect(2, 22, 28, 6);

    // Deep soil shadows
    ctx.fillStyle = '#291002';
    ctx.fillRect(2, 10, 28, 3);
    ctx.fillRect(2, 19, 28, 3);

    // Carrots row (top furrow)
    // Carrot 1
    ctx.fillStyle = '#f97316';
    ctx.fillRect(6, 6, 3, 2); // Carrot tip in soil
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(5, 3, 5, 3); // Leaves
    ctx.fillStyle = '#15803d';
    ctx.fillRect(6, 2, 3, 2);
    // Carrot 2
    ctx.fillStyle = '#f97316';
    ctx.fillRect(16, 6, 3, 2);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(15, 3, 5, 3);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(16, 2, 3, 2);

    // Plump Leafy Cabbage (middle furrow)
    ctx.fillStyle = '#166534';
    ctx.fillRect(8, 13, 7, 6);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(9, 14, 5, 4);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(10, 15, 3, 2); // Crisp core

    // Sprouting crops (bottom furrow)
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(7, 23, 2, 3);
    ctx.fillRect(6, 22, 4, 2);
    ctx.fillRect(18, 23, 2, 3);
    ctx.fillRect(17, 22, 4, 2);
    ctx.fillRect(25, 23, 2, 3);
    ctx.fillRect(24, 22, 4, 2);
  });

  // TILE_PIER: Wooden lakeside fishing pier with mooring rope & nail studs
  createTile('tile_pier', (ctx) => {
    // Under-deck dark water shadow
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, tileSize, tileSize);

    // Horizontal wooden timber planks
    const plankColors = ['#78350f', '#92400e', '#78350f', '#92400e', '#78350f'];
    plankColors.forEach((color, idx) => {
      const y = idx * 6 + 1;
      ctx.fillStyle = color;
      ctx.fillRect(0, y, tileSize, 5);
      // Plank top highlight
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, y, tileSize, 1);
      // Plank bottom groove
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, y + 4, tileSize, 1);

      // Iron nail studs
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(3, y + 2, 1, 1);
      ctx.fillRect(tileSize - 4, y + 2, 1, 1);
    });

    // Mooring bollard on the right with coiled rope
    ctx.fillStyle = '#451a03';
    ctx.fillRect(24, 8, 5, 8);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(23, 11, 7, 3); // Coiled rope
  });

  // TILE_TENT: Cozy canvas adventurer A-frame shelter with guy ropes & warm bedroll
  createTile('tile_tent', (ctx) => {
    // Ground shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.40)';
    ctx.beginPath();
    ctx.ellipse(16, 24, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Guy ropes
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 6);
    ctx.lineTo(2, 26);
    ctx.moveTo(16, 6);
    ctx.lineTo(30, 26);
    ctx.stroke();

    // Wooden ground pegs
    ctx.fillStyle = '#78350f';
    ctx.fillRect(1, 24, 2, 4);
    ctx.fillRect(29, 24, 2, 4);

    // Tent Canvas Triangle (Ivory Khaki)
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath();
    ctx.moveTo(16, 5);
    ctx.lineTo(5, 25);
    ctx.lineTo(27, 25);
    ctx.closePath();
    ctx.fill();

    // Tent Shading (Left side lit, right side shaded)
    ctx.fillStyle = '#d6d3d1';
    ctx.beginPath();
    ctx.moveTo(16, 5);
    ctx.lineTo(16, 25);
    ctx.lineTo(27, 25);
    ctx.closePath();
    ctx.fill();

    // Ridge seam
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(15, 5, 2, 20);

    // Tent Entrance Interior (Dark cozy opening)
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(16, 12);
    ctx.lineTo(11, 25);
    ctx.lineTo(21, 25);
    ctx.closePath();
    ctx.fill();

    // Red plaid warm sleeping blanket rolled inside
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(13, 21, 6, 3);
    ctx.fillStyle = '#fecaca';
    ctx.fillRect(14, 22, 4, 1);
  });

  // TILE_LANTERN: Standing timber post with amber glowing glass lantern
  createTile('tile_lantern', (ctx) => {
    // Ground contact shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(12, 24, 8, 4);

    // Timber post
    ctx.fillStyle = '#451a03';
    ctx.fillRect(14, 10, 4, 15);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(15, 11, 2, 14);

    // Wrought iron hanging arm
    ctx.fillStyle = '#334155';
    ctx.fillRect(15, 7, 7, 2);
    ctx.fillRect(21, 9, 2, 2);

    // Lantern Cap
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(18, 10, 8, 2);

    // Amber Glass Chamber with warm candle
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(19, 12, 6, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(20, 13, 4, 4); // Core glowing flame

    // Lantern Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(19, 18, 6, 2);
  });

  // TILE_SHRINE: Weathered ancient stone obelisk with sun runes & climbing ivy
  createTile('tile_shrine', (ctx) => {
    // Base platform shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.40)';
    ctx.fillRect(4, 24, 24, 5);

    // Stone tiered base
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, 21, 20, 4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(8, 18, 16, 4);

    // Upright Obelisk Monolith
    ctx.fillStyle = '#64748b';
    ctx.fillRect(11, 6, 10, 13);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(12, 6, 4, 13); // Light highlight
    ctx.fillStyle = '#475569';
    ctx.fillRect(18, 6, 3, 13); // Shadowed edge

    // Carved Golden Sun Spiral Motif
    ctx.fillStyle = '#facc15';
    ctx.fillRect(14, 9, 4, 4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(15, 10, 2, 2);

    // Ivy vines climbing the side
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(9, 19, 3, 3);
    ctx.fillRect(10, 15, 2, 4);
    ctx.fillRect(11, 12, 2, 3);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(10, 14, 2, 2);
  });

  // =========================================================================
  // 3. EXPRESSIVE CHARACTER SPRITESHEETS: NAUFAL & LAUREN
  // 4 directions (rows: Down=0, Left=1, Right=2, Up=3)
  // 4 frames per direction (32x32 each, canvas 128x128)
  // =========================================================================

  const drawCharacterSheet = (
    key: string,
    palette: {
      hair: string;
      hairHighlight: string;
      skin: string;
      skinShadow: string;
      eyeColor: string;
      outfitMain: string;
      outfitAccent: string;
      pants: string;
      shoes: string;
      isFemale?: boolean;
    }
  ) => {
    if (scene.textures.exists(key)) return;

    const canvas = document.createElement('canvas');
    canvas.width = 128; // 4 frames * 32px
    canvas.height = 128; // 4 rows * 32px
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const dirs: Array<'down' | 'left' | 'right' | 'up'> = ['down', 'left', 'right', 'up'];

    dirs.forEach((dir, rowIdx) => {
      for (let frame = 0; frame < 4; frame++) {
        const ox = frame * 32;
        const oy = rowIdx * 32;

        // Walking strides & arm offsets
        let leftLegOffset = 0;
        let rightLegOffset = 0;
        let bodyBob = 0;

        if (frame === 1) {
          leftLegOffset = -2;
          rightLegOffset = 2;
          bodyBob = 1; // Subtle dip on step
        } else if (frame === 3) {
          leftLegOffset = 2;
          rightLegOffset = -2;
          bodyBob = 1;
        }

        // 1. Soft Elliptical Ground Contact Shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.40)';
        ctx.beginPath();
        ctx.ellipse(ox + 16, oy + 28, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Legs & Shoes
        ctx.fillStyle = palette.pants;
        if (dir === 'left' || dir === 'right') {
          ctx.fillRect(ox + 13, oy + 21 + bodyBob, 6, 6 + leftLegOffset);
        } else {
          ctx.fillRect(ox + 12, oy + 21 + bodyBob, 3, 6 + leftLegOffset);
          ctx.fillRect(ox + 17, oy + 21 + bodyBob, 3, 6 + rightLegOffset);
        }

        ctx.fillStyle = palette.shoes;
        if (dir === 'left') {
          ctx.fillRect(ox + 11, oy + 26 + bodyBob + leftLegOffset, 7, 3);
        } else if (dir === 'right') {
          ctx.fillRect(ox + 14, oy + 26 + bodyBob + rightLegOffset, 7, 3);
        } else {
          ctx.fillRect(ox + 11, oy + 26 + bodyBob + leftLegOffset, 4, 3);
          ctx.fillRect(ox + 17, oy + 26 + bodyBob + rightLegOffset, 4, 3);
        }

        // 3. Torso / Clothes (Tunic / Vest / Dress)
        ctx.fillStyle = palette.outfitMain;
        ctx.fillRect(ox + 11, oy + 14 + bodyBob, 10, 8);

        // Vest / Dress Details
        ctx.fillStyle = palette.outfitAccent;
        if (dir === 'down') {
          ctx.fillRect(ox + 10, oy + 14 + bodyBob, 3, 8); // Vest left
          ctx.fillRect(ox + 19, oy + 14 + bodyBob, 3, 8); // Vest right
          ctx.fillRect(ox + 11, oy + 20 + bodyBob, 10, 2); // Belt / hem
        } else if (dir === 'up') {
          ctx.fillRect(ox + 10, oy + 14 + bodyBob, 12, 8);
        } else if (dir === 'left') {
          ctx.fillRect(ox + 11, oy + 14 + bodyBob, 9, 8);
          // Arm swing
          ctx.fillStyle = palette.skin;
          ctx.fillRect(ox + 13 + leftLegOffset, oy + 16 + bodyBob, 3, 5);
        } else if (dir === 'right') {
          ctx.fillRect(ox + 12, oy + 14 + bodyBob, 9, 8);
          // Arm swing
          ctx.fillStyle = palette.skin;
          ctx.fillRect(ox + 16 + rightLegOffset, oy + 16 + bodyBob, 3, 5);
        }

        // Leather Belt & Buckle
        ctx.fillStyle = '#451a03';
        ctx.fillRect(ox + 11, oy + 19 + bodyBob, 10, 2);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(ox + 15, oy + 19 + bodyBob, 2, 2); // Gold buckle

        // 4. Head & Face
        // Neck shadow
        ctx.fillStyle = palette.skinShadow;
        ctx.fillRect(ox + 14, oy + 13 + bodyBob, 4, 2);

        // Face Base
        ctx.fillStyle = palette.skin;
        ctx.fillRect(ox + 11, oy + 6 + bodyBob, 10, 8);

        // Eyes (Expressive with pupil & white shine)
        if (dir === 'down') {
          // Eye Left
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 12, oy + 9 + bodyBob, 3, 2);
          ctx.fillStyle = palette.eyeColor;
          ctx.fillRect(ox + 13, oy + 9 + bodyBob, 2, 2);

          // Eye Right
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 17, oy + 9 + bodyBob, 3, 2);
          ctx.fillStyle = palette.eyeColor;
          ctx.fillRect(ox + 17, oy + 9 + bodyBob, 2, 2);

          // Subtle smile
          ctx.fillStyle = palette.skinShadow;
          ctx.fillRect(ox + 15, oy + 12 + bodyBob, 2, 1);
        } else if (dir === 'left') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 11, oy + 9 + bodyBob, 3, 2);
          ctx.fillStyle = palette.eyeColor;
          ctx.fillRect(ox + 11, oy + 9 + bodyBob, 2, 2);
        } else if (dir === 'right') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 18, oy + 9 + bodyBob, 3, 2);
          ctx.fillStyle = palette.eyeColor;
          ctx.fillRect(ox + 19, oy + 9 + bodyBob, 2, 2);
        }

        // 5. Hair & Headwear
        ctx.fillStyle = palette.hair;
        if (dir === 'down') {
          // Hair crown & bangs
          ctx.fillRect(ox + 10, oy + 3 + bodyBob, 12, 5);
          ctx.fillRect(ox + 9, oy + 6 + bodyBob, 2, 4);
          ctx.fillRect(ox + 21, oy + 6 + bodyBob, 2, 4);

          // Highlights
          ctx.fillStyle = palette.hairHighlight;
          ctx.fillRect(ox + 12, oy + 4 + bodyBob, 7, 2);

          if (palette.isFemale) {
            // Long flowing braided side-locks for Lauren
            ctx.fillStyle = palette.hair;
            ctx.fillRect(ox + 8, oy + 7 + bodyBob, 3, 9);
            ctx.fillRect(ox + 21, oy + 7 + bodyBob, 3, 9);

            // Flower hairclip
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(ox + 9, oy + 5 + bodyBob, 2, 2);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(ox + 10, oy + 6 + bodyBob, 1, 1);
          }
        } else if (dir === 'up') {
          ctx.fillStyle = palette.hair;
          ctx.fillRect(ox + 9, oy + 3 + bodyBob, 14, 9);
          ctx.fillStyle = palette.hairHighlight;
          ctx.fillRect(ox + 11, oy + 4 + bodyBob, 10, 2);

          if (palette.isFemale) {
            // Braided bun
            ctx.fillStyle = palette.hair;
            ctx.fillRect(ox + 13, oy + 10 + bodyBob, 6, 7);
            ctx.fillStyle = palette.hairHighlight;
            ctx.fillRect(ox + 14, oy + 12 + bodyBob, 4, 3);
          }
        } else if (dir === 'left') {
          ctx.fillStyle = palette.hair;
          ctx.fillRect(ox + 10, oy + 3 + bodyBob, 12, 5);
          ctx.fillRect(ox + 15, oy + 7 + bodyBob, 7, 6);
          ctx.fillStyle = palette.hairHighlight;
          ctx.fillRect(ox + 12, oy + 4 + bodyBob, 8, 2);

          if (palette.isFemale) {
            ctx.fillStyle = palette.hair;
            ctx.fillRect(ox + 16, oy + 11 + bodyBob, 4, 7);
          }
        } else if (dir === 'right') {
          ctx.fillStyle = palette.hair;
          ctx.fillRect(ox + 10, oy + 3 + bodyBob, 12, 5);
          ctx.fillRect(ox + 10, oy + 7 + bodyBob, 7, 6);
          ctx.fillStyle = palette.hairHighlight;
          ctx.fillRect(ox + 12, oy + 4 + bodyBob, 8, 2);

          if (palette.isFemale) {
            ctx.fillStyle = palette.hair;
            ctx.fillRect(ox + 12, oy + 11 + bodyBob, 4, 7);
          }
        }
      }
    });

    const texture = scene.textures.addCanvas(key, canvas);
    if (texture) {
      // Cut all 16 frames: 4 rows x 4 columns of 32x32
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const frameIndex = row * 4 + col;
          texture.add(frameIndex, 0, col * 32, row * 32, 32, 32);
          texture.add(frameIndex.toString(), 0, col * 32, row * 32, 32, 32);
        }
      }
      texture.refresh();
    }
  };

  // Naufal: Male, cobalt adventurer vest, dark hair with sheen, warm skin
  drawCharacterSheet('char_naufal', {
    hair: '#1e293b',          // Deep charcoal black
    hairHighlight: '#475569', // Slate highlight
    skin: '#fed7aa',          // Warm natural skin
    skinShadow: '#fba765',    // Warm tone shadow
    eyeColor: '#0284c7',      // Expressive blue eyes
    outfitMain: '#f8fafc',    // Crisp white linen shirt
    outfitAccent: '#2563eb',  // Royal cobalt adventurer vest
    pants: '#334155',        // Slate travel trousers
    shoes: '#78350f',        // Burnished leather boots
    isFemale: false,
  });

  // Lauren: Female, forest green pinafore dress, auburn braided hair with flower clip
  drawCharacterSheet('char_lauren', {
    hair: '#b45309',          // Rich auburn / amber
    hairHighlight: '#f59e0b', // Golden amber shine
    skin: '#ffedd5',          // Soft fair skin
    skinShadow: '#fed7aa',    // Peachy shadow
    eyeColor: '#059669',      // Bright emerald green eyes
    outfitMain: '#fef3c7',    // Cream blouse
    outfitAccent: '#059669',  // Forest emerald dress
    pants: '#047857',        // Emerald leggings
    shoes: '#573318',        // Timberland boots
    isFemale: true,
  });
}
