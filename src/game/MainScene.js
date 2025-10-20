import Phaser from "phaser";
import { Renderer } from "./Renderer.js";
import { InputManager } from "./InputManager.js";
import { FXManager } from "./FXManager.js";
import { SocketManager } from "./SocketManager.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });

    // Public game state (used by managers)
    this.socket = null;
    this.players = new Map();
    this.resources = new Map();
    this.bullets = new Map();
    this.currentPlayerId = null;

    // UI callbacks
    this.onStatsUpdate = null;
    this.onGameOver = null;

    // Managers
    this.renderer = null;
    this.inputManager = null;
    this.fxManager = null;
    this.socketManager = null;
    
    // Hardcoded world dimensions (ideally from a shared config)
    this.WORLD_WIDTH = 9000;
    this.WORLD_HEIGHT = 9000;
  }

  // --- External Setter Methods ---

  setSocket(socket) {
    // Inject the socket into the manager only after it's initialized
    if (this.socketManager) {
        this.socketManager.setupSocket(socket);
    } else {
        // Queue the socket if the manager isn't ready (shouldn't happen in this setup)
        this.socket = socket; 
    }
  }

  setStatsCallback(callback) {
    this.onStatsUpdate = callback;
  }

  setGameOverCallback(callback) {
    this.onGameOver = callback;
  }
  
  // --- Phaser Lifecycle Methods ---

  preload() {
    // Delegate audio loading to the FX Manager
    this.fxManager = new FXManager(this);
    this.fxManager.preload();
  }

  create() {
    this.renderer = new Renderer(this);
    this.inputManager = new InputManager(this);
    this.socketManager = new SocketManager(this);

    // If socket was set before create, initialize manager now
    if (this.socket) {
        this.socketManager.setupSocket(this.socket);
    }

    this.fxManager.create(); // Create audio/textures
    this.renderer.createWorldGraphics(this.WORLD_WIDTH, this.WORLD_HEIGHT);
  }

  update(time, delta) {
    // Delegate client prediction and server comms to InputManager
    this.inputManager?.update(time, delta);
  }
}
