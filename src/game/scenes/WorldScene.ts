import * as Phaser from 'phaser';
import { generatePixelArtAssets } from '../assets/pixelArtGenerator';
import { WorldState } from '../../simulation/world/WorldState';
import { CharacterId, Direction } from '../../types/character';
import { GameBridge, CameraAction } from '../GameBridge';

interface CharacterVisual {
  sprite: Phaser.GameObjects.Sprite;
  nameTag: Phaser.GameObjects.Text;
  selectionRing: Phaser.GameObjects.Graphics;
  emoteContainer: Phaser.GameObjects.Container;
  emoteText: Phaser.GameObjects.Text;
  emoteBg: Phaser.GameObjects.Graphics;
  lastEmoteTimer: number;
  dustTimer?: number;
}

export class WorldScene extends Phaser.Scene {
  private worldState: WorldState;
  private gameBridge: GameBridge;

  private characters: Map<CharacterId, CharacterVisual> = new Map();
  private waterTiles: Phaser.GameObjects.Sprite[] = [];
  private waterTimer = 0;
  private ambientOverlay?: Phaser.GameObjects.Graphics;

  // Camera dragging & zoom state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;

  // Unsubscribe callbacks
  private unsubscribeCamera?: () => void;

  constructor() {
    super({ key: 'WorldScene' });
    this.worldState = WorldState.getInstance();
    this.gameBridge = GameBridge.getInstance();
  }

  public preload(): void {
    generatePixelArtAssets(this);
  }

  public create(): void {
    // Generate assets as safeguard
    generatePixelArtAssets(this);

    const gridMap = this.worldState.gridMap;
    const mapPixelWidth = gridMap.width * gridMap.tileSize;
    const mapPixelHeight = gridMap.height * gridMap.tileSize;

    // 1. Render Map Tiles & Props
    this.createMapLayers();

    // 2. Ambient Floating Particles (Flower petals & gentle wind)
    this.createAmbientParticles(mapPixelWidth, mapPixelHeight);

    // 3. Day / Night Ambient Lighting Overlay
    this.createDayNightLighting(mapPixelWidth, mapPixelHeight);

    // 4. Create Character Animations
    this.createCharacterAnimations('char_naufal');
    this.createCharacterAnimations('char_lauren');

    // 5. Create Characters
    this.createCharacterEntities();

    // 6. Setup Camera & Bounds
    this.cameras.main.setBounds(0, 0, mapPixelWidth, mapPixelHeight);
    this.cameras.main.setZoom(1.5);
    // Center initially on crossroads
    this.cameras.main.centerOn(11 * 32, 10 * 32);

    // 7. Setup Camera Input Controls (Drag to Pan, Wheel to Zoom)
    this.setupCameraInput();

    // 8. Listen to GameBridge Camera Actions
    this.unsubscribeCamera = this.gameBridge.onCameraAction((action: CameraAction) => {
      this.handleCameraAction(action);
    });
  }

  private createMapLayers(): void {
    const gridMap = this.worldState.gridMap;
    const allTiles = gridMap.getAllTiles();

    for (let y = 0; y < gridMap.height; y++) {
      for (let x = 0; x < gridMap.width; x++) {
        const tile = allTiles[y][x];
        const worldX = x * gridMap.tileSize + gridMap.tileSize / 2;
        const worldY = y * gridMap.tileSize + gridMap.tileSize / 2;

        const isGroundTile =
          tile.type === 'grass' ||
          tile.type === 'grass_dense' ||
          tile.type === 'grass_flowers' ||
          tile.type === 'path' ||
          tile.type === 'water' ||
          tile.type === 'sand' ||
          tile.type === 'garden' ||
          tile.type === 'pier' ||
          tile.type === 'bridge';

        if (isGroundTile) {
          const groundSprite = this.add.sprite(worldX, worldY, `tile_${tile.type}`);
          groundSprite.setDepth(0);
          if (tile.type === 'water') {
            this.waterTiles.push(groundSprite);
          }
        } else {
          // Render underlying lush grass first
          const underGrass = this.add.sprite(worldX, worldY, 'tile_grass');
          underGrass.setDepth(0);

          // Elevated Obstacle or Prop
          const obstacle = this.add.sprite(worldX, worldY, `tile_${tile.type}`);
          // Depth sorted by worldY for authentic top-down perspective overlap
          obstacle.setDepth(worldY + 5);

          // Dynamic light sources
          if (tile.type === 'campfire') {
            this.createCampfireLight(worldX, worldY);
          } else if (tile.type === 'lantern') {
            this.createLanternLight(worldX, worldY);
          }
        }
      }
    }
  }

  private createCampfireLight(x: number, y: number): void {
    const glow = this.add.graphics();
    glow.setDepth(y - 1);
    glow.setPosition(x, y + 2);

    // Multi-layer warm ambient halo centered at (0, 0)
    glow.fillStyle(0xf97316, 0.16);
    glow.fillCircle(0, 0, 24);
    glow.fillStyle(0xfbbf24, 0.22);
    glow.fillCircle(0, 0, 15);
    glow.fillStyle(0xfef08a, 0.30);
    glow.fillCircle(0, 0, 8);

    // Gentle organic flame flicker: only subtle alpha shift, stays strictly in place!
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.75, to: 1.0 },
      duration: 450,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createLanternLight(x: number, y: number): void {
    const glow = this.add.graphics();
    glow.setDepth(y - 1);
    glow.setPosition(x + 5, y - 2);

    // Multi-layer warm amber glow centered at (0, 0)
    glow.fillStyle(0xf59e0b, 0.14);
    glow.fillCircle(0, 0, 18);
    glow.fillStyle(0xfef08a, 0.22);
    glow.fillCircle(0, 0, 8);

    // Gentle candle flicker in place
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.80, to: 1.0 },
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createAmbientParticles(mapWidth: number, mapHeight: number): void {
    // 1. Drifting flower petals & gentle wind sparkles
    for (let i = 0; i < 22; i++) {
      const rx = Phaser.Math.Between(32, mapWidth - 32);
      const ry = Phaser.Math.Between(32, mapHeight - 32);
      const isPetal = i % 2 === 0;

      const particle = this.add.graphics();
      particle.setDepth(700);
      particle.fillStyle(isPetal ? 0xf472b6 : 0xa3e635, 0.75);
      particle.fillCircle(0, 0, isPetal ? 2 : 2.5);
      particle.setPosition(rx, ry);

      this.tweens.add({
        targets: particle,
        x: rx + Phaser.Math.Between(80, 160),
        y: ry + Phaser.Math.Between(50, 100),
        alpha: { from: 0.8, to: 0.15 },
        duration: Phaser.Math.Between(4500, 7500),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          particle.setPosition(
            Phaser.Math.Between(32, mapWidth - 32),
            Phaser.Math.Between(32, mapHeight - 32)
          );
        },
      });
    }

    // 2. Fluttering Nature Butterflies
    const butterflyTints = [0x60a5fa, 0xf472b6, 0xfacc15, 0x4ade80];
    for (let b = 0; b < 5; b++) {
      const bx = Phaser.Math.Between(80, mapWidth - 80);
      const by = Phaser.Math.Between(80, mapHeight - 80);
      const tint = butterflyTints[b % butterflyTints.length];

      const bFly = this.add.graphics();
      bFly.setDepth(720);
      bFly.fillStyle(tint, 0.95);
      bFly.fillCircle(-2, -1, 2);
      bFly.fillCircle(2, -1, 2);
      bFly.fillStyle(0x1e293b, 0.9);
      bFly.fillRect(-0.5, -2, 1, 4);
      bFly.setPosition(bx, by);

      // Wing flapping animation
      this.tweens.add({
        targets: bFly,
        scaleX: 0.35,
        yoyo: true,
        repeat: -1,
        duration: 140,
        ease: 'Sine.easeInOut',
      });

      // Drifting flight path
      this.tweens.add({
        targets: bFly,
        x: { value: `+=${Phaser.Math.Between(-60, 60)}`, duration: 3200, yoyo: true, repeat: -1 },
        y: { value: `+=${Phaser.Math.Between(-40, 40)}`, duration: 2500, yoyo: true, repeat: -1 },
        ease: 'Quad.easeInOut',
      });
    }
  }

  private createDayNightLighting(mapWidth: number, mapHeight: number): void {
    this.ambientOverlay = this.add.graphics();
    this.ambientOverlay.setDepth(999); // Ambient tint layer
    this.updateAmbientLighting(mapWidth, mapHeight);
  }

  private updateAmbientLighting(mapWidth?: number, mapHeight?: number): void {
    if (!this.ambientOverlay) return;

    const w = mapWidth || this.worldState.gridMap.width * 32;
    const h = mapHeight || this.worldState.gridMap.height * 32;
    const hour = this.worldState.clock.getTime().hour;

    this.ambientOverlay.clear();

    if (hour >= 6 && hour < 9) {
      // Golden Sunrise
      this.ambientOverlay.fillStyle(0xfde68a, 0.10);
      this.ambientOverlay.fillRect(0, 0, w, h);
    } else if (hour >= 17 && hour < 20) {
      // Warm Sunset Golden Hour
      this.ambientOverlay.fillStyle(0xf97316, 0.16);
      this.ambientOverlay.fillRect(0, 0, w, h);
    } else if (hour >= 20 || hour < 6) {
      // Cozy Twilight Navy
      this.ambientOverlay.fillStyle(0x1e1b4b, 0.36);
      this.ambientOverlay.fillRect(0, 0, w, h);
    }
  }

  private createCharacterAnimations(textureKey: string): void {
    const dirs: Array<{ dir: Direction; startFrame: number }> = [
      { dir: 'down', startFrame: 0 },
      { dir: 'left', startFrame: 4 },
      { dir: 'right', startFrame: 8 },
      { dir: 'up', startFrame: 12 },
    ];

    dirs.forEach(({ dir, startFrame }) => {
      const walkKey = `${textureKey}_walk_${dir}`;
      if (!this.anims.exists(walkKey)) {
        this.anims.create({
          key: walkKey,
          frames: [startFrame, startFrame + 1, startFrame, startFrame + 3].map((f) => ({
            key: textureKey,
            frame: f,
          })),
          frameRate: 6,
          repeat: -1,
        });
      }

      const idleKey = `${textureKey}_idle_${dir}`;
      if (!this.anims.exists(idleKey)) {
        this.anims.create({
          key: idleKey,
          frames: [{ key: textureKey, frame: startFrame }],
          frameRate: 1,
        });
      }
    });
  }

  private createCharacterEntities(): void {
    const snapshot = this.worldState.getSnapshot();

    for (const [idStr, char] of Object.entries(snapshot.characters)) {
      const id = idStr as CharacterId;
      const textureKey = id === 'naufal' ? 'char_naufal' : 'char_lauren';

      // Character Sprite
      const sprite = this.add.sprite(char.worldX, char.worldY, textureKey, 0);
      sprite.setDepth(char.worldY + 10);
      sprite.setInteractive({ useHandCursor: true });

      // Selection ring indicator
      const selectionRing = this.add.graphics();
      selectionRing.setDepth(char.worldY + 1);

      // Name tag with pill styling
      const nameTag = this.add.text(char.worldX, char.worldY - 26, char.name, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        padding: { x: 5, y: 2 },
      });
      nameTag.setOrigin(0.5, 0.5);
      nameTag.setDepth(char.worldY + 20);

      // Emote Bubble Container
      const emoteContainer = this.add.container(char.worldX, char.worldY - 42);
      emoteContainer.setDepth(char.worldY + 30);
      emoteContainer.setAlpha(0);

      const emoteBg = this.add.graphics();
      emoteBg.fillStyle(0xffffff, 0.95);
      emoteBg.fillRoundedRect(-12, -10, 24, 20, 6);
      emoteBg.fillStyle(0xffffff, 0.95);
      emoteBg.fillTriangle(-3, 10, 3, 10, 0, 14);

      const emoteText = this.add.text(0, 0, '✨', {
        fontSize: '12px',
      });
      emoteText.setOrigin(0.5, 0.5);

      emoteContainer.add([emoteBg, emoteText]);

      const visual: CharacterVisual = {
        sprite,
        nameTag,
        selectionRing,
        emoteContainer,
        emoteText,
        emoteBg,
        lastEmoteTimer: id === 'naufal' ? 4000 : 8000,
      };

      // Click to select character & play joyful bounce reaction
      sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.leftButtonDown()) {
          this.gameBridge.focusCharacter(id);
          this.playCharacterJoyReaction(visual, id);
        }
      });

      this.characters.set(id, visual);
    }
  }

  private playCharacterJoyReaction(visual: CharacterVisual, id: CharacterId): void {
    // 1. Joyful bounce tween
    this.tweens.add({
      targets: visual.sprite,
      scaleY: 1.22,
      scaleX: 0.92,
      yoyo: true,
      duration: 160,
      ease: 'Back.easeOut',
    });

    // 2. Overhead heart or sparkle reaction
    const emote = id === 'naufal' ? '✨' : '💖';
    this.showEmoteBubble(visual, emote, 1800);
  }

  private showEmoteBubble(visual: CharacterVisual, emote: string, duration = 2000): void {
    visual.emoteText.setText(emote);
    visual.emoteContainer.setAlpha(1);
    visual.emoteContainer.setScale(0.7);

    this.tweens.add({
      targets: visual.emoteContainer,
      scale: 1.0,
      duration: 200,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: visual.emoteContainer,
      y: visual.emoteContainer.y - 8,
      alpha: 0,
      delay: duration - 500,
      duration: 500,
      ease: 'Sine.easeIn',
      onComplete: () => {
        visual.emoteContainer.setAlpha(0);
      },
    });
  }

  private spawnFootstepDust(x: number, y: number): void {
    const dust = this.add.graphics();
    dust.setDepth(y + 2);
    dust.fillStyle(0xd1d5db, 0.45);
    dust.fillCircle(x + (Math.random() * 8 - 4), y, 2.5);

    this.tweens.add({
      targets: dust,
      alpha: 0,
      scaleX: 1.6,
      scaleY: 1.6,
      y: y - 5,
      duration: 320,
      ease: 'Sine.easeOut',
      onComplete: () => {
        dust.destroy();
      },
    });
  }

  private setupCameraInput(): void {
    // Mouse drag to pan
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const dx = (pointer.x - this.dragStartX) / this.cameras.main.zoom;
        const dy = (pointer.y - this.dragStartY) / this.cameras.main.zoom;
        this.cameras.main.scrollX -= dx;
        this.cameras.main.scrollY -= dy;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
      }
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });

    // Mouse wheel to zoom
    this.input.on('wheel', (
      _pointer: Phaser.Input.Pointer,
      _gameObjects: unknown[],
      _deltaX: number,
      deltaY: number
    ) => {
      const currentZoom = this.cameras.main.zoom;
      const zoomChange = deltaY > 0 ? -0.15 : 0.15;
      const newZoom = Phaser.Math.Clamp(currentZoom + zoomChange, 1.0, 3.0);
      this.cameras.main.setZoom(newZoom);
    });
  }

  private handleCameraAction(action: CameraAction): void {
    const cam = this.cameras.main;
    switch (action.type) {
      case 'ZOOM_IN':
        cam.setZoom(Phaser.Math.Clamp(cam.zoom + 0.25, 1.0, 3.0));
        break;
      case 'ZOOM_OUT':
        cam.setZoom(Phaser.Math.Clamp(cam.zoom - 0.25, 1.0, 3.0));
        break;
      case 'RESET_ZOOM':
        cam.setZoom(1.5);
        break;
      case 'FOCUS_CHARACTER': {
        const char = this.worldState.getCharacter(action.characterId);
        if (char) {
          cam.pan(char.worldX, char.worldY, 400, 'Sine.easeInOut');
        }
        break;
      }
    }
  }

  public update(_time: number, delta: number): void {
    // 1. Authoritative world simulation tick
    this.worldState.update(delta);

    // 2. Water ripple shimmer
    this.waterTimer += delta;
    if (this.waterTimer > 600) {
      this.waterTimer = 0;
      for (const w of this.waterTiles) {
        w.setAlpha(0.92 + Math.random() * 0.08);
      }
      this.updateAmbientLighting();
    }

    // 3. Sync visual character entities with simulation state
    const snapshot = this.worldState.getSnapshot();
    const selectedId = this.gameBridge.getSelectedCharacter();

    for (const [id, visual] of this.characters.entries()) {
      const charData = snapshot.characters[id];
      if (!charData) continue;

      const { sprite, nameTag, selectionRing, emoteContainer } = visual;
      const textureKey = id === 'naufal' ? 'char_naufal' : 'char_lauren';

      // Update positions
      sprite.setPosition(charData.worldX, charData.worldY);
      sprite.setDepth(charData.worldY + 10);

      nameTag.setPosition(charData.worldX, charData.worldY - 24);
      nameTag.setDepth(charData.worldY + 20);

      emoteContainer.setPosition(charData.worldX, charData.worldY - 42);
      emoteContainer.setDepth(charData.worldY + 30);

      // Selection ring indicator
      selectionRing.clear();
      if (selectedId === id) {
        selectionRing.lineStyle(2, 0xfacc15, 0.95);
        selectionRing.strokeEllipse(charData.worldX, charData.worldY + 14, 20, 10);
        selectionRing.setDepth(charData.worldY + 1);
      }

      // Footstep dust puffs when walking
      const isWalking = charData.activity === 'walking';
      if (isWalking) {
        if (!visual.dustTimer) visual.dustTimer = 0;
        visual.dustTimer += delta;
        if (visual.dustTimer > 200) {
          visual.dustTimer = 0;
          this.spawnFootstepDust(charData.worldX, charData.worldY + 12);
        }
      } else {
        // Idle breathing bounce effect (subtle vertical breathing every ~1.2s)
        const breathe = Math.sin(_time / 300) * 0.7;
        sprite.setY(charData.worldY + breathe);
      }

      // Occasional charming spontaneous emote
      visual.lastEmoteTimer -= delta;
      if (visual.lastEmoteTimer <= 0) {
        visual.lastEmoteTimer = 12000 + Math.random() * 10000;
        const emotes = id === 'naufal' ? ['👀', '✨', '🚶', '💡', '🗺️'] : ['🌸', '🌿', '💭', '🍵', '🦋'];
        const chosen = emotes[Math.floor(Math.random() * emotes.length)];
        this.showEmoteBubble(visual, chosen, 2500);
      }

      // Update animations based on state
      const animKey = isWalking
        ? `${textureKey}_walk_${charData.direction}`
        : `${textureKey}_idle_${charData.direction}`;

      if (sprite.anims.currentAnim?.key !== animKey) {
        sprite.play(animKey, true);
      }
    }
  }

  public shutdown(): void {
    if (this.unsubscribeCamera) {
      this.unsubscribeCamera();
    }
  }
}
