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
  const previewCards = pack.cards.slice(0, 4);

  return (
    <div className="relative group rounded-2xl bg-[#10121A] border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl">
      {/* Background radial glow */}
      <div
        className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${pack.accentColor}`}
      />

      {/* Header section with pricing */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{pack.name}</h3>
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${pack.badgeColor} bg-white/5`}>
                £{pack.cost}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{pack.tagline}</p>
          </div>
        </div>

        {/* 20x Chase Banner Card */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400/90 font-medium uppercase tracking-wider">
                20x Top Chase
              </div>
              <div className="text-xs font-bold text-white truncate max-w-[170px] sm:max-w-[200px]">
                {pack.topChaseCardName}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-amber-400 font-mono tabular-nums block">
              £{pack.topChaseValue.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1 in 100 odds</span>
          </div>
        </div>
      </div>

      {/* Real Pokemon Booster Foil Pack with Mystery Aura & 3D Tilt */}
      <div className="px-5 py-3 flex items-center justify-center relative">
        <BoosterPack
          pack={pack}
          size="md"
          interactive
          onInspect={() => onInspect(pack)}
          showBackToggle
        />
      </div>

      {/* Pack Key Metrics & Odds Summary */}
      <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/30">
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">Total Pool</span>
            <span className="font-semibold text-slate-200">100 Cards</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Floor Value</span>
            <span className="font-semibold text-slate-200">£{pack.floorValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Avg Value</span>
            <span className="font-semibold text-emerald-400">£{pack.averageValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Multi-pack selector pills */}
        <div className="mt-3 flex items-center justify-between gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800">
          {[1, 3, 5].map((cnt) => (
            <button
              key={cnt}
              onClick={() => {
                sound.playClick();
                setSelectedCount(cnt);
              }}
              className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all font-mono ${
                selectedCount === cnt
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cnt}x Pack
            </button>
          ))}
        </div>
      </div>

      {/* Actual Cards Loaded Preview Strip */}
      <div className="px-5 py-2 bg-slate-950/40 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Actual Cards Loaded</span>
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onInspect(pack);
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold text-[10px] hover:underline"
          >
            All 100 →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {previewCards.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                sound.playClick();
                onInspect(pack);
              }}
              className="group/thumb relative rounded-lg bg-slate-900 border border-slate-800 p-1 flex flex-col items-center cursor-pointer hover:border-amber-500/60 hover:bg-slate-850 transition-all shadow-sm"
              title={`${c.name} · £${c.marketValue.toFixed(2)} (NM/M)`}
            >
              <img
                src={c.imageUrl || c.artworkUrl}
                alt={c.name}
                className="w-7 h-10 object-contain rounded drop-shadow group-hover/thumb:scale-105 transition-transform"
                loading="lazy"
              />
              <span className="text-[8px] font-mono text-amber-400 font-bold truncate w-full text-center mt-1">
                £{c.marketValue.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-3 flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onInspect(pack);
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          title="Inspect all 100 cards loaded in pack"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Actual Cards (100)</span>
        </button>

        <button
          onClick={() => {
            if (!canAfford) return;
            sound.playClick();
            onRip(pack, selectedCount);
          }}
          disabled={!canAfford}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md font-mono ${
            canAfford
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 hover:shadow-amber-500/20 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
          }`}
        >
          <span>Rip {selectedCount > 1 ? `${selectedCount}x` : ''}</span>
          <span className="tabular-nums">· £{totalCost.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};
