import React from 'react';
import { DropEvent } from '../types';
import { Sparkles } from 'lucide-react';

interface LiveDropTickerProps {
  drops: DropEvent[];
  onSelectDrop?: (drop: DropEvent) => void;
}

export const LiveDropTicker: React.FC<LiveDropTickerProps> = ({ drops }) => {
  return (
    <div className="w-full bg-[#07080C] border-b border-slate-800/60 overflow-hidden py-2 select-none">
      <div className="flex items-center">
        {/* Label */}
        <div className="px-3 shrink-0 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-r border-slate-800">
          <span className="text-amber-400 text-xs">●</span>
          <span className="font-semibold text-slate-300">Live Pulls</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-x-auto flex items-center gap-4 px-4 scrollbar-none whitespace-nowrap">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className={`inline-flex items-center gap-2 text-xs font-mono py-0.5 px-2.5 rounded-md transition-colors ${
                drop.isGrail
                  ? 'bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-slate-400 text-[11px] font-medium">{drop.userName}</span>
              <span className="text-slate-500 text-[10px]">pulled</span>
              <span className="font-bold text-white text-[11px] truncate max-w-[140px]">
                {drop.cardName}
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-300">
                {drop.cardGrade}
              </span>
              <span className="font-bold text-emerald-400 tabular-nums text-[11px]">
                £{drop.marketValue.toFixed(2)}
              </span>
              <span className="text-[9px] text-slate-400">{drop.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
