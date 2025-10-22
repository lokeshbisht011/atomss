"use client";

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { io } from "socket.io-client";
import GameModal from "./GameModal";
import MainScene from "../game/MainScene.js";
import GameUI from "./GameUI";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export default function GameCanvas() {
  const [showModal, setShowModal] = useState(true);
  const [modalMode, setModalMode] = useState("start");
  const [playerName, setPlayerName] = useState("");

  const gameRef = useRef(null);
  const socketRef = useRef(null);

  const [stats, setStats] = useState({
    protons: 1,
    neutrons: 0,
    electrons: 0,
    element: "Hydrogen",
    stability: 100,
    players: [],
    worldTotals: {},
  });

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_ATOMSS_BACKEND_URL);
    socketRef.current = socket;

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game-container",
      backgroundColor: "#050510",
      scene: MainScene,
      physics: { default: "arcade", arcade: { debug: false } },
      plugins: {
        global: [
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    socket.on("connect", () => console.log("✅ Connected to server"));

    // game.events.once(Phaser.Core.Events.READY, () => {
    //   const scene = game.scene.keys["MainScene"]; // or whatever your scene key is
    //   if (scene && scene.disableKeyboard) {
    //     scene.disableKeyboard();
    //     console.log("🎮 Keyboard input disabled for modal");
    //   }
    // });

    // Clean up on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (gameRef.current) gameRef.current.destroy(true);
    };
  }, []);

  const handleStartGame = () => {
    if (!playerName.trim()) return;

    const socket = socketRef.current;
    const scene = gameRef.current?.scene?.scenes[0];

    if (socket && scene && scene.setSocket) {
      scene.setSocket(socket);
      scene.setStatsCallback((newStats) => setStats(newStats));
      scene.setGameOverCallback(handleGameOver);
      socket.emit("joinGame", playerName);
    }

    setShowModal(false);
  };

  const handleRestartGame = () => {
    const socket = socketRef.current;
    socket.emit("restartGame");
    setShowModal(false);
  };

  const handleGameOver = () => {
    setModalMode("gameOver");
    setShowModal(true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Phaser Game */}
      <div id="game-container" className="absolute inset-0" />

      {!showModal && <GameUI stats={stats} />}

      {/* Overlay UI */}
      <GameModal
        isOpen={showModal}
        mode={modalMode}
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={handleStartGame}
        onRestart={handleRestartGame}
      />
    </div>
  );
}
