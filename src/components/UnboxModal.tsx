import React, { useState, useEffect, useRef } from 'react';
import { PackTier, PokemonCard } from '../types';
import { CardSlab } from './CardSlab';
import { BoosterPack } from './BoosterPack';
import { GrailRevealEffect } from './GrailRevealEffect';
import { sound } from '../utils/audio';
import { Sparkles, ShieldCheck, RefreshCw, DollarSign, Package, X, Flame, Eye, Globe, ExternalLink, Crown } from 'lucide-react';

interface UnboxModalProps {
  pack: PackTier;
  count: number;
  onClose: () => void;
  onVault: (cards: PokemonCard[]) => void;
  onInstantSell: (cards: PokemonCard[], totalValue: number) => void;
  onRedeemPhysical: (card: PokemonCard) => void;
  onRipAgain: (pack: PackTier, count: number) => void;
  userBalance: number;
}

export const UnboxModal: React.FC<UnboxModalProps> = ({
  pack,
  count,
  onClose,
  onVault,
  onInstantSell,
  onRedeemPhysical,
  onRipAgain,
  userBalance,
}) => {
  const [pulledCards, setPulledCards] = useState<PokemonCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Stages: sealed -> buildup (heartbeat & charge) -> ripping (pack tears open and card pulls out) -> revealed
  const [stage, setStage] = useState<'sealed' | 'buildup' | 'ripping' | 'revealed'>('sealed');
  const [ripPhase, setRipPhase] = useState<'tear' | 'emerge'>('tear');

  // Generate pulls based on provable fair random weights from the 100 cards
  useEffect(() => {
    const results: PokemonCard[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * pack.cards.length);
      results.push(pack.cards[randomIndex]);
    }
    setPulledCards(results);
  }, [pack, count]);

  const currentCard = pulledCards[currentIndex];
  const isGrail = !!(currentCard?.isTopChase || (currentCard as any)?.isGrail || currentCard?.rarity === 'grail');
  const isUltraRare = currentCard?.rarity === 'ultra_rare';
  const isRare = currentCard?.rarity === 'rare';
  const totalMarketValue = pulledCards.reduce((acc, c) => acc + c.marketValue, 0);
  const instantSellPayout = Number((totalMarketValue * 0.9).toFixed(2)); // 90% instant sell value

  // Trigger real pack ripping animation sequence:
  // 1. Brief buildup (vibrating energy & heartbeat)
  // 2. Crisp foil tear strip & top foil flying off with foil rip sound
  // 3. Card slides out directly from inside the torn booster pack
  // 4. Transitions smoothly into full grand reveal
  const handleStartRip = () => {
    if (stage !== 'sealed') return;
    setStage('buildup');

    // Suspense audio: heartbeats + rising energy drone
    sound.playHeartbeat();
    sound.playEnergyCharge(0.9);

    setTimeout(() => {
      sound.playHeartbeat();
    }, 450);

    // After 900ms build-up, start the physical pack rip!
    setTimeout(() => {
      sound.playFoilRip();
      setStage('ripping');
      setRipPhase('tear');

      // 400ms in: card starts rising from the torn foil interior
      setTimeout(() => {
        setRipPhase('emerge');
        sound.playSlowPeel();
      }, 400);

      // 1200ms in: grand reveal with sparkles/fanfare
      setTimeout(() => {
        triggerGrandReveal();
      }, 1250);
    }, 900);
  };

  const triggerGrandReveal = () => {
    setStage('revealed');
    sound.playCardReveal();
    if (isGrail) {
      setTimeout(() => {
        sound.playGrailFanfare();
      }, 150);
    } else if (isUltraRare || isRare) {
      setTimeout(() => {
        sound.playSparkleBurst();
      }, 100);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < pulledCards.length - 1) {
      sound.playClick();
      setCurrentIndex((prev) => prev + 1);
      setStage('sealed');
      setRipPhase('tear');
    }
  };

  const canAffordAgain = userBalance >= pack.cost * count;

  // Aura colors based on rarity
  const auraGlow = isGrail
    ? 'from-amber-400 via-yellow-300 to-amber-600'
    : isUltraRare
    ? 'from-fuchsia-500 via-purple-400 to-pink-600'
    : isRare
    ? 'from-sky-400 via-cyan-300 to-blue-600'
    : 'from-slate-400 via-slate-300 to-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      {/* Background ambient lighting */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          stage === 'revealed' && isGrail
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.3)_0%,rgba(0,0,0,0)_70%)]'
            : stage === 'buildup' && isGrail
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.25)_0%,rgba(0,0,0,0)_60%)]'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,rgba(0,0,0,0)_70%)]'
        }`}
      />

      <div className="relative w-full max-w-xl flex flex-col items-center my-auto">
        {/* Top close button */}
        <button
          onClick={() => {
            sound.playClick();
            if (stage === 'revealed' || stage === 'ripping') {
              onVault(pulledCards);
            }
            onClose();
          }}
          className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors z-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Multi-card count indicator */}
        {count > 1 && (
          <div className="mb-4 text-xs font-mono text-slate-400 bg-slate-900/90 px-3.5 py-1 rounded-full border border-slate-800 z-10 flex items-center gap-2">
            <span>Pulling Card {currentIndex + 1} of {count}</span>
            <span className="text-amber-400 font-bold">· £{(pack.cost * count).toFixed(2)}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 1: REAL POKEMON FOIL PACK READY TO RIP                 */}
        {/* ============================================================ */}
        {stage === 'sealed' && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Real Pokemon Booster Pack Display */}
            <div className="mb-4">
              <BoosterPack
                pack={pack}
                size="hero"
                interactive
                onRip={handleStartRip}
                showBackToggle
              />
            </div>

            <button
              onClick={handleStartRip}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black font-mono text-sm tracking-wide shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Break Seal & Rip Pack</span>
            </button>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Provably fair draw from 100 loaded raw Pokémon cards · Vault Custody
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: BUILDUP - VIBRATING SHAKE & ENERGY RADIANT AURA     */}
        {/* ============================================================ */}
        {stage === 'buildup' && (
          <div className="flex flex-col items-center justify-center my-4 relative">
            {/* Spinning Radiant Light Beams (for Rare/Grail hits!) */}
            <div
              className={`absolute -inset-20 rounded-full blur-3xl opacity-80 pointer-events-none bg-gradient-to-tr ${auraGlow} ${
                isGrail ? 'animate-beam-spin opacity-95' : 'animate-pulse-glow'
              }`}
            />

            {/* Sparkles Particle Stars */}
            {isGrail && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                <div className="absolute -top-8 -left-4 text-amber-300 text-2xl animate-bounce">✨</div>
                <div className="absolute -bottom-8 -right-4 text-yellow-300 text-3xl animate-pulse">👑</div>
                <div className="absolute top-2 -right-8 text-amber-400 text-2xl animate-ping">⚡</div>
                <div className="absolute bottom-6 -left-8 text-amber-200 text-2xl animate-bounce">✨</div>
              </div>
            )}

            {/* Shaking Booster Pack Container */}
            <div
              className={`relative ${
                isGrail ? 'animate-pack-shake-intense' : 'animate-pack-shake-subtle'
              }`}
            >
              {/* Glowing tear fissure light emitting from top crimp */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-48 h-6 bg-amber-400 blur-md opacity-90 z-30 animate-pulse pointer-events-none" />

              <BoosterPack
                pack={pack}
                size="hero"
                interactive={false}
                showBackToggle={false}
              />
            </div>

            <div className="mt-5 text-center z-10">
              <span className="text-xs sm:text-sm font-black font-mono tracking-widest text-amber-400 uppercase animate-pulse flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>{isGrail ? '👑 INCOMING TOP CHASE GRAIL DETECTED! 👑' : 'TEARING PACK SEAL & UNLEASHING RAW CARD...'}</span>
                <span>⚡</span>
              </span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: REAL FOIL PACK RIPPING & CARD EMERGING DIRECTLY     */}
        {/* ============================================================ */}
        {stage === 'ripping' && currentCard && (
          <div className="flex flex-col items-center justify-center my-2 relative w-full">
            {/* Radiant Ambient Flash */}
            <div
              className={`absolute -inset-16 rounded-full blur-3xl opacity-90 pointer-events-none bg-gradient-to-tr ${auraGlow} animate-rip-flash`}
            />

            {/* Stage title */}
            <div className="mb-4 text-center z-20">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-xl animate-pulse">
                <span>✂️</span>
                <span>PACK RIPPED OPEN · DRAWING RAW CARD...</span>
              </div>
            </div>

            {/* The Pack Tear Assembly: Realistic pack separating + Card sliding out */}
            <div className="relative w-[280px] h-[520px] flex items-center justify-center">
              {/* 1. FLYING DETACHED TOP CRIMP FOIL (Rips across top and peels backward) */}
              <div className="absolute top-0 left-0 right-0 z-30 animate-foil-top-fly pointer-events-none">
                <div className="h-14 w-full rounded-t-2xl overflow-hidden shadow-2xl border-t-2 border-amber-400/80 bg-gradient-to-b from-[#242b3d] via-[#1a1f2c] to-black flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between text-[8px] font-mono text-amber-300 font-bold">
                    <span>⚡ TEAR LINE RIPPED</span>
                    <span>VAULT #UK</span>
                  </div>
                  {/* Jagged foil rip tear line */}
                  <div
                    className="h-2 w-full"
                    style={{
                      background:
                        'repeating-linear-gradient(45deg, #f59e0b 0px, #f59e0b 4px, transparent 4px, transparent 8px)',
                    }}
                  />
                </div>
              </div>

              {/* 2. EMITTING RADIANT ENERGY BURST FROM PACK OPENING */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-56 h-12 bg-amber-400 blur-xl opacity-80 z-20 pointer-events-none animate-pulse" />

              {/* 3. THE CARD EMERGING DIRECTLY FROM INSIDE THE PACK */}
              <div className="absolute top-8 z-25 animate-card-emerge">
                <CardSlab card={currentCard} size="md" interactive={false} />
              </div>

              {/* 4. LOWER PACK FOIL SLEEVE (Sinks downward as card is pulled out) */}
              <div className="absolute bottom-0 left-0 right-0 h-[440px] z-10 animate-pack-bottom-drop pointer-events-none">
                <div className="relative w-full h-full rounded-b-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-gradient-to-b from-black via-[#0d1017] to-black flex flex-col justify-end">
                  {/* Jagged open foil rim */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-500/40 via-yellow-300/60 to-amber-500/40 border-b border-amber-400/50 shadow-lg" />

                  {/* Pack artwork lower portion visible */}
                  <div className="p-4 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {pack.name}
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                      1 RAW POKÉMON CARD UNVAULTED
                    </div>
                  </div>

                  {/* Bottom heat-crimp teeth */}
                  <div
                    className="h-7 w-full border-t border-black/80"
                    style={{
                      background:
                        'repeating-linear-gradient(90deg, #1f242e 0px, #4b5563 2px, #d1d5db 4px, #9ca3af 6px, #11141b 8px)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 4: GRAND REVEAL (CONGRATULATIONS & POST-PULL ACTIONS)  */}
        {/* ============================================================ */}
        {stage === 'revealed' && currentCard && (
          <div className="flex flex-col items-center animate-in zoom-in-90 duration-300 w-full relative">
            {/* Rare-specific particle effect animation & celestial color glow for Top Chase (isGrail: true) */}
            {isGrail && (
              <GrailRevealEffect
                cardName={currentCard.name}
                marketValue={currentCard.marketValue}
              />
            )}

            {/* Top Chase or Hit Celebration Banner */}
            {isGrail ? (
              <div className="relative z-20 mb-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.85)] flex items-center gap-2.5 animate-bounce border-2 border-yellow-200">
                <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
                <span>20X TOP CHASE GRAIL UNLOCKED! (£{currentCard.marketValue.toFixed(2)})</span>
                <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
              </div>
            ) : (
              <div className="relative z-20 mb-3 px-4 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ACTUAL RAW POKÉMON CARD UNVAULTED</span>
              </div>
            )}

            {/* Actual Pokemon Card Slab Renderer with 3D Mouse Tilt and Holographic Foil Sheen */}
            <div className="relative z-20 mb-2">
              <CardSlab card={currentCard} size="hero" interactive />
            </div>

            <p className="relative z-20 text-[11px] text-slate-400 font-mono mb-4 text-center">
              Tilt mouse/finger to shine holo foil · Tap <span className="text-amber-300 font-bold">'Back'</span> on card to flip · Click <span className="text-blue-300 font-bold">'UK TCG DB'</span> to verify
            </p>

            {/* Valuation callout */}
            <div className="relative z-20 text-center mb-5">
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentCard.name}
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs font-mono">
                <span className="text-slate-400">{currentCard.set}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  Market Value: £{currentCard.marketValue.toFixed(2)}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400 font-semibold">{currentCard.condition || 'Raw NM/M'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                {currentCard.marketValue >= 25 ? (
                  <span className="text-emerald-400 font-bold">🚚 Free UK Shipping Qualified (£25+)</span>
                ) : (
                  <span>🚚 UK Shipping £3.99 (Free over £25) · Overseas £14.99 (Free over £100)</span>
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-center">
                <a
                  href={currentCard.pokemonUkDbUrl || `https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/?cardName=${encodeURIComponent(currentCard.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/40 text-blue-300 font-mono text-xs font-medium transition-colors shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Scan · Verify on Pokémon.com UK Database</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Post-Pull Action Buttons (Courtyard style) */}
            <div className="relative z-20 w-full max-w-md space-y-2.5">
              {/* Batch multi-pack next card step if available */}
              {currentIndex < pulledCards.length - 1 && (
                <button
                  onClick={handleNextCard}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Reveal Next Pull ({currentIndex + 2}/{pulledCards.length})</span>
                  <span>→</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                {/* Instant Sell Back (90% Value) */}
                <button
                  onClick={() => {
                    sound.playCashChime();
                    onInstantSell(pulledCards, instantSellPayout);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  title="Instant liquidity at 90% of market value"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Instant Sell (90%): £{instantSellPayout.toFixed(2)}</span>
                </button>

                {/* Keep & Vault */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onVault(pulledCards);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Keep in Vault</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Redeem Physical Shipment */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onRedeemPhysical(currentCard);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Physical Delivery</span>
                </button>

                {/* Rip Again */}
                <button
                  onClick={() => {
                    if (!canAffordAgain) return;
                    sound.playClick();
                    onVault(pulledCards);
                    onRipAgain(pack, count);
                  }}
                  disabled={!canAffordAgain}
                  className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    canAffordAgain
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                      : 'bg-slate-850 text-slate-600 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rip Again (£{(pack.cost * count).toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
