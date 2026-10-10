import React, { useState, useMemo } from 'react';
import { PackTier, CardRarity, PokemonCard } from '../types';
import { X, Search, ArrowUpDown, LayoutGrid, List, Sparkles, ExternalLink, Globe, Package } from 'lucide-react';
import { CardSlab } from './CardSlab';
import { BoosterPack } from './BoosterPack';
import { sound } from '../utils/audio';

interface PackInspectionModalProps {
  pack: PackTier;
  onClose: () => void;
  onRip: (pack: PackTier, count: number) => void;
  userBalance: number;
}

export const PackInspectionModal: React.FC<PackInspectionModalProps> = ({
  pack,
  onClose,
  onRip,
  userBalance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'number' | 'grade'>('value-desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<PokemonCard | null>(null);
  const [showPackWrapperPreview, setShowPackWrapperPreview] = useState(false);

  // Filter & sort the 100 cards
  const filteredCards = useMemo(() => {
    return pack.cards
      .filter((card) => {
        const matchesSearch =
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.certNumber ? card.certNumber.includes(searchTerm) : false) ||
          (card.serialCode ? card.serialCode.includes(searchTerm) : false);
        const matchesRarity =
          selectedRarity === 'all' || card.rarity === selectedRarity;
        return matchesSearch && matchesRarity;
      })
      .sort((a, b) => {
        if (sortBy === 'value-desc') return b.marketValue - a.marketValue;
        if (sortBy === 'value-asc') return a.marketValue - b.marketValue;
        if (sortBy === 'number') return a.cardNumber - b.cardNumber;
        if (sortBy === 'grade') return (b.gradeNumber || 10) - (a.gradeNumber || 10);
        return 0;
      });
  }, [pack.cards, searchTerm, selectedRarity, sortBy]);

  // Breakdown statistics
  const rarityCounts = useMemo(() => {
    const counts = { grail: 0, ultra_rare: 0, rare: 0, mid: 0, standard: 0 };
    pack.cards.forEach((c) => {
      counts[c.rarity] = (counts[c.rarity] || 0) + 1;
    });
    return counts;
  }, [pack.cards]);

  const canAfford = userBalance >= pack.cost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0E1017] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
              £{pack.cost}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">{pack.name} · Actual Cards Audit</h2>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  100% Transparent Odds
                </span>
                <a
                  href="https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  <span>Pokémon.com UK Database</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All 100 actual raw Pokémon cards loaded in this pack with official card artwork and certified valuations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowPackWrapperPreview(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Inspect 3D physical booster pack wrapper"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Inspect</span>
              <span>Foil Pack</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Banners */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-900/30 border-b border-slate-800 text-xs font-mono shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <div className="text-[10px] text-slate-400">Total Cards Loaded</div>
            <div className="text-base font-bold text-white mt-0.5">100 / 100 Raw Cards</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>20x Top Chase</span>
            </div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              £{pack.topChaseValue.toFixed(2)} (1% Odds)
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <div className="text-[10px] text-slate-400">Guaranteed Floor</div>
            <div className="text-base font-bold text-slate-200 mt-0.5">£{pack.floorValue.toFixed(2)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <div className="text-[10px] text-slate-400">Pool Expected Value</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">£{pack.averageValue.toFixed(2)}</div>
          </div>
        </div>

        {/* Filter, Search & View Controls */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-950/20">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 100 cards by name, set, or cert..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Rarity filter segmented tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px] overflow-x-auto max-w-full">
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('all'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (100)
            </button>
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('grail'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'grail'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-amber-400 hover:text-white'
              }`}
            >
              👑 20x Chase ({rarityCounts.grail})
            </button>
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('ultra_rare'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'ultra_rare'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-purple-400 hover:text-white'
              }`}
            >
              Ultra Rare ({rarityCounts.ultra_rare})
            </button>
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('rare'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'rare'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-sky-400 hover:text-white'
              }`}
            >
              Rare Hits ({rarityCounts.rare})
            </button>
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('mid'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'mid'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mid Hits ({rarityCounts.mid})
            </button>
            <button
              onClick={() => { sound.playClick(); setSelectedRarity('standard'); }}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedRarity === 'standard'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Floor ({rarityCounts.standard})
            </button>
          </div>

          {/* Sort dropdown and View switch */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="value-desc" className="bg-slate-900">Highest Value (£)</option>
                <option value="value-asc" className="bg-slate-900">Lowest Value (£)</option>
                <option value="number" className="bg-slate-900">Card # (1-100)</option>
                <option value="grade" className="bg-slate-900">Raw Condition</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid slab view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Table or Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0 backdrop-blur z-10">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Card Name</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Set & Year</th>
                    <th className="py-2.5 px-3">Condition</th>
                    <th className="py-2.5 px-3 text-right">Odds</th>
                    <th className="py-2.5 px-3 text-right">Market Val</th>
                    <th className="py-2.5 px-3 text-right text-emerald-400">Sell (90%)</th>
                    <th className="py-2.5 px-3 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        card.isTopChase ? 'bg-amber-500/10 font-bold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        #{card.cardNumber}
                      </td>
                      <td className="py-2.5 px-3 text-white font-sans font-medium">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={card.imageUrl || card.artworkUrl}
                            alt={card.name}
                            className="w-7 h-10 object-contain rounded bg-black/40 border border-slate-700/60 shrink-0 shadow-sm transition-transform hover:scale-125"
                            loading="lazy"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {card.isTopChase && (
                                <span className="text-[10px] bg-amber-500 text-stone-950 px-1 rounded font-bold">
                                  20x CHASE
                                </span>
                              )}
                              <span className="truncate max-w-[200px] sm:max-w-xs">{card.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono sm:hidden">{card.set}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 hidden sm:table-cell text-[11px]">
                        {card.set} ({card.year})
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {card.condition}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {card.dropRatePercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-400 tabular-nums">
                        £{card.marketValue.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums">
                        £{(card.marketValue * 0.9).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSelectedCardForPreview(card);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px]"
                        >
                          View Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCardForPreview(card);
                  }}
                  className="cursor-pointer"
                >
                  <CardSlab card={card} size="sm" showDetails />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with quick Rip action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="text-white font-semibold">{filteredCards.length}</span> of 100 cards
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              Balance: <span className="font-bold text-emerald-400">£{userBalance.toFixed(2)}</span>
            </span>
            <button
              onClick={() => {
                if (!canAfford) return;
                sound.playClick();
                onClose();
                onRip(pack, 1);
              }}
              disabled={!canAfford}
              className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                canAfford
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Rip This Pack · £{pack.cost.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Single Card Slab Zoom Preview Modal */}
      {selectedCardForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="relative flex flex-col items-center max-w-md w-full">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedCardForPreview(null);
              }}
              className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <CardSlab card={selectedCardForPreview} size="hero" interactive />
            <div className="mt-4 text-center max-w-sm w-full">
              <h4 className="text-base font-bold text-white">{selectedCardForPreview.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedCardForPreview.description}</p>
              
              <div className="mt-2 text-sm font-mono font-bold text-amber-400">
                Market Value: £{selectedCardForPreview.marketValue.toFixed(2)} · {selectedCardForPreview.dropRatePercent}% Odds
              </div>

              {/* Instant Sell (90%) Callout */}
              <div className="mt-1 text-xs font-mono text-emerald-400 font-semibold">
                Instant Sell (90% Value): £{(selectedCardForPreview.marketValue * 0.9).toFixed(2)}
              </div>

              {/* Shipping Rules */}
              <div className="mt-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {selectedCardForPreview.marketValue >= 100 ? (
                  <span className="text-emerald-400 font-bold">✈️ Free UK & Overseas Shipping Qualified (£100+)</span>
                ) : selectedCardForPreview.marketValue >= 25 ? (
                  <span className="text-emerald-400 font-bold">🚚 Free UK Tracked Shipping Qualified (£25+) · Overseas £14.99</span>
                ) : (
                  <span>🚚 UK Tracked: £3.99 (Free over £25) · Overseas: £14.99 (Free over £100)</span>
                )}
              </div>

              {/* Direct Pokemon.com UK Database Button */}
              <a
                href={selectedCardForPreview.pokemonUkDbUrl || `https://www.pokemon.com/uk/pokemon-tcg/pokemon-cards/?cardName=${encodeURIComponent(selectedCardForPreview.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-mono font-bold shadow-lg transition-all border border-blue-400/30"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Verify on Pokémon.com UK Card Database</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Real Pokemon Booster Foil Pack Wrapper 3D Preview Modal */}
      {showPackWrapperPreview && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                sound.playClick();
                setShowPackWrapperPreview(false);
              }}
              className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <BoosterPack
              pack={pack}
              size="hero"
              interactive
              showBackToggle
            />

            <div className="mt-4 text-center max-w-xs text-xs font-mono text-slate-400">
              <span className="text-white font-bold">{pack.name}</span> · Real Booster Foil Wrapper
              <p className="text-[11px] text-slate-500 mt-0.5">
                Move mouse or finger to tilt and catch holographic shimmer · Tap 'Inspect Back' to check sealed seam & certified odds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
