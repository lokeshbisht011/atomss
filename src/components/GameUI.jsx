"use client";

import { Atom, Zap, Trophy, Circle } from "lucide-react";

export default function GameUI({ stats }) {
  const getStabilityColor = (stability) => {
    if (stability > 60) return "bg-green-500";
    if (stability > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStabilityText = (stability) => {
    if (stability > 60) return "Stable";
    if (stability > 30) return "Unstable";
    return "Critical";
  };

  const getNextParticleAdvice = () => {
    const protonElectronDiff = stats.protons - stats.electrons;
    const protonNeutronDiff = stats.protons - stats.neutrons;

    if (stats.stability > 80)
      return "You’re stable — explore or collect more to grow!";

    if (protonElectronDiff > 2)
      return "Collect more electrons to balance charge!";

    if (protonElectronDiff < -2)
      return "Collect more protons to balance charge!";

    if (Math.abs(protonNeutronDiff) > 3) {
      if (stats.neutrons < stats.protons)
        return "Collect neutrons for stability!";
      return "Collect protons to balance nucleus!";
    }

    return "Slightly unstable — balance particles to stabilize!";
  };

  const topPlayers = [...(stats.players || [])]
    .sort((a, b) => b.protons - a.protons)
    .slice(0, 10);

  const WORLD_SIZE = 9000;
  const MINI_MAP_SIZE = 200;
  const MINI_MAP_SIZE_MOBILE = 120;

  return (
    <>
      {/* ================= DESKTOP UI ================= */}
      <div className="hidden sm:block absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-6 left-6 bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-4 backdrop-blur-sm pointer-events-auto max-w-[250px]">
          <div className="flex items-center gap-2 mb-3">
            <Atom className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {stats.element}
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300 w-20">Protons:</span>
              <span className="text-sm font-bold text-white">
                {stats.protons}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-300 w-20">Neutrons:</span>
              <span className="text-sm font-bold text-white">
                {stats.neutrons}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-300 w-20">Electrons:</span>
              <span className="text-sm font-bold text-white">
                {stats.electrons}
              </span>
            </div>
          </div>

          {/* Stability Bar */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Stability</span>
            </div>
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${getStabilityColor(
                  stats.stability
                )} transition-all duration-300`}
                style={{ width: `${stats.stability}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
                {getStabilityText(stats.stability)} ({stats.stability}%)
              </span>
            </div>

            {/* Next Particle Advice */}
            <p className="text-xs text-gray-300 mt-3 italic">
              💡 {getNextParticleAdvice()}
            </p>
          </div>
          {/* Legend TODO remove*/}
          <div className="mt-4 bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-3 backdrop-blur-sm pointer-events-auto">
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>{stats.worldTotals.protons}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span>{stats.worldTotals.neutrons}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{stats.worldTotals.electrons}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>{stats.worldTotals.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls + Leaderboard */}
        <div className="absolute top-6 right-6 bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-4 backdrop-blur-sm pointer-events-auto max-h-[80vh] overflow-y-auto">
          {/* Controls */}
          <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Controls
          </h3>
          <div className="space-y-1 text-xs text-gray-300 mb-4">
            <div>
              <span className="text-blue-400 font-mono">WASD</span> /{" "}
              <span className="text-blue-400 font-mono">Arrows</span> - Move
            </div>
            <div>
              <span className="text-blue-400 font-mono">Mouse</span> - Aim
            </div>
            <div>
              <span className="text-blue-400 font-mono">Left Click</span> -
              Shoot
            </div>
          </div>

          {/* Leaderboard */}
          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-bold text-yellow-400">
                Top 10 Players
              </h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              {topPlayers.map((player, index) => (
                <div
                  key={player.name + index}
                  className="flex gap items-center justify-between bg-gray-800/60 rounded-md px-2 py-1"
                >
                  <span className="text-blue-400 font-bold w-4 text-right">
                    {index + 1}.
                  </span>
                  <span className="font-medium flex-1 ml-2 truncate">
                    {player.name}
                  </span>
                  <span className="text-cyan-400 text-[11px]">
                    {player.element}
                  </span>
                  <div
                    className={`ml-2 h-2 w-10 rounded-full ${getStabilityColor(
                      player.stability
                    )}`}
                    title={`Stability: ${player.stability}%`}
                  ></div>
                </div>
              ))}

              {topPlayers.length === 0 && (
                <p className="text-gray-500 text-xs italic">
                  No players yet...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mini-Map */}
        <div className="absolute bottom-6 right-6 w-[210px] h-[210px] bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-2 backdrop-blur-sm pointer-events-auto">
          <div className="relative w-full h-full bg-gray-800 rounded-sm overflow-hidden">
            {stats.players?.map((player) => {
              const x = (player.x / WORLD_SIZE) * MINI_MAP_SIZE;
              const y = (player.y / WORLD_SIZE) * MINI_MAP_SIZE;

              const isCurrent = player.element === stats.element;

              return (
                <div key={player.id} className="relative group">
                  <div
                    className={`absolute w-3 h-3 rounded-full border ${
                      isCurrent
                        ? "bg-cyan-400 border-white"
                        : "bg-red-400 border-gray-700"
                    }`}
                    style={{ left: x - 1.5, top: y - 1.5 }}
                  ></div>

                  {/* Hover Tooltip */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full px-2 py-1 text-xs text-white bg-black bg-opacity-80 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {player.name} ({player.element})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MOBILE UI ================= */}
      <div className="block sm:hidden absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Element Info at top */}
        <div className="absolute top-4 left-4 w-[35%] bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-3 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <Atom className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 truncate">
              {stats.element}
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300 w-20">Protons:</span>
              <span className="text-sm font-bold text-white">
                {stats.protons}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-300 w-20">Neutrons:</span>
              <span className="text-sm font-bold text-white">
                {stats.neutrons}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-300 w-20">Electrons:</span>
              <span className="text-sm font-bold text-white">
                {stats.electrons}
              </span>
            </div>
          </div>

          {/* Stability */}
          <div className="mt-2 border-t border-gray-700 pt-2">
            <div className="flex items-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Stability</span>
            </div>
            <div className="relative h-5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${getStabilityColor(
                  stats.stability
                )} transition-all duration-300`}
                style={{ width: `${stats.stability}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
                {getStabilityText(stats.stability)} ({stats.stability}%)
              </span>
            </div>
            <p className="text-[10px] text-gray-300 mt-1 italic">
              💡 {getNextParticleAdvice()}
            </p>
          </div>
        </div>

        <div className="absolute top-4 right-4 backdrop-blur-sm pointer-events-auto overflow-y-auto w-[35%]">
          <div className="bg-gray-900/90 border-2 border-blue-500/50 rounded-lg p-2 max-h-[80vh] mb-2">
            {/* Leaderboard */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <h3 className="text-xs font-bold text-yellow-400">
                Top 10 Players
              </h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              {topPlayers.map((player, index) => (
                <div
                  key={player.name + index}
                  className="flex gap items-center justify-between bg-gray-800/60 rounded-md px-1 py-1"
                >
                  <span className="text-blue-400 font-bold w-4 text-right">
                    {index + 1}.
                  </span>
                  <span className="font-medium flex-1 ml-2 truncate">
                    {player.name}
                  </span>
                  <span className="text-cyan-400 text-[11px]">
                    {player.element}
                  </span>
                  <div
                    className={`ml-2 h-2 w-10 rounded-full ${getStabilityColor(
                      player.stability
                    )}`}
                    title={`Stability: ${player.stability}%`}
                  ></div>
                </div>
              ))}

              {topPlayers.length === 0 && (
                <p className="text-gray-500 text-xs italic">
                  No players yet...
                </p>
              )}
            </div>
          </div>

          {/* Mini-Map below Leaderboard */}
          <div className="w-full h-40 bg-gray-800 rounded-lg p-2 overflow-hidden bg-gray-900/90 border-2 border-blue-500/50 backdrop-blur-sm">
            <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
              {stats.players?.map((player) => {
                const x = (player.x / WORLD_SIZE) * MINI_MAP_SIZE_MOBILE;
                const y = (player.y / WORLD_SIZE) * MINI_MAP_SIZE_MOBILE;
                const isCurrent = player.element === stats.element;

                return (
                  <div key={player.id} className="relative group">
                    <div
                      className={`absolute w-3 h-3 rounded-full border ${
                        isCurrent
                          ? "bg-cyan-400 border-white"
                          : "bg-red-400 border-gray-700"
                      }`}
                      style={{ left: x - 1.5, top: y - 1.5 }}
                    ></div>

                    {/* Hover Tooltip */}
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full px-2 py-1 text-xs text-white bg-black bg-opacity-80 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {player.name} ({player.element})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
