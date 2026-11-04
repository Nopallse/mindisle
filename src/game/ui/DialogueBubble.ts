import * as Phaser from 'phaser';
import { CharacterId } from '../../types/character';

export class DialogueBubble extends Phaser.GameObjects.Container {
  private bgGraphics: Phaser.GameObjects.Graphics;
  private namePillBg: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private dialogueText: Phaser.GameObjects.Text;
  private dismissTimer?: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    characterId: CharacterId,
    characterName: string,
    message: string
  ) {
    super(scene, x, y);

    const isNaufal = characterId === 'naufal';
    const pillColor = isNaufal ? 0x2563eb : 0xe11d48; // Blue for Naufal, Rose for Lauren

    // 1. Text Object to measure dimensions
    const maxTextWidth = 180;
    this.dialogueText = scene.add.text(0, 0, message, {
      fontFamily: 'monospace, sans-serif',
      fontSize: '11px',
      color: '#1e293b',
      wordWrap: { width: maxTextWidth, useAdvancedWrap: true },
      lineSpacing: 3,
    });
    this.dialogueText.setOrigin(0.5, 0.5);

    const bubbleWidth = Math.max(120, Math.min(maxTextWidth + 24, this.dialogueText.width + 24));
    const bubbleHeight = Math.max(38, this.dialogueText.height + 20);

    // 2. Speech Bubble Graphics (Rounded rectangle with border and pointer tail)
    this.bgGraphics = scene.add.graphics();

    // Dark outer border
    this.bgGraphics.fillStyle(0x2e2820, 1.0);
    this.bgGraphics.fillRoundedRect(
      -bubbleWidth / 2 - 2,
      -bubbleHeight / 2 - 2,
      bubbleWidth + 4,
      bubbleHeight + 4,
      8
    );
    // Border pointer tail
    this.bgGraphics.fillTriangle(
      -8,
      bubbleHeight / 2 + 1,
      8,
      bubbleHeight / 2 + 1,
      0,
      bubbleHeight / 2 + 10
    );

    // Cream inner fill
    this.bgGraphics.fillStyle(0xfffbf0, 1.0);
    this.bgGraphics.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      7
    );
    // Inner pointer tail
    this.bgGraphics.fillTriangle(
      -6,
      bubbleHeight / 2,
      6,
      bubbleHeight / 2,
      0,
      bubbleHeight / 2 + 8
    );

    // 3. Name Pill Header positioned above top-left of the bubble
    const pillWidth = Math.max(46, characterName.length * 8 + 14);
    const pillHeight = 18;
    const pillX = -bubbleWidth / 2 + 12;
    const pillY = -bubbleHeight / 2 - 8;

    this.namePillBg = scene.add.graphics();
    // Pill dark border
    this.namePillBg.fillStyle(0x1e293b, 1.0);
    this.namePillBg.fillRoundedRect(pillX - 1, pillY - 1, pillWidth + 2, pillHeight + 2, 7);
    // Pill colored fill
    this.namePillBg.fillStyle(pillColor, 1.0);
    this.namePillBg.fillRoundedRect(pillX, pillY, pillWidth, pillHeight, 6);

    this.nameText = scene.add.text(pillX + pillWidth / 2, pillY + pillHeight / 2, characterName, {
      fontFamily: 'monospace, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffffff',
    });
    this.nameText.setOrigin(0.5, 0.5);

    // Add children to container
    this.add([this.bgGraphics, this.dialogueText, this.namePillBg, this.nameText]);
    this.setDepth(1000); // Always render on top
    this.setAlpha(0);
    this.setScale(0.85);

    scene.add.existing(this);

    // Entrance animation
    scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut',
    });

    // Auto dismiss after 6 seconds
    this.dismissTimer = scene.time.delayedCall(6000, () => {
      this.dismiss();
    });
  }

  public dismiss(): void {
    if (this.dismissTimer) {
      this.dismissTimer.remove();
    }
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.85,
      scaleY: 0.85,
      duration: 250,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
