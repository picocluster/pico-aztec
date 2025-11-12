// Game configuration
export const CONFIG = {
  // Display settings
  WIDTH: 640,
  HEIGHT: 480,
  SCALE_MODE: Phaser.Scale.FIT,
  PIXEL_ART: true,

  // Temple generation
  TEMPLE_SCREENS_WIDE: 4,
  TEMPLE_SCREENS_DEEP: 8,
  PLATFORMS_PER_SCREEN: 3,

  // Player settings
  PLAYER_MAX_HEALTH: 5,
  PLAYER_SPEED: 120,
  PLAYER_JUMP_VELOCITY: -300,

  // Inventory
  MAX_BULLETS: 10,

  // Physics
  GRAVITY: 600,

  // Difficulty (can be adjusted)
  ENEMY_DAMAGE: 1,

  // Debug
  DEBUG_MODE: false
};

export default CONFIG;
