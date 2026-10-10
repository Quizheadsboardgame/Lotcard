import React, { useState, useMemo } from 'react';
import { VaultedItem, PokemonCard, PackTier } from '../types';
import { PACK_TIERS } from '../data/packData';
import { CardSlab } from './CardSlab';
import { sound } from '../utils/audio';
import { 
  ShieldCheck, Package, DollarSign, Search, Sparkles, X, 
  Layers, CheckCircle2, Lock, Unlock, ArrowUpDown, Filter,
  TrendingUp, Award, Flame, Globe, ExternalLink
} from 'lucide-react';

interface InventoryViewProps {
  vaultItems: VaultedItem[];
  onSellItem: (itemId: string, value: number) => void;
  onSellAll: () => void;
  onSellDuplicates: (duplicateItemIds: { id: string; value: number }[]) => void;
  onRedeemItem: (card: PokemonCard) => void;
  onToggleLockItem: (itemId: string) => void;
  onBackToPacks: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  vaultItems,
  onSellItem,
  onSellAll,
  onSellDuplicates,
  onRedeemItem,
  onToggleLockItem,
  onBackToPacks,
}) => {
  // View mode: 'inventory' (only owned cards) or 'master-set' (all 400 cards tracker)
  const [viewMode, setViewMode] = useState<'inventory' | 'master-set'>('inventory');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'missing' | 'duplicates'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'quantity-desc' | 'name' | 'number'>('value-desc');
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<PokemonCard | null>(null);

  // Active items currently stored in vault
  const activeVaultItems = useMemo(() => {
    return vaultItems.filter((item) => item.status === 'vaulted');
  }, [vaultItems]);

  // Aggregate owned cards by unique card ID to track count/quantities
  const ownedCardCounts = useMemo(() => {
    const map = new Map<string, { count: number; items: VaultedItem[]; card: PokemonCard }>();
    activeVaultItems.forEach((item) => {
      const existing = map.get(item.card.id);
      if (existing) {
        existing.count += 1;
        existing.items.push(item);
      } else {
        map.set(item.card.id, {
          count: 1,
          items: [item],
          card: item.card,
        });
      }
    });
    return map;
  }, [activeVaultItems]);

  // All 400 cards from all 4 packs combined for the Master Checklist tracker
  const all400Cards = useMemo(() => {
    return PACK_TIERS.flatMap((t) => t.cards);
  }, []);

  // Summary Metrics
  const totalVaultValue = activeVaultItems.reduce((acc, item) => acc + item.card.marketValue, 0);
  const totalInstantSellVaultValue = Number((totalVaultValue * 0.9).toFixed(2));
  const totalUniqueOwned = ownedCardCounts.size;
  const totalSlabsOwned = activeVaultItems.length;
  const duplicateItems = useMemo(() => {
    const dups: { id: string; value: number }[] = [];
    ownedCardCounts.forEach((group) => {
      if (group.count > 1) {
        // keep the first item, mark subsequent as duplicates eligible for sale at 90% value
        group.items.slice(1).forEach((item) => {
          if (!item.isLocked) {
            dups.push({ id: item.id, value: Number((item.card.marketValue * 0.9).toFixed(2)) });
          }
        });
      }
    });
    return dups;
  }, [ownedCardCounts]);

  const duplicatesValue = duplicateItems.reduce((acc, d) => acc + d.value, 0);

  // Filtered Cards for Inventory Mode
  const inventoryGroups = useMemo(() => {
    const list = Array.from(ownedCardCounts.values());
    return list
      .filter((group) => {
        const matchesSearch =
          group.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.card.certNumber ? group.card.certNumber.includes(searchTerm) : false) ||
          (group.card.serialCode ? group.card.serialCode.includes(searchTerm) : false);
        const matchesTier =
          selectedTierFilter === 'all' || group.card.packTierId === selectedTierFilter;
        const matchesRarity =
          selectedRarityFilter === 'all' || group.card.rarity === selectedRarityFilter;
        const matchesOwnership =
          ownershipFilter === 'all' ||
          (ownershipFilter === 'duplicates' && group.count > 1);

        return matchesSearch && matchesTier && matchesRarity && matchesOwnership;
      })
      .sort((a, b) => {
        if (sortBy === 'value-desc') return b.card.marketValue - a.card.marketValue;
        if (sortBy === 'value-asc') return a.card.marketValue - b.card.marketValue;
        if (sortBy === 'quantity-desc') return b.count - a.count;
        if (sortBy === 'name') return a.card.name.localeCompare(b.card.name);
        if (sortBy === 'number') return a.card.cardNumber - b.card.cardNumber;
        return 0;
      });
  }, [ownedCardCounts, searchTerm, selectedTierFilter, selectedRarityFilter, ownershipFilter, sortBy]);

  // Filtered Cards for Master Set Tracker Mode
  const masterSetList = useMemo(() => {
    return all400Cards
      .filter((card) => {
        const isOwned = ownedCardCounts.has(card.id);
        const group = ownedCardCounts.get(card.id);
        const count = group ? group.count : 0;

        const matchesSearch =
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.set.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier =
          selectedTierFilter === 'all' || card.packTierId === selectedTierFilter;
        const matchesRarity =
          selectedRarityFilter === 'all' || card.rarity === selectedRarityFilter;

        let matchesOwnership = true;
        if (ownershipFilter === 'owned') matchesOwnership = isOwned;
        if (ownershipFilter === 'missing') matchesOwnership = !isOwned;
        if (ownershipFilter === 'duplicates') matchesOwnership = count > 1;

        return matchesSearch && matchesTier && matchesRarity && matchesOwnership;
      })
      .sort((a, b) => {
        const countA = ownedCardCounts.get(a.id)?.count || 0;
        const countB = ownedCardCounts.get(b.id)?.count || 0;
        if (sortBy === 'value-desc') return b.marketValue - a.marketValue;
        if (sortBy === 'value-asc') return a.marketValue - b.marketValue;
        if (sortBy === 'quantity-desc') return countB - countA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'number') return a.cardNumber - b.cardNumber;
        return 0;
      });
  }, [all400Cards, ownedCardCounts, searchTerm, selectedTierFilter, selectedRarityFilter, ownershipFilter, sortBy]);

  // Completion stats by pack tier
  const tierProgress = useMemo(() => {
    const stats: Record<string, { owned: number; total: number }> = {};
    PACK_TIERS.forEach((t) => {
      let owned = 0;
      t.cards.forEach((c) => {
        if (ownedCardCounts.has(c.id)) owned += 1;
      });
      stats[t.id] = { owned, total: t.cards.length };
    });
    return stats;
  }, [ownedCardCounts]);

  // Clean rarity badge helper
  const renderRarityLabel = (rarity: string, isTopChase?: boolean) => {
    if (isTopChase || rarity === 'grail') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
          <span>👑</span> 20x Chase
        </span>
      );
    }
    if (rarity === 'ultra_rare') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-semibold border border-fuchsia-500/30">
          Ultra Rare
        </span>
      );
    }
    if (rarity === 'rare') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
          Rare Hit
        </span>
      );
    }
    if (rarity === 'mid') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 font-medium">
          Mid Hit
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
        Floor
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Collection & Inventory Tracker
            </h1>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              1:1 Vaulted Raw Cards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track all raw Pokémon cards you own, monitor duplicate counts, cash out at 90% instant liquidity, and redeem physical delivery.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {duplicateItems.length > 0 && (
            <button
              onClick={() => {
                sound.playCashChime();
                onSellDuplicates(duplicateItems);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold font-mono text-emerald-400 transition-colors flex items-center gap-1.5"
              title="Sell all duplicate copies at 90% value while keeping 1 of each card in your vault"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Sell Duplicates @ 90% (+£{duplicatesValue.toFixed(2)})</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onBackToPacks();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-mono transition-colors shadow-md"
          >
            Rip More Packs
          </button>
        </div>
      </div>

      {/* Free Shipping Policy Callout Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/30 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <span className="text-slate-200">
            <strong>Physical Delivery Rules:</strong> Free shipping if over <strong>£25</strong> value (UK only) and over <strong>£100</strong> (Overseas).
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-amber-400">
          <span>UK &gt; £25: Free</span>
          <span>·</span>
          <span>Overseas &gt; £100: Free</span>
          <span>·</span>
          <span className="text-emerald-400">Instant Sell: 90% Value</span>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>Portfolio Valuation</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
            £{totalVaultValue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Instant sell-back liquidity</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>Unique Cards Owned</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {totalUniqueOwned} <span className="text-slate-500 text-sm font-normal">/ 400</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {((totalUniqueOwned / 400) * 100).toFixed(1)}% Master Set completion
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>Total Vaulted Slabs</span>
            <Layers className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {totalSlabsOwned} Slabs
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Stored in Brink's vault</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131C] border border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
            <span>Duplicate Slabs</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {duplicateItems.length} Extra
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Value: £{duplicatesValue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Master Set Completion Progress Bar Across 4 Tiers */}
      <div className="p-4 rounded-2xl bg-[#10121A] border border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              Master Set Collection Progress (400 Loaded Slabs)
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {totalUniqueOwned} / 400 Collected ({((totalUniqueOwned / 400) * 100).toFixed(1)}%)
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-4">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, (totalUniqueOwned / 400) * 100)}%` }}
          />
        </div>

        {/* Tier-by-tier mini breakdown chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          {PACK_TIERS.map((tier) => {
            const stat = tierProgress[tier.id] || { owned: 0, total: 100 };
            const pct = Math.round((stat.owned / stat.total) * 100);
            return (
              <div
                key={tier.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedTierFilter(selectedTierFilter === tier.id ? 'all' : tier.id);
                }}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  selectedTierFilter === tier.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">{tier.name} (£{tier.cost})</span>
                  <span className="text-amber-400 font-bold">{stat.owned}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main View Mode Switcher & Filter Toolbar */}
      <div className="p-4 bg-[#11131C] border border-slate-800 rounded-2xl mb-6 space-y-3">
        {/* Row 1: Mode Switcher (Inventory Owned vs Master Checklist) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('inventory');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'inventory'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Vault Inventory ({totalUniqueOwned} unique, {totalSlabsOwned} total)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('master-set');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'master-set'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Set Checklist (All 400 Slabs)
            </button>
          </div>

          {/* Ownership Filter Segmented Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { sound.playClick(); setOwnershipFilter('all'); }}
              className={`px-2.5 py-1 rounded-lg ${ownershipFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => { sound.playClick(); setOwnershipFilter('owned'); }}
              className={`px-2.5 py-1 rounded-lg ${ownershipFilter === 'owned' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Owned Only
            </button>
            {viewMode === 'master-set' && (
              <button
                onClick={() => { sound.playClick(); setOwnershipFilter('missing'); }}
                className={`px-2.5 py-1 rounded-lg ${ownershipFilter === 'missing' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Missing Only
              </button>
            )}
            <button
              onClick={() => { sound.playClick(); setOwnershipFilter('duplicates'); }}
              className={`px-2.5 py-1 rounded-lg ${ownershipFilter === 'duplicates' ? 'bg-slate-800 text-purple-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Duplicates (≥2)
            </button>
          </div>
        </div>

        {/* Row 2: Search, Rarity, Pack Tier & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Pokémon name, set, cert..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Select */}
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Pack Tiers</option>
              <option value="pack-5">£5 Starter Vault</option>
              <option value="pack-10">£10 Elite Vault</option>
              <option value="pack-25">£25 Master Vault</option>
              <option value="pack-50">£50 Grail Vault</option>
            </select>

            {/* Rarity Select */}
            <select
              value={selectedRarityFilter}
              onChange={(e) => setSelectedRarityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Rarities</option>
              <option value="grail">👑 20x Chase Only</option>
              <option value="ultra_rare">Ultra Rare</option>
              <option value="rare">Rare Hits</option>
              <option value="mid">Mid Hits</option>
              <option value="standard">Floor Cards</option>
            </select>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="value-desc" className="bg-slate-900">Highest Value (£)</option>
                <option value="value-asc" className="bg-slate-900">Lowest Value (£)</option>
                <option value="quantity-desc" className="bg-slate-900">Quantity Owned</option>
                <option value="name" className="bg-slate-900">Name (A-Z)</option>
                <option value="number" className="bg-slate-900">Card # (1-100)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* VIEW MODE 1: USER VAULT INVENTORY (OWNED SLABS WITH QUANTITIES)   */}
      {/* ================================================================= */}
      {viewMode === 'inventory' && (
        <div>
          {inventoryGroups.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-2xl bg-[#11131C]/60 border border-slate-800">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Matching Cards in Inventory</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeVaultItems.length === 0
                  ? 'Open £5, £10, £25, or £50 mystery packs to start pulling graded Pokémon slabs into your vault.'
                  : 'No cards match your current search and filter criteria.'}
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToPacks();
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-all shadow-md"
              >
                Open Mystery Packs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {inventoryGroups.map((group) => {
                const isLocked = group.items.every((i) => i.isLocked);
                return (
                  <div
                    key={group.card.id}
                    className="w-full max-w-[280px] p-3.5 rounded-2xl bg-[#10121A] border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col justify-between relative group"
                  >
                    {/* Quantity Badge on Top Left */}
                    <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black font-mono text-[11px] shadow-md">
                        x{group.count} Owned
                      </span>
                    </div>

                    {/* Lock Status Button on Top Right */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onToggleLockItem(group.items[0].id);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg bg-black/60 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                      title={isLocked ? 'Locked (Protected from sale)' : 'Unlocked'}
                    >
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {/* Slab Visual */}
                    <div
                      className="cursor-pointer mx-auto my-2"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCardForPreview(group.card);
                      }}
                    >
                      <CardSlab card={group.card} size="sm" interactive />
                    </div>

                    {/* Card Information & Metadata */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-bold text-white truncate max-w-[150px]">
                          {group.card.name}
                        </div>
                        <div className="text-xs font-bold font-mono text-emerald-400 tabular-nums">
                          £{group.card.marketValue.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                        <span>{group.card.condition}</span>
                        {renderRarityLabel(group.card.rarity, group.card.isTopChase)}
                      </div>

                      {/* If multiple copies, show total value */}
                      {group.count > 1 && (
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex justify-between mb-2">
                          <span>Total ({group.count}x): £{(group.card.marketValue * group.count).toFixed(2)}</span>
                          <span className="font-bold text-emerald-400">
                            90%: £{(group.card.marketValue * group.count * 0.9).toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Action Controls */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            if (isLocked) return;
                            sound.playCashChime();
                            onSellItem(group.items[0].id, Number((group.card.marketValue * 0.9).toFixed(2)));
                          }}
                          disabled={isLocked}
                          className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 ${
                            isLocked
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300'
                          }`}
                          title={isLocked ? 'Card is locked' : 'Sell 1 copy at 90% market value'}
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Sell 90% (£{(group.card.marketValue * 0.9).toFixed(2)})</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playClick();
                            onRedeemItem(group.card);
                          }}
                          className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                          title="Redeem physical graded slab shipment"
                        >
                          <Package className="w-3 h-3" />
                          <span>Redeem</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW MODE 2: MASTER SET CHECKLIST (ALL 400 SLABS TRACKER)         */}
      {/* ================================================================= */}
      {viewMode === 'master-set' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Showing <strong className="text-white">{masterSetList.length}</strong> of 400 total cards in the Lotcards protocol.
            </span>
            <span className="text-emerald-400">
              Owned: {totalUniqueOwned} / 400
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {masterSetList.map((card) => {
              const isOwned = ownedCardCounts.has(card.id);
              const group = ownedCardCounts.get(card.id);
              const count = group ? group.count : 0;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCardForPreview(card);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isOwned
                      ? 'bg-[#10121A] border-amber-500/40 hover:border-amber-400 shadow-md'
                      : 'bg-[#0B0D13]/60 border-slate-850 hover:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Top status banner */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      #{card.cardNumber} · {card.packTierId === 'pack-5' ? '£5' : card.packTierId === 'pack-10' ? '£10' : card.packTierId === 'pack-25' ? '£25' : '£50'} Pack
                    </span>

                    {isOwned ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>x{count} Owned</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Missing
                      </span>
                    )}
                  </div>

                  {/* Card Main Info */}
                  <div className="my-1">
                    <div className="text-xs font-bold text-white truncate">
                      {card.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {card.set} ({card.year})
                    </div>
                  </div>

                  {/* Valuation and Rarity */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono mt-2">
                    <div>{renderRarityLabel(card.rarity, card.isTopChase)}</div>
                    <span className={`font-bold tabular-nums ${isOwned ? 'text-amber-400' : 'text-slate-400'}`}>
                      £{card.marketValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Card 3D Preview Zoom Modal */}
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
            <div className="mt-4 text-center max-w-sm w-full">
              <h4 className="text-base font-bold text-white">{selectedCardForPreview.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedCardForPreview.description}</p>
              <div className="mt-2 text-sm font-mono font-bold text-amber-400">
                Market Value: £{selectedCardForPreview.marketValue.toFixed(2)} · {selectedCardForPreview.condition || 'Raw NM/M'}
              </div>
              <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">
                Instant Sell (90%): £{(selectedCardForPreview.marketValue * 0.9).toFixed(2)}
              </div>

              {/* Shipping Qualification Info */}
              <div className="mt-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {selectedCardForPreview.marketValue >= 100 ? (
                  <span className="text-emerald-400 font-bold">✈️ Free UK & Worldwide Shipping Qualified (£100+)</span>
                ) : selectedCardForPreview.marketValue >= 25 ? (
                  <span className="text-emerald-400 font-bold">🚚 Free UK Tracked Shipping Qualified (£25+) · Overseas £14.99</span>
                ) : (
                  <span>🚚 UK Tracked: £3.99 (Free over £25) · Overseas: £14.99 (Free over £100)</span>
                )}
              </div>

              <div className="text-xs text-slate-500 font-mono mt-2">
                Serial #{selectedCardForPreview.serialCode || selectedCardForPreview.certNumber} · {ownedCardCounts.get(selectedCardForPreview.id)?.count || 0} Owned in Vault
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
    </div>
  );
};
