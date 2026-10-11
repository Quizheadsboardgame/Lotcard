import React, { useState } from 'react';
import { PackTier } from '../types';
import { Eye, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { BoosterPack } from './BoosterPack';

interface PackCardProps {
  pack: PackTier;
  onInspect: (pack: PackTier) => void;
  onRip: (pack: PackTier, count: number) => void;
  userBalance: number;
}

export const PackCard: React.FC<PackCardProps> = ({
  pack,
  onInspect,
  onRip,
  userBalance,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const totalCost = pack.cost * selectedCount;
  const canAfford = userBalance >= totalCost;
  const topChaseCard = pack.cards.find((c) => c.isTopChase) || pack.cards[0];

  return (
    <div className="relative group rounded-3xl bg-[#0E1019] border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-amber-500/5">
      {/* Dynamic ambient radial glow */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${pack.accentColor} group-hover:opacity-30 transition-opacity`}
      />

      {/* Header section with pricing */}
      <div className="p-5 pb-3 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-black text-white tracking-tight">{pack.name}</h3>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${pack.badgeColor} bg-white/5 shadow-sm`}>
                £{pack.cost}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{pack.tagline}</p>
          </div>
        </div>

        {/* 20x Top Chase Showcase Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/8 to-transparent border border-amber-500/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span>20x Top Chase</span>
              </div>
              <div className="text-xs font-bold text-white truncate max-w-[155px] sm:max-w-[170px]">
                {pack.topChaseCardName}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 pl-2">
            <span className="text-sm font-black text-amber-400 font-mono tabular-nums block">
              £{pack.topChaseValue.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-mono block">1 in 100 odds</span>
          </div>
        </div>
      </div>

      {/* Real Pokemon Booster Foil Pack with Mystery Aura & 3D Tilt */}
      <div className="px-5 py-4 flex items-center justify-center relative">
        <BoosterPack
          pack={pack}
          size="md"
          interactive
          onRip={() => {
            if (canAfford) {
              sound.playClick();
              onRip(pack, selectedCount);
            }
          }}
          onInspect={() => onInspect(pack)}
          showBackToggle
        />
      </div>

      {/* Pack Key Metrics & Odds Summary */}
      <div className="px-5 py-3.5 border-t border-slate-800/80 bg-slate-950/50 relative z-10">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 text-[10px] block font-medium">Pool</span>
            <span className="font-bold text-slate-200">100 Cards</span>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 text-[10px] block font-medium">Floor</span>
            <span className="font-bold text-slate-200">£{pack.floorValue.toFixed(2)}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 text-[10px] block font-medium">Avg Value</span>
            <span className="font-bold text-emerald-400">£{pack.averageValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Multi-pack selector pills */}
        <div className="mt-3 flex items-center justify-between gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {[1, 3, 5].map((cnt) => (
            <button
              key={cnt}
              onClick={() => {
                sound.playClick();
                setSelectedCount(cnt);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all font-mono ${
                selectedCount === cnt
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cnt}x Pack
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-3.5 flex items-center gap-2.5 relative z-10">
        <button
          onClick={() => {
            sound.playClick();
            onInspect(pack);
          }}
          className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm active:scale-[0.98]"
          title="Inspect all 100 cards loaded in pack"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Pool (100)</span>
        </button>

        <button
          onClick={() => {
            if (!canAfford) return;
            sound.playClick();
            onRip(pack, selectedCount);
          }}
          disabled={!canAfford}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-lg font-mono ${
            canAfford
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 hover:shadow-amber-500/25 active:scale-[0.98]'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
          }`}
        >
          <span>Rip {selectedCount > 1 ? `${selectedCount}x` : ''}</span>
          <span className="tabular-nums normal-case font-bold">· £{totalCost.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};
