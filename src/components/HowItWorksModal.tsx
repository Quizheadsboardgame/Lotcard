import React from 'react';
import { X, ShieldCheck, RefreshCw, Truck, Database, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowItWorksModalProps {
  onClose: () => void;
  onExplorePacks: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  onClose,
  onExplorePacks,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0E1017] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            LC
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">How Lotcards Works</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Inspired by Courtyard.io's physical asset vaulting protocol. Here's how our 100-card Pokémon mystery packs operate:
        </p>

        {/* 4 Pillars */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100 Cards Loaded in Every Pack</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every mystery pack (£5, £10, £25, £50) contains a finite pool of exactly 100 certified raw Pokémon cards. No hidden algorithms: you can inspect all 100 cards and exact drop rates before opening.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed 20x Top Chase</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The premier chase card in each tier is valued at exactly 20x the entry price: £100 for £5 packs, £200 for £10 packs, £500 for £25 packs, and a £1,000 Moonbreon Raw NM/M for £50 packs!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">1:1 Backed by Physical Raw Cards</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                All pulls are 100% authentic raw Pokémon cards protected in penny sleeves and rigid magnetic touch holders in climate-controlled vaults.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Sell @ 90% & Free Shipping</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Instant sell back for <strong>90% cash value</strong> at any time. Or request physical delivery with <strong>Free Shipping over £25 (UK only)</strong> and <strong>Free Shipping over £100 (Overseas)</strong>!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
            onExplorePacks();
          }}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-all shadow-md"
        >
          Start Opening Mystery Packs
        </button>
      </div>
    </div>
  );
};
