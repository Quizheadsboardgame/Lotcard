import React, { useState, useMemo } from 'react';
import { VaultedItem, PokemonCard } from '../types';
import { CardSlab } from './CardSlab';
import { sound } from '../utils/audio';
import { ShieldCheck, Package, DollarSign, Search, Sparkles, X, ArrowUpRight } from 'lucide-react';

interface VaultViewProps {
  vaultItems: VaultedItem[];
  onSellItem: (itemId: string, value: number) => void;
  onSellAll: () => void;
  onRedeemItem: (card: PokemonCard) => void;
  onBackToPacks: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  vaultItems,
  onSellItem,
  onSellAll,
  onRedeemItem,
  onBackToPacks,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrader, setSelectedGrader] = useState<string>('all');
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<PokemonCard | null>(null);

  // Active vaulted items (excluding already sold items)
  const activeItems = useMemo(() => {
    return vaultItems.filter((item) => item.status === 'vaulted');
  }, [vaultItems]);

  const filteredItems = useMemo(() => {
    return activeItems.filter((item) => {
      const matchesSearch =
        item.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.card.certNumber ? item.card.certNumber.includes(searchTerm) : false) ||
        (item.card.serialCode ? item.card.serialCode.includes(searchTerm) : false);
      const matchesGrader =
        selectedGrader === 'all' || item.card.grader === selectedGrader;
      return matchesSearch && matchesGrader;
    });
  }, [activeItems, searchTerm, selectedGrader]);

  const totalVaultValue = activeItems.reduce((acc, item) => acc + item.card.marketValue, 0);
  const highestValueCard = activeItems.reduce(
    (max, item) => (item.card.marketValue > max ? item.card.marketValue : max),
    0
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Digital Vault
            </h1>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              1:1 Physically Backed
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Certified graded slabs held in high-security temperature-controlled vaults. Trade digitally or request insured courier delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeItems.length > 0 && (
            <button
              onClick={() => {
                sound.playCashChime();
                onSellAll();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold font-mono text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Instant Sell All (£{totalVaultValue.toFixed(2)})</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onBackToPacks();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-mono transition-colors"
          >
            Rip More Packs
          </button>
        </div>
      </div>

      {/* Vault Statistics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Portfolio Valuation</div>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
            £{totalVaultValue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Instant liquidity value</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Total Vaulted Slabs</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {activeItems.length} Slabs
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Stored in Brink's vault</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Highest Value Pull</div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-1">
            £{highestValueCard.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Single top asset</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono">Redemption Status</div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            Instant
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Physical shipping ready</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#11131C] border border-slate-800 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search your collection by card name, set, cert..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg text-xs font-mono">
          {['all', 'PSA', 'BGS', 'CGC'].map((gr) => (
            <button
              key={gr}
              onClick={() => {
                sound.playClick();
                setSelectedGrader(gr);
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedGrader === gr
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {gr === 'all' ? 'All Graders' : gr}
            </button>
          ))}
        </div>
      </div>

      {/* Items Collection Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-[#11131C]/60 border border-slate-800/80">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Your Vault is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Open £5, £10, £25, or £50 mystery packs to pull certified graded Pokémon cards into your physical vault.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onBackToPacks();
            }}
            className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-all shadow-md"
          >
            Explore Mystery Packs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-[280px] p-3 rounded-2xl bg-[#10121A] border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col justify-between"
            >
              <div
                className="cursor-pointer mx-auto mb-3"
                onClick={() => {
                  sound.playClick();
                  setSelectedCardForPreview(item.card);
                }}
              >
                <CardSlab card={item.card} size="sm" interactive />
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                    {item.card.name}
                  </span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    £{item.card.marketValue.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-3">
                  Vaulted: {new Date(item.pulledAt).toLocaleDateString()}
                </div>

                {/* Card Item Action Controls */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      sound.playCashChime();
                      onSellItem(item.id, item.card.marketValue);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    title="Sell back instantly"
                  >
                    <DollarSign className="w-3 h-3" />
                    <span>Sell</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRedeemItem(item.card);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                    title="Request physical shipping delivery"
                  >
                    <Package className="w-3 h-3" />
                    <span>Redeem</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Preview Modal */}
      {selectedCardForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="relative flex flex-col items-center">
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
            <div className="mt-4 text-center max-w-sm">
              <h4 className="text-base font-bold text-white">{selectedCardForPreview.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedCardForPreview.description}</p>
              <div className="mt-2 text-sm font-mono font-bold text-amber-400">
                Market Value: £{selectedCardForPreview.marketValue.toFixed(2)} · {selectedCardForPreview.grade}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
