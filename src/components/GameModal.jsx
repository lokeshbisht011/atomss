import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const GameModal = ({
  isOpen,
  mode = "start",
  playerName,
  setPlayerName,
  onStart,
  onRestart,
  finalStats = null,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900/80 border border-blue-500 rounded-xl p-8 shadow-xl max-w-md w-full text-center backdrop-blur-md"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Atomss.fun
          </h1>

          <p className="text-gray-400 mb-6">
            {mode === "start"
              ? "Collect particles, grow your atom, and dominate the arena."
              : "Your atom has reached critical instability!"}
          </p>

          {mode === "start" ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onStart()}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                />
              </div>

              <button
                onClick={onStart}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Join Game
              </button>

              <div className="mt-8 p-4 bg-gray-800/70 rounded-lg text-left">
                <h3 className="text-sm font-bold text-blue-400 mb-2">
                  How to Play:
                </h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Move with WASD or Arrow keys</li>
                  <li>• Aim with mouse, shoot with Left Click</li>
                  <li>• Collect protons (red), neutrons (gray), electrons (blue)</li>
                  <li>• Grow your atom and become powerful elements</li>
                  <li>• Shoot energy bullets to shrink opponents</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* --- Game Over --- */}
              <div className="bg-gray-800/70 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-blue-400 font-bold mb-2 text-sm">
                  Final Stats
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>🌟 Element: {finalStats?.element || "Unknown"}</li>
                  <li>⚛️ Protons: {finalStats?.protons ?? 0}</li>
                  <li>💫 Stability: {finalStats?.stability ?? 0}</li>
                  {finalStats?.rank && <li>🏅 Rank: #{finalStats.rank}</li>}
                </ul>
              </div>

              <button
                onClick={onRestart}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Play Again
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameModal;
