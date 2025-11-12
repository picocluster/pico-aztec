import Phaser from 'phaser';
import CONFIG from './config.js';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: CONFIG.SCALE_MODE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONFIG.GRAVITY },
      debug: CONFIG.DEBUG_MODE
    }
  },
  pixelArt: CONFIG.PIXEL_ART,
  scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);

export default game;
