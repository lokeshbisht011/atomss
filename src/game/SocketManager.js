export class SocketManager {
  constructor(scene) {
    this.scene = scene;
    this.fxManager = scene.fxManager;
    this.renderer = scene.renderer;
  }

  setupSocket(socket) {
    this.scene.socket = socket;
    console.log("Socket ready, setting up listeners...");
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    if (!this.scene.socket) return;

    this.scene.socket.on("joined", (data) => {
      this.scene.currentPlayerId = data.playerId;
      this.scene.cameras.main.centerOn(data.playerX, data.playerY);
    });

    this.scene.socket.on("gameState", (state) => this.updateGameState(state));

    this.scene.socket.on("bulletFired", (bullet) => {
      // The renderer will handle creating/updating this bullet in the next gameState update
    });

    this.scene.socket.on("playerLeft", (playerId) => {
      const playerContainer = this.scene.players.get(playerId);
      if (playerContainer) {
        // Use FXManager for visual effect before removal
        this.fxManager.createExplosion(
          playerContainer.x,
          playerContainer.y,
          0xaaaaaa
        );
      }
      this.renderer.removePlayer(playerId);
    });

    this.scene.socket.on("playerHit", ({ playerId, x, y, color }) => {
      if (playerId === this.scene.currentPlayerId) {
        this.fxManager.onPlayerHit();
      }
      this.fxManager.createExplosion(x, y, color || 0xff4444);
    });

    this.scene.socket.on("playerDied", ({ playerId, x, y, color, reason }) => {
      if (playerId === this.scene.currentPlayerId) {
        this.scene.onGameOver?.(); // Call the UI callback
      }
      this.fxManager.createExplosion(x, y, color || 0xff4444);
    });
  }

  updateGameState(state) {
    // 1. Update UI Stats
    if (this.scene.currentPlayerId && this.scene.onStatsUpdate) {
      const current = state.players.find(
        (p) => p.id === this.scene.currentPlayerId
      );
      if (current) {
        this.scene.onStatsUpdate({
          protons: current.protons,
          neutrons: current.neutrons,
          electrons: current.electrons,
          element: current.element,
          stability: current.stability,
          players: state.players,
        });
      }
    }

    // 2. Cleanup (Players)
    const existingPlayerIds = new Set(state.players.map((p) => p.id));
    for (const id of this.scene.players.keys()) {
      if (!existingPlayerIds.has(id)) this.renderer.removePlayer(id);
    }

    // 3. Update Players
    for (const playerData of state.players)
      this.renderer.updatePlayer(playerData);

    // 4. Cleanup (Resources)
    const existingResourceIds = new Set(state.particles.map((r) => r.id));
    for (const id of this.scene.resources.keys()) {
      if (!existingResourceIds.has(id)) this.renderer.removeResource(id);
    }

    // 5. Update Resources
    for (const resourceData of state.particles)
      this.renderer.updateResource(resourceData);

    // 6. Cleanup (Bullets)
    const existingBulletIds = new Set(state.bullets.map((b) => b.id));
    for (const id of this.scene.bullets.keys()) {
      if (!existingBulletIds.has(id)) this.renderer.removeBullet(id);
    }

    // 7. Update Bullets
    for (const bulletData of state.bullets)
      this.renderer.updateBullet(bulletData);
  }
}
