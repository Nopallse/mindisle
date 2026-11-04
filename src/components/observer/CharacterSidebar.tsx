'use client';

import React, { useEffect, useState } from 'react';
import { GameBridge } from '../../game/GameBridge';
import { CharacterId, CharacterSnapshot } from '../../types/character';
import { EventBus } from '../../simulation/events/EventBus';
import { User, Eye, MapPin, Activity } from 'lucide-react';

export const CharacterSidebar: React.FC = () => {
  const bridge = GameBridge.getInstance();
  const [characters, setCharacters] = useState<Record<CharacterId, CharacterSnapshot>>(
    () => bridge.getSnapshot().characters
  );
  const [selectedId, setSelectedId] = useState<CharacterId | null>(() =>
    bridge.getSelectedCharacter()
  );

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubTick = eventBus.on('worldTick', () => {
      setCharacters({ ...bridge.getSnapshot().characters });
    });

    const unsubSelect = bridge.onSelectionChange((id) => {
      setSelectedId(id);
    });

    return () => {
      unsubTick();
      unsubSelect();
    };
  }, [bridge]);

  const handleSelect = (id: CharacterId) => {
    bridge.focusCharacter(id);
  };

  const charList = Object.values(characters);

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col z-10 backdrop-blur-md select-none">
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-300 font-mono flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          Characters ({charList.length})
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">AUTONOMOUS</span>
      </div>

      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
        {charList.map((char) => {
          const isSelected = selectedId === char.id;
          const isNaufal = char.id === 'naufal';

          return (
            <div
              key={char.id}
              onClick={() => handleSelect(char.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/60 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Header: Avatar, Name & Role */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm"
                    style={{
                      backgroundColor: isNaufal ? '#2563eb' : '#059669',
                    }}
                  >
                    {char.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      {char.name}
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {isNaufal ? 'Curious Explorer' : 'Thoughtful Observer'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    bridge.focusCharacter(char.id);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-700/60 transition-colors"
                  title="Focus Camera"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status & Position Bar */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/60 font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Activity className="w-3 h-3 text-sky-400" />
                  <span className="capitalize">{char.activity}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>({char.tileX}, {char.tileY})</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Island Minimap / Radar Widget */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Island Radar (30x20)
            </span>
            <span className="text-[9px] font-mono text-slate-500">SCALE 1:1</span>
          </div>

          {/* Minimap Grid Container */}
          <div className="relative w-full aspect-[30/20] bg-emerald-950/40 rounded-lg border border-slate-800/80 overflow-hidden">
            {/* Crossroads representation */}
            <div className="absolute left-[33.3%] top-0 bottom-0 w-[3.3%] bg-amber-900/40" />
            <div className="absolute top-[50%] left-0 right-0 h-[5%] bg-amber-900/40" />

            {/* Pond */}
            <div className="absolute left-[60%] top-[35%] w-[23.3%] h-[35%] bg-sky-700/50 rounded-sm border border-sky-500/30" />
            {/* Bridge */}
            <div className="absolute left-[60%] top-[50%] w-[23.3%] h-[5%] bg-amber-800/80" />

            {/* Campfire mark */}
            <div className="absolute left-[33.3%] top-[70%] w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />

            {/* Character Blips */}
            {charList.map((char) => {
              const leftPercent = (char.tileX / 30) * 100;
              const topPercent = (char.tileY / 20) * 100;
              const isNaufal = char.id === 'naufal';

              return (
                <div
                  key={char.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white flex items-center justify-center transition-all duration-300 ${
                    isNaufal ? 'bg-blue-500 shadow-sm shadow-blue-500' : 'bg-emerald-500 shadow-sm shadow-emerald-500'
                  }`}
                  title={`${char.name} at (${char.tileX}, ${char.tileY})`}
                >
                  <span className="text-[6px] font-bold text-white leading-none">
                    {char.name.charAt(0)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1.5 px-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Naufal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Lauren
            </span>
            <span className="text-amber-400/80">🔥 Campfire</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 font-mono">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
          Phase 1 Rules
        </p>
        <p className="leading-relaxed">
          Characters move deterministically according to world collision & walkability.
        </p>
      </div>
    </aside>
  );
};

