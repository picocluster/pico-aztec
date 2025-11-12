import CONFIG from '../config.js';
import Spider from '../entities/Spider.js';
import Tiger from '../entities/Tiger.js';
import Warrior from '../entities/Warrior.js';
import TreasureChest from '../entities/TreasureChest.js';
import Stairs from '../entities/Stairs.js';

/**
 * Procedurally generates the Aztec temple
 */
export default class TempleGenerator {
  constructor(scene, difficulty = 'EASY') {
    this.scene = scene;
    this.difficulty = CONFIG.DIFFICULTY[difficulty];
    this.templeWidth = this.difficulty.width;
    this.templeDepth = this.difficulty.depth;

    this.platforms = [];
    this.stairs = [];
    this.enemies = [];
    this.chests = [];
    this.idol = null;
  }

  generate() {
    console.log(`Generating ${this.difficulty.name} temple: ${this.templeWidth}x${this.templeDepth}`);

    // Generate each screen
    for (let screenY = 0; screenY < this.templeDepth; screenY++) {
      for (let screenX = 0; screenX < this.templeWidth; screenX++) {
        this.generateScreen(screenX, screenY);
      }
    }

    // Place idol at the bottom center of the temple
    this.placeIdol();

    return {
      platforms: this.platforms,
      stairs: this.stairs,
      enemies: this.enemies,
      chests: this.chests,
      idol: this.idol
    };
  }

  generateScreen(screenX, screenY) {
    const offsetX = screenX * CONFIG.WIDTH;
    const offsetY = screenY * CONFIG.HEIGHT;

    // Generate platforms for this screen
    const numPlatforms = CONFIG.PLATFORMS_PER_SCREEN;
    const platformHeight = CONFIG.HEIGHT / (numPlatforms + 1);

    for (let i = 0; i < numPlatforms; i++) {
      const y = offsetY + platformHeight * (i + 1);
      this.createPlatform(offsetX, y, screenX, screenY, i);
    }

    // Add stairs connecting platforms
    this.createStairs(offsetX, offsetY, platformHeight);

    // Spawn enemies (more enemies deeper in the temple)
    this.spawnEnemies(offsetX, offsetY, screenY);

    // Maybe spawn a treasure chest
    if (Math.random() < CONFIG.CHEST_SPAWN_CHANCE) {
      this.spawnChest(offsetX, offsetY);
    }
  }

  createPlatform(offsetX, y, screenX, screenY, level) {
    // Randomize platform width and position
    const minWidth = 200;
    const maxWidth = 600;
    const width = Phaser.Math.Between(minWidth, maxWidth);

    // Random X position within screen bounds
    const x = offsetX + Phaser.Math.Between(width / 2 + 50, CONFIG.WIDTH - width / 2 - 50);

    const platform = this.scene.add.rectangle(x, y, width, 20, 0x8B4513);
    this.scene.physics.add.existing(platform, true);

    this.platforms.push(platform);

    return platform;
  }

  createStairs(offsetX, offsetY, platformHeight) {
    // Create 1-2 stairs per screen to connect levels
    const numStairs = Phaser.Math.Between(1, 2);

    for (let i = 0; i < numStairs; i++) {
      const x = offsetX + Phaser.Math.Between(100, CONFIG.WIDTH - 100);
      const y = offsetY + Phaser.Math.Between(platformHeight, CONFIG.HEIGHT - platformHeight);

      const stairs = new Stairs(this.scene, x, y, 40, 80);
      this.stairs.push(stairs);
    }
  }

  spawnEnemies(offsetX, offsetY, depth) {
    // Difficulty increases with depth
    const numEnemies = Math.floor(depth / 2) + Phaser.Math.Between(1, 3);

    for (let i = 0; i < numEnemies; i++) {
      const x = offsetX + Phaser.Math.Between(100, CONFIG.WIDTH - 100);
      const y = offsetY + Phaser.Math.Between(100, CONFIG.HEIGHT - 100);

      // Enemy type based on depth
      let enemy;
      const rand = Math.random();

      if (depth < 2) {
        // Early levels: mostly spiders
        enemy = new Spider(this.scene, x, y);
      } else if (depth < 4) {
        // Mid levels: mix of spiders and tigers
        enemy = rand < 0.6 ? new Spider(this.scene, x, y) : new Tiger(this.scene, x, y);
      } else {
        // Deep levels: all enemy types
        if (rand < 0.3) {
          enemy = new Spider(this.scene, x, y);
        } else if (rand < 0.7) {
          enemy = new Tiger(this.scene, x, y);
        } else {
          enemy = new Warrior(this.scene, x, y);
        }
      }

      this.enemies.push(enemy);
    }
  }

  spawnChest(offsetX, offsetY) {
    const x = offsetX + Phaser.Math.Between(150, CONFIG.WIDTH - 150);
    const y = offsetY + Phaser.Math.Between(150, CONFIG.HEIGHT - 150);

    const chest = new TreasureChest(this.scene, x, y);
    this.chests.push(chest);
  }

  placeIdol() {
    // Place idol at bottom center
    const centerX = (this.templeWidth / 2) * CONFIG.WIDTH;
    const bottomY = (this.templeDepth - 1) * CONFIG.HEIGHT + CONFIG.HEIGHT - 100;

    this.idol = this.scene.add.rectangle(centerX, bottomY, 20, 30, 0xFFD700);
    this.scene.physics.add.existing(this.idol, true);

    // Make it glow
    this.idol.setStrokeStyle(4, 0xFFFF00);

    // Add pulsing animation
    this.scene.tweens.add({
      targets: this.idol,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  getSpawnPoint() {
    // Player starts at top-center of temple
    return {
      x: (this.templeWidth / 2) * CONFIG.WIDTH,
      y: 100
    };
  }

  getExitPoint() {
    // Exit is at top-center (same as spawn)
    return this.getSpawnPoint();
  }
}
