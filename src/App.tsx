import React, { useState } from 'react';
import { PACK_TIERS, INITIAL_DROPS } from './data/packData';
import { PackTier, PokemonCard, VaultedItem, DropEvent } from './types';
import { Navbar } from './components/Navbar';
import { LiveDropTicker } from './components/LiveDropTicker';
import { PackCard } from './components/PackCard';
import { PackInspectionModal } from './components/PackInspectionModal';
import { UnboxModal } from './components/UnboxModal';
import { InventoryView } from './components/InventoryView';
import { PhysicalRedeemModal } from './components/PhysicalRedeemModal';
import { WalletModal } from './components/WalletModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ProvablyFairView } from './components/ProvablyFairView';
import { CardSlab } from './components/CardSlab';
import { sound } from './utils/audio';
import { ShieldCheck, Sparkles, Database, ArrowRight, Eye, Check } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'packs' | 'vault' | 'odds' | 'how-it-works'>('packs');

  // User state
  const [userBalance, setUserBalance] = useState<number>(150.0); // £150 starting demo balance
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [totalWon, setTotalWon] = useState<number>(0);
  const [packsOpened, setPacksOpened] = useState<number>(3);
  const [vaultItems, setVaultItems] = useState<VaultedItem[]>(() => {
    // Pre-populate with starter cards including duplicate for instant inventory tracking demonstration
    const p5_charizard = PACK_TIERS[0].cards[0]; // 20x chase (£100)
    const p5_pikachu = PACK_TIERS[0].cards[1];   // Pikachu VMAX Rainbow (£65)
    const p10_rayquaza = PACK_TIERS[1].cards[0]; // 20x chase (£200)
    return [
      {
        id: 'vault-init-1',
        card: p5_charizard,
        pulledAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'vaulted',
        isLocked: true,
      },
      {
        id: 'vault-init-2',
        card: p5_pikachu,
        pulledAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'vaulted',
      },
      {
        id: 'vault-init-3',
        card: p5_pikachu, // duplicate copy! shows x2 Owned
        pulledAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'vaulted',
      },
      {
        id: 'vault-init-4',
        card: p10_rayquaza,
        pulledAt: new Date(Date.now() - 900000).toISOString(),
        status: 'vaulted',
      },
    ];
  });
  const [liveDrops, setLiveDrops] = useState<DropEvent[]>(INITIAL_DROPS);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [inspectingPack, setInspectingPack] = useState<PackTier | null>(null);
  const [unboxingConfig, setUnboxingConfig] = useState<{ pack: PackTier; count: number } | null>(null);
  const [redeemingCard, setRedeemingCard] = useState<PokemonCard | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Sound toggle
  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  // Start pack unboxing
  const handleStartRip = (pack: PackTier, count: number) => {
    const totalCost = pack.cost * count;
    if (userBalance < totalCost) {
      setIsWalletOpen(true);
      return;
    }

    // Deduct cost
    setUserBalance((prev) => prev - totalCost);
    setTotalSpent((prev) => prev + totalCost);
    setPacksOpened((prev) => prev + count);

    // Open modal
    setUnboxingConfig({ pack, count });
  };

  // Handle Vault post-pull
  const handleVaultCards = (cards: PokemonCard[]) => {
    const newItems: VaultedItem[] = cards.map((card) => ({
      id: `vault-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      card,
      pulledAt: new Date().toISOString(),
      status: 'vaulted',
    }));

    setVaultItems((prev) => [...newItems, ...prev]);

    // Add to live drops
    cards.forEach((card) => {
      setTotalWon((prev) => prev + card.marketValue);
      const newDrop: DropEvent = {
        id: `drop-${Date.now()}-${Math.random()}`,
        userName: 'You',
        packName: `${card.packTierId === 'pack-5' ? '£5' : card.packTierId === 'pack-10' ? '£10' : card.packTierId === 'pack-25' ? '£25' : '£50'} Mystery Pack`,
        packCost: card.packTierId === 'pack-5' ? 5 : card.packTierId === 'pack-10' ? 10 : card.packTierId === 'pack-25' ? 25 : 50,
        cardName: card.name,
        cardSet: card.set,
        cardGrade: card.grade || card.condition || 'Raw NM/M',
        marketValue: card.marketValue,
        instantSellValue: Number((card.marketValue * 0.9).toFixed(2)),
        isGrail: !!card.isTopChase,
        timeAgo: 'Just now',
      };
      setLiveDrops((prev) => [newDrop, ...prev.slice(0, 15)]);
    });
  };

  // Handle Instant Sell Back
  const handleInstantSell = (cards: PokemonCard[], totalValue: number) => {
    setUserBalance((prev) => prev + totalValue);
    setTotalWon((prev) => prev + totalValue);

    // Also record pull in drops feed
    cards.forEach((card) => {
      const newDrop: DropEvent = {
        id: `drop-${Date.now()}-${Math.random()}`,
        userName: 'You (Cashed Out 90%)',
        packName: `${card.packTierId === 'pack-5' ? '£5' : card.packTierId === 'pack-10' ? '£10' : card.packTierId === 'pack-25' ? '£25' : '£50'} Pack`,
        packCost: card.packTierId === 'pack-5' ? 5 : card.packTierId === 'pack-10' ? 10 : card.packTierId === 'pack-25' ? 25 : 50,
        cardName: card.name,
        cardSet: card.set,
        cardGrade: card.grade || card.condition || 'Raw NM/M',
        marketValue: card.marketValue,
        instantSellValue: Number((card.marketValue * 0.9).toFixed(2)),
        isGrail: !!card.isTopChase,
        timeAgo: 'Just now',
      };
      setLiveDrops((prev) => [newDrop, ...prev.slice(0, 15)]);
    });
  };

  // Sell individual item from Vault
  const handleSellVaultItem = (itemId: string, value: number) => {
    setUserBalance((prev) => prev + value);
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'sold', soldFor: value } : item
      )
    );
  };

  // Sell all items from Vault at 90% instant sell value
  const handleSellAllVault = () => {
    const active = vaultItems.filter((i) => i.status === 'vaulted');
    const totalInstantPayout = Number(
      (active.reduce((acc, i) => acc + (i.card.instantSellValue || i.card.marketValue * 0.9), 0)).toFixed(2)
    );
    setUserBalance((prev) => prev + totalInstantPayout);
    setVaultItems((prev) =>
      prev.map((item) =>
        item.status === 'vaulted'
          ? { ...item, status: 'sold', soldFor: item.card.instantSellValue || Number((item.card.marketValue * 0.9).toFixed(2)) }
          : item
      )
    );
  };

  // Sell duplicate copies only (keeping 1 copy of each card in master collection)
  const handleSellDuplicates = (duplicateItems: { id: string; value: number }[]) => {
    const totalCash = duplicateItems.reduce((acc, d) => acc + d.value, 0);
    const idSet = new Set(duplicateItems.map((d) => d.id));
    setUserBalance((prev) => prev + totalCash);
    setVaultItems((prev) =>
      prev.map((item) =>
        idSet.has(item.id)
          ? { ...item, status: 'sold', soldFor: item.card.marketValue }
          : item
      )
    );
  };

  // Toggle lock protection on a slab
  const handleToggleLockItem = (itemId: string) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isLocked: !item.isLocked } : item
      )
    );
  };

  // Confirm Physical Redemption
  const handleConfirmRedeem = (card: PokemonCard, address: string) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.card.id === card.id
          ? {
              ...item,
              status: 'redeemed_physical',
              shippingAddress: address,
              trackingNumber: `GB-BRINKS-${Math.floor(10000000 + Math.random() * 90000000)}`,
            }
          : item
      )
    );
  };

  // Add demo funds
  const handleAddFunds = (amount: number) => {
    setUserBalance((prev) => prev + amount);
  };

  // Reset session
  const handleResetBalance = () => {
    setUserBalance(150.0);
    setTotalSpent(0);
    setTotalWon(0);
    setPacksOpened(0);
    setVaultItems([]);
  };

  const activeVaultCount = vaultItems.filter((i) => i.status === 'vaulted').length;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'how-it-works') {
            setIsHowItWorksOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        userBalance={userBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
        vaultCount={activeVaultCount}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Live Drop Ticker */}
      <LiveDropTicker drops={liveDrops} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'packs' && (
          <div className="w-full">
            {/* Bold Hero Section */}
            <section className="relative px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16 max-w-7xl mx-auto overflow-hidden">
              {/* Vibrant ambient backdrops */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

              <div className="relative z-10 text-center max-w-4xl mx-auto">
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-200 mb-6 shadow-md backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-white">100% Authentic Raw Cards</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-400 font-bold">20x Top Chase Guaranteed</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-bold">90% Instant Sell-Back</span>
                </div>

                {/* Bold Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight text-balance leading-[1.08]">
                  Unbox Raw Pokémon Packs with{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                    20x Top Chases
                  </span>
                </h1>

                {/* Fresh Subhead */}
                <p className="mt-5 text-sm sm:text-base text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
                  Four curated mystery tiers with <strong className="text-white font-bold">100 real raw Pokémon cards</strong> loaded per pack, matched to official Pokémon UK card database scans. Instant buyback for <strong className="text-emerald-400 font-bold">90% cash value</strong>, or request insured vault delivery.
                </p>

                {/* 4 Crisp Feature Badges */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>100 Cards / Pack</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
                      Every pool is fully auditable with transparent odds.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>20x Top Chase</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
                      Iconic grails guaranteed at 20x pack entry (1 in 100).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>90% Instant Sell</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
                      Cash out any card in seconds with zero delay.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm shadow-md hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>Insured Vault</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
                      Physical tracked delivery across UK & Worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Mystery Pack Grid Section */}
            <section className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <span>Curated Pack Tiers</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Select Your Mystery Pack
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose from 4 tiers: £5, £10, £25, or £50. Real tactile foil ripping with 3D tilt.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsHowItWorksOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-amber-400 hover:text-white transition-all shadow-sm w-fit"
                >
                  <span>How packs work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PACK_TIERS.map((pack) => (
                  <PackCard
                    key={pack.id}
                    pack={pack}
                    onInspect={(p) => setInspectingPack(p)}
                    onRip={handleStartRip}
                    userBalance={userBalance}
                  />
                ))}
              </div>

              {/* Chase Highlights Showcase Section */}
              <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-[#0D0F19] border border-slate-800/90 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Featured 20x Top Chase Slabs
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Each tier features an iconic grail card valued at exactly 20x the pack price (1 in 100 odds).
                    </p>
                  </div>

                  <div className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
                    Inspected & vaulted under Brink's custody
                  </div>
                </div>

                {/* 4 Top Chases Displayed side by side */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center relative z-10">
                  {PACK_TIERS.map((tier) => {
                    const topChaseCard = tier.cards[0];
                    return (
                      <div
                        key={tier.id}
                        onClick={() => {
                          sound.playClick();
                          setInspectingPack(tier);
                        }}
                        className="cursor-pointer group flex flex-col items-center p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/60 transition-all duration-300 w-full"
                      >
                        <CardSlab card={topChaseCard} size="sm" interactive />
                        <div className="mt-3.5 text-center w-full">
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            {tier.cost === 5 ? '£5 Pack Chase (20x)' : tier.cost === 10 ? '£10 Pack Chase (20x)' : tier.cost === 25 ? '£25 Pack Chase (20x)' : '£50 Pack Chase (20x)'}
                          </span>
                          <div className="text-xs font-bold text-white truncate max-w-[180px] mt-2 group-hover:text-amber-300 transition-colors">
                            {topChaseCard.name}
                          </div>
                          <div className="text-xs font-black font-mono text-amber-400 mt-0.5">
                            £{tier.topChaseValue.toLocaleString()} · {topChaseCard.grade}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* User Inventory & Master Collection Tracker Tab */}
        {currentTab === 'vault' && (
          <InventoryView
            vaultItems={vaultItems}
            onSellItem={handleSellVaultItem}
            onSellAll={handleSellAllVault}
            onSellDuplicates={handleSellDuplicates}
            onRedeemItem={(card) => setRedeemingCard(card)}
            onToggleLockItem={handleToggleLockItem}
            onBackToPacks={() => setCurrentTab('packs')}
          />
        )}

        {/* Provably Fair Tab */}
        {currentTab === 'odds' && (
          <ProvablyFairView
            onInspectPack={(pack) => setInspectingPack(pack)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07080C] py-8 px-4 text-xs font-mono text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Lotcards</span>
            <span>·</span>
            <span>Courtyard-inspired Physical Asset Vaulting</span>
          </div>

          <div className="flex items-center gap-6">
            <span>PSA / BGS / CGC Verified</span>
            <span>·</span>
            <span>100 Cards Per Pack</span>
            <span>·</span>
            <span>20x Top Chase</span>
          </div>

          <div>
            © 2026 Lotcards Protocol. All rights reserved.
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Pack Inspection Modal (View 100 Cards loaded in pack) */}
      {inspectingPack && (
        <PackInspectionModal
          pack={inspectingPack}
          onClose={() => setInspectingPack(null)}
          onRip={(p, cnt) => {
            setInspectingPack(null);
            handleStartRip(p, cnt);
          }}
          userBalance={userBalance}
        />
      )}

      {/* Unbox Modal (Interactive 3D Foil Rip and Slab Reveal) */}
      {unboxingConfig && (
        <UnboxModal
          pack={unboxingConfig.pack}
          count={unboxingConfig.count}
          onClose={() => setUnboxingConfig(null)}
          onVault={handleVaultCards}
          onInstantSell={handleInstantSell}
          onRedeemPhysical={(card) => {
            setUnboxingConfig(null);
            setRedeemingCard(card);
          }}
          onRipAgain={(pack, count) => {
            setUnboxingConfig(null);
            handleStartRip(pack, count);
          }}
          userBalance={userBalance}
        />
      )}

      {/* Physical Redeem Modal */}
      {redeemingCard && (
        <PhysicalRedeemModal
          card={redeemingCard}
          onClose={() => setRedeemingCard(null)}
          onConfirmRedeem={handleConfirmRedeem}
        />
      )}

      {/* Wallet / Top-Up Modal */}
      {isWalletOpen && (
        <WalletModal
          userBalance={userBalance}
          totalSpent={totalSpent}
          totalWon={totalWon}
          packsOpened={packsOpened}
          onAddFunds={handleAddFunds}
          onResetBalance={handleResetBalance}
          onClose={() => setIsWalletOpen(false)}
        />
      )}

      {/* How It Works Educational Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onExplorePacks={() => {
            setIsHowItWorksOpen(false);
            setCurrentTab('packs');
          }}
        />
      )}
    </div>
  );
}
