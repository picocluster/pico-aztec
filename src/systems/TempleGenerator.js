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

    // Define platform Y positions with increasing spacing
    // Top: 20% down, Middle: 50% down, Bottom: 85% down
    const platformYPositions = [
      offsetY + CONFIG.HEIGHT * 0.20,  // Top platform
      offsetY + CONFIG.HEIGHT * 0.50,  // Middle platform (more space)
      offsetY + CONFIG.HEIGHT * 0.85   // Bottom platform (even more space)
    ];
    const screenPlatforms = [];

    // First pass: Determine stair positions
    const stairPositions = [];
    for (let i = 0; i < numPlatforms - 1; i++) {
      const y1 = platformYPositions[i];
      const y2 = platformYPositions[i + 1];

      // Decide stair X position (left, center, or right third of screen)
      const section = Math.floor(Math.random() * 3); // 0=left, 1=center, 2=right
      const stairX = offsetX + (section * CONFIG.WIDTH / 3) + CONFIG.WIDTH / 6;

      stairPositions.push({
        x: stairX,
        upperLevel: i,
        lowerLevel: i + 1,
        y1: y1,
        y2: y2
      });
    }

    // Second pass: Create platforms with gaps at stair positions
    for (let i = 0; i < numPlatforms; i++) {
      const y = platformYPositions[i];

      // Find stairs connecting to this platform
      const relevantStairs = stairPositions.filter(s => s.upperLevel === i || s.lowerLevel === i);

      // Create platform segments with gaps at stair positions
      const platforms = this.createPlatformWithGaps(offsetX, y, relevantStairs, screenX, screenY, i);

      // Store main platform info (use first segment as reference)
      if (platforms.length > 0) {
        screenPlatforms.push({
          platforms: platforms,
          x: offsetX + CONFIG.WIDTH / 2,
          y: y,
          width: CONFIG.WIDTH,
          level: i,
          stairPositions: relevantStairs.map(s => s.x)
        });
      }
    }

    // Third pass: Create stairs at predetermined positions
    stairPositions.forEach(stairPos => {
      const verticalDistance = Math.abs(stairPos.y2 - stairPos.y1);

      // Stairs sprite has 70x60 aspect ratio (width:height = 1.17:1)
      const stairHeight = verticalDistance * 0.9; // Use most of vertical distance
      const stairWidth = stairHeight * 1.17; // Maintain sprite aspect ratio

      // Center position between the two platforms
      const centerX = stairPos.x;
      const centerY = (stairPos.y1 + stairPos.y2) / 2;

      // Randomly choose left or right direction
      const direction = Math.random() < 0.5 ? 'left' : 'right';

      const stairs = new Stairs(this.scene, centerX, centerY, stairWidth, stairHeight, direction);
      this.stairs.push(stairs);
    });

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

  createPlatformWithGaps(offsetX, y, relevantStairs, screenX, screenY, level) {
    const gapWidth = 560; // Width of gap for stairs (doubled for 10x sprites)
    const platforms = [];

    // Sort stair positions left to right
    const stairXPositions = relevantStairs.map(s => s.x).sort((a, b) => a - b);

    // Define segments between gaps
    const segments = [];
    let lastX = offsetX;

    stairXPositions.forEach(stairX => {
      // Create segment from lastX to stair gap start
      const segmentStart = lastX;
      const segmentEnd = stairX - gapWidth / 2;

      if (segmentEnd - segmentStart > 50) { // Only create if segment is wide enough
        segments.push({
          start: segmentStart,
          end: segmentEnd
        });
      }

      lastX = stairX + gapWidth / 2; // Next segment starts after the gap
    });

    // Final segment to screen edge
    const finalSegmentEnd = offsetX + CONFIG.WIDTH;
    if (finalSegmentEnd - lastX > 50) {
      segments.push({
        start: lastX,
        end: finalSegmentEnd
      });
    }

    // Create platform rectangles for each segment
    segments.forEach(segment => {
      const segmentWidth = segment.end - segment.start;
      const segmentX = (segment.start + segment.end) / 2;

      const platform = this.scene.add.rectangle(
        segmentX, y,
        segmentWidth, CONFIG.PLATFORM_HEIGHT,
        CONFIG.COLORS.PLATFORM
      );
      this.scene.physics.add.existing(platform, true);

      // Add shadow/depth effect
      const shadow = this.scene.add.rectangle(
        segmentX, y + 2,
        segmentWidth, CONFIG.PLATFORM_HEIGHT - 2,
        CONFIG.COLORS.PLATFORM_SHADOW
      );
      shadow.setDepth(-1);

      this.platforms.push(platform);
      platforms.push(platform);
    });

    return platforms;
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
