// High-resolution Pokémon illustration artwork mapper
// Uses official Pokémon asset imagery with high-fidelity alt-art backdrops

export interface PokemonArtData {
  imageUrl: string;
  shinyImageUrl?: string;
  bgGradient: string;
  badgeLabel?: string;
  illustrator: string;
  characterName: string;
}

// National Pokédex mapping for authentic character artwork
const POKEDEX_MAP: Record<string, number> = {
  charizard: 6,
  pikachu: 25,
  umbreon: 197,
  rayquaza: 384,
  mario: 25, // Mario Pikachu
  gengar: 94,
  lugia: 249,
  giratina: 487,
  mewtwo: 150,
  mew: 151,
  blastoise: 9,
  venusaur: 3,
  sylveon: 700,
  espeon: 196,
  glaceon: 471,
  leafeon: 470,
  jolteon: 135,
  flareon: 136,
  vaporeon: 134,
  eevee: 133,
  tyranitar: 248,
  dragonite: 149,
  suicune: 245,
  raikou: 243,
  entei: 244,
  darkrai: 491,
  arceus: 493,
  aerodactyl: 142,
  dialga: 483,
  palkia: 484,
  lucario: 448,
  gyarados: 130,
  gardevoir: 282,
  snorlax: 143,
  zapdos: 145,
  articuno: 144,
  moltres: 146,
  alakazam: 65,
  machamp: 68,
  garchomp: 445,
  scizor: 212,
  metagross: 376,
  salamence: 373,
  flygon: 330,
  kingdra: 230,
  crobat: 169,
  steelix: 208,
  houndoom: 229,
  heracross: 214,
  typhlosion: 157,
  feraligatr: 160,
  meganium: 154,
  hooh: 250,
  deoxys: 386,
  latias: 380,
  latios: 381,
  torchic: 255,
  treecko: 252,
  mudkip: 258,
  celebi: 251,
  jirachi: 385,
  kyogre: 382,
  yveltal: 717,
  zacian: 888,
  zamazenta: 889,
  raichu: 26,
  slowpoke: 79,
  magikarp: 129,
  lapras: 131,
  arcanine: 59,
  ninetales: 38,
  miraidon: 1008,
  koraidon: 1007,
  roaring: 1005,
  iron: 1006,
  greninja: 658,
  blaziken: 257,
  swampert: 260,
  sceptile: 254,
  torterra: 389,
  empoleon: 395,
  haunter: 93,
  ditto: 132,
  pidgeot: 18,
  kangaskhan: 115,
  wigglytuff: 40,
  golem: 76,
  jynx: 124,
  pinsir: 127,
  togekiss: 468,
  weavile: 461,
  magmortar: 467,
  electivire: 466,
  rotom: 479,
  dusknoir: 477,
  gliscor: 472,
  froslass: 478,
  mamoswine: 473,
  porygon: 474,
  uxie: 480,
  mesprit: 481,
  azelf: 482,
  poliwhirl: 62,
  tangela: 114,
  caterpie: 10,
  arbok: 24,
  dragonair: 148,
  machoke: 67,
  nidoking: 34,
  psyduck: 54,
  omanyte: 138,
  chandelure: 609,
  centiskorch: 851,
  orbeetle: 826,
  corviknight: 823,
  duraludon: 884,
  starmie: 121,
  zoroark: 571,
  samurott: 503,
  lilligant: 549,
  urshifu: 892,
  wailord: 321,
  zekrom: 644,
  reshiram: 643,
  lunala: 792,
  solgaleo: 791,
  piplup: 393,
  snivy: 495,
  cleffa: 173,
  togepi: 175,
  marshadow: 802,
  pheromosa: 795,
  buzzwole: 794,
  muk: 89,
  trevenant: 709,
  noctowl: 164,
  spiritomb: 442,
  mismagius: 429,
  honchkrow: 430,
  staraptor: 398,
  shaymin: 492,
  cresselia: 488,
  rhyperior: 464,
  weezing: 110,
  hypno: 97,
  golbat: 42,
  slowbro: 80,
  dugtrio: 51,
  magneton: 82,
  smeargle: 235,
  politoed: 186,
  charmander: 4,
  squirtle: 7,
  bulbasaur: 1,
};

// Identify the Pokémon name from the card title
export function getPokemonArt(cardName: string, pokemonType: string, isTopChase?: boolean): PokemonArtData {
  const lower = cardName.toLowerCase();
  
  // Find matching pokedex key
  let matchedKey = 'pikachu'; // fallback default
  for (const key of Object.keys(POKEDEX_MAP)) {
    if (lower.includes(key)) {
      matchedKey = key;
      break;
    }
  }

  const dexNumber = POKEDEX_MAP[matchedKey] || 25;
  const isShiny = lower.includes('shiny') || lower.includes('shining') || isTopChase;

  // High-resolution official Pokémon artwork URL
  const officialArtworkUrl = isShiny && [6, 197, 384, 130, 248].includes(dexNumber)
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${dexNumber}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`;

  // Dynamic alt-art scenic backdrops based on Pokemon and card theme
  let bgGradient = 'from-slate-900 via-indigo-950 to-black';
  let badgeLabel = 'ALT ART';
  let illustrator = '5ban Graphics';

  if (lower.includes('moonbreon') || lower.includes('umbreon')) {
    bgGradient = 'from-indigo-950 via-purple-950 to-[#070913]';
    badgeLabel = 'MOONLIGHT ALT ART';
    illustrator = 'teeziro';
  } else if (lower.includes('charizard')) {
    bgGradient = 'from-red-950 via-amber-950 to-[#120808]';
    badgeLabel = 'SHINY VAULT VMAX';
    illustrator = 'aky CG Works';
  } else if (lower.includes('rayquaza')) {
    bgGradient = 'from-teal-950 via-emerald-950 to-[#051110]';
    badgeLabel = 'CELESTIAL ALT ART';
    illustrator = 'Ryuta Fuse';
  } else if (lower.includes('mario')) {
    bgGradient = 'from-red-900 via-amber-800 to-yellow-950';
    badgeLabel = 'SPECIAL BOX PROMO';
    illustrator = 'Nintendo / Ken Sugimori';
  } else if (lower.includes('giratina')) {
    bgGradient = 'from-purple-950 via-neutral-900 to-[#150a1c]';
    badgeLabel = 'LOST ORIGIN ALT ART';
    illustrator = 'Shinji Kanda';
  } else if (lower.includes('lugia')) {
    bgGradient = 'from-blue-950 via-slate-900 to-[#091122]';
    badgeLabel = 'SILVER TEMPEST ALT ART';
    illustrator = 'kawayoo';
  } else if (lower.includes('gengar')) {
    bgGradient = 'from-fuchsia-950 via-purple-950 to-[#130718]';
    badgeLabel = 'FUSION STRIKE ALT ART';
    illustrator = 'sowsow';
  } else if (lower.includes('mewtwo') || lower.includes('mew')) {
    bgGradient = 'from-violet-950 via-purple-950 to-[#12081c]';
    badgeLabel = 'SECRET ART RARE';
    illustrator = 'Yusuke Ohmura';
  } else if (lower.includes('blastoise') || lower.includes('water')) {
    bgGradient = 'from-blue-950 via-cyan-950 to-[#061020]';
    badgeLabel = 'SPECIAL ILLUSTRATION';
    illustrator = 'Mitsuhiro Arita';
  } else if (lower.includes('venusaur') || lower.includes('grass')) {
    bgGradient = 'from-emerald-950 via-teal-950 to-[#071610]';
    badgeLabel = 'SPECIAL ILLUSTRATION';
    illustrator = 'Mitsuhiro Arita';
  }

  return {
    imageUrl: officialArtworkUrl,
    bgGradient,
    badgeLabel,
    illustrator,
    characterName: matchedKey.toUpperCase(),
  };
}
