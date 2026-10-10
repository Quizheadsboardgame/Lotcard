import React, { useState } from 'react';
import { PokemonCard } from '../types';
import { X, Package, ShieldCheck, CheckCircle2, Truck, Globe, MapPin } from 'lucide-react';
import { sound } from '../utils/audio';

interface PhysicalRedeemModalProps {
  card: PokemonCard;
  onClose: () => void;
  onConfirmRedeem: (card: PokemonCard, address: string) => void;
}

export const PhysicalRedeemModal: React.FC<PhysicalRedeemModalProps> = ({
  card,
  onClose,
  onConfirmRedeem,
}) => {
  const [destination, setDestination] = useState<'uk' | 'overseas'>('uk');
  const [fullName, setFullName] = useState('Owen Newton');
  const [addressLine, setAddressLine] = useState('14 Kensington Court');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('W8 5DL');
  const [country, setCountry] = useState('United Kingdom');
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  // Shipping threshold calculation:
  // "Free shipping if over £25 value uk only and £100 over seas"
  const isFreeUkShipping = destination === 'uk' && card.marketValue >= 25;
  const isFreeOverseasShipping = destination === 'overseas' && card.marketValue >= 100;
  const isFreeShipping = isFreeUkShipping || isFreeOverseasShipping;

  const standardFee = destination === 'uk' ? 3.99 : 14.99;
  const shippingFee = isFreeShipping ? 0 : standardFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const tracking = destination === 'uk'
      ? `GB-RM-24-${Math.floor(10000000 + Math.random() * 90000000)}`
      : `INTL-DHL-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTrackingNumber(tracking);
    setIsSuccess(true);
    sound.playCashChime();
    onConfirmRedeem(
      card,
      `[${destination.toUpperCase()}] ${fullName}, ${addressLine}, ${city}, ${postcode}, ${country} (Shipping: ${isFreeShipping ? 'FREE' : `£${shippingFee.toFixed(2)}`})`
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E1017] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Redeem Physical Raw Pokémon Card
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Your raw card will be safely sleeved in a protective penny sleeve & rigid magnetic touch holder, tamper-sealed, and dispatched from Brink's vault.
            </p>

            {/* Destination Toggle */}
            <div className="mb-4">
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Select Shipping Destination
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDestination('uk');
                    setCountry('United Kingdom');
                  }}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    destination === 'uk'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>United Kingdom (UK)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDestination('overseas');
                    if (country === 'United Kingdom') setCountry('United States');
                  }}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    destination === 'overseas'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Overseas / International</span>
                </button>
              </div>
            </div>

            {/* Free Shipping Qualification Notice Banner */}
            <div className={`p-3 rounded-xl border text-xs font-mono mb-4 flex items-center justify-between ${
              isFreeShipping
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-bold text-white">
                    {destination === 'uk' ? 'UK Delivery Rule' : 'Overseas Delivery Rule'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {destination === 'uk'
                      ? 'Free shipping if card value over £25 (UK only)'
                      : 'Free shipping if card value over £100 (Overseas)'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {isFreeShipping ? (
                  <span className="font-bold text-emerald-400 text-sm">FREE (£0.00)</span>
                ) : (
                  <span className="font-bold text-slate-200">£{shippingFee.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Card Summary Pill */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={card.imageUrl || card.artworkUrl}
                  alt={card.name}
                  className="w-10 h-14 object-contain rounded bg-black/60 border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{card.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {card.condition || 'Raw NM/M'} · #{card.serialCode}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Card Value: £{card.marketValue.toFixed(2)}
                </span>
                <span className="block text-[9px] text-slate-500 font-mono">
                  Instant Sell (90%): £{(card.marketValue * 0.9).toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    {destination === 'uk' ? 'Postcode' : 'Zip / Postal Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {destination === 'overseas' && (
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Insured Vault Dispatch</span>
                </div>
                <span className="text-white font-mono font-bold">
                  Shipping: {isFreeShipping ? 'FREE' : `£${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs transition-all shadow-md mt-2"
              >
                Confirm Physical Shipment {shippingFee > 0 ? `(Pay £${shippingFee.toFixed(2)})` : '(Free Delivery)'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Physical Card Dispatched</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Your raw {card.name} has been retrieved, sealed in a rigid magnetic holder, and handed to insured couriers.
            </p>

            <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>Tracking Number</span>
                <span className="text-emerald-400 font-bold">
                  {destination === 'uk' ? 'Royal Mail Tracked 24' : 'DHL Express Worldwide'}
                </span>
              </div>
              <div className="text-white font-bold text-sm tracking-wider">{trackingNumber}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                Destination: {country} · Shipping Cost: {isFreeShipping ? 'FREE' : `£${shippingFee.toFixed(2)}`}
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold"
            >
              Return to Inventory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
