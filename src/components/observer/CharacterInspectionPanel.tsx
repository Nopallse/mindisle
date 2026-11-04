'use client';

import React, { useEffect, useState } from 'react';
import { GameBridge } from '../../game/GameBridge';
import { CharacterId, CharacterSnapshot } from '../../types/character';
import { EventBus } from '../../simulation/events/EventBus';
import {
  Compass,
  MapPin,
  Activity,
  Zap,
  Sparkles,
  Users,
  Eye,
  ShieldCheck,
  Heart,
  Tag,
} from 'lucide-react';

export const CharacterInspectionPanel: React.FC = () => {
  const bridge = GameBridge.getInstance();
  const [character, setCharacter] = useState<CharacterSnapshot | null>(() => {
    const id = bridge.getSelectedCharacter();
    return id ? bridge.getSnapshot().characters[id] : null;
  });

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubTick = eventBus.on('worldTick', () => {
      const currId = bridge.getSelectedCharacter();
      if (currId) {
        setCharacter(bridge.getSnapshot().characters[currId]);
      }
    });

    const unsubSelect = bridge.onSelectionChange((id) => {
      if (id) {
        setCharacter(bridge.getSnapshot().characters[id]);
      } else {
        setCharacter(null);
      }
    });

    return () => {
      unsubTick();
      unsubSelect();
    };
  }, [bridge]);

  if (!character) {
    return (
      <aside className="w-80 bg-slate-900/95 border-l border-slate-800 p-4 flex flex-col items-center justify-center text-slate-400 font-mono text-xs select-none">
        <p>Select a character to inspect state</p>
      </aside>
    );
  }

  const isNaufal = character.id === 'naufal';

  // Grounded location descriptor based on authoritative tile position
  const getLocationName = (x: number, y: number) => {
    if (x >= 18 && x <= 24 && y >= 7 && y <= 13) return 'Pond Shoreline / Bridge';
    if (x >= 9 && x <= 13 && y >= 13 && y <= 16) return 'Campfire Gathering Circle';
    if (x >= 8 && x <= 12 && y >= 2 && y <= 5) return 'Ancient Stone Well';
    if (x <= 7 && y >= 7 && y <= 12) return 'Western Clover Meadow';
    if (x >= 25) return 'Eastern Vista Grove';
    if (x === 10 || y === 10) return 'Cobblestone Crossroads';
    return 'Lush Grassy Island';
  };

  const tendencies = isNaufal
    ? ['Curious', 'Adventurous', 'Friendly', 'Impulsive']
    : ['Observant', 'Thoughtful', 'Cautious', 'Introverted'];

  return (
    <aside className="w-80 bg-slate-900/95 border-l border-slate-800 flex flex-col z-10 backdrop-blur-md select-none overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg border border-white/20"
            style={{
              backgroundColor: isNaufal ? '#2563eb' : '#059669',
            }}
          >
            {character.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {character.name}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              {isNaufal ? 'Curious Explorer' : 'Naturalist Observer'}
            </p>
          </div>
        </div>

        <button
          onClick={() => bridge.focusCharacter(character.id)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Focus Camera on Character"
        >
          <Eye className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      <div className="p-4 space-y-3.5 flex-1">
        {/* Current Location & Activity */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-sky-400" />
              Area & Activity
            </h3>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                character.activity === 'walking'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {character.activity === 'walking' ? 'NAVIGATING' : 'IDLE / RESTING'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/50">
            <div className="text-xs font-semibold text-slate-200">
              {getLocationName(character.tileX, character.tileY)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Grid Tile: ({character.tileX}, {character.tileY}) | Facing:{' '}
              <span className="text-amber-300 capitalize">{character.direction}</span>
            </div>
          </div>
        </div>

        {/* Behavioral Tendencies */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-emerald-400" />
            Behavioral Tendencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tendencies.map((trait) => (
              <span
                key={trait}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Simulated Attributes */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            Simulated Attributes
          </h3>

          {/* Energy */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Energy
              </span>
              <span className="text-slate-200 font-semibold">
                {character.attributes.energy}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${character.attributes.energy}%` }}
              />
            </div>
          </div>

          {/* Curiosity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" /> Curiosity
              </span>
              <span className="text-slate-200 font-semibold">
                {character.attributes.curiosity}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${character.attributes.curiosity}%` }}
              />
            </div>
          </div>

          {/* Sociability */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Sociability
              </span>
              <span className="text-slate-200 font-semibold">
                {character.attributes.sociability}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${character.attributes.sociability}%` }}
              />
            </div>
          </div>
        </div>

        {/* Equipped Items & Carryings */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-sky-400" />
            Equipped Gear & Satchel
          </h3>
          <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
            {isNaufal ? (
              <>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-slate-300">
                  <span className="text-base">🧭</span>
                  <div>
                    <div className="text-slate-200 font-medium">Brass Pocket Compass</div>
                    <div className="text-[9px] text-slate-500">Navigation tool</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-slate-300">
                  <span className="text-base">🪵</span>
                  <div>
                    <div className="text-slate-200 font-medium">Carved Walking Staff</div>
                    <div className="text-[9px] text-slate-500">Sturdy oak walking aid</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-slate-300">
                  <span className="text-base">📔</span>
                  <div>
                    <div className="text-slate-200 font-medium">Botanist Field Journal</div>
                    <div className="text-[9px] text-slate-500">Pressed flowers & notes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-slate-300">
                  <span className="text-base">🍵</span>
                  <div>
                    <div className="text-slate-200 font-medium">Chamomile Herbal Flask</div>
                    <div className="text-[9px] text-slate-500">Warm calming brew</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Action */}
        <button
          onClick={() => bridge.focusCharacter(character.id)}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          Focus & Follow in World
        </button>
      </div>
    </aside>
  );
};
