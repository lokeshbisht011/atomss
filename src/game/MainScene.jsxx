import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    this.socket = null;
    this.players = new Map();
    this.resources = new Map();
    this.bullets = new Map();
    this.currentPlayerId = null;
    this.cursors = null;
    this.wasd = null;
    this.playerSpeed = 500;
    this.onStatsUpdate = null;
  }

  setSocket(socket) {
    this.socket = socket;
    console.log("Socket ready, setting up listeners...");
    this.setupSocketListeners();
  }

  setStatsCallback(callback) {
    this.onStatsUpdate = callback;
  }

  setGameOverCallback(callback) {
    this.onGameOver = callback;
  }

  preload() {
    this.load.audio("bgMusic", "/assets/audio/bg.mp3");
    this.load.audio("collect", "/assets/audio/collect.mp3");
    this.load.audio("explode", "/assets/audio/explode.mp3");
  }

  createParticleTexture() {
    if (this.textures.exists("explosion_dot")) return;

    const size = 10;
    const graphics = this.add.graphics({ x: 0, y: 0 });

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(size / 2, size / 2, size / 2);

    graphics.generateTexture("explosion_dot", size, size);
    graphics.destroy();
  }

  create() {
    this.isMobile =
      this.sys.game.device.os.android ||
      this.sys.game.device.os.iOS ||
      this.sys.game.device.os.iPad;

    if (this.isMobile) {
      this.createMobileControls();
    }

    this.cameras.main.setBackgroundColor(0x0a0a1a);
    this.cameras.main.setBounds(0, 0, 9000, 9000);

    this.createParticleTexture();

    this.cursors = this.input.keyboard?.createCursorKeys() || null;
    this.wasd = this.input.keyboard?.addKeys("W,S,A,D");

    // --- Draw grid background
    const grid = this.add.graphics({
      lineStyle: { width: 1, color: 0x1f1f3f, alpha: 0.8 },
    });
    const gridSize = 50;
    const worldW = 9000;
    const worldH = 9000;

    for (let x = 0; x <= worldW; x += gridSize)
      grid.lineBetween(x, 0, x, worldH);
    for (let y = 0; y <= worldH; y += gridSize)
      grid.lineBetween(0, y, worldW, y);

    grid.lineStyle(2, 0x3a3a6a, 1.0);
    const majorGridSize = 5 * gridSize;
    for (let x = 0; x <= worldW; x += majorGridSize)
      grid.lineBetween(x, 0, x, worldH);
    for (let y = 0; y <= worldH; y += majorGridSize)
      grid.lineBetween(0, y, worldW, y);
    grid.setDepth(-10);

    // --- Shooting
    this.input.on("pointerdown", (pointer) => {
      if (pointer.leftButtonDown() && this.socket && this.currentPlayerId) {
        const worldX = pointer.x + this.cameras.main.scrollX;
        const worldY = pointer.y + this.cameras.main.scrollY;
        this.socket.emit("shoot", { x: worldX, y: worldY });
      }
    });

    this.bgMusic = this.sound.add("bgMusic", {
      volume: 0.5, // Adjust between 0 and 1
      loop: true, // Loop forever
    });

    this.bgMusic.play();

    this.collectSound = this.sound.add("collect", {
      volume: 0.5,
    });

    this.explodeSound = this.sound.add("explode", {
      volume: 0.5,
    });
  }

  createMobileControls() {
    this.joystick = this.plugins.get("rexVirtualJoystick").add(this, {
      x: 100,
      y: this.cameras.main.height - 120,
      radius: 60,
      base: this.add.circle(0, 0, 60, 0x333333, 0.4),
      thumb: this.add.circle(0, 0, 30, 0xffffff, 0.8),
    });

    this.cursorKeys = this.joystick.createCursorKeys();

    this.shootBtn = this.add
      .circle(
        this.cameras.main.width - 100,
        this.cameras.main.height - 120,
        45,
        0xff4444,
        0.6
      )
      .setScrollFactor(0)
      .setInteractive();

    this.shootBtn.on("pointerdown", () => {
      this.socket.emit("shoot");
    });

    this.shootBtn.on("pointerdown", () =>
      this.shootBtn.setFillStyle(0xff6666, 0.8)
    );
    this.shootBtn.on("pointerup", () =>
      this.shootBtn.setFillStyle(0xff4444, 0.6)
    );
  }

  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("joined", (data) => {
      this.currentPlayerId = data.playerId;
    });

    this.socket.on("gameState", (state) => this.updateGameState(state));

    this.socket.on("resourceCollected", (data) => {
      if (data.playerId === this.currentPlayerId) {
        this.collectSound.play();
        // if (data.resourceType === "proton") this.sound.play("collect");
        // else if (data.resourceType === "neutron") this.sound.play("collect");
        // else if (data.resourceType === "electron") this.sound.play("collect");
      }
    });

    this.socket.on("bulletFired", (bullet) => this.createBullet(bullet));

    this.socket.on("playerLeft", (playerId) => this.removePlayer(playerId));

    this.socket.on("playerHit", ({ playerId, x, y, color }) => {
      this.createExplosion(x, y, color || 0xff4444, this);
      if (playerId === this.currentPlayerId) {
        this.cameras.main.shake(150, 0.008);
      }
    });

    //TODO
    this.socket.on("playerExploded", ({ playerId, x, y, color, reason }) => {
      this.onGameOver?.();
      this.explodeSound.play();
      this.createExplosion(x, y, color || 0xff4444, this);
    });

    this.socket.on("explosion", ({ x, y, color }) => {
      this.createExplosion(x, y, color || 0xffff00, this);
    });
  }

  createExplosion(x, y, color, scene) {
    // Create a particle system directly (no createEmitter!)
    const explosion = scene.add.particles(x, y, "__WHITE", {
      lifespan: 800,
      speed: { min: 100, max: 250 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      quantity: 30,
      tint: color,
      blendMode: "ADD",
      gravityY: 200,
    });

    // Destroy after animation
    scene.time.delayedCall(800, () => {
      explosion.destroy();
    });
  }

  updateGameState(state) {
    const existingPlayerIds = new Set(state.players.map((p) => p.id));
    for (const id of this.players.keys())
      if (!existingPlayerIds.has(id)) this.removePlayer(id);

    for (const playerData of state.players) this.updatePlayer(playerData);

    const existingResourceIds = new Set(state.resources.map((r) => r.id));
    for (const id of this.resources.keys()) {
      if (!existingResourceIds.has(id)) {
        const res = this.resources.get(id);
        if (res) res.destroy();
        this.resources.delete(id);
      }
    }

    for (const resourceData of state.resources)
      this.updateResource(resourceData);

    const existingBulletIds = new Set(state.bullets.map((b) => b.id));
    for (const id of this.bullets.keys()) {
      if (!existingBulletIds.has(id)) {
        const bullet = this.bullets.get(id);
        if (bullet) bullet.destroy();
        this.bullets.delete(id);
      }
    }

    for (const bulletData of state.bullets) this.updateBullet(bulletData);

    if (this.currentPlayerId) {
      const current = state.players.find((p) => p.id === this.currentPlayerId);
      if (current && this.onStatsUpdate) {
        this.onStatsUpdate({
          protons: current.protons,
          neutrons: current.neutrons,
          electrons: current.electrons,
          element: current.element,
          stability: current.stability,
          players: state.players,
          worldTotals: state.worldTotals,
        });
      }
    }
  }

  updatePlayer(playerData) {
    let playerContainer = this.players.get(playerData.id);

    if (!playerContainer) {
      playerContainer = this.add.container(playerData.x, playerData.y);
      this.players.set(playerData.id, playerContainer);

      const nucleus = this.add.graphics();
      playerContainer.add(nucleus);

      const nameText = this.add
        .text(0, 0, playerData.name, {
          fontSize: "14px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5);
      playerContainer.add(nameText);
    }

    // if (playerData.id === this.currentPlayerId) {
    //   this.cameras.main.startFollow(playerContainer, true, 0.05, 0.05);
    // }

    if (playerData.id != this.currentPlayerId)
      playerContainer.setPosition(playerData.x, playerData.y);

    const nucleus = playerContainer.getAt(0);
    nucleus.clear();

    const stabilityColor =
      playerData.stability > 60
        ? 0x00ff00
        : playerData.stability > 30
        ? 0xffff00
        : 0xff0000;
    nucleus.lineStyle(3, stabilityColor, 1);
    nucleus.strokeCircle(0, 0, playerData.radius);

    const glowIntensity = Math.min(playerData.electrons * 0.1, 1);
    nucleus.fillStyle(playerData.color, 0.3 + glowIntensity * 0.4);
    nucleus.fillCircle(0, 0, playerData.radius);

    nucleus.fillStyle(playerData.color, 0.8);
    nucleus.fillCircle(0, 0, playerData.radius * 0.6);

    const nameText = playerContainer.getAt(1);
    nameText.setPosition(0, -playerData.radius - 20);
    nameText.setText(playerData.name);
  }

  updateResource(resourceData) {
    let resourceGraphic = this.resources.get(resourceData.id);
    if (!resourceGraphic) {
      resourceGraphic = this.add.graphics();
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

    resourceGraphic.lineStyle(2, color, 1);
    resourceGraphic.strokeCircle(0, 0, 10 + Math.sin(Date.now() / 200) * 2);
  }

  createBullet(bulletData) {
    const bulletGraphic = this.add.graphics();
    this.bullets.set(bulletData.id, bulletGraphic);

    bulletGraphic.setPosition(bulletData.x, bulletData.y);
    bulletGraphic.fillStyle(0xffff00, 0.9);
    bulletGraphic.fillCircle(0, 0, 6);
    bulletGraphic.lineStyle(2, 0xffffff, 0.6);
    bulletGraphic.strokeCircle(0, 0, 8);
  }

  updateBullet(bulletData) {
    let bulletGraphic = this.bullets.get(bulletData.id);
    if (!bulletGraphic) {
      bulletGraphic = this.add.graphics();
      this.bullets.set(bulletData.id, bulletGraphic);
    }

    bulletGraphic.setPosition(bulletData.x, bulletData.y);
    bulletGraphic.clear();
    bulletGraphic.fillStyle(0xffff00, 0.9);
    bulletGraphic.fillCircle(0, 0, 6);
    bulletGraphic.lineStyle(2, 0xffffff, 0.6);
    bulletGraphic.strokeCircle(0, 0, 8);
  }

  removePlayer(playerId) {
    const playerContainer = this.players.get(playerId);
    if (playerContainer) {
      const { x, y } = playerContainer;
      this.createExplosion(x, y, 0xff0000, this);
      playerContainer.destroy();
      this.players.delete(playerId);
    }
  }

  update() {
    if (!this.socket || !this.currentPlayerId) return;

    const playerContainer = this.players.get(this.currentPlayerId);
    if (!playerContainer) return;

    let vx = 0,
      vy = 0;

    if (this.isMobile && this.cursorKeys) {
      if (this.cursorKeys.left.isDown) vx -= 1;
      if (this.cursorKeys.right.isDown) vx += 1;
      if (this.cursorKeys.up.isDown) vy -= 1;
      if (this.cursorKeys.down.isDown) vy += 1;
    } else {
      if (this.cursors?.left.isDown || this.wasd?.A.isDown) vx -= 1;
      if (this.cursors?.right.isDown || this.wasd?.D.isDown) vx += 1;
      if (this.cursors?.up.isDown || this.wasd?.W.isDown) vy -= 1;
      if (this.cursors?.down.isDown || this.wasd?.S.isDown) vy += 1;
    }

    if (vx !== 0 || vy !== 0) {
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      vx = (vx / magnitude) * this.playerSpeed;
      vy = (vy / magnitude) * this.playerSpeed;

      const newX = playerContainer.x + vx * 0.016;
      const newY = playerContainer.y + vy * 0.016;

      playerContainer.x = newX;
      playerContainer.y = newY;
      this.cameras.main.startFollow(playerContainer, true, 0.05, 0.05);

      this.socket.emit("playerMove", { x: newX, y: newY, vx, vy });
    }
  }
}
