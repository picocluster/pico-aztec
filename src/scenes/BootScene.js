import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Display loading text
    const loadingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'LOADING...',
      {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // TODO: Load assets here
    // this.load.image('player', 'assets/sprites/player.png');
    // this.load.image('enemy', 'assets/sprites/enemy.png');
    // etc.

    // For now, we'll create placeholder graphics in the GameScene
  }

  create() {
    console.log('BootScene: Assets loaded');

    // Add title screen
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      'PICO AZTEC',
      {
        fontSize: '48px',
        fill: '#ff6600',
        fontFamily: 'monospace',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    const instructions = [
      'Arrow Keys: Move',
      'Space: Jump',
      'Z: Load Gun',
      'X: Shoot',
      'C: Machete',
      'E: Open Chest',
      '',
      'Press SPACE to Start'
    ];

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 50,
      instructions.join('\n'),
      {
        fontSize: '16px',
        fill: '#fff',
        fontFamily: 'monospace',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Start game on spacebar
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
