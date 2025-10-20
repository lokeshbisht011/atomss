import Phaser from "phaser";

export class FXManager {
  constructor(scene) {
    this.scene = scene;
    this.bgMusic = null;
    this.collectSound = null;
    this.explodeSound = null;
  }

  /**
   * Preloads all audio assets.
   */
  preload() {
    this.scene.load.audio("bgMusic", "/assets/audio/bg.mp3");
    this.scene.load.audio("collect", "/assets/audio/collect.mp3");
    this.scene.load.audio("explode", "/assets/audio/explode.mp3");
  }

  /**
   * Initializes audio objects and creates the particle texture.
   */
  create() {
    this.createParticleTexture();

    this.bgMusic = this.scene.sound.add("bgMusic", {
      volume: 0.5,
      loop: true,
    });
    this.bgMusic.play();

    this.collectSound = this.scene.sound.add("collect", { volume: 0.5 });
    this.explodeSound = this.scene.sound.add("explode", { volume: 0.5 });
  }

  /**
   * Creates a simple white circle texture for particle effects.
   */
  createParticleTexture() {
    if (this.scene.textures.exists("explosion_dot")) return;

    const size = 10;
    const graphics = this.scene.add.graphics({ x: 0, y: 0 });

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(size / 2, size / 2, size / 2);

    graphics.generateTexture("explosion_dot", size, size);
    graphics.destroy();
  }

  /**
   * Plays a collect sound and triggers a visual particle collection effect.
   */
  onResourceCollected(type) {
    this.collectSound.play();
  }

  /**
   * Creates a visual explosion effect and plays the sound.
   * @param {number} x
   * @param {number} y
   * @param {number} color
   */
  createExplosion(x, y, color) {
    this.explodeSound.play();
    this.scene.cameras.main.shake(150, 0.008);
    
    // Create a particle system directly
    const explosion = this.scene.add.particles(x, y, "explosion_dot", {
      lifespan: 300,
      speed: { min: 100, max: 250 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      quantity: 30,
      tint: color,
      blendMode: "ADD",
      gravityY: 200,
    });

    // Destroy after animation
    this.scene.time.delayedCall(800, () => {
      explosion.destroy();
    });
  }

  /**
   * Shakes the camera slightly when the player is hit.
   */
  onPlayerHit() {
    this.scene.cameras.main.shake(150, 0.008);
  }
}