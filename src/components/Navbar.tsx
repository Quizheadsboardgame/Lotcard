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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090B12]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Brand Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('packs');
          }}
          className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </span>
          <span className="tracking-tighter font-extrabold uppercase text-white group-hover:text-amber-400 transition-colors">
            Lotcards
          </span>
        </button>

        {/* Navigation links with bold active pills */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('packs');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'packs'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'hover:text-white hover:bg-slate-850/60'
            }`}
          >
            Mystery Packs
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('vault');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'vault'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'hover:text-white hover:bg-slate-850/60'
            }`}
          >
            <span>Inventory</span>
            {vaultCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-black">
                {vaultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('odds');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'odds'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'hover:text-white hover:bg-slate-850/60'
            }`}
          >
            Provably Fair Odds
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('how-it-works');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
              currentTab === 'how-it-works'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'hover:text-white hover:bg-slate-850/60'
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* User Balance & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Primary Balance Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWallet();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-500/50 transition-all text-xs font-mono shadow-md group"
          >
            <Wallet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-slate-400 font-medium">Bal</span>
              <span className="font-extrabold text-emerald-400 tabular-nums">
                £{userBalance.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
              + Top Up
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
