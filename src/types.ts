export type Grader = 'Raw' | 'PSA' | 'BGS' | 'CGC';

export type CardCondition = 'Pack Fresh NM/M' | 'Near Mint (Raw)' | 'Mint (Raw)' | 'Pristine Raw';

export type CardRarity = 'grail' | 'ultra_rare' | 'rare' | 'mid' | 'standard';

export interface PokemonCard {
  id: string;
  packTierId: 'pack-5' | 'pack-10' | 'pack-25' | 'pack-50';
  cardNumber: number; // 1 to 100 within the pack
  name: string;
  set: string;
  setNumber: string;
  year: number;
  condition?: CardCondition; // Only raw cards!
  serialCode?: string; // Raw card inventory identifier
  marketValue: number; // Market Value in GBP (£)
  instantSellValue?: number; // 90% of Market Value
  rarity: CardRarity;
  dropRatePercent: number; // e.g. 1.0%
  pokemonType: 'fire' | 'water' | 'grass' | 'lightning' | 'psychic' | 'dark' | 'dragon' | 'colorless' | 'steel' | 'fighting';
  holographicType: 'cosmic' | 'galaxy' | 'gold_etched' | 'alt_art_textured' | 'rainbow' | 'vintage_starlight';
  description: string;
  isTopChase?: boolean; // 20x chase
  imageUrl?: string; // High-res actual card scan
  artworkUrl?: string; // High-res Pokemon illustration
  pokemonUkDbUrl?: string; // Link to official Pokemon.com UK TCG Database
  officialCardSource?: string; // e.g. "Pokemon.com UK TCG Database"
  dexId?: number; // Pokedex number
  hp?: number;
  attacks?: { name: string; damage: string; text?: string; cost?: string[] }[];
  artist?: string;
  grader?: Grader | string;
  grade?: string;
  gradeNumber?: number;
  certNumber?: string;
}

export interface PackTier {
  id: 'pack-5' | 'pack-10' | 'pack-25' | 'pack-50';
  name: string;
  tagline: string;
  cost: number;
  topChaseValue: number; // 20x cost
  topChaseCardName: string;
  topChaseCardSet: string;
  topChaseCardGrade: string;
  floorValue: number;
  averageValue: number;
  totalCards: number; // 100
  accentColor: string; // Tailwind color theme
  badgeColor: string;
  foilGradient: string;
  cards: PokemonCard[];
}

export interface VaultedItem {
  id: string;
  card: PokemonCard;
  pulledAt: string;
  status: 'vaulted' | 'redeemed_physical' | 'sold';
  soldFor?: number;
  trackingNumber?: string;
  shippingAddress?: string;
  shippingFee?: number;
  destinationType?: 'uk' | 'overseas';
  isLocked?: boolean;
}

export interface InventoryCardGroup {
  card: PokemonCard;
  items: VaultedItem[];
  count: number;
  totalValue: number;
  totalInstantSellValue: number;
}

export interface DropEvent {
  id: string;
  userName: string;
  packName: string;
  packCost: number;
  cardName: string;
  cardSet: string;
  cardGrade: string;
  marketValue: number;
  instantSellValue: number;
  isGrail: boolean;
  timeAgo: string;
}
