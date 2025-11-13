// Game configuration
export const CONFIG = {
  // Display settings
  WIDTH: 1024,
  HEIGHT: 768,
  SCALE_MODE: Phaser.Scale.FIT,
  PIXEL_ART: true,

  // Visual style (vibrant 16-bit pixel art)
  COLORS: {
    BACKGROUND: 0x1a0f2e, // Deep purple
    BACKGROUND_GRADIENT: 0x2d1b3d, // Lighter purple for gradient
    PLATFORM: 0x808080, // Grey for temple stone
    PLATFORM_SHADOW: 0x505050, // Darker grey for depth
    LADDER: 0xe0ac69, // Golden ladder
    PLAYER: 0x00ffff, // Bright cyan for player
    PLAYER_ACCENT: 0xffff00, // Yellow accent
    IDOL: 0xffd700, // Bright gold
    IDOL_GLOW: 0xffff00, // Yellow glow
    GEM_CYAN: 0x00ffff,
    GEM_MAGENTA: 0xff00ff,
    GEM_YELLOW: 0xffff00,
    CHEST: 0x8b4513, // Dark brown
    CHEST_LOCK: 0xffd700, // Gold lock
    UI_TEXT: 0xffffff,
    UI_ACCENT: 0x00ff00
  },

  // Difficulty levels - controls temple size
  DIFFICULTY: {
    EASY: { width: 3, depth: 3, name: 'Easy', startLives: 6 },
    MEDIUM: { width: 4, depth: 4, name: 'Medium', startLives: 5 },
    HARD: { width: 5, depth: 5, name: 'Hard', startLives: 3 }
  },
  DEFAULT_DIFFICULTY: 'EASY',

  // Temple generation (like original Aztec)
  PLATFORMS_PER_SCREEN: 3,
  LADDERS_PER_SCREEN: 2,
  PLATFORM_HEIGHT: 16,
  PLATFORM_MIN_WIDTH: 150,
  PLATFORM_MAX_WIDTH: 400,

  // Player settings (smaller, more like original)
  PLAYER_WIDTH: 12,
  PLAYER_HEIGHT: 16,
  PLAYER_SPEED: 140,
  PLAYER_JUMP_VELOCITY: -380,
  PLAYER_CLIMB_SPEED: 100,

  // Lives system (like original)
  STARTING_LIVES: 6,

  // Scoring system
  POINTS: {
    SPIDER: 100,
    TIGER: 250,
    WARRIOR: 500,
    GEM: 100,
    CHEST: 200,
    IDOL: 5000
  },

  // Inventory
  MAX_BULLETS: 10,

  // Physics
  GRAVITY: 800,

  // Enemy configuration (colorful 16-bit style)
  ENEMIES: {
    SPIDER: {
      type: 'spider',
      health: 1,
      damage: 1,
      speed: 80,
      patrolRange: 150,
      aggroRange: 200,
      color: 0x9b30ff, // Purple spider
      accentColor: 0xff00ff, // Bright magenta
      width: 14,
      height: 14
    },
    TIGER: {
      type: 'tiger',
      health: 2,
      damage: 1,
      speed: 120,
      patrolRange: 200,
      aggroRange: 250,
      color: 0xff6600, // Bright orange tiger
      accentColor: 0xffff00, // Yellow stripes
      width: 18,
      height: 14
    },
    WARRIOR: {
      type: 'warrior',
      health: 3,
      damage: 1,
      speed: 100,
      patrolRange: 180,
      aggroRange: 220,
      color: 0x00cc88, // Teal warrior
      accentColor: 0xffd700, // Gold armor
      width: 14,
      height: 20
    }
  },

  // Combat
  BULLET_SPEED: 400,
  BULLET_SIZE: 4,
  MACHETE_RANGE: 40,
  ATTACK_COOLDOWN: 500,

  // Treasure chests
  CHEST_SPAWN_CHANCE: 0.3,
  GEM_SPAWN_CHANCE: 0.4,
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
