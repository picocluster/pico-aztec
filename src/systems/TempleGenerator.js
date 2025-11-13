import CONFIG from '../config.js';
import Spider from '../entities/Spider.js';
import Tiger from '../entities/Tiger.js';
import Warrior from '../entities/Warrior.js';
import TreasureChest from '../entities/TreasureChest.js';
import Stairs from '../entities/Stairs.js';
import Gem from '../entities/Gem.js';

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
    this.gems = [];
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
      gems: this.gems,
      idol: this.idol
    };
  }

  generateScreen(screenX, screenY) {
    const offsetX = screenX * CONFIG.WIDTH;
    const offsetY = screenY * CONFIG.HEIGHT;

    // Generate platforms for this screen and store their positions
    const numPlatforms = CONFIG.PLATFORMS_PER_SCREEN;
    const platformHeight = CONFIG.HEIGHT / (numPlatforms + 1);
    const screenPlatforms = [];

    for (let i = 0; i < numPlatforms; i++) {
      const y = offsetY + platformHeight * (i + 1);
      const platform = this.createPlatform(offsetX, y, screenX, screenY, i);
      screenPlatforms.push({
        platform: platform,
        x: platform.x,
        y: platform.y,
        width: platform.width,
        level: i
      });
    }

    // Add stairs connecting platforms
    this.createStairsConnectingPlatforms(screenPlatforms);

    // Spawn enemies (more enemies deeper in the temple)
    this.spawnEnemies(offsetX, offsetY, screenY);

    // Maybe spawn a treasure chest
    if (Math.random() < CONFIG.CHEST_SPAWN_CHANCE) {
      this.spawnChest(offsetX, offsetY);
    }

    // Spawn gems
    if (Math.random() < CONFIG.GEM_SPAWN_CHANCE) {
      this.spawnGems(offsetX, offsetY);
    }
  }

  createPlatform(offsetX, y, screenX, screenY, level) {
    // Randomize platform width and position
    const width = Phaser.Math.Between(CONFIG.PLATFORM_MIN_WIDTH, CONFIG.PLATFORM_MAX_WIDTH);

    // Random X position within screen bounds
    const x = offsetX + Phaser.Math.Between(width / 2 + 50, CONFIG.WIDTH - width / 2 - 50);

    // Create colorful platform
    const platform = this.scene.add.rectangle(
      x, y,
      width, CONFIG.PLATFORM_HEIGHT,
      CONFIG.COLORS.PLATFORM
    );
    this.scene.physics.add.existing(platform, true);

    // Add shadow/depth effect
    const shadow = this.scene.add.rectangle(
      x, y + 2,
      width, CONFIG.PLATFORM_HEIGHT - 2,
      CONFIG.COLORS.PLATFORM_SHADOW
    );
    shadow.setDepth(-1);

    this.platforms.push(platform);

    return platform;
  }

  createStairsConnectingPlatforms(screenPlatforms) {
    // Create stairs that connect each adjacent pair of platforms
    for (let i = 0; i < screenPlatforms.length - 1; i++) {
      const upperPlatform = screenPlatforms[i];
      const lowerPlatform = screenPlatforms[i + 1];

      // Position stairs to connect the platforms
      // Start on the edge of upper platform, end on edge of lower platform
      const stairWidth = 200; // Wide enough to be visible and usable
      const stairHeight = Math.abs(lowerPlatform.y - upperPlatform.y);

      // Choose a side (left or right) for the stairs
      const onLeft = Math.random() < 0.5;

      let stairX, stairY;

      if (onLeft) {
        // Place stairs on left side
        stairX = Math.min(upperPlatform.x - upperPlatform.width/4, lowerPlatform.x - lowerPlatform.width/4);
      } else {
        // Place stairs on right side
        stairX = Math.max(upperPlatform.x + upperPlatform.width/4, lowerPlatform.x + lowerPlatform.width/4);
      }

      // Vertical position: between the two platforms
      stairY = (upperPlatform.y + lowerPlatform.y) / 2;

      const stairs = new Stairs(this.scene, stairX, stairY, stairWidth, stairHeight);
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

  spawnGems(offsetX, offsetY) {
    // Spawn 1-3 gems per screen
    const numGems = Phaser.Math.Between(1, 3);

    for (let i = 0; i < numGems; i++) {
      const x = offsetX + Phaser.Math.Between(100, CONFIG.WIDTH - 100);
      const y = offsetY + Phaser.Math.Between(100, CONFIG.HEIGHT - 100);

      const gem = new Gem(this.scene, x, y);
      this.gems.push(gem);
    }
  }

  placeIdol() {
    // Place idol at bottom center
    const centerX = (this.templeWidth / 2) * CONFIG.WIDTH;
    const bottomY = (this.templeDepth - 1) * CONFIG.HEIGHT + CONFIG.HEIGHT - 100;

    this.idol = this.scene.add.sprite(centerX, bottomY, 'idol');
    this.scene.physics.add.existing(this.idol, true);

    // Add pulsing animation
    this.scene.tweens.add({
      targets: this.idol,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
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
