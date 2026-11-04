'use client';

import React, { useEffect, useState } from 'react';
import { GameBridge } from '../../game/GameBridge';
import { WorldTime } from '../../types/world';
import { EventBus } from '../../simulation/events/EventBus';
import {
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  Calendar,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  CloudSun,
} from 'lucide-react';

export const TopHUD: React.FC = () => {
  const bridge = GameBridge.getInstance();
  const [time, setTime] = useState<WorldTime>(() => bridge.getSnapshot().time);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsub = eventBus.on('worldTick', () => {
      setTime(bridge.getSnapshot().time);
    });
    return unsub;
  }, [bridge]);

  const togglePause = () => {
    const isPaused = bridge.togglePause();
    setTime((prev) => ({ ...prev, isPaused }));
  };

  const handleSpeed = (speed: number) => {
    bridge.setSpeed(speed);
    setTime((prev) => ({ ...prev, speed }));
  };

  const handleTimeJump = (hour: number) => {
    bridge.setWorldTime(hour, 0);
  };

  const formatClock = () => {
    const hh = String(time.hour).padStart(2, '0');
    const mm = String(time.minute).padStart(2, '0');
    const ampm = time.hour >= 12 ? 'PM' : 'AM';
    return `${hh}:${mm} ${ampm}`;
  };

  const getWeatherInfo = () => {
    const h = time.hour;
    if (h >= 6 && h < 9) {
      return {
        icon: <CloudSun className="w-3.5 h-3.5 text-amber-300" />,
        label: 'Golden Sunrise',
        temp: '20°C',
        desc: 'Gentle mist & cool morning dew',
      };
    } else if (h >= 9 && h < 17) {
      return {
        icon: <Sun className="w-3.5 h-3.5 text-yellow-400" />,
        label: 'Pleasant Sunlight',
        temp: '24°C',
        desc: 'Clear skies, butterflies active',
      };
    } else if (h >= 17 && h < 20) {
      return {
        icon: <Sunset className="w-3.5 h-3.5 text-orange-400" />,
        label: 'Warm Sunset',
        temp: '22°C',
        desc: 'Campfire embers glowing',
      };
    } else {
      return {
        icon: <Moon className="w-3.5 h-3.5 text-indigo-300" />,
        label: 'Starlit Twilight',
        temp: '18°C',
        desc: 'Lanterns lit, fireflies drifting',
      };
    }
  };

  const weather = getWeatherInfo();

  return (
    <header className="h-16 px-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between text-slate-100 select-none z-20 backdrop-blur-md">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
          <Sparkles className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-white uppercase font-mono">
              EDEN
            </h1>
            <span className="text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PHASE 1
            </span>
          </div>
          <p className="text-[11px] text-slate-400">AI Living World Simulation</p>
        </div>
      </div>

      {/* World Clock, Weather & Atmosphere */}
      <div className="flex items-center gap-3">
        {/* Day & Clock */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-3.5 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Day {time.day}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-700/80" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{formatClock()}</span>
          </div>
          {time.isPaused && (
            <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              PAUSED
            </span>
          )}
        </div>

        {/* Dynamic Weather & Atmosphere Badge */}
        <div
          className="hidden md:flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800/80 text-xs font-mono"
          title={weather.desc}
        >
          {weather.icon}
          <span className="text-slate-300">{weather.label}</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400">{weather.temp}</span>
        </div>

        {/* Quick Time of Day Presets */}
        <div className="hidden lg:flex items-center bg-slate-950/60 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => handleTimeJump(6)}
            className={`px-2 py-1 rounded transition-colors ${
              time.hour >= 6 && time.hour < 9 ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Set to Dawn (06:00)"
          >
            Dawn
          </button>
          <button
            onClick={() => handleTimeJump(12)}
            className={`px-2 py-1 rounded transition-colors ${
              time.hour >= 9 && time.hour < 17 ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Set to Noon (12:00)"
          >
            Noon
          </button>
          <button
            onClick={() => handleTimeJump(18)}
            className={`px-2 py-1 rounded transition-colors ${
              time.hour >= 17 && time.hour < 20 ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Set to Sunset (18:00)"
          >
            Dusk
          </button>
          <button
            onClick={() => handleTimeJump(22)}
            className={`px-2 py-1 rounded transition-colors ${
              time.hour >= 20 || time.hour < 6 ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Set to Night (22:00)"
          >
            Night
          </button>
        </div>
      </div>

      {/* Simulation & Camera Controls */}
      <div className="flex items-center gap-3">
        {/* Simulation Speed & Pause */}
        <div className="flex items-center bg-slate-950/80 rounded-lg p-1 border border-slate-800">
          <button
            onClick={togglePause}
            className={`p-1.5 rounded-md transition-colors ${
              time.isPaused
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={time.isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          >
            {time.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {([1, 2, 5] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => handleSpeed(spd)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                time.speed === spd && !time.isPaused
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={`Run at ${spd}x speed`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Camera Zoom Buttons */}
        <div className="flex items-center bg-slate-950/80 rounded-lg p-1 border border-slate-800 text-slate-400">
          <button
            onClick={() => bridge.zoomIn()}
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => bridge.zoomOut()}
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => bridge.resetZoom()}
            className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-100 transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

