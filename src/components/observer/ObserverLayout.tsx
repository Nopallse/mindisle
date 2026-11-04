'use client';

import React, { useEffect, useState } from 'react';
import { TopHUD } from './TopHUD';
import { CharacterSidebar } from './CharacterSidebar';
import { CharacterInspectionPanel } from './CharacterInspectionPanel';
import { WorldEventLog } from './WorldEventLog';
import { PhaserCanvas } from './PhaserCanvas';

export const ObserverLayout: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="tracking-wide">Initializing Mindisle Living World...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. Top HUD */}
      <TopHUD />

      {/* 2. Main Center Body: Left Sidebar + Canvas + Right Inspection */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Character Sidebar */}
        <CharacterSidebar />

        {/* Central Game Canvas */}
        <main className="flex-1 h-full relative overflow-hidden bg-slate-950">
          <PhaserCanvas />
        </main>

        {/* Right Character Inspection Sidebar */}
        <CharacterInspectionPanel />
      </div>

      {/* 3. Bottom World Event Log */}
      <WorldEventLog />
    </div>
  );
};
