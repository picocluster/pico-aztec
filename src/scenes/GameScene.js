import Phaser from 'phaser';
import CONFIG from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.player = null;
    this.cursors = null;
    this.inventory = {
      hasGun: false,
      hasMachete: false,
      bullets: 0
    };
    this.health = CONFIG.PLAYER_MAX_HEALTH;
  }

  create() {
    console.log('GameScene: Starting game');

    // Create a simple test level
    this.createTestLevel();

    // Create player
    this.createPlayer();

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, CONFIG.WIDTH * CONFIG.TEMPLE_SCREENS_WIDE, CONFIG.HEIGHT * CONFIG.TEMPLE_SCREENS_DEEP);

    // Set up controls
    this.setupControls();

    // Create UI
    this.createUI();

    // Set world bounds for physics
    this.physics.world.setBounds(0, 0, CONFIG.WIDTH * CONFIG.TEMPLE_SCREENS_WIDE, CONFIG.HEIGHT * CONFIG.TEMPLE_SCREENS_DEEP);
  }

  createTestLevel() {
    // Create platforms group
    this.platforms = this.physics.add.staticGroup();

    // Create a simple test level with platforms
    // Ground platform
    const ground = this.add.rectangle(320, 460, 640, 40, 0x8B4513);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // Middle platforms
    const platform1 = this.add.rectangle(200, 320, 300, 20, 0x8B4513);
    this.physics.add.existing(platform1, true);
    this.platforms.add(platform1);

    const platform2 = this.add.rectangle(500, 200, 250, 20, 0x8B4513);
    this.physics.add.existing(platform2, true);
    this.platforms.add(platform2);

    // Background color - temple-like
    this.cameras.main.setBackgroundColor('#2d1810');
  }

  createPlayer() {
    // Create player as a simple rectangle for now
    // TODO: Replace with sprite when we have assets
    this.player = this.add.rectangle(100, 400, 16, 24, 0xFFFFFF);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // Add collision with platforms
    this.physics.add.collider(this.player, this.platforms);
  }

  setupControls() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Action keys
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
    this.healthText = this.add.text(16, 16, `Health: ${this.health}/${CONFIG.PLAYER_MAX_HEALTH}`, {
      fontSize: '16px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setScrollFactor(0);

    // Inventory display
    this.inventoryText = this.add.text(16, 40, this.getInventoryText(), {
      fontSize: '16px',
      fill: '#fff',
      fontFamily: 'monospace'
    }).setScrollFactor(0);
  }

  getInventoryText() {
    const items = [];
    if (this.inventory.hasGun) items.push(`Gun (${this.inventory.bullets})`);
    if (this.inventory.hasMachete) items.push('Machete');
    return items.length > 0 ? `Items: ${items.join(', ')}` : 'Items: None';
  }

  update() {
    if (!this.player) return;

    // Handle movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-CONFIG.PLAYER_SPEED);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(CONFIG.PLAYER_SPEED);
    } else {
      this.player.body.setVelocityX(0);
    }

    // Handle jump
    if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.player.body.touching.down) {
      this.player.body.setVelocityY(CONFIG.PLAYER_JUMP_VELOCITY);
    }

    // Handle action keys
    if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
      this.shoot();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.machete)) {
      this.useMachete();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.loadGun)) {
      this.loadGun();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.openChest)) {
      this.openChest();
    }

    // Update UI
    this.healthText.setText(`Health: ${this.health}/${CONFIG.PLAYER_MAX_HEALTH}`);
    this.inventoryText.setText(this.getInventoryText());
  }

  shoot() {
    if (this.inventory.hasGun && this.inventory.bullets > 0) {
      console.log('Shooting!');
      this.inventory.bullets--;
      // TODO: Create bullet projectile
    } else if (!this.inventory.hasGun) {
      console.log('No gun!');
    } else {
      console.log('No bullets!');
    }
  }

  useMachete() {
    if (this.inventory.hasMachete) {
      console.log('Swinging machete!');
      // TODO: Create machete attack hitbox
    } else {
      console.log('No machete!');
    }
  }

  loadGun() {
    if (this.inventory.hasGun) {
      console.log('Gun loaded/reloaded');
      // Could add reload animation here
    } else {
      console.log('No gun to load!');
    }
  }

  openChest() {
    console.log('Trying to open chest...');
    // TODO: Check if player is near a chest
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    console.log(`Player took ${amount} damage. Health: ${this.health}`);

    if (this.health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    console.log('Game Over!');
    // TODO: Implement game over screen
    this.scene.restart();
  }
}
