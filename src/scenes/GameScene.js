import Phaser from 'phaser';
import CONFIG from '../config.js';
import Player from '../entities/Player.js';
import Bullet from '../entities/Bullet.js';
import TempleGenerator from '../systems/TempleGenerator.js';
import SoundManager from '../systems/SoundManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    // Get difficulty from BootScene
    this.difficulty = data.difficulty || CONFIG.DEFAULT_DIFFICULTY;
    this.gameState = 'descending'; // 'descending' or 'ascending'

    // Game stats (like original Aztec)
    this.score = 0;
    this.lives = CONFIG.DIFFICULTY[this.difficulty].startLives;
    this.gemsCollected = 0;
  }

  create() {
    console.log(`GameScene: Starting ${this.difficulty} difficulty`);

    // Set vibrant background
    this.cameras.main.setBackgroundColor(CONFIG.COLORS.BACKGROUND);

    // Initialize sound manager
    this.soundManager = new SoundManager(this);
    this.soundManager.create();
    this.soundManager.playMusic();

    // Generate temple
    this.generateTemple();

    // Create player
    this.createPlayer();

    // Set up physics collisions
    this.setupCollisions();

    // Set up controls
    this.setupControls();

    // Create UI
    this.createUI();

    // Set world bounds for physics
    const templeSize = CONFIG.DIFFICULTY[this.difficulty];
    this.physics.world.setBounds(
      0, 0,
      CONFIG.WIDTH * templeSize.width,
      CONFIG.HEIGHT * templeSize.depth
    );

    // Set up camera for screen-based viewing (no smooth scrolling)
    // Each screen is a static view, camera snaps between screens
    this.cameras.main.setBounds(
      0, 0,
      CONFIG.WIDTH * templeSize.width,
      CONFIG.HEIGHT * templeSize.depth
    );

    // Track current screen
    this.currentScreenX = 0;
    this.currentScreenY = 0;
    this.templeWidth = templeSize.width;
    this.templeDepth = templeSize.depth;

    // Set initial camera position to spawn screen
    this.updateCameraToScreen(Math.floor(this.spawnPoint.x / CONFIG.WIDTH), Math.floor(this.spawnPoint.y / CONFIG.HEIGHT));

    // Create bullets group
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
  }

  generateTemple() {
    const generator = new TempleGenerator(this, this.difficulty);
    const temple = generator.generate();

    this.platforms = temple.platforms;
    this.stairs = temple.stairs;
    this.enemies = temple.enemies;
    this.chests = temple.chests;
    this.gems = temple.gems;
    this.idol = temple.idol;
    this.spawnPoint = generator.getSpawnPoint();
    this.exitPoint = generator.getExitPoint();

    console.log(`Temple generated: ${this.enemies.length} enemies, ${this.chests.length} chests, ${this.gems.length} gems`);
  }

  createPlayer() {
    this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
    this.player.lives = this.lives;
  }

  setupCollisions() {
    // Player collides with platforms
    this.platforms.forEach(platform => {
      this.physics.add.collider(this.player, platform);
    });

    // Enemies collide with platforms
    this.enemies.forEach(enemy => {
      this.platforms.forEach(platform => {
        this.physics.add.collider(enemy, platform);
      });

      // Player collides with enemies
      this.physics.add.overlap(this.player, enemy, this.handlePlayerEnemyCollision, null, this);
    });

    // Player overlaps with chests
    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, this.handleChestOverlap, null, this);
    });

    // Player overlaps with gems
    this.gems.forEach(gem => {
      this.physics.add.overlap(this.player, gem, this.handleGemCollect, null, this);
    });

    // Player overlaps with idol
    this.physics.add.overlap(this.player, this.idol, this.handleIdolCollect, null, this);
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.keys = {
      loadGun: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      machete: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      openChest: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };
  }

  createUI() {
    // Top UI bar (like original Aztec)
    const uiBarHeight = 40;
    const uiBar = this.add.rectangle(CONFIG.WIDTH / 2, uiBarHeight / 2, CONFIG.WIDTH, uiBarHeight, 0x000000, 0.8);
    uiBar.setScrollFactor(0);
    uiBar.setDepth(100);

    // Score (left side)
    this.scoreText = this.add.text(20, 12, '', {
      fontSize: '24px',
      fill: CONFIG.COLORS.UI_TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    // Lives (center-left)
    this.livesText = this.add.text(250, 12, '', {
      fontSize: '24px',
      fill: CONFIG.COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    // Gems (center-right)
    this.gemsText = this.add.text(450, 12, '', {
      fontSize: '24px',
      fill: CONFIG.COLORS.GEM_CYAN,
      fontFamily: 'monospace',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(101);

    // Inventory (right side)
    this.inventoryText = this.add.text(650, 12, '', {
      fontSize: '20px',
      fill: CONFIG.COLORS.UI_TEXT,
      fontFamily: 'monospace'
    }).setScrollFactor(0).setDepth(101);

    // Objective display (below UI bar)
    this.objectiveText = this.add.text(CONFIG.WIDTH / 2, 55, '', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'monospace',
      align: 'center'
    }).setScrollFactor(0).setDepth(101).setOrigin(0.5, 0);
  }

  update() {
    if (!this.player || !this.player.active) return;

    // Reset stairs flag each frame (will be set if overlapping)
    this.player.isOnStairs = false;
    this.player.stairDirection = null;

    // Check if player is on any stairs
    this.stairs.forEach(stairs => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        stairs.getBounds()
      )) {
        this.player.isOnStairs = true;
        this.player.stairDirection = stairs.direction;
      }
    });

    // Update player
    this.player.update(this.cursors, this.keys);

    // Update enemies
    this.enemies.forEach(enemy => {
      if (enemy.active) {
        enemy.update(this.player);
      }
    });

    // Handle action keys
    if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
      this.shoot();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.machete)) {
      this.useMachete();
    }

    // Update camera based on player's screen position
    this.updateCameraPosition();

    // Update UI
    this.updateUI();

    // Check win condition
    this.checkWinCondition();
  }

  /**
   * Update camera to show a specific screen
   */
  updateCameraToScreen(screenX, screenY) {
    // Clamp to valid screen coordinates
    screenX = Phaser.Math.Clamp(screenX, 0, this.templeWidth - 1);
    screenY = Phaser.Math.Clamp(screenY, 0, this.templeDepth - 1);

    this.currentScreenX = screenX;
    this.currentScreenY = screenY;

    // Snap camera to screen position
    this.cameras.main.scrollX = screenX * CONFIG.WIDTH;
    this.cameras.main.scrollY = screenY * CONFIG.HEIGHT;
  }

  /**
   * Check if player crossed screen boundary and update camera
   */
  updateCameraPosition() {
    // Determine which screen the player is on
    const playerScreenX = Math.floor(this.player.x / CONFIG.WIDTH);
    const playerScreenY = Math.floor(this.player.y / CONFIG.HEIGHT);

    // If player moved to a different screen, snap camera
    if (playerScreenX !== this.currentScreenX || playerScreenY !== this.currentScreenY) {
      this.updateCameraToScreen(playerScreenX, playerScreenY);
    }
  }

  shoot() {
    if (!this.player.inventory.hasGun) {
      console.log('No gun!');
      return;
    }

    if (!this.player.useBullet()) {
      console.log('No bullets!');
      this.soundManager.playSFX('empty');
      return;
    }

    // Create bullet
    const direction = this.player.facingRight ? 1 : -1;
    const bulletX = this.player.x + (direction * 20);
    const bulletY = this.player.y;

    const bullet = new Bullet(this, bulletX, bulletY, direction);
    this.bullets.add(bullet);

    // Bullet hits enemies
    this.enemies.forEach(enemy => {
      this.physics.add.overlap(bullet, enemy, this.handleBulletHit, null, this);
    });

    this.soundManager.playSFX('shoot');
  }

  useMachete() {
    if (!this.player.inventory.hasMachete) {
      console.log('No machete!');
      return;
    }

    // Create temporary hitbox
    const direction = this.player.facingRight ? 1 : -1;
    const hitboxX = this.player.x + (direction * CONFIG.MACHETE_RANGE);
    const hitboxY = this.player.y;

    const hitbox = this.add.rectangle(hitboxX, hitboxY, 40, 40, 0xFFFFFF, 0.3);
    this.physics.add.existing(hitbox);

    // Check hits
    this.enemies.forEach(enemy => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox.getBounds(), enemy.getBounds())) {
        const isDead = enemy.takeDamage(1);

        if (isDead) {
          this.score += enemy.pointValue;
          this.soundManager.playSFX('death');
          console.log(`Enemy killed! +${enemy.pointValue} points`);
        } else {
          this.soundManager.playSFX('hit');
        }
      }
    });

    // Remove hitbox after animation
    this.time.delayedCall(100, () => hitbox.destroy());

    this.soundManager.playSFX('machete');
  }

  handlePlayerEnemyCollision(player, enemy) {
    if (!player.active || !enemy.active) return;

    const damage = enemy.attackPlayer(player);
    if (damage > 0) {
      const isDead = player.takeDamage(damage);
      this.soundManager.playSFX('hurt');

      if (isDead) {
        this.loseLife();
      }
    }
  }

  handleBulletHit(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;

    bullet.destroy();
    const isDead = enemy.takeDamage(1);

    if (isDead) {
      // Award points for killing enemy
      this.score += enemy.pointValue;
      this.soundManager.playSFX('death');
      console.log(`Enemy killed! +${enemy.pointValue} points`);
    } else {
      this.soundManager.playSFX('hit');
    }
  }

  loseLife() {
    this.lives--;
    console.log(`Lost a life! ${this.lives} remaining`);

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Respawn player at spawn point
      this.player.x = this.spawnPoint.x;
      this.player.y = this.spawnPoint.y;
      this.player.currentHealth = 1;
      this.player.body.setVelocity(0, 0);

      // Snap camera to spawn screen
      this.updateCameraToScreen(
        Math.floor(this.spawnPoint.x / CONFIG.WIDTH),
        Math.floor(this.spawnPoint.y / CONFIG.HEIGHT)
      );

      // Flash message
      const respawnText = this.add.text(
        CONFIG.WIDTH / 2,
        CONFIG.HEIGHT / 2,
        `${this.lives} ${this.lives === 1 ? 'LIFE' : 'LIVES'} REMAINING`,
        {
          fontSize: '32px',
          fill: '#ff0000',
          fontFamily: 'monospace',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

      this.time.delayedCall(2000, () => {
        respawnText.destroy();
      });
    }
  }

  handleChestOverlap(player, chest) {
    // Store nearby chest for opening
    this.nearbyChest = chest;
  }

  handleGemCollect(player, gem) {
    if (!gem.active || gem.collected) return;

    const points = gem.collect();
    if (points > 0) {
      this.score += points;
      this.gemsCollected++;
      this.soundManager.playSFX('collect');
      console.log(`Gem collected! +${points} points`);
    }
  }

  handleIdolCollect(player, idol) {
    if (this.gameState === 'descending') {
      player.inventory.hasIdol = true;
      idol.destroy();
      this.gameState = 'ascending';
      this.score += CONFIG.POINTS.IDOL;
      this.soundManager.playSFX('collect');

      console.log(`Idol collected! +${CONFIG.POINTS.IDOL} points! Return to the entrance!`);
    }
  }

  checkWinCondition() {
    if (this.gameState === 'ascending' && this.player.inventory.hasIdol) {
      const distanceToExit = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.exitPoint.x, this.exitPoint.y
      );

      if (distanceToExit < 50) {
        this.gameWin();
      }
    }
  }

  updateUI() {
    // Score (like original Aztec)
    this.scoreText.setText(`SCORE: ${this.score.toString().padStart(6, '0')}`);

    // Lives
    this.livesText.setText(`LIVES: ${this.lives}`);

    // Gems
    this.gemsText.setText(`GEMS: ${this.gemsCollected}`);

    // Inventory
    const items = [];
    if (this.player.inventory.hasGun) items.push(`Gun(${this.player.inventory.bullets})`);
    if (this.player.inventory.hasMachete) items.push('Machete');
    if (this.player.inventory.hasIdol) items.push('IDOL');
    this.inventoryText.setText(items.length > 0 ? items.join(' ') : '');

    // Objective
    if (this.gameState === 'descending') {
      this.objectiveText.setText('↓ Find the Idol at the Bottom ↓');
    } else {
      this.objectiveText.setText('↑ Return to the Entrance! ↑');
    }

    // Handle chest opening
    if (Phaser.Input.Keyboard.JustDown(this.keys.openChest) && this.nearbyChest) {
      const loot = this.nearbyChest.open();
      if (loot) {
        this.player.addItem(loot);
        this.score += CONFIG.POINTS.CHEST;
        this.soundManager.playSFX('collect');
        console.log(`Found: ${loot} (+${CONFIG.POINTS.CHEST} points)`);
      }
      this.nearbyChest = null;
    }
  }

  gameOver() {
    console.log('Game Over!');
    this.soundManager.stopMusic();
    this.soundManager.playSFX('death');

    // Show game over screen
    const gameOverBg = this.add.rectangle(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT, 0x000000, 0.8);
    gameOverBg.setScrollFactor(0);

    const gameOverText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 50, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0);

    const restartText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 50, 'Press SPACE to restart', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.restart({ difficulty: this.difficulty });
    });
  }

  gameWin() {
    console.log('You Win!');
    this.soundManager.stopMusic();
    this.soundManager.playSFX('victory');

    const winBg = this.add.rectangle(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT, 0x000000, 0.8);
    winBg.setScrollFactor(0);

    const winText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 50, 'VICTORY!', {
      fontSize: '64px',
      fill: '#00ff00',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0);

    const continueText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 50, 'Press SPACE to return to menu', {
      fontSize: '24px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setScrollFactor(0);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('BootScene');
    });
  }
}
