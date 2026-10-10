import React from 'react';
import { X, Wallet, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface WalletModalProps {
  userBalance: number;
  totalSpent: number;
  totalWon: number;
  packsOpened: number;
  onAddFunds: (amount: number) => void;
  onResetBalance: () => void;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  userBalance,
  totalSpent,
  totalWon,
  packsOpened,
  onAddFunds,
  onResetBalance,
  onClose,
}) => {
  const topUpAmounts = [25, 50, 100, 250];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0E1017] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Demo Balance & Wallet</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Lotcards demo mode with instant liquidity. Add funds to test £5, £10, £25, and £50 packs.
        </p>

        {/* Current Balance Display */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center mb-5">
          <span className="text-xs font-mono text-slate-400">Available Balance</span>
          <div className="text-3xl font-black text-emerald-400 font-mono tabular-nums mt-1">
            £{userBalance.toFixed(2)}
          </div>
        </div>

        {/* Quick Top-Up Chips */}
        <div className="mb-5">
          <label className="text-xs font-mono text-slate-400 block mb-2 font-medium">
            Quick Add Demo Funds
          </label>
          <div className="grid grid-cols-4 gap-2">
            {topUpAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  sound.playCashChime();
                  onAddFunds(amount);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-1 hover:scale-105 active:scale-95"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span>£{amount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lifetime Session Stats */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono space-y-2 mb-5">
          <div className="flex justify-between text-slate-400">
            <span>Packs Opened:</span>
            <span className="text-white font-semibold">{packsOpened}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Total Spent on Packs:</span>
            <span className="text-slate-300 font-semibold tabular-nums">£{totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Total Value Pulled:</span>
            <span className="text-emerald-400 font-bold tabular-nums">£{totalWon.toFixed(2)}</span>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onResetBalance();
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo State</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
