// Game configuration
export const CONFIG = {
  // Display settings
  WIDTH: 1024,
  HEIGHT: 768,
  SCALE_MODE: Phaser.Scale.FIT,
  PIXEL_ART: true,

  // Difficulty levels - controls temple size
  DIFFICULTY: {
    EASY: { width: 3, depth: 3, name: 'Easy' },
    MEDIUM: { width: 4, depth: 4, name: 'Medium' },
    HARD: { width: 5, depth: 5, name: 'Hard' }
  },
  DEFAULT_DIFFICULTY: 'EASY',

  // Temple generation
  PLATFORMS_PER_SCREEN: 3,
  STAIRS_PER_SCREEN: 2, // Min/max stairs connecting levels

  // Player settings
  PLAYER_MAX_HEALTH: 5,
  PLAYER_SPEED: 160,
  PLAYER_JUMP_VELOCITY: -400,
  PLAYER_CLIMB_SPEED: 100,

  // Inventory
  MAX_BULLETS: 10,

  // Physics
  GRAVITY: 800,

  // Enemy configuration
  ENEMIES: {
    SPIDER: {
      type: 'spider',
      health: 1,
      damage: 1,
      speed: 80,
      patrolRange: 150,
      aggroRange: 200,
      color: 0x8B008B
    },
    TIGER: {
      type: 'tiger',
      health: 2,
      damage: 1,
      speed: 120,
      patrolRange: 200,
      aggroRange: 250,
      color: 0xFF8C00
    },
    WARRIOR: {
      type: 'warrior',
      health: 3,
      damage: 1,
      speed: 100,
      patrolRange: 180,
      aggroRange: 220,
      color: 0xCD853F
    }
  },

  // Combat
  BULLET_SPEED: 400,
  MACHETE_RANGE: 40,
  ATTACK_COOLDOWN: 500, // milliseconds

  // Treasure chests
  CHEST_SPAWN_CHANCE: 0.3, // 30% chance per screen
  CHEST_LOOT: {
    GUN: 0.3,
    BULLETS: 0.5,
    MACHETE: 0.2
  },

  // Sound
  SOUND_ENABLED: true,
  MUSIC_VOLUME: 0.7,
  SFX_VOLUME: 0.8,

  // Debug
  DEBUG_MODE: false
};

export default CONFIG;
