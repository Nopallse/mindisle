'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GameBridge } from '../../game/GameBridge';
import { WorldEvent } from '../../types/events';
import { EventBus } from '../../simulation/events/EventBus';
import { ScrollText, ChevronUp, ChevronDown, Radio } from 'lucide-react';

export const WorldEventLog: React.FC = () => {
  const bridge = GameBridge.getInstance();
  const [events, setEvents] = useState<WorldEvent[]>(() => bridge.getEvents());
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'MOVEMENT' | 'TIME' | 'SYSTEM'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsub = eventBus.on('worldEvent', (newEvent: unknown) => {
      setEvents((prev) => [newEvent as WorldEvent, ...prev.slice(0, 99)]);
    });
    return unsub;
  }, []);

  const getBadgeColor = (type: WorldEvent['type']) => {
    switch (type) {
      case 'SYSTEM':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'MOVEMENT':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'TIME':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const filteredEvents = filter === 'ALL' ? events : events.filter((e) => e.type === filter);

  return (
    <div className="border-t border-slate-800 bg-slate-900/95 select-none transition-all duration-200 z-10 backdrop-blur-md">
      {/* Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-slate-300">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer hover:text-white"
        >
          <ScrollText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            World Event Log
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono ml-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVE FEED ({events.length})
          </span>
        </div>

        {/* Filter Pills & Collapse */}
        <div className="flex items-center gap-2">
          {isExpanded && (
            <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
              {(['ALL', 'MOVEMENT', 'TIME', 'SYSTEM'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filter === cat
                      ? 'bg-slate-800 text-emerald-300 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Events List */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="h-28 px-4 py-2 overflow-y-auto space-y-1.5 font-mono text-[11px] border-t border-slate-800/60 divide-y divide-slate-800/30"
        >
          {filteredEvents.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No events matching filter.</p>
          ) : (
            filteredEvents.map((evt) => (
              <div key={evt.id} className="pt-1.5 flex items-start gap-2.5">
                <span suppressHydrationWarning className="text-slate-500 text-[10px] whitespace-nowrap">
                  {evt.timestamp}
                </span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold whitespace-nowrap ${getBadgeColor(
                    evt.type
                  )}`}
                >
                  {evt.type}
                </span>
                <span className="text-slate-300 flex-1">{evt.message}</span>
                <span suppressHydrationWarning className="text-slate-500 text-[10px] whitespace-nowrap">
                  {evt.worldTime}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

