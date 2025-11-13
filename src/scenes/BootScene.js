import Phaser from 'phaser';
import CONFIG from '../config.js';
import SpriteGenerator from '../systems/SpriteGenerator.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
    this.selectedDifficulty = CONFIG.DEFAULT_DIFFICULTY;
  }

  preload() {
    // Display loading text
    const loadingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Generating pixel art sprites...',
      {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Generate all pixel art sprites programmatically
    const spriteGen = new SpriteGenerator(this);
    spriteGen.generateAllSprites();

    loadingText.destroy();
  }

  create() {
    console.log('BootScene: Assets loaded');

    // Background
    this.cameras.main.setBackgroundColor('#000000');

    // Add title
    this.add.text(
      this.cameras.main.centerX,
      80,
      'PICO AZTEC',
      {
        fontSize: '72px',
        fill: '#ff6600',
        fontFamily: 'monospace',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Subtitle
    this.add.text(
      this.cameras.main.centerX,
      160,
      'Temple of the Lost Idol',
      {
        fontSize: '24px',
        fill: '#ffaa00',
        fontFamily: 'monospace',
        fontStyle: 'italic'
      }
    ).setOrigin(0.5);

    // Controls
    const instructions = [
      'CONTROLS',
      '',
      'Arrow Keys: Move Left/Right',
      'Up/Down on Stairs: Climb',
      'Space: Jump',
      'X: Shoot',
      'C: Machete',
      'E: Open Chest'
    ];

    this.add.text(
      this.cameras.main.centerX,
      260,
      instructions.join('\n'),
      {
        fontSize: '18px',
        fill: '#fff',
        fontFamily: 'monospace',
        align: 'center',
        lineSpacing: 4
      }
    ).setOrigin(0.5);

    // Difficulty selection
    this.add.text(
      this.cameras.main.centerX,
      480,
      'SELECT DIFFICULTY',
      {
        fontSize: '24px',
        fill: '#ffff00',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Create difficulty buttons
    this.createDifficultyButtons();

    // Start instruction
    this.startText = this.add.text(
      this.cameras.main.centerX,
      680,
      'Press SPACE to Start',
      {
        fontSize: '28px',
        fill: '#00ff00',
        fontFamily: 'monospace'
      }
    ).setOrigin(0.5);

    // Pulsing animation for start text
    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on spacebar
    this.input.keyboard.on('keydown-SPACE', () => {
      this.startGame();
    });

    // Difficulty selection with number keys
    this.input.keyboard.on('keydown-ONE', () => this.selectDifficulty('EASY'));
    this.input.keyboard.on('keydown-TWO', () => this.selectDifficulty('MEDIUM'));
    this.input.keyboard.on('keydown-THREE', () => this.selectDifficulty('HARD'));
  }

  createDifficultyButtons() {
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];
    const buttonY = 540;
    const buttonSpacing = 200;
    const startX = this.cameras.main.centerX - buttonSpacing;

    this.difficultyButtons = {};

    difficulties.forEach((difficulty, index) => {
      const x = startX + (index * buttonSpacing);
      const config = CONFIG.DIFFICULTY[difficulty];

      // Button background
      const button = this.add.rectangle(x, buttonY, 180, 60, 0x444444);
      button.setInteractive({ useHandCursor: true });

      // Button text
      const text = this.add.text(x, buttonY - 10, difficulty, {
        fontSize: '20px',
        fill: '#fff',
        fontFamily: 'monospace'
      }).setOrigin(0.5);

      // Temple size info
      const sizeText = this.add.text(x, buttonY + 15, `${config.width}x${config.depth} screens`, {
        fontSize: '14px',
        fill: '#aaa',
        fontFamily: 'monospace'
      }).setOrigin(0.5);

      // Number key hint
      const keyHint = this.add.text(x, buttonY - 45, `[${index + 1}]`, {
        fontSize: '16px',
        fill: '#666',
        fontFamily: 'monospace'
      }).setOrigin(0.5);

      // Store references
      this.difficultyButtons[difficulty] = {
        button,
        text,
        sizeText,
        keyHint
      };

      // Click handler
      button.on('pointerdown', () => {
        this.selectDifficulty(difficulty);
      });

      // Hover effects
      button.on('pointerover', () => {
        button.setFillStyle(0x666666);
      });

      button.on('pointerout', () => {
        if (this.selectedDifficulty !== difficulty) {
          button.setFillStyle(0x444444);
        }
      });
    });

    // Highlight default selection
    this.updateDifficultySelection();
  }

  selectDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    this.updateDifficultySelection();
  }

  updateDifficultySelection() {
    Object.keys(this.difficultyButtons).forEach(difficulty => {
      const { button, text } = this.difficultyButtons[difficulty];

      if (difficulty === this.selectedDifficulty) {
        button.setFillStyle(0x00aa00);
        text.setFill('#ffffff');
      } else {
        button.setFillStyle(0x444444);
        text.setFill('#fff');
      }
    });
  }

  startGame() {
    console.log(`Starting game with ${this.selectedDifficulty} difficulty`);
    this.scene.start('GameScene', { difficulty: this.selectedDifficulty });
  }
}
