import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Generates pixel art sprites programmatically
 */
export default class SpriteGenerator {
  constructor(scene) {
    this.scene = scene;
    this.pixelSize = 2; // Each "pixel" is 2x2 actual pixels
  }

  /**
   * Generate player sprite (Indiana Jones style)
   */
  generatePlayerSprite() {
    const scale = 5; // 5x larger
    const canvas = this.scene.textures.createCanvas('player', 12 * scale, 16 * scale);
    const ctx = canvas.getContext();

    // Player pixels (cyan with yellow hat/whip)
    const pixels = [
      [0,0,0,1,1,1,1,0,0,0,0,0], // Hat brim
      [0,0,1,2,2,2,2,1,0,0,0,0], // Hat top
      [0,0,0,3,3,3,3,0,0,0,0,0], // Face
      [0,0,0,3,4,3,4,0,0,0,0,0], // Eyes
      [0,0,0,0,3,3,0,0,0,0,0,0], // Nose
      [0,0,5,5,5,5,5,5,0,0,0,0], // Shirt
      [0,0,5,5,5,5,5,5,0,0,0,0], // Body
      [0,0,5,6,5,5,6,5,0,0,0,0], // Belt
      [0,0,0,7,7,7,7,0,0,0,0,0], // Pants
      [0,0,0,7,7,7,7,0,0,0,0,0], // Pants
      [0,0,0,7,0,0,7,0,0,0,0,0], // Legs
      [0,0,0,7,0,0,7,0,0,0,0,0], // Legs
      [0,0,0,8,0,0,8,0,0,0,0,0], // Feet
    ];

    const colors = [
      null,           // 0 - transparent
      '#8B4513',      // 1 - brown hat
      '#DAA520',      // 2 - yellow hat
      '#FFD0A0',      // 3 - skin
      '#000000',      // 4 - eyes
      '#00FFFF',      // 5 - cyan shirt
      '#FFD700',      // 6 - gold belt
      '#0066CC',      // 7 - blue pants
      '#4A3020',      // 8 - brown boots
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'player';
  }

  /**
   * Generate spider sprite (purple)
   */
  generateSpiderSprite() {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas('spider', 14 * scale, 14 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0,0,0],
      [0,1,1,2,2,4,4,2,2,1,1,0,0,0],
      [1,1,0,0,2,2,2,2,0,0,1,1,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,1,0,0],
    ];

    const colors = [
      null,           // 0 - transparent
      '#4A0040',      // 1 - dark purple legs
      '#9B30FF',      // 2 - purple body
      '#FF0000',      // 3 - red eyes
      '#FF00FF',      // 4 - magenta accent
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'spider';
  }

  /**
   * Generate tiger sprite (orange)
   */
  generateTigerSprite() {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas('tiger', 18 * scale, 14 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,1,2,1,0,0,0,1,2,1,0,0,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0,0,0],
      [0,0,0,0,2,3,2,2,2,3,2,0,0,0,0,0,0,0],
      [0,0,0,2,2,2,2,4,2,2,2,2,0,0,0,0,0,0],
      [0,0,2,2,1,2,2,2,2,2,1,2,2,0,0,0,0,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
      [0,2,1,2,2,2,2,2,2,2,2,2,1,2,0,0,0,0],
      [0,0,2,2,0,2,2,0,0,2,2,0,2,2,0,0,0,0],
      [0,0,5,5,0,0,0,0,0,0,0,0,5,5,0,0,0,0],
    ];

    const colors = [
      null,           // 0 - transparent
      '#000000',      // 1 - black stripes
      '#FF6600',      // 2 - orange
      '#FFFF00',      // 3 - yellow eyes
      '#FFB6C1',      // 4 - pink nose
      '#8B4513',      // 5 - brown paws
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'tiger';
  }

  /**
   * Generate warrior sprite (teal with gold)
   */
  generateWarriorSprite() {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas('warrior', 14 * scale, 20 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,2,2,2,2,0,0,0,0,0,0],
      [0,0,0,0,3,4,4,3,0,0,0,0,0,0],
      [0,0,0,0,3,3,3,3,0,0,0,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0,0,0],
      [0,0,5,6,6,6,6,6,6,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0,0,0],
      [0,0,0,7,5,5,5,5,7,0,0,0,0,0],
      [0,0,0,0,7,7,7,7,0,0,0,0,0,0],
      [0,0,0,0,7,7,7,7,0,0,0,0,0,0],
      [0,0,0,0,7,0,0,7,0,0,0,0,0,0],
      [0,0,0,0,7,0,0,7,0,0,0,0,0,0],
      [0,0,0,0,8,0,0,8,0,0,0,0,0,0],
    ];

    const colors = [
      null,           // 0 - transparent
      '#FFD700',      // 1 - gold headdress
      '#8B4513',      // 2 - brown hair
      '#D2691E',      // 3 - tan skin
      '#000000',      // 4 - eyes
      '#00CC88',      // 5 - teal body
      '#FFD700',      // 6 - gold armor
      '#654321',      // 7 - brown legs
      '#8B4513',      // 8 - brown feet
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'warrior';
  }

  /**
   * Generate gem sprite (pulsing cyan/magenta/yellow)
   */
  generateGemSprite(color = 'cyan') {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas(`gem_${color}`, 8 * scale, 8 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,0,0,1,1,0,0,0],
      [0,0,1,2,2,1,0,0],
      [0,1,2,2,2,2,1,0],
      [0,1,2,3,3,2,1,0],
      [0,1,2,2,2,2,1,0],
      [0,0,1,2,2,1,0,0],
      [0,0,0,1,1,0,0,0],
    ];

    const colorMap = {
      cyan: ['#004444', '#00FFFF', '#88FFFF', '#FFFFFF'],
      magenta: ['#440044', '#FF00FF', '#FF88FF', '#FFFFFF'],
      yellow: ['#444400', '#FFFF00', '#FFFF88', '#FFFFFF']
    };

    const colors = [null].concat(colorMap[color]);

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return `gem_${color}`;
  }

  /**
   * Generate chest sprite
   */
  generateChestSprite() {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas('chest', 24 * scale, 20 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,2,2,2,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    ];

    const colors = [
      null,           // 0 - transparent
      '#000000',      // 1 - dark outline
      '#8B4513',      // 2 - brown wood
      '#FFD700',      // 3 - gold lock
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'chest';
  }

  /**
   * Generate idol sprite (golden statue)
   */
  generateIdolSprite() {
    const scale = 5;
    const canvas = this.scene.textures.createCanvas('idol', 20 * scale, 30 * scale);
    const ctx = canvas.getContext();

    const pixels = [
      [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,0,1,2,2,3,2,2,2,2,3,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,4,4,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,2,2,2,2,2,2,1,1,1,1,0,0,0],
      [0,0,1,1,2,2,1,1,1,1,1,1,1,1,2,2,1,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,1,2,2,1,2,2,2,2,2,2,2,2,1,2,2,1,0,0],
      [0,0,1,2,1,1,1,2,2,2,2,2,2,1,1,1,2,1,0,0],
      [0,0,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    ];

    const colors = [
      null,           // 0 - transparent
      '#B8860B',      // 1 - dark gold outline
      '#FFD700',      // 2 - bright gold
      '#FF0000',      // 3 - ruby eyes
      '#8B0000',      // 4 - dark red mouth
    ];

    this.drawPixelArt(ctx, pixels, colors, scale);
    canvas.refresh();
    return 'idol';
  }

  /**
   * Generate stairs sprite (diagonal triangular steps at 45 degrees)
   */
  generateStairsSprite() {
    const scale = 5;
    const width = 40 * scale;
    const height = 80 * scale;
    const canvas = this.scene.textures.createCanvas('stairs', width, height);
    const ctx = canvas.getContext();

    // Draw diagonal stairs at 45-degree angle
    ctx.fillStyle = '#808080'; // Grey color matching platforms
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // Draw multiple steps going diagonally
    const numSteps = 8;
    const stepWidth = width / numSteps;
    const stepHeight = height / numSteps;

    for (let i = 0; i < numSteps; i++) {
      const x = i * stepWidth;
      const y = i * stepHeight;

      // Draw triangular step
      ctx.beginPath();
      ctx.moveTo(x, y + stepHeight);
      ctx.lineTo(x + stepWidth, y + stepHeight);
      ctx.lineTo(x + stepWidth, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    canvas.refresh();
    return 'stairs';
  }

  /**
   * Helper to draw pixel art from array
   */
  drawPixelArt(ctx, pixels, colors, scale = 1) {
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const colorIndex = pixels[y][x];
        if (colorIndex > 0 && colors[colorIndex]) {
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }

  /**
   * Generate all sprites at once
   */
  generateAllSprites() {
    console.log('Generating pixel art sprites...');

    this.generatePlayerSprite();
    this.generateSpiderSprite();
    this.generateTigerSprite();
    this.generateWarriorSprite();
    this.generateGemSprite('cyan');
    this.generateGemSprite('magenta');
    this.generateGemSprite('yellow');
    this.generateChestSprite();
    this.generateIdolSprite();
    this.generateStairsSprite();

    console.log('All sprites generated!');
  }
}
