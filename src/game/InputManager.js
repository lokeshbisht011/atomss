import Phaser from "phaser";

export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.playerSpeed = 1000;
    this.isMobile =
      this.scene.sys.game.device.os.android ||
      this.scene.sys.game.device.os.iOS ||
      this.scene.sys.game.device.os.iPad;
      
    this.cursors = null;
    this.wasd = null;
    this.joystick = null;
    this.cursorKeys = null;
    this.shootBtn = null;
    
    this.initInput();
  }

  initInput() {
    if (this.isMobile) {
      this.createMobileControls();
    } else {
      this.cursors = this.scene.input.keyboard?.createCursorKeys() || null;
      this.wasd = this.scene.input.keyboard?.addKeys("W,S,A,D");
    }

    // Shooting input
    this.scene.input.on("pointerdown", (pointer) => {
      if (pointer.leftButtonDown() && this.scene.socket && this.scene.currentPlayerId) {
        const worldX = pointer.x + this.scene.cameras.main.scrollX;
        const worldY = pointer.y + this.scene.cameras.main.scrollY;
        this.scene.socket.emit("shoot", { x: worldX, y: worldY });
      }
    });
  }

  createMobileControls() {
    const { width, height } = this.scene.cameras.main;

    // Joystick for movement (requires rexVirtualJoystick plugin in Phaser config)
    this.joystick = this.scene.plugins.get("rexVirtualJoystick").add(this.scene, {
      x: 100,
      y: height - 120,
      radius: 60,
      base: this.scene.add.circle(0, 0, 60, 0x333333, 0.4),
      thumb: this.scene.add.circle(0, 0, 30, 0xffffff, 0.8),
    }).setScrollFactor(0); // Fixed position
    this.cursorKeys = this.joystick.createCursorKeys();

    // Shoot Button
    this.shootBtn = this.scene.add
      .circle(
        width - 100,
        height - 120,
        45,
        0xff4444,
        0.6
      )
      .setScrollFactor(0)
      .setInteractive();

    this.shootBtn.on("pointerdown", () => {
      // On mobile, shoot toward the center of the camera view
      const targetX = this.scene.cameras.main.midPoint.x;
      const targetY = this.scene.cameras.main.midPoint.y;
      this.scene.socket.emit("shoot", { x: targetX, y: targetY });
      this.shootBtn.setFillStyle(0xff6666, 0.8);
    });
    
    this.shootBtn.on("pointerup", () =>
      this.shootBtn.setFillStyle(0xff4444, 0.6)
    );
  }

  /**
   * Called every game tick to calculate and send movement.
   */
  update() {
    if (!this.scene.socket || !this.scene.currentPlayerId) return;

    const playerContainer = this.scene.players.get(this.scene.currentPlayerId);
    if (!playerContainer) return;

    let vx = 0, vy = 0;

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

      // Client-side prediction
      const newX = playerContainer.x + vx * 0.016;
      const newY = playerContainer.y + vy * 0.016;

      playerContainer.x = newX;
      playerContainer.y = newY;
      
      // Start camera follow (moved from updatePlayer)
      this.scene.cameras.main.startFollow(playerContainer, true, 0.05, 0.05);

      // Send update to server
      this.scene.socket.emit("playerMove", { x: newX, y: newY, vx, vy });
    }
  }
}
