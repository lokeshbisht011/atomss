import Phaser from "phaser";

export class Renderer {
  constructor(scene) {
    this.scene = scene;
    this.players = scene.players;
    this.resources = scene.resources;
    this.bullets = scene.bullets;
    this.currentPlayerId = scene.currentPlayerId;
  }

  /**
   * Initializes the static visual elements of the world (grid).
   */
  createWorldGraphics(worldW, worldH) {
    this.scene.cameras.main.setBackgroundColor(0x0a0a1a);
    this.scene.cameras.main.setBounds(0, 0, worldW, worldH);

    const grid = this.scene.add.graphics({
      lineStyle: { width: 1, color: 0x1f1f3f, alpha: 0.8 },
    });
    const gridSize = 50;

    // Minor lines
    for (let x = 0; x <= worldW; x += gridSize)
      grid.lineBetween(x, 0, x, worldH);
    for (let y = 0; y <= worldH; y += gridSize)
      grid.lineBetween(0, y, worldW, y);

    // Major lines
    grid.lineStyle(2, 0x3a3a6a, 1.0);
    const majorGridSize = 5 * gridSize;
    for (let x = 0; x <= worldW; x += majorGridSize)
      grid.lineBetween(x, 0, x, worldH);
    for (let y = 0; y <= worldH; y += majorGridSize)
      grid.lineBetween(0, y, worldW, y);
      
    grid.setDepth(-10);
  }

  // --- Player Rendering ---

  createPlayer(playerData) {
    const playerContainer = this.scene.add.container(playerData.x, playerData.y);
    this.players.set(playerData.id, playerContainer);

    // Index 0: Nucleus Graphics
    const nucleus = this.scene.add.graphics();
    playerContainer.add(nucleus);

    // Index 1: Name Text
    const nameText = this.scene.add
      .text(0, 0, playerData.name, {
        fontSize: "14px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    playerContainer.add(nameText);

    return playerContainer;
  }

  updatePlayer(playerData) {
    let playerContainer = this.players.get(playerData.id);

    if (!playerContainer) {
      playerContainer = this.createPlayer(playerData);
    }

    if (playerData.id !== this.scene.currentPlayerId) {
      // Interpolate position for other players (optional, but smoother)
      playerContainer.setPosition(playerData.x, playerData.y); 
    }

    const nucleus = playerContainer.getAt(0);
    nucleus.clear();

    const stabilityColor =
      playerData.stability > 60
        ? 0x00ff00
        : playerData.stability > 30
        ? 0xffff00
        : 0xff0000;
        
    // Stability Ring (Outer edge)
    nucleus.lineStyle(3, stabilityColor, 1);
    nucleus.strokeCircle(0, 0, playerData.radius + 3);

    // Outer Glow / Electron Cloud
    const glowIntensity = Math.min(playerData.electrons * 0.1, 1);
    nucleus.fillStyle(playerData.color, 0.3 + glowIntensity * 0.4);
    nucleus.fillCircle(0, 0, playerData.radius);

    // Inner Nucleus
    nucleus.fillStyle(playerData.color, 0.8);
    nucleus.fillCircle(0, 0, playerData.radius * 0.6);

    const nameText = playerContainer.getAt(1);
    nameText.setPosition(0, -playerData.radius - 20);
    nameText.setText(playerData.name);
  }

  removePlayer(playerId) {
    const playerContainer = this.players.get(playerId);
    if (playerContainer) {
      // FXManager handles explosion, we just destroy the container
      playerContainer.destroy();
      this.players.delete(playerId);
    }
  }

  // --- Resource Rendering ---

  updateResource(resourceData) {
    let resourceGraphic = this.resources.get(resourceData.id);
    if (!resourceGraphic) {
      resourceGraphic = this.scene.add.graphics();
      this.resources.set(resourceData.id, resourceGraphic);
    }

    resourceGraphic.clear();
    resourceGraphic.setPosition(resourceData.x, resourceData.y);

    let color = 0xffffff;
    if (resourceData.type === "proton") color = 0xff4444;
    else if (resourceData.type === "neutron") color = 0x888888;
    else if (resourceData.type === "electron") color = 0x4444ff;

    resourceGraphic.fillStyle(color, 0.8);
    resourceGraphic.fillCircle(0, 0, 8);

    // Pulse animation
    resourceGraphic.lineStyle(2, color, 1);
    resourceGraphic.strokeCircle(0, 0, 10 + Math.sin(this.scene.time.now / 200) * 2);
  }
  
  removeResource(resourceId) {
      const res = this.resources.get(resourceId);
      if (res) res.destroy();
      this.resources.delete(resourceId);
  }

  // --- Bullet Rendering ---

  updateBullet(bulletData) {
    let bulletGraphic = this.bullets.get(bulletData.id);
    if (!bulletGraphic) {
      bulletGraphic = this.scene.add.graphics();
      this.bullets.set(bulletData.id, bulletGraphic);

      bulletGraphic.fillStyle(0xffff00, 0.9);
      bulletGraphic.fillCircle(0, 0, 6);
      bulletGraphic.lineStyle(2, 0xffffff, 0.6);
      bulletGraphic.strokeCircle(0, 0, 8);
    }

    bulletGraphic.setPosition(bulletData.x, bulletData.y);
  }
  
  removeBullet(bulletId) {
      const bullet = this.bullets.get(bulletId);
      if (bullet) bullet.destroy();
      this.bullets.delete(bulletId);
  }
}
