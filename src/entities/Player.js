import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Player character
 */
export default class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT, CONFIG.COLORS.PLAYER);

    this.scene = scene;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Player stats (no health bar in original - just lives)
    this.lives = 0; // Will be set by scene
    this.maxHealth = 1; // One hit = lose a life
    this.currentHealth = 1;

    // Inventory
    this.inventory = {
      hasGun: false,
      hasMachete: false,
      bullets: 0,
      hasIdol: false
    };

    // State
    this.isOnStairs = false;
    this.facingRight = true;
    this.isInvulnerable = false;
    this.lastAttackTime = 0;

    // Physics
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0);
  }

  update(cursors, keys) {
    // Handle horizontal movement
    if (cursors.left.isDown) {
      this.body.setVelocityX(-CONFIG.PLAYER_SPEED);
      this.facingRight = false;
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(CONFIG.PLAYER_SPEED);
      this.facingRight = true;
    } else {
      this.body.setVelocityX(0);
    }

    // Handle stairs climbing
    if (this.isOnStairs) {
      this.body.setAllowGravity(false);

      if (cursors.up.isDown) {
        this.body.setVelocityY(-CONFIG.PLAYER_CLIMB_SPEED);
      } else if (cursors.down.isDown) {
        this.body.setVelocityY(CONFIG.PLAYER_CLIMB_SPEED);
      } else {
        this.body.setVelocityY(0);
      }
    } else {
      this.body.setAllowGravity(true);

      // Handle jump
      if (Phaser.Input.Keyboard.JustDown(keys.space) && this.body.touching.down) {
        this.body.setVelocityY(CONFIG.PLAYER_JUMP_VELOCITY);
      }
    }
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return false;

    this.currentHealth = Math.max(0, this.currentHealth - amount);

    // Invulnerability frames
    this.isInvulnerable = true;

    // Flash effect
    let flashCount = 0;
    const flashTimer = this.scene.time.addEvent({
      delay: 100,
      repeat: 5,
      callback: () => {
        this.setAlpha(flashCount % 2 === 0 ? 0.5 : 1);
        flashCount++;
      }
    });

    this.scene.time.delayedCall(600, () => {
      this.isInvulnerable = false;
      this.setAlpha(1);
    });

    return this.currentHealth <= 0;
  }

  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }

  addItem(itemType) {
    switch (itemType) {
      case 'gun':
        this.inventory.hasGun = true;
        break;
      case 'machete':
        this.inventory.hasMachete = true;
        break;
      case 'bullets':
        this.inventory.bullets = Math.min(CONFIG.MAX_BULLETS, this.inventory.bullets + 5);
        break;
      case 'idol':
        this.inventory.hasIdol = true;
        break;
    }
  }

  useBullet() {
    if (this.inventory.bullets > 0) {
      this.inventory.bullets--;
      return true;
    }
    return false;
  }
}
