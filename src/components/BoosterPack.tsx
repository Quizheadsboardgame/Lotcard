import React, { useState, useRef } from 'react';
import { PackTier } from '../types';
import { Sparkles, Eye, RotateCcw, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export interface PackThemeConfig {
  seriesName: string;
  expansionTitle: string;
  mascotTitle: string;
  accentBorder: string;
  foilGlow: string;
  crimpColor: string;
  frontBackground: string;
  backBackground: string;
  badgeBg: string;
  themeColor: string;
  artUrl: string;
}

export const PACK_THEMES: Record<string, PackThemeConfig> = {
  'pack-5': {
    seriesName: 'STARTER VAULT · £5',
    expansionTitle: 'SHINING EMBER MYSTERY',
    mascotTitle: 'CHARIZARD VMAX',
    accentBorder: 'border-red-500/70',
    foilGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.35)]',
    crimpColor: 'from-amber-900/60 via-amber-200/50 to-amber-900/60',
    frontBackground: 'linear-gradient(150deg, #ea580c 0%, #dc2626 35%, #b91c1c 70%, #991b1b 100%)',
    backBackground: 'linear-gradient(150deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%)',
    badgeBg: 'bg-red-500/30 text-amber-200 border-red-400/50',
    themeColor: '#dc2626',
    artUrl: '/mystery-pack-art.png',
  },
  'pack-10': {
    seriesName: 'ELITE VAULT · £10',
    expansionTitle: 'CELESTIAL DRAGON MYSTERY',
    mascotTitle: 'RAYQUAZA VMAX',
    accentBorder: 'border-emerald-400/70',
    foilGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    crimpColor: 'from-emerald-900/60 via-emerald-200/50 to-emerald-900/60',
    frontBackground: 'linear-gradient(150deg, #10b981 0%, #059669 35%, #047857 70%, #064e3b 100%)',
    backBackground: 'linear-gradient(150deg, #064e3b 0%, #047857 50%, #022c22 100%)',
    badgeBg: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50',
    themeColor: '#059669',
    artUrl: '/mystery-pack-art.png',
  },
  'pack-25': {
    seriesName: 'MASTER VAULT · £25',
    expansionTitle: 'GOLDEN CROWN MYSTERY',
    mascotTitle: 'MARIO PIKACHU',
    accentBorder: 'border-blue-400/70',
    foilGlow: 'shadow-[0_0_30px_rgba(37,99,235,0.35)]',
    crimpColor: 'from-blue-900/60 via-cyan-200/50 to-blue-900/60',
    frontBackground: 'linear-gradient(150deg, #3b82f6 0%, #2563eb 35%, #1d4ed8 70%, #1e3a8a 100%)',
    backBackground: 'linear-gradient(150deg, #1e3a8a 0%, #1d4ed8 50%, #0f172a 100%)',
    badgeBg: 'bg-blue-500/30 text-blue-200 border-blue-400/50',
    themeColor: '#2563eb',
    artUrl: '/mystery-pack-art.png',
  },
  'pack-50': {
    seriesName: 'GRAIL VAULT · £50',
    expansionTitle: 'OBSIDIAN MOON MYSTERY',
    mascotTitle: 'MOONBREON VMAX',
    accentBorder: 'border-purple-400/70',
    foilGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.4)]',
    crimpColor: 'from-purple-900/60 via-fuchsia-200/50 to-purple-900/60',
    frontBackground: 'linear-gradient(150deg, #a855f7 0%, #9333ea 35%, #7e22ce 70%, #581c87 100%)',
    backBackground: 'linear-gradient(150deg, #581c87 0%, #6b21a8 50%, #2e1065 100%)',
    badgeBg: 'bg-purple-500/30 text-purple-200 border-purple-400/50',
    themeColor: '#9333ea',
    artUrl: '/mystery-pack-art.png',
  },
};

export function getPackTheme(packId: string): PackThemeConfig {
  return PACK_THEMES[packId] || PACK_THEMES['pack-5'];
}

interface BoosterPackProps {
  pack: PackTier;
  size?: 'sm' | 'md' | 'hero';
  interactive?: boolean;
  onInspect?: () => void;
  onRip?: () => void;
  showBackToggle?: boolean;
  className?: string;
}

export const BoosterPack: React.FC<BoosterPackProps> = ({
  pack,
  size = 'md',
  interactive = true,
  onInspect,
  onRip,
  showBackToggle = true,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const topChaseCard = pack.cards.find((c) => c.isTopChase) || pack.cards[0];
  const theme = getPackTheme(pack.id);

  // Sizing definitions matching real Pokemon booster pack proportions (1 : 1.95)
  const sizeStyles = {
    sm: {
      container: 'w-[145px] h-[280px]',
      topCrimpH: 'h-6',
      bottomCrimpH: 'h-5',
      badgeText: 'text-[7px]',
      titleText: 'text-[9px]',
      subText: 'text-[7px]',
    },
    md: {
      container: 'w-[220px] h-[430px]',
      topCrimpH: 'h-8',
      bottomCrimpH: 'h-7',
      badgeText: 'text-[9px]',
      titleText: 'text-xs',
      subText: 'text-[8px]',
    },
    hero: {
      container: 'w-[260px] sm:w-[280px] h-[505px] sm:h-[540px]',
      topCrimpH: 'h-10',
      bottomCrimpH: 'h-8',
      badgeText: 'text-[10px]',
      titleText: 'text-sm',
      subText: 'text-[9px]',
    },
  }[size];

  // Handle 3D Mouse / Touch perspective tilt & rainbow glare
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // tilt X (-12 to 12 deg)
    const rY = ((x - centerX) / centerX) * 14; // tilt Y (-14 to 14 deg)

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Perspective Canvas Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative ${sizeStyles.container} cursor-pointer group transition-transform duration-150`}
        style={{
          perspective: '1200px',
        }}
        onClick={() => {
          if (onRip) {
            onRip();
          } else if (onInspect) {
            sound.playClick();
            onInspect();
          }
        }}
      >
        {/* Flipping 3D wrapper */}
        <div
          className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ============================================================== */}
          {/* FRONT FACE: AUTHENTIC POKEMON MYSTERY FOIL BOOSTER PACK        */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl [backface-visibility:hidden] border ${theme.accentBorder} ${theme.foilGlow}`}
          >
            {/* TOP CRIMPED FOIL FIN (Authentic Heat-Sealed Retail Crimp with Peg Hanger Slot) */}
            <div className={`relative ${sizeStyles.topCrimpH} w-full shrink-0 z-30 flex flex-col justify-between overflow-hidden shadow-md border-b border-black/80`}>
              {/* Metallic Crimped Teeth Serrations */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, #1f242e 0px, #4b5563 2px, #d1d5db 4px, #9ca3af 6px, #11141b 8px)',
                }}
              />
              {/* Crimp Foil Glaze Highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/60 pointer-events-none" />

              {/* Retail Die-Cut Peg Hanger Slot ("Sombrero" Punch Hole) */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-10 h-2.5 sm:w-12 sm:h-3 rounded-full bg-[#08090E]/90 border border-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <div className="w-4 h-1 rounded-full bg-black/60" />
                </div>
              </div>

              {/* Left and Right Notched Tear Markers */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 text-[7px] font-mono text-white/80 font-black tracking-tighter">
                ◀ TEAR
              </div>
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 text-[7px] font-mono text-white/80 font-black tracking-tighter">
                TEAR ▶
              </div>
            </div>

            {/* MAIN PACK BODY WITH SET-SPECIFIC BACKGROUND COLOR & MYSTERY DESIGN */}
            <div
              className="relative flex-1 flex flex-col justify-between overflow-hidden z-15"
              style={{
                background: theme.frontBackground,
              }}
            >
              {/* Soft 3D Cylindrical Pillow Shading */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.18) 12%, rgba(255,255,255,0.02) 25%, transparent 50%, rgba(255,255,255,0.04) 75%, rgba(0,0,0,0.25) 88%, rgba(0,0,0,0.65) 100%)',
                }}
              />

              {/* Micro Diagonal Foil Texture Lines */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-25"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 6px)',
                }}
              />

              {/* Dynamic Prismatic Rainbow Mylar Foil Glare */}
              <div
                className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-200"
                style={{
                  opacity: glarePos.opacity,
                  background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.55) 0%, rgba(255, 230, 0, 0.3) 25%, rgba(0, 240, 255, 0.3) 50%, rgba(255, 0, 180, 0.2) 75%, transparent 100%)`,
                  mixBlendMode: 'color-dodge',
                }}
              />

              {/* Top Series Identifier Badge */}
              <div className="relative z-30 pt-1.5 px-2.5 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${theme.badgeBg} ${sizeStyles.badgeText} font-mono font-bold tracking-wider uppercase backdrop-blur-sm shadow-sm`}>
                  <span>◆</span>
                  <span>{theme.seriesName}</span>
                </span>
                <span className={`${sizeStyles.badgeText} font-mono font-bold text-white/90 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs`}>
                  1 RAW CARD
                </span>
              </div>

              {/* THE USER'S EXACT MYSTERY PACK DESIGN ARTWORK */}
              <div className="relative z-15 flex-1 w-full flex items-center justify-center p-2 my-auto">
                <img
                  src={theme.artUrl}
                  alt={`${pack.name} Mystery Pack Design`}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Bottom Chase & Floor Callout Footer */}
              <div className="relative z-30 pb-1.5 pt-1 px-2.5 flex items-center justify-between border-t border-black/20 bg-black/35 backdrop-blur-xs">
                <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-black text-amber-300 drop-shadow">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>20X: £{pack.topChaseValue}</span>
                </div>
                <div className="text-[7px] sm:text-[8px] font-mono text-white/90 font-medium">
                  FLOOR £{pack.floorValue.toFixed(2)}
                </div>
              </div>
            </div>

            {/* BOTTOM CRIMPED FOIL FIN (Heat-Sealed Mylar Teeth with Legal/Barcode Stamping) */}
            <div className={`relative ${sizeStyles.bottomCrimpH} w-full shrink-0 z-30 flex items-center justify-between px-2 overflow-hidden shadow-inner border-t border-black/80`}>
              {/* Metallic Crimped Teeth Serrations */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, #1f242e 0px, #4b5563 2px, #d1d5db 4px, #9ca3af 6px, #11141b 8px)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-black/70 pointer-events-none" />

              {/* Fine Print Stamped on Bottom Crimp */}
              <span className="relative z-10 text-[6px] sm:text-[7px] font-mono text-slate-300 font-bold tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                ©2024 POKÉMON / LOTCARDS VAULT #UK-992
              </span>

              {/* Mini Barcode Stamp */}
              <div className="relative z-10 flex items-center gap-[1px] bg-white px-1 py-0.5 rounded-xs h-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-black"
                    style={{ width: i % 3 === 0 ? '2px' : '1px' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BACK FACE: AUTHENTIC BOOSTER PACK REVERSE (FIN FOLD & ODDS)    */}
          {/* WITH UNIQUE SET-SPECIFIC BACK COLOR                            */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] border ${theme.accentBorder}`}
            style={{
              background: theme.backBackground,
            }}
          >
            {/* Top Crimp on Back */}
            <div className={`relative ${sizeStyles.topCrimpH} w-full shrink-0 z-30 flex items-center justify-center overflow-hidden border-b border-black/80`}>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, #1f242e 0px, #4b5563 2px, #d1d5db 4px, #9ca3af 6px, #11141b 8px)',
                }}
              />
              <div className="relative z-10 w-10 h-2 rounded-full bg-[#08090E]/90 border border-black/80" />
            </div>

            {/* Back Body with Authentic Vertical Fin-Fold Seam */}
            <div className="relative flex-1 p-3 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar">
              {/* The Vertical Sealed Foil Fin Flap running down the center */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/40 via-white/10 to-black/40 border-x border-white/10 pointer-events-none opacity-40" />

              <div>
                <div className="flex items-center justify-between border-b border-white/20 pb-1.5 mb-2">
                  <div className="text-xs font-bold text-white tracking-tight drop-shadow">
                    {pack.name} · Official Audit
                  </div>
                  <span className="text-[9px] font-mono text-amber-300 bg-black/50 px-1.5 py-0.5 rounded border border-amber-400/30">
                    100 Cards
                  </span>
                </div>

                <p className="text-[8px] sm:text-[9px] text-white/90 font-mono leading-relaxed mb-2 drop-shadow-xs">
                  Contains 1 randomly drawn authentic physical Pokémon card from a sealed pool of exactly 100 raw cards vaulted in the UK.
                </p>

                {/* Drop Odds Breakdown */}
                <div className="space-y-1 mb-2 bg-black/60 p-2 rounded-lg border border-white/15 text-[8px] sm:text-[9px] font-mono backdrop-blur-xs">
                  <div className="text-[8px] font-bold text-white/70 uppercase tracking-wider mb-1">
                    Certified Odds Breakdown:
                  </div>
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>👑 20x Top Chase ({topChaseCard.name.split(' ')[0]})</span>
                    <span>1.0%</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>⭐ Ultra Rare Hits</span>
                    <span>4.0%</span>
                  </div>
                  <div className="flex justify-between text-cyan-200">
                    <span>💎 Rare Vault Hits</span>
                    <span>15.0%</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>⚡ Mid Tier Value Cards</span>
                    <span>30.0%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>📦 Standard Floor (NM/M)</span>
                    <span>50.0%</span>
                  </div>
                </div>

                {/* Instant Liquidity & Delivery Guarantee */}
                <div className="text-[8px] text-white/80 font-mono space-y-0.5 border-t border-white/15 pt-1.5">
                  <div className="flex items-center gap-1 text-emerald-300 font-bold">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span>Instant 90% Buyback or Physical Shipping</span>
                  </div>
                  <div>• UK Tracked: £3.99 (Free over £25)</div>
                  <div>• Overseas Tracked: £14.99 (Free over £100)</div>
                </div>
              </div>

              {/* Bottom Authentic EAN Barcode on Pack Reverse */}
              <div className="pt-1.5 border-t border-white/15 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-white/70">BATCH NO.</span>
                  <span className="text-[8px] font-mono font-bold text-white">#UK-VAULT-2024</span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-[1.5px] bg-white px-1.5 py-0.5 rounded h-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full bg-black"
                        style={{ width: i % 4 === 0 ? '2px' : '1px' }}
                      />
                    ))}
                  </div>
                  <span className="text-[6px] font-mono text-white/80 mt-0.5">5 012345 678901</span>
                </div>
              </div>
            </div>

            {/* Bottom Crimp on Back */}
            <div className={`relative ${sizeStyles.bottomCrimpH} w-full shrink-0 z-30 flex items-center justify-center overflow-hidden border-t border-black/80`}>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(90deg, #1f242e 0px, #4b5563 2px, #d1d5db 4px, #9ca3af 6px, #11141b 8px)',
                }}
              />
              <span className="relative z-10 text-[7px] font-mono text-slate-300 font-bold">
                POKÉMON.COM UK TCG DATABASE COMPLIANT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auxiliary interactive controls beneath the booster pack */}
      {showBackToggle && (
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsFlipped(!isFlipped);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-mono text-[10px] flex items-center gap-1 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>{isFlipped ? 'Front View' : 'Inspect Back & Odds'}</span>
          </button>

          {onInspect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onInspect();
              }}
              className="px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono text-[10px] flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3 h-3 text-blue-400" />
              <span>Audit 100 Cards</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

