import React from 'react';
import { DropEvent } from '../types';
import { Sparkles } from 'lucide-react';

interface LiveDropTickerProps {
  drops: DropEvent[];
  onSelectDrop?: (drop: DropEvent) => void;
}

export const LiveDropTicker: React.FC<LiveDropTickerProps> = ({ drops }) => {
  return (
    <div className="w-full bg-[#080A10] border-b border-slate-800/80 overflow-hidden py-2 select-none shadow-sm">
      <div className="flex items-center">
        {/* Live Indicator Label */}
        <div className="px-4 shrink-0 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-300 border-r border-slate-800/80 bg-slate-900/40 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-white tracking-wide">Live Feed</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-x-auto flex items-center gap-3 px-4 scrollbar-none whitespace-nowrap">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className={`inline-flex items-center gap-2 text-xs font-mono py-1 px-3 rounded-xl transition-all shadow-sm ${
                drop.isGrail
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/40 text-amber-300 font-bold shadow-amber-500/5'
                  : 'bg-slate-900/80 border border-slate-800/90 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-slate-400 text-[11px] font-semibold">{drop.userName}</span>
              <span className="text-slate-500 text-[10px]">pulled</span>
              <span className="font-bold text-white text-xs truncate max-w-[150px]">
                {drop.cardName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-200 font-medium border border-white/5">
                {drop.cardGrade}
              </span>
              <span className="font-black text-emerald-400 tabular-nums text-xs">
                £{drop.marketValue.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">{drop.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
