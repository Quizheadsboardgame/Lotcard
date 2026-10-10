import React from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Wallet } from 'lucide-react';

interface NavbarProps {
  currentTab: 'packs' | 'vault' | 'odds' | 'how-it-works';
  onSelectTab: (tab: 'packs' | 'vault' | 'odds' | 'how-it-works') => void;
  userBalance: number;
  onOpenWallet: () => void;
  vaultCount: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userBalance,
  onOpenWallet,
  vaultCount,
  isMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0A0C13]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('packs');
          }}
          className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black text-xs shadow-md">
            LC
          </span>
          <span>Lotcards</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('packs');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'packs' ? 'text-amber-400' : ''
            }`}
          >
            Mystery Packs
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('vault');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              currentTab === 'vault' ? 'text-amber-400' : ''
            }`}
          >
            <span>Inventory</span>
            {vaultCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {vaultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('odds');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'odds' ? 'text-amber-400' : ''
            }`}
          >
            Provably Fair
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('how-it-works');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'how-it-works' ? 'text-amber-400' : ''
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Primary Balance / Wallet Action */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWallet();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-500/50 transition-all text-xs font-mono group"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-emerald-400 tabular-nums">
              £{userBalance.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-amber-300">
              + Top Up
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
