'use client';

import React, { useEffect, useRef } from 'react';
import type * as PhaserType from 'phaser';

export const PhaserCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserType.Game | null>(null);

  useEffect(() => {
    let isMounted = true;
    let localGame: PhaserType.Game | null = null;

    // Load Phaser on client side only
    const initPhaser = async () => {
      try {
        if (!containerRef.current) return;

        const Phaser = await import('phaser');
        const { createGameConfig } = await import('../../game/config');

        if (!isMounted || !containerRef.current) return;

        // Clean up any stale canvas elements inside container
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        const config = createGameConfig(containerRef.current.id);
        localGame = new Phaser.Game(config);
        gameRef.current = localGame;
      } catch (err) {
        console.error('Failed to initialize Phaser game canvas:', err);
      }
    };

    initPhaser();

    return () => {
      isMounted = false;
      if (localGame) {
        localGame.destroy(true);
        localGame = null;
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
      <div
        id="eden-phaser-container"
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden"
      />
      {/* Subtle overlay hint */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700/60 shadow-sm backdrop-blur-sm">
        Drag: Pan | Scroll: Zoom | Click character: Inspect
      </div>
    </div>
  );
};

