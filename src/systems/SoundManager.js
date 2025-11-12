import CONFIG from '../config.js';

/**
 * Manages game sound effects and music
 */
export default class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.music = null;
    this.enabled = CONFIG.SOUND_ENABLED;
  }

  /**
   * Load sound assets (to be called in preload)
   */
  preload() {
    // TODO: Load actual sound files when available
    // this.scene.load.audio('jump', 'assets/sounds/jump.wav');
    // this.scene.load.audio('shoot', 'assets/sounds/shoot.wav');
    // this.scene.load.audio('hit', 'assets/sounds/hit.wav');
    // this.scene.load.audio('collect', 'assets/sounds/collect.wav');
    // this.scene.load.audio('death', 'assets/sounds/death.wav');
    // this.scene.load.audio('music', 'assets/music/temple.mp3');
  }

  /**
   * Create sound objects (to be called in create)
   */
  create() {
    if (!this.enabled) return;

    // TODO: Create sound objects when assets are available
    // this.sounds.jump = this.scene.sound.add('jump', { volume: CONFIG.SFX_VOLUME });
    // this.sounds.shoot = this.scene.sound.add('shoot', { volume: CONFIG.SFX_VOLUME });
    // this.sounds.hit = this.scene.sound.add('hit', { volume: CONFIG.SFX_VOLUME });
    // this.sounds.collect = this.scene.sound.add('collect', { volume: CONFIG.SFX_VOLUME });
    // this.sounds.death = this.scene.sound.add('death', { volume: CONFIG.SFX_VOLUME });

    // this.music = this.scene.sound.add('music', {
    //   volume: CONFIG.MUSIC_VOLUME,
    //   loop: true
    // });
  }

  /**
   * Play a sound effect
   */
  playSFX(soundName) {
    if (!this.enabled || !this.sounds[soundName]) {
      console.log(`[SFX] ${soundName}`);
      return;
    }

    this.sounds[soundName].play();
  }

  /**
   * Start background music
   */
  playMusic() {
    if (!this.enabled || !this.music) {
      console.log('[Music] Started');
      return;
    }

    if (!this.music.isPlaying) {
      this.music.play();
    }
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (!this.enabled || !this.music) {
      console.log('[Music] Stopped');
      return;
    }

    this.music.stop();
  }

  /**
   * Toggle sound on/off
   */
  toggleSound() {
    this.enabled = !this.enabled;

    if (!this.enabled && this.music) {
      this.music.stop();
    }

    return this.enabled;
  }

  /**
   * Set master volume
   */
  setVolume(volume) {
    if (this.music) {
      this.music.setVolume(volume * CONFIG.MUSIC_VOLUME);
    }

    Object.values(this.sounds).forEach(sound => {
      sound.setVolume(volume * CONFIG.SFX_VOLUME);
    });
  }
}
