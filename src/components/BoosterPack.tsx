import React, { useState, useRef } from 'react';
import { PackTier } from '../types';
import { Sparkles, Eye, RotateCcw, ExternalLink, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

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

  // Top chase card reference for pack mascot
  const topChaseCard = pack.cards.find((c) => c.isTopChase) || pack.cards[0];
  const mascotImg = topChaseCard.imageUrl || topChaseCard.artworkUrl;

  // Sizing definitions matching real Pokemon booster pack proportions (1 : 1.95)
  const sizeStyles = {
    sm: {
      container: 'w-[145px] h-[280px]',
      topCrimpH: 'h-6',
      bottomCrimpH: 'h-5',
      logoScale: 'scale-75 origin-top',
      mascotH: 'h-24 w-20',
      badgeText: 'text-[8px]',
      titleText: 'text-xs',
      subText: 'text-[7px]',
      teethCount: 16,
    },
    md: {
      container: 'w-[220px] h-[430px]',
      topCrimpH: 'h-8',
      bottomCrimpH: 'h-7',
      logoScale: 'scale-100',
      mascotH: 'h-40 w-32',
      badgeText: 'text-[10px]',
      titleText: 'text-sm',
      subText: 'text-[9px]',
      teethCount: 22,
    },
    hero: {
      container: 'w-[260px] sm:w-[280px] h-[505px] sm:h-[540px]',
      topCrimpH: 'h-10',
      bottomCrimpH: 'h-8',
      logoScale: 'scale-110',
      mascotH: 'h-52 w-40 sm:h-56 sm:w-44',
      badgeText: 'text-xs',
      titleText: 'text-base',
      subText: 'text-[10px]',
      teethCount: 26,
    },
  }[size];

  // Distinctive Mystery Pack themes per tier
  const packThemes: Record<
    string,
    {
      seriesName: string;
      expansionTitle: string;
      mascotTitle: string;
      elementalAura: string;
      accentBorder: string;
      foilGlow: string;
      crimpColor: string;
      foilSheen: string;
      mysteryVibe: string;
      glowGradient: string;
    }
  > = {
    'pack-5': {
      seriesName: 'SWORD & SHIELD SERIES',
      expansionTitle: 'SHINING EMBER VAULT',
      mascotTitle: 'CHARIZARD VMAX',
      elementalAura: 'from-amber-600/40 via-orange-600/30 to-red-950/60',
      accentBorder: 'border-amber-400/50',
      foilGlow: 'shadow-amber-500/30',
      crimpColor: 'from-amber-900/40 via-amber-200/40 to-amber-900/40',
      foilSheen: 'from-amber-500/20 via-orange-400/10 to-transparent',
      mysteryVibe: 'Fiery Ember Mystery Shroud',
      glowGradient: 'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.2) 50%, transparent 75%)',
    },
    'pack-10': {
      seriesName: 'SCARLET & VIOLET SERIES',
      expansionTitle: 'CELESTIAL DRAGON VAULT',
      mascotTitle: 'RAYQUAZA VMAX',
      elementalAura: 'from-emerald-600/40 via-teal-600/30 to-slate-950/60',
      accentBorder: 'border-emerald-400/50',
      foilGlow: 'shadow-emerald-500/30',
      crimpColor: 'from-emerald-900/40 via-emerald-200/40 to-emerald-900/40',
      foilSheen: 'from-emerald-500/20 via-teal-400/10 to-transparent',
      mysteryVibe: 'Celestial Cyclone Shroud',
      glowGradient: 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.45) 0%, rgba(13, 148, 136, 0.2) 50%, transparent 75%)',
    },
    'pack-25': {
      seriesName: 'MASTER COLLECTION SERIES',
      expansionTitle: 'GOLDEN CROWN VAULT',
      mascotTitle: 'MARIO PIKACHU',
      elementalAura: 'from-blue-600/40 via-cyan-600/30 to-indigo-950/60',
      accentBorder: 'border-cyan-400/50',
      foilGlow: 'shadow-cyan-500/30',
      crimpColor: 'from-cyan-900/40 via-cyan-200/40 to-cyan-900/40',
      foilSheen: 'from-cyan-500/20 via-blue-400/10 to-transparent',
      mysteryVibe: 'Electric 24K Royal Starlight',
      glowGradient: 'radial-gradient(circle at 50% 45%, rgba(6, 182, 212, 0.45) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 75%)',
    },
    'pack-50': {
      seriesName: 'ULTRA GRAIL ARCHIVE',
      expansionTitle: 'OBSIDIAN MOON VAULT',
      mascotTitle: 'MOONBREON VMAX',
      elementalAura: 'from-purple-600/40 via-fuchsia-600/30 to-stone-950/60',
      accentBorder: 'border-purple-400/50',
      foilGlow: 'shadow-purple-500/40',
      crimpColor: 'from-purple-900/40 via-fuchsia-200/40 to-purple-900/40',
      foilSheen: 'from-purple-500/20 via-fuchsia-400/10 to-transparent',
      mysteryVibe: 'Midnight Cosmic Nebula Shroud',
      glowGradient: 'radial-gradient(circle at 50% 45%, rgba(168, 85, 247, 0.5) 0%, rgba(217, 70, 239, 0.25) 50%, transparent 75%)',
    },
  };

  const theme = packThemes[pack.id] || packThemes['pack-5'];

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
          if (onInspect) {
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
          {/* FRONT FACE: REAL POKEMON FOIL BOOSTER PACK WITH MYSTERY AURA   */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl [backface-visibility:hidden] border ${theme.accentBorder} ${theme.foilGlow}`}
            style={{
              background: `linear-gradient(135deg, #0b0d14 0%, #151824 50%, #0d0f17 100%)`,
            }}
          >
            {/* Soft 3D Cylindrical Pillow Shading (Simulating cards bulging inside real foil wrapper) */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.12) 14%, rgba(255,255,255,0.02) 28%, transparent 50%, rgba(255,255,255,0.03) 72%, rgba(0,0,0,0.3) 88%, rgba(0,0,0,0.7) 100%)',
              }}
            />

            {/* Dynamic Prismatic Rainbow Mylar Foil Glare */}
            <div
              className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-200"
              style={{
                opacity: glarePos.opacity,
                background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255, 230, 0, 0.25) 25%, rgba(0, 240, 255, 0.25) 50%, rgba(255, 0, 180, 0.15) 75%, transparent 100%)`,
                mixBlendMode: 'color-dodge',
              }}
            />

            {/* Micro Diagonal Foil Texture Lines */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 6px)',
              }}
            />

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
              <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20 text-[7px] font-mono text-white/70 font-black tracking-tighter">
                ◀ TEAR
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 z-20 text-[7px] font-mono text-white/70 font-black tracking-tighter">
                TEAR ▶
              </div>
            </div>

            {/* MAIN PACK BODY */}
            <div className="relative flex-1 flex flex-col justify-between p-3 overflow-hidden z-15">
              {/* Radial Elemental Aura Backdrop */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: theme.glowGradient,
                }}
              />

              {/* Atmospheric Mystery Fog Nebula */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

              {/* TOP BRANDING BAR: POKEMON TCG HEADER */}
              <div className={`relative z-20 flex flex-col items-center text-center ${sizeStyles.logoScale}`}>
                {/* Series Banner */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-amber-300 uppercase shadow-sm">
                  <span>◆</span>
                  <span>{theme.seriesName}</span>
                  <span>◆</span>
                </div>

                {/* The Classic Pokemon Logo Styling */}
                <div className="relative mt-1">
                  <div className="text-xl sm:text-2xl font-black tracking-tighter uppercase font-sans select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 filter drop-shadow-[0_1px_1px_#1e3a8a]">
                    POKÉMON
                  </div>
                  <div className="text-[7px] sm:text-[8px] font-black tracking-[0.25em] text-white/95 uppercase -mt-0.5 drop-shadow">
                    TRADING CARD GAME
                  </div>
                </div>

                {/* Vault Expansion Title */}
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="h-[1px] w-4 bg-gradient-to-r from-transparent to-amber-400" />
                  <span className={`font-black uppercase tracking-wider text-white drop-shadow-md ${sizeStyles.titleText}`}>
                    {theme.expansionTitle}
                  </span>
                  <span className="h-[1px] w-4 bg-gradient-to-l from-transparent to-amber-400" />
                </div>
              </div>

              {/* CENTRAL MASCOT & MYSTERY AURA DISPLAY */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                {/* Ethereal Mystery Shroud Frame */}
                <div className="relative flex items-center justify-center">
                  {/* Pulsating Halo Glow */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/20 via-white/10 to-transparent blur-xl animate-pulse pointer-events-none" />

                  {/* Mascot Card Artwork Window with Mystery Shroud */}
                  <div
                    className={`relative ${sizeStyles.mascotH} rounded-xl overflow-hidden shadow-2xl border-2 border-white/40 bg-black/70 flex items-center justify-center transform transition-transform group-hover:scale-105 duration-300`}
                  >
                    {/* Official Pokemon Card Scan Image */}
                    <img
                      src={mascotImg}
                      alt={topChaseCard.name}
                      className="w-full h-full object-contain filter contrast-110 drop-shadow-2xl"
                      loading="lazy"
                    />

                    {/* Mystery Nebula Overlay (giving it that authentic mystery pack allure!) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Prismatic Shimmer Scan Line */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

                    {/* Holographic Mystery Emblem Badge */}
                    <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-amber-400/40 text-center">
                      <div className="text-[8px] sm:text-[9px] font-black font-mono text-amber-300 uppercase tracking-tight truncate">
                        {theme.mascotTitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 20x Top Chase Callout & Mystery Guarantee */}
                <div className="mt-2 text-center w-full max-w-[210px]">
                  <div className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/10 to-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[9px] sm:text-[10px] font-bold shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>20X CHASE: £{pack.topChaseValue.toLocaleString()}</span>
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-slate-300 font-mono mt-0.5 font-medium">
                    1 in 100 Odds · 100 Raw Cards Loaded
                  </div>
                </div>
              </div>

              {/* BOTTOM PACK DETAILS: GUARANTEED CARD INFO & PACK PRICE */}
              <div className="relative z-20 pt-2 border-t border-white/10 flex items-center justify-between text-white/90">
                <div className="flex flex-col">
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-400 uppercase tracking-widest">
                    CONTENTS
                  </span>
                  <span className={`font-mono font-bold text-white ${sizeStyles.subText}`}>
                    1 RAW CARD
                  </span>
                </div>

                <div className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black font-mono text-xs sm:text-sm shadow-md">
                  £{pack.cost}
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-400 uppercase tracking-widest">
                    FLOOR
                  </span>
                  <span className={`font-mono font-bold text-emerald-400 ${sizeStyles.subText}`}>
                    £{pack.floorValue.toFixed(2)}
                  </span>
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
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] border border-slate-700`}
            style={{
              background: `linear-gradient(135deg, #0e111a 0%, #161a26 50%, #0d0f17 100%)`,
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
            <div className="relative flex-1 p-3.5 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar">
              {/* The Vertical Sealed Foil Fin Flap running down the center */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/40 via-white/10 to-black/40 border-x border-white/10 pointer-events-none opacity-40" />

              <div>
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
                  <div className="text-xs font-bold text-white tracking-tight">
                    {pack.name} · Official Audit
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    100 Cards
                  </span>
                </div>

                <p className="text-[9px] text-slate-300 font-mono leading-relaxed mb-2.5">
                  Contains 1 randomly drawn authentic physical Pokémon card from a sealed pool of exactly 100 raw cards vaulted in the UK.
                </p>

                {/* Drop Odds Breakdown */}
                <div className="space-y-1 mb-2.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-[9px] font-mono">
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Certified Odds Breakdown:
                  </div>
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>👑 20x Top Chase ({pack.topChaseCardName.split(' ')[0]})</span>
                    <span>1.0%</span>
                  </div>
                  <div className="flex justify-between text-purple-300">
                    <span>⭐ Ultra Rare Hits (£35 - £70)</span>
                    <span>4.0%</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>💎 Rare Vault Hits</span>
                    <span>15.0%</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>⚡ Mid Tier Value Cards</span>
                    <span>30.0%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>📦 Standard Floor (NM/M)</span>
                    <span>50.0%</span>
                  </div>
                </div>

                {/* Instant Liquidity & Delivery Guarantee */}
                <div className="text-[8px] text-slate-400 font-mono space-y-1 border-t border-slate-800 pt-2">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Instant 90% Buyback or Physical Shipping</span>
                  </div>
                  <div>• UK Tracked: £3.99 (Free over £25)</div>
                  <div>• Overseas Tracked: £14.99 (Free over £100)</div>
                </div>
              </div>

              {/* Bottom Authentic EAN Barcode on Pack Reverse */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-slate-400">BATCH NO.</span>
                  <span className="text-[9px] font-mono font-bold text-white">#UK-VAULT-2024</span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-[1.5px] bg-white px-1.5 py-1 rounded h-5">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full bg-black"
                        style={{ width: i % 4 === 0 ? '2px' : '1px' }}
                      />
                    ))}
                  </div>
                  <span className="text-[7px] font-mono text-slate-400 mt-0.5">5 012345 678901</span>
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
