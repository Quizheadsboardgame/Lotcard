import React, { useState, useRef } from 'react';
import { PokemonCard } from '../types';
import { resolveCardArt, OFFICIAL_POKEMON_CARD_BACK, getPokemonUkDatabaseUrl } from '../data/cardArtwork';
import { Sparkles, Maximize2, ExternalLink, RotateCcw, X, ShieldCheck } from 'lucide-react';

interface CardSlabProps {
  card: PokemonCard;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showDetails?: boolean;
  onCardClick?: () => void;
}

export const CardSlab: React.FC<CardSlabProps> = ({
  card,
  interactive = true,
  size = 'md',
  showDetails = false,
  onCardClick,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fallback artwork resolution
  const resolvedArt = resolveCardArt(card.name, card.pokemonType, card.isTopChase);
  const actualImageUrl = card.imageUrl || resolvedArt.imageUrl;
  const officialDbUrl = card.pokemonUkDbUrl || resolvedArt.pokemonUkDbUrl || getPokemonUkDatabaseUrl(card.name);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.8,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomModalOpen(true);
  };

  // Dimensions formatted to standard ~1:1.4 physical Pokemon trading card ratio (63mm x 88mm)
  const scaleClasses = {
    sm: 'w-[170px] h-[245px] text-[10px]',
    md: 'w-[210px] h-[305px] text-xs',
    lg: 'w-[265px] h-[385px] text-xs',
    hero: 'w-[300px] sm:w-[330px] h-[440px] sm:h-[480px] text-sm',
  }[size];

  const instantSell = Number((card.marketValue * 0.9).toFixed(2));

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onCardClick}
        className={`relative select-none transition-transform duration-150 ease-out preserve-3d group ${scaleClasses}`}
        style={{
          transform: interactive
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`
            : isFlipped
            ? 'rotateY(180deg)'
            : undefined,
          transition: isFlipped ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.15s ease-out',
        }}
      >
        {/* 20x Chase Golden Crown Aura */}
        {card.isTopChase && (
          <div className="absolute -inset-2.5 bg-gradient-to-r from-amber-500/40 via-yellow-400/60 to-amber-600/40 rounded-3xl blur-md animate-pulse pointer-events-none z-0" />
        )}

        {/* ULTRA-PRO ONE-TOUCH MAGNETIC SLEEVE CASING */}
        <div
          className={`relative w-full h-full rounded-2xl p-2 bg-[#0c0e14]/95 border-2 ${
            card.isTopChase
              ? 'border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.4)]'
              : 'border-slate-700/80 shadow-2xl'
          } overflow-hidden flex flex-col justify-between`}
          style={{
            boxShadow: card.isTopChase
              ? '0 0 35px rgba(245, 158, 11, 0.45), inset 0 0 14px rgba(255, 255, 255, 0.25)'
              : '0 15px 35px rgba(0, 0, 0, 0.85), inset 0 0 8px rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Authentic Diamond Corner Cutouts */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-br-sm bg-black/80 border-r border-b border-white/20 pointer-events-none z-30" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-bl-sm bg-black/80 border-l border-b border-white/20 pointer-events-none z-30" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-tr-sm bg-black/80 border-r border-t border-white/20 pointer-events-none z-30" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-tl-sm bg-black/80 border-l border-t border-white/20 pointer-events-none z-30" />

          {/* Holographic Prismatic Foil Glare Overlay (Shifts with mouse tilt!) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-30 rounded-xl"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255,255,255,0) 80%),
                           linear-gradient(${glarePos.x * 2.5}deg, rgba(255,0,128,0.2), rgba(0,255,255,0.2), rgba(255,255,0,0.2))`,
            }}
          />

          {/* Top Sleeve Casing Tab / Vault Authenticity Header */}
          <div className="flex items-center justify-between pb-1 border-b border-white/15 z-20 shrink-0">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 inline-block" />
              <span className="font-mono font-bold text-[9px] tracking-wider text-emerald-400 shrink-0">
                RAW NM/M
              </span>
              <span className="text-slate-600 font-mono text-[9px]">·</span>
              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">
                #{card.serialCode || card.certNumber || 'RAW-001'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {card.isTopChase && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[8px] px-1 py-0.2 rounded uppercase">
                  👑 20x CHASE
                </span>
              )}
              {/* Quick Flip Button */}
              <button
                type="button"
                onClick={handleFlip}
                title="Flip card (view front/back)"
                className="text-[9px] font-mono text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-0.5 transition-colors"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>{isFlipped ? 'Front' : 'Back'}</span>
              </button>
              {/* Quick Zoom Button */}
              <button
                type="button"
                onClick={handleZoom}
                title="Zoom high-resolution card scan"
                className="text-[9px] font-mono text-slate-300 hover:text-white p-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* MAIN CARD BODY: THE ACTUAL POKÉMON CARD */}
          <div className="relative flex-1 my-1 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-[1.01] transition-transform duration-200">
            {/* FRONT FACE: Authentic Full Pokémon Card Scan */}
            <div
              className={`absolute inset-0 flex items-center justify-center p-1 transition-opacity duration-300 ${
                isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Official Pokemon.com UK Source Badge */}
              <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-blue-400/40 text-[7px] font-mono text-blue-300 pointer-events-none shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>Pokemon.com UK Scan</span>
              </div>

              {/* The Actual Physical Pokemon Card Face */}
              {!imgError ? (
                <img
                  src={actualImageUrl}
                  alt={card.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain filter drop-shadow-xl rounded-lg"
                />
              ) : (
                /* High-fidelity Authentic Card Face Fallback if network blocked */
                <div className="w-full h-full rounded-lg bg-gradient-to-b from-amber-900/60 via-slate-900 to-black p-2 flex flex-col justify-between border-2 border-amber-500/40">
                  <div className="flex items-center justify-between pb-1 border-b border-white/20">
                    <span className="font-bold text-xs text-white truncate">{card.name}</span>
                    <span className="font-mono text-xs text-amber-300">HP {card.hp || 310}</span>
                  </div>
                  <div className="relative flex-1 my-1 rounded bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={card.artworkUrl || resolvedArt.artworkUrl}
                      alt={card.name}
                      className="w-3/4 h-3/4 object-contain filter drop-shadow-lg"
                    />
                  </div>
                  <div className="p-1 rounded bg-black/70 text-[9px] font-mono text-slate-300">
                    <div className="flex justify-between font-bold text-white">
                      <span>{card.attacks?.[0]?.name || 'Attack Move'}</span>
                      <span className="text-amber-400">{card.attacks?.[0]?.damage || '280'}</span>
                    </div>
                    <div className="text-[8px] text-slate-400 truncate">{card.description}</div>
                  </div>
                </div>
              )}

              {/* Holographic light sheen reflection bar */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 pointer-events-none" />

              {/* Direct Pokemon.com UK database external link */}
              <a
                href={officialDbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2 right-2 z-20 flex items-center gap-0.5 bg-black/85 hover:bg-blue-900/90 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20 hover:border-blue-400 text-[7px] font-mono text-slate-200 hover:text-white transition-all shadow-md group/link"
                title="Verify on Pokemon.com UK TCG Database"
              >
                <span>UK TCG DB</span>
                <ExternalLink className="w-2 h-2 text-blue-400 group-hover/link:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* BACK FACE: Authentic Classic Blue Pokémon Card Back */}
            <div
              className={`absolute inset-0 flex items-center justify-center p-1 transition-opacity duration-300 ${
                isFlipped ? 'opacity-100 [transform:rotateY(180deg)]' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={OFFICIAL_POKEMON_CARD_BACK}
                alt="Classic Pokemon Card Back"
                loading="lazy"
                className="w-full h-full object-contain filter drop-shadow-xl rounded-lg"
                onError={(e) => {
                  // Fallback styled card back if external back is blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {/* Back watermark overlay */}
              <div className="absolute bottom-2 inset-x-2 text-center bg-black/70 backdrop-blur-sm rounded py-0.5 text-[8px] font-mono text-slate-300 pointer-events-none">
                Authentic Pokémon TCG Reverse
              </div>
            </div>
          </div>

          {/* Bottom Sleeve Casing Status: Set & Market Value */}
          <div className="pt-1 border-t border-white/15 flex items-center justify-between text-[9px] shrink-0 font-mono text-slate-300 z-20">
            <div className="flex items-center gap-1 text-[8px] text-slate-400 truncate max-w-[130px]">
              <span className="text-white font-semibold">#{card.setNumber}</span>
              <span>·</span>
              <span className="truncate">{card.set}</span>
            </div>

            <div className="text-right flex items-baseline gap-1 shrink-0">
              <span className="text-[8px] text-slate-400">Value:</span>
              <span className="font-black text-amber-400 tabular-nums text-[10px] sm:text-xs">
                £{card.marketValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Optional Metadata Subtitle for Grids */}
        {showDetails && (
          <div className="mt-2 text-center">
            <div className="text-xs font-semibold text-white truncate" title={card.name}>
              {card.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono tabular-nums flex items-center justify-center gap-1.5 mt-0.5">
              <span className="text-amber-300 font-bold">£{card.marketValue.toFixed(2)}</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">
                90% Instant: £{instantSell.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <a
                href={officialDbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[9px] font-mono text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-0.5"
              >
                <span>Pokemon.com UK DB</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL: FULL-RESOLUTION SCAN INSPECTION */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0D0F18] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL POKÉMON TCG SCAN</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {card.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {card.set} · #{card.setNumber} · {card.year}
              </p>
            </div>

            {/* High-Resolution Pokémon Card Image */}
            <div className="relative w-full max-w-[340px] h-[480px] rounded-2xl overflow-hidden bg-black/70 border border-white/20 p-2 shadow-2xl flex items-center justify-center">
              <img
                src={isFlipped ? OFFICIAL_POKEMON_CARD_BACK : actualImageUrl}
                alt={card.name}
                className="w-full h-full object-contain filter drop-shadow-2xl rounded-xl"
              />
            </div>

            {/* Financial Valuation & Database Link */}
            <div className="w-full mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="font-mono text-xs">
                <span className="text-slate-400">Market Value: </span>
                <span className="text-amber-400 font-bold">£{card.marketValue.toFixed(2)}</span>
                <span className="text-slate-600 mx-1.5">·</span>
                <span className="text-emerald-400 font-bold">90% Sell: £{instantSell.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
                </button>

                <a
                  href={officialDbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Verify on UK DB</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
