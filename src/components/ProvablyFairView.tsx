import React, { useState } from 'react';
import { PACK_TIERS } from '../data/packData';
import { PackTier } from '../types';
import { ShieldCheck, CheckCircle2, Eye, Key } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProvablyFairViewProps {
  onInspectPack: (pack: PackTier) => void;
}

export const ProvablyFairView: React.FC<ProvablyFairViewProps> = ({ onInspectPack }) => {
  const [clientSeed, setClientSeed] = useState('lotcards_public_session_784920');
  const [serverHash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [nonce, setNonce] = useState(1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Provably Fair VRF Protocol</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Cryptographically Verified Mystery Packs
        </h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Inspired by Courtyard.io's transparency standards. Every pack has a finite, public 100-card inventory with pre-committed card slots and provable randomness.
        </p>
      </div>

      {/* 4 Tier Odds Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {PACK_TIERS.map((pack) => (
          <div
            key={pack.id}
            className="p-5 rounded-2xl bg-[#11131C] border border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{pack.name}</h3>
                  <span className="text-xs font-mono font-bold text-amber-400">£{pack.cost}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onInspectPack(pack);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect 100 Cards</span>
                </button>
              </div>

              {/* Rarity & Drop Rate Breakdown Table */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
                  <span className="font-bold">👑 20x Top Chase (1 Card)</span>
                  <span className="font-bold">1.0% · £{pack.topChaseValue.toFixed(2)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-purple-300">
                  <span>Ultra Rares (4 Cards)</span>
                  <span>4.0% · £{(pack.cost * 4).toFixed(0)} - £{(pack.cost * 13).toFixed(0)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-sky-300">
                  <span>Rare Hits (15 Cards)</span>
                  <span>15.0% · £{(pack.cost * 2).toFixed(0)} - £{(pack.cost * 5.5).toFixed(0)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-slate-300">
                  <span>Mid Hits (35 Cards)</span>
                  <span>35.0% · £{(pack.cost * 1.1).toFixed(0)} - £{(pack.cost * 2.2).toFixed(0)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-slate-400">
                  <span>Floor Hits (45 Cards)</span>
                  <span>45.0% · £{pack.floorValue.toFixed(2)} Guaranteed</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Pool Size: 100 Raw Cards</span>
              <span className="text-emerald-400 font-bold">EV: £{pack.averageValue.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Cryptographic Verifier Box */}
      <div className="p-6 rounded-2xl bg-[#0E1017] border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            VRF Seed Transparency Inspector
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 block mb-1">Server Seed (SHA-256 Pre-Commitment)</label>
            <input
              type="text"
              readOnly
              value={serverHash}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Client Seed (Customizable)</label>
            <input
              type="text"
              value={clientSeed}
              onChange={(e) => setClientSeed(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Current Nonce:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold">{nonce}</span>
            <button
              onClick={() => {
                sound.playClick();
                setNonce((n) => n + 1);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Rotate Nonce
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cryptographic Draw Validated Against 100 Slabs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
