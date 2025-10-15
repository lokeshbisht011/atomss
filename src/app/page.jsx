'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), {
  ssr: false,
});

export default function Home() {
  // const [gameStarted, setGameStarted] = useState(false);
  // const [playerName, setPlayerName] = useState('');

  // const handleJoinGame = () => {
  //   if (playerName.trim()) {
  //     setGameStarted(true);
  //   }
  // };

  // if (!gameStarted) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
  //       <div className="bg-gray-800 border-2 border-blue-500 rounded-lg p-8 shadow-2xl max-w-md w-full">
  //         <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
  //           Atom Arena
  //         </h1>
  //         <p className="text-gray-400 text-center mb-8">
  //           Collect particles, grow your atom, and dominate the arena
  //         </p>

  //         <div className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-300 mb-2">
  //               Player Name
  //             </label>
  //             <input
  //               type="text"
  //               value={playerName}
  //               onChange={(e) => setPlayerName(e.target.value)}
  //               onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
  //               placeholder="Enter your name"
  //               className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               maxLength={20}
  //             />
  //           </div>

  //           <button
  //             onClick={handleJoinGame}
  //             className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
  //           >
  //             Join Game
  //           </button>
  //         </div>

  //         <div className="mt-8 p-4 bg-gray-700 rounded-lg">
  //           <h3 className="text-sm font-bold text-blue-400 mb-2">How to Play:</h3>
  //           <ul className="text-xs text-gray-300 space-y-1">
  //             <li>• Move with WASD or Arrow keys</li>
  //             <li>• Aim with mouse, shoot with Left Click</li>
  //             <li>• Collect protons (red), neutrons (gray), electrons (blue)</li>
  //             <li>• Grow your atom and become powerful elements</li>
  //             <li>• Shoot energy bullets to shrink opponents</li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return <GameCanvas/>;
}
