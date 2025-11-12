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
  }

  create() {
    console.log(`GameScene: Starting ${this.difficulty} difficulty`);

    // Set background
    this.cameras.main.setBackgroundColor('#2d1810');

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

    // Set up camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0, 0,
      CONFIG.WIDTH * templeSize.width,
      CONFIG.HEIGHT * templeSize.depth
    );

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
    this.idol = temple.idol;
    this.spawnPoint = generator.getSpawnPoint();
    this.exitPoint = generator.getExitPoint();

    console.log(`Temple generated: ${this.enemies.length} enemies, ${this.chests.length} chests`);
  }

  createPlayer() {
    this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
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

    // Player overlaps with stairs
    this.stairs.forEach(stairs => {
      this.physics.add.overlap(this.player, stairs, this.handleStairsOverlap, null, this);
    });

    // Player overlaps with chests
    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, this.handleChestOverlap, null, this);
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
    // Health bar
    this.healthText = this.add.text(16, 16, '', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setScrollFactor(0);

    // Inventory display
    this.inventoryText = this.add.text(16, 44, '', {
      fontSize: '18px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setScrollFactor(0);

    // Objective display
    this.objectiveText = this.add.text(16, 72, '', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'monospace'
    }).setScrollFactor(0);

    // Position indicator
    this.positionText = this.add.text(CONFIG.WIDTH - 16, 16, '', {
      fontSize: '16px',
      fill: '#888',
      fontFamily: 'monospace'
    }).setScrollFactor(0).setOrigin(1, 0);
  }

  update() {
    if (!this.player || !this.player.active) return;

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

    // Update UI
    this.updateUI();

    // Check win condition
    this.checkWinCondition();
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
        enemy.takeDamage(1);
        this.soundManager.playSFX('hit');
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
        this.gameOver();
      }
    }
  }

  handleBulletHit(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;

    bullet.destroy();
    const isDead = enemy.takeDamage(1);

    if (isDead) {
      this.soundManager.playSFX('death');
    } else {
      this.soundManager.playSFX('hit');
    }
  }

  handleStairsOverlap(player, stairs) {
    player.isOnStairs = true;

    // Reset stairs state when leaving
    this.time.delayedCall(100, () => {
      const stillOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
        player.getBounds(),
        stairs.getBounds()
      );

      if (!stillOverlapping) {
        player.isOnStairs = false;
      }
    });
  }

  handleChestOverlap(player, chest) {
    // Store nearby chest for opening
    this.nearbyChest = chest;
  }

  handleIdolCollect(player, idol) {
    if (this.gameState === 'descending') {
      player.inventory.hasIdol = true;
      idol.destroy();
      this.gameState = 'ascending';
      this.soundManager.playSFX('collect');

      console.log('Idol collected! Return to the entrance!');
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
    // Health
    const healthBar = '♥'.repeat(this.player.currentHealth) + '♡'.repeat(this.player.maxHealth - this.player.currentHealth);
    this.healthText.setText(`Health: ${healthBar}`);

    // Inventory
    const items = [];
    if (this.player.inventory.hasGun) items.push(`Gun (${this.player.inventory.bullets})`);
    if (this.player.inventory.hasMachete) items.push('Machete');
    if (this.player.inventory.hasIdol) items.push('IDOL');
    this.inventoryText.setText(items.length > 0 ? `Items: ${items.join(', ')}` : 'Items: None');

    // Objective
    if (this.gameState === 'descending') {
      this.objectiveText.setText('Find the idol at the bottom!');
    } else {
      this.objectiveText.setText('Return to the entrance!');
    }

    // Position (debug)
    const screenX = Math.floor(this.player.x / CONFIG.WIDTH);
    const screenY = Math.floor(this.player.y / CONFIG.HEIGHT);
    this.positionText.setText(`Screen: ${screenX},${screenY}`);

    // Handle chest opening
    if (Phaser.Input.Keyboard.JustDown(this.keys.openChest) && this.nearbyChest) {
      const loot = this.nearbyChest.open();
      if (loot) {
        this.player.addItem(loot);
        this.soundManager.playSFX('collect');
        console.log(`Found: ${loot}`);
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
