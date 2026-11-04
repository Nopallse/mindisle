import * as Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

export function createGameConfig(containerId: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: containerId,
    width: 960,
    height: 640,
    backgroundColor: '#1b4332',
    pixelArt: true,
    render: {
      antialias: false,
      roundPixels: true,
      pixelArt: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 640,
    },
    scene: [WorldScene],
  };
}

