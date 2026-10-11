import { PackTier, PokemonCard, CardRarity, CardCondition, Grader } from '../types';
import { resolveCardArt } from './cardArtwork';

// Helper to generate consistent raw card inventory codes
function generateCert(seed: number): string {
  const base = (68492000 + seed * 947) % 99999999;
  return base.toString().padStart(8, '0');
}

function makeRaw(card: PokemonCard): PokemonCard {
  const art = resolveCardArt(card.name, card.pokemonType, card.isTopChase);
  return {
    ...card,
    condition: card.condition || 'Pack Fresh NM/M',
    serialCode: card.certNumber || generateCert(card.cardNumber),
    certNumber: card.certNumber || generateCert(card.cardNumber),
    grade: 'Raw NM/M',
    grader: 'Raw',
    gradeNumber: 10,
    instantSellValue: Number((card.marketValue * 0.9).toFixed(2)),
    imageUrl: card.imageUrl || art.imageUrl,
    artworkUrl: card.artworkUrl || art.artworkUrl,
    pokemonUkDbUrl: card.pokemonUkDbUrl || art.pokemonUkDbUrl,
    officialCardSource: card.officialCardSource || art.officialCardSource,
    dexId: card.dexId || art.dexId,
    hp: card.hp || art.hp,
    attacks: card.attacks || art.attacks,
  };
}

// ===== £5 MYSTERY PACK DATA (100 Cards, Top Chase: £100 = 20x) =====
function buildPack5Cards(): PokemonCard[] {
  const cards: PokemonCard[] = [];

  // #1 TOP CHASE (20x = £100)
  cards.push({
    id: 'p5-1',
    packTierId: 'pack-5',
    cardNumber: 1,
    name: 'Charizard VMAX (Shiny Vault)',
    set: 'Shining Fates',
    setNumber: 'SV107/SV122',
    year: 2021,
    grader: 'PSA',
    grade: '10 GEM MT',
    gradeNumber: 10,
    certNumber: generateCert(501),
    marketValue: 100.0,
    rarity: 'grail',
    dropRatePercent: 1.0,
    pokemonType: 'fire',
    holographicType: 'alt_art_textured',
    description: 'Iconic black shiny Gigantamax Charizard textured ultra rare.',
    isTopChase: true,
  });

  // #2-5 Ultra Rares (£35 - £65)
  const ultraRares = [
    { name: 'Pikachu VMAX Rainbow Rare', set: 'Vivid Voltage', no: '188/185', yr: 2020, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 65, type: 'lightning' as const, holo: 'rainbow' as const },
    { name: 'Mewtwo VSTAR (Secret Rare)', set: 'Pokemon GO', no: '086/078', yr: 2022, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 52, type: 'psychic' as const, holo: 'gold_etched' as const },
    { name: 'Sylveon V Alt Art', set: 'Evolving Skies', no: '184/203', yr: 2021, gr: 'CGC' as Grader, g: '9.5 MINT+', gn: 9.5, val: 45, type: 'psychic' as const, holo: 'alt_art_textured' as const },
    { name: 'Gengar EX Full Art', set: 'Phantom Forces', no: '114/119', yr: 2014, gr: 'PSA' as Grader, g: '9 MINT', gn: 9, val: 38, type: 'psychic' as const, holo: 'galaxy' as const },
  ];
  ultraRares.forEach((ur, idx) => {
    cards.push({
      id: `p5-${cards.length + 1}`,
      packTierId: 'pack-5',
      cardNumber: cards.length + 1,
      name: ur.name,
      set: ur.set,
      setNumber: ur.no,
      year: ur.yr,
      grader: ur.gr,
      grade: ur.g,
      gradeNumber: ur.gn,
      certNumber: generateCert(502 + idx),
      marketValue: ur.val,
      rarity: 'ultra_rare',
      dropRatePercent: 1.0,
      pokemonType: ur.type,
      holographicType: ur.holo,
      description: `High-tier hit graded ${ur.g} by ${ur.gr}.`,
    });
  });

  // #6-20 Rares (£12 - £28)
  const rares = [
    { name: 'Dragonite V Full Art', set: 'Evolving Skies', val: 28, type: 'dragon' as const },
    { name: 'Blastoise 25th Celebrations', set: 'Celebrations', val: 24, type: 'water' as const },
    { name: 'Venusaur 25th Celebrations', set: 'Celebrations', val: 20, type: 'grass' as const },
    { name: 'Suicune V Alt Art', set: 'Crown Zenith', val: 22, type: 'water' as const },
    { name: 'Raikou V Alt Art', set: 'Crown Zenith', val: 19, type: 'lightning' as const },
    { name: 'Entei V Alt Art', set: 'Crown Zenith', val: 18, type: 'fire' as const },
    { name: 'Mew V Full Art', set: 'Fusion Strike', val: 17, type: 'psychic' as const },
    { name: 'Umbreon V Full Art', set: 'Evolving Skies', val: 22, type: 'dark' as const },
    { name: 'Espeon V Full Art', set: 'Evolving Skies', val: 16, type: 'psychic' as const },
    { name: 'Rayquaza V Full Art', set: 'Silver Tempest', val: 18, type: 'dragon' as const },
    { name: 'Pikachu AR (Illustration Rare)', set: 'Crown Zenith', val: 15, type: 'lightning' as const },
    { name: 'Darkrai VSTAR Secret', set: 'Crown Zenith', val: 14, type: 'dark' as const },
    { name: 'Arceus V Promo', set: 'Brilliant Stars', val: 13, type: 'colorless' as const },
    { name: 'Lucario VSTAR Holo', set: 'Crown Zenith', val: 12, type: 'fighting' as const },
    { name: 'Gyarados GX Secret', set: 'Crimson Invasion', val: 14, type: 'water' as const },
  ];
  rares.forEach((r, idx) => {
    const isPsa10 = idx % 2 === 0;
    cards.push({
      id: `p5-${cards.length + 1}`,
      packTierId: 'pack-5',
      cardNumber: cards.length + 1,
      name: r.name,
      set: r.set,
      setNumber: `${100 + idx}/180`,
      year: 2021 + (idx % 3),
      grader: idx % 4 === 0 ? 'CGC' : 'PSA',
      grade: isPsa10 ? '10 GEM MT' : '9 MINT',
      gradeNumber: isPsa10 ? 10 : 9,
      certNumber: generateCert(520 + idx),
      marketValue: r.val,
      rarity: 'rare',
      dropRatePercent: 1.0,
      pokemonType: r.type,
      holographicType: 'cosmic',
      description: `Solid raw hit with strong collector liquidity.`,
    });
  });

  // #21-55 Mid hits (£6.00 - £11.00) (35 cards)
  const midPokemon = [
    'Gardevoir ex', 'Miraidon ex', 'Koraidon ex', 'Iron Valiant ex', 'Roaring Moon ex',
    'Charizard ex OBF', 'Tyranitar ex', 'Scizor Illustration Rare', 'Slowpoke AR',
    'Magikarp Vintage Reverse', 'Gengar Holo', 'Alakazam ex', 'Zapdos ex 151',
    'Articuno Holo', 'Moltres Holo', 'Machamp V', 'Typhlosion VSTAR',
    'Feraligatr Vintage Holo', 'Meganium Neo Genesis', 'Eevee Promo Black Star',
    'Jolteon TG', 'Flareon TG', 'Vaporeon TG', 'Leafeon V', 'Glaceon V',
    'Snorlax 151 AR', 'Mewtwo Promo', 'Greninja ex', 'Blaziken V', 'Swampert Holo',
    'Sceptile Holo', 'Dark Gyarados Celebrations', 'Clefairy Promo Holo', 'Torterra LV.X',
    'Empoleon V'
  ];
  midPokemon.forEach((poke, idx) => {
    const val = 6.0 + Number(((idx * 0.15) % 5.0).toFixed(2));
    cards.push({
      id: `p5-${cards.length + 1}`,
      packTierId: 'pack-5',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Modern S&V / Sword & Shield',
      setNumber: `${50 + idx}/198`,
      year: 2022,
      grader: idx % 3 === 0 ? 'BGS' : 'PSA',
      grade: idx % 3 === 0 ? '9.5 MINT+' : '9 MINT',
      gradeNumber: idx % 3 === 0 ? 9.5 : 9,
      certNumber: generateCert(550 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'mid',
      dropRatePercent: 1.0,
      pokemonType: (['psychic', 'fire', 'water', 'grass', 'lightning', 'dark'] as const)[idx % 6],
      holographicType: 'cosmic',
      description: `Authentic vaulted card above pack cost.`,
    });
  });

  // #56-100 Standard / Floor cards (£3.50 - £5.00) (45 cards)
  const floorPokemon = [
    'Pikachu McDonald 25th', 'Charmander 151 Reverse', 'Squirtle 151 Reverse', 'Bulbasaur 151 Reverse',
    'Haunter Base Set 2', 'Electabuzz Movie Promo', 'Arcanine Holo', 'Lapras Holo Crown Zenith',
    'Ditto Shiny Vault', 'Pidgeot ex', 'Kangaskhan ex', 'Ninetales ex',
    'Wigglytuff ex', 'Golem ex', 'Jynx ex', 'Pinsir AR',
    'Heracross Holo', 'Houndoom Holo', 'Scizor V', 'Steelix Holo',
    'Crobat V', 'Kingdra Holo', 'Flygon Holo', 'Salamence Holo',
    'Metagross Holo', 'Garchomp Holo', 'Lucario Holo', 'Togekiss V',
    'Weavile Holo', 'Magnezone VSTAR', 'Rhyperior Holo', 'Electivire Holo',
    'Magmortar Holo', 'Yanmega Holo', 'Gliscor Holo', 'Mamoswine Holo',
    'Porygon-Z Holo', 'Dusknoir Holo', 'Froslass Holo', 'Rotom V',
    'Uxie Holo', 'Mesprit Holo', 'Azelf Holo', 'Dialga Holo', 'Palkia Holo'
  ];
  floorPokemon.forEach((poke, idx) => {
    const val = 3.5 + Number(((idx * 0.035) % 1.5).toFixed(2));
    cards.push({
      id: `p5-${cards.length + 1}`,
      packTierId: 'pack-5',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Scarlet & Violet / SwSh',
      setNumber: `${10 + idx}/165`,
      year: 2023,
      grader: 'PSA',
      grade: '9 MINT',
      gradeNumber: 9,
      certNumber: generateCert(600 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'standard',
      dropRatePercent: 1.0,
      pokemonType: (['lightning', 'fire', 'water', 'grass', 'psychic', 'colorless'] as const)[idx % 6],
      holographicType: 'cosmic',
      description: 'Certified physical raw card with guaranteed floor value.',
    });
  });

  return cards.map(makeRaw);
}

// ===== £10 MYSTERY PACK DATA (100 Cards, Top Chase: £200 = 20x) =====
function buildPack10Cards(): PokemonCard[] {
  const cards: PokemonCard[] = [];

  // #1 TOP CHASE (20x = £200)
  cards.push({
    id: 'p10-1',
    packTierId: 'pack-10',
    cardNumber: 1,
    name: 'Rayquaza VMAX Alt Art #218',
    set: 'Evolving Skies',
    setNumber: '218/203',
    year: 2021,
    grader: 'PSA',
    grade: '10 GEM MT',
    gradeNumber: 10,
    certNumber: generateCert(1001),
    marketValue: 200.0,
    rarity: 'grail',
    dropRatePercent: 1.0,
    pokemonType: 'dragon',
    holographicType: 'alt_art_textured',
    description: 'The sky ruler dragon soaring over forests. One of modern Pokémon’s holy grails in pristine.',
    isTopChase: true,
  });

  // #2-5 Ultra Rares (£80 - £140)
  const ultraRares = [
    { name: 'Giratina V Alt Art', set: 'Lost Origin', no: '186/196', yr: 2022, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 140, type: 'dragon' as const, holo: 'alt_art_textured' as const },
    { name: 'Charizard V Alt Art', set: 'Brilliant Stars', no: '154/172', yr: 2022, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 110, type: 'fire' as const, holo: 'alt_art_textured' as const },
    { name: 'Aerodactyl V Alt Art', set: 'Lost Origin', no: '180/196', yr: 2022, gr: 'BGS' as Grader, g: '9.5 MINT+', gn: 9.5, val: 95, type: 'fighting' as const, holo: 'alt_art_textured' as const },
    { name: 'Mew VMAX Alt Art', set: 'Fusion Strike', no: '269/264', yr: 2021, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 85, type: 'psychic' as const, holo: 'alt_art_textured' as const },
  ];
  ultraRares.forEach((ur, idx) => {
    cards.push({
      id: `p10-${cards.length + 1}`,
      packTierId: 'pack-10',
      cardNumber: cards.length + 1,
      name: ur.name,
      set: ur.set,
      setNumber: ur.no,
      year: ur.yr,
      grader: ur.gr,
      grade: ur.g,
      gradeNumber: ur.gn,
      certNumber: generateCert(1002 + idx),
      marketValue: ur.val,
      rarity: 'ultra_rare',
      dropRatePercent: 1.0,
      pokemonType: ur.type,
      holographicType: ur.holo,
      description: `Spectacular modern alt art hit graded ${ur.g}.`,
    });
  });

  // #6-20 Rares (£25 - £55)
  const rares = [
    { name: 'Tyranitar V Alt Art', set: 'Battle Styles', val: 55, type: 'dark' as const },
    { name: 'Dragonite V Alt Art', set: 'Evolving Skies', val: 50, type: 'dragon' as const },
    { name: 'Glaceon VMAX Alt Art', set: 'Evolving Skies', val: 48, type: 'water' as const },
    { name: 'Leafeon VMAX Alt Art', set: 'Evolving Skies', val: 45, type: 'grass' as const },
    { name: 'Pikachu Special Delivery', set: 'Pokemon Center Promo', val: 42, type: 'lightning' as const },
    { name: 'Mewtwo V Alt Art', set: 'Pokemon GO', val: 38, type: 'psychic' as const },
    { name: 'Origin Forme Dialga V Alt Art', set: 'Astral Radiance', val: 35, type: 'steel' as const },
    { name: 'Origin Forme Palkia V Alt Art', set: 'Astral Radiance', val: 32, type: 'water' as const },
    { name: 'Arceus V Alt Art', set: 'Brilliant Stars', val: 36, type: 'colorless' as const },
    { name: 'Beedrill V Alt Art', set: 'Astral Radiance', val: 30, type: 'grass' as const },
    { name: 'Charizard Base Set 2 Holo', set: 'Base Set 2', val: 50, type: 'fire' as const },
    { name: 'Lumineon V Alt Art', set: 'Brilliant Stars', val: 26, type: 'water' as const },
    { name: 'Galarian Moltres V Secret', set: 'Chilling Reign', val: 34, type: 'dark' as const },
    { name: 'Galarian Zapdos V Alt Art', set: 'Chilling Reign', val: 30, type: 'fighting' as const },
    { name: 'Galarian Articuno V Alt Art', set: 'Chilling Reign', val: 28, type: 'psychic' as const },
  ];
  rares.forEach((r, idx) => {
    const isPsa10 = idx % 2 === 0;
    cards.push({
      id: `p10-${cards.length + 1}`,
      packTierId: 'pack-10',
      cardNumber: cards.length + 1,
      name: r.name,
      set: r.set,
      setNumber: `${150 + idx}/203`,
      year: 2021 + (idx % 2),
      grader: idx % 3 === 0 ? 'CGC' : 'PSA',
      grade: isPsa10 ? '10 GEM MT' : '9 MINT',
      gradeNumber: isPsa10 ? 10 : 9,
      certNumber: generateCert(1020 + idx),
      marketValue: r.val,
      rarity: 'rare',
      dropRatePercent: 1.0,
      pokemonType: r.type,
      holographicType: 'alt_art_textured',
      description: `Highly liquid alt art graded card.`,
    });
  });

  // #21-55 Mid hits (£12.00 - £24.00) (35 cards)
  const midPokemon = [
    'Charizard ex 151 Ultra Rare', 'Blastoise ex 151 Ultra Rare', 'Venusaur ex 151 Ultra Rare',
    'Alakazam 151 Illustration Rare', 'Zapdos ex 151 Special Art', 'Erika’s Invitation SAR',
    'Iono SAR Paldea Evolved', 'Miriam SAR Scarlet & Violet', 'Pikachu Grey Felt Hat Van Gogh',
    'Umbreon Star 25th Celebrations', 'Charizard Celebrations Holo', 'Rayquaza Amazing Rare',
    'Jirachi Amazing Rare', 'Kyogre Amazing Rare', 'Yveltal Amazing Rare',
    'Celebi Amazing Rare', 'Zacian Amazing Rare', 'Zamazenta Amazing Rare',
    'Raichu Illustration Rare', 'Gengar Holo Fossil Unlimited', 'Haunter 1st Edition Fossil',
    'Pikachu V Golden Promo', 'Pokeball Gold Metal Card Celebrations', 'Pikachu VMAX Starter Deck Promo',
    'Hisuian Zoroark VSTAR Secret', 'Deoxys VSTAR Galarian Gallery', 'Darkrai VSTAR Galarian Gallery',
    'Samurott VSTAR Alt Art', 'Lilligant V Alt Art', 'Starmie V Trainer Gallery',
    'Garchomp V Trainer Gallery', 'Pikachu VMAX Trainer Gallery', 'Mew VMAX Gold Secret',
    'Urshifu Rapid Strike VMAX Alt Art', 'Urshifu Single Strike VMAX Alt Art'
  ];
  midPokemon.forEach((poke, idx) => {
    const val = 12.0 + Number(((idx * 0.35) % 12.0).toFixed(2));
    cards.push({
      id: `p10-${cards.length + 1}`,
      packTierId: 'pack-10',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Sword & Shield / SV Special Sets',
      setNumber: `${70 + idx}/200`,
      year: 2022,
      grader: idx % 3 === 0 ? 'BGS' : 'PSA',
      grade: '9.5 MINT+',
      gradeNumber: 9.5,
      certNumber: generateCert(1050 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'mid',
      dropRatePercent: 1.0,
      pokemonType: (['dragon', 'psychic', 'fire', 'water', 'lightning', 'grass'] as const)[idx % 6],
      holographicType: 'cosmic',
      description: `Solid mid-tier hit above pack entry cost.`,
    });
  });

  // #56-100 Standard / Floor cards (£7.50 - £11.00) (45 cards)
  const floorPokemon = [
    'Squirtle Illustration Rare 151', 'Bulbasaur Illustration Rare 151', 'Charmander Illustration Rare 151',
    'Poliwhirl Illustration Rare 151', 'Dragonair Illustration Rare 151', 'Machoke Illustration Rare 151',
    'Nidoking Illustration Rare 151', 'Psyduck Illustration Rare 151', 'Omanyte Illustration Rare 151',
    'Caterpie Illustration Rare 151', 'Tangela Illustration Rare 151', 'Snorlax Promo 151 ETB',
    'Mewtwo Promo 151 Poster Box', 'Arbok ex Ultra Rare', 'Ninetales ex Ultra Rare',
    'Wigglytuff ex Ultra Rare', 'Alakazam ex Ultra Rare', 'Golem ex Ultra Rare',
    'Kangaskhan ex Ultra Rare', 'Jynx ex Ultra Rare', 'Zapdos ex Ultra Rare',
    'Mew ex Ultra Rare', 'Gengar Trainer Gallery Lost Origin', 'Pikachu Trainer Gallery Lost Origin',
    'Chandelure Trainer Gallery', 'Centiskorch VMAX Trainer Gallery', 'Orbeetle VMAX Trainer Gallery',
    'Corviknight VMAX Trainer Gallery', 'Duraludon VMAX Trainer Gallery', 'Single Strike Mustard Secret',
    'Rapid Strike Mustard Secret', 'Peonia Rainbow Rare', 'Flannery Rainbow Rare',
    'Zinnia’s Resolve Full Art', 'Aroma Lady Full Art', 'Copycat Full Art',
    'Raihan Full Art Crown Zenith', 'Cynthia’s Ambition Full Art', 'Gardenia’s Vigor Full Art',
    'Grant Full Art', 'Irida Full Art Astral Radiance', 'Kamado Full Art',
    'Roxanne Full Art', 'Adaman Full Art', 'Cyllene Full Art'
  ];
  floorPokemon.forEach((poke, idx) => {
    const val = 7.5 + Number(((idx * 0.08) % 3.5).toFixed(2));
    cards.push({
      id: `p10-${cards.length + 1}`,
      packTierId: 'pack-10',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Scarlet & Violet 151 / Crown Zenith',
      setNumber: `${20 + idx}/165`,
      year: 2023,
      grader: 'PSA',
      grade: '9 MINT',
      gradeNumber: 9,
      certNumber: generateCert(1100 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'standard',
      dropRatePercent: 1.0,
      pokemonType: (['water', 'grass', 'fire', 'psychic', 'lightning', 'colorless'] as const)[idx % 6],
      holographicType: 'cosmic',
      description: 'Physical vaulted raw card with guaranteed £7.50+ floor.',
    });
  });

  return cards.map(makeRaw);
}

// ===== £25 MYSTERY PACK DATA (100 Cards, Top Chase: £500 = 20x) =====
function buildPack25Cards(): PokemonCard[] {
  const cards: PokemonCard[] = [];

  // #1 TOP CHASE (20x = £500)
  cards.push({
    id: 'p25-1',
    packTierId: 'pack-25',
    cardNumber: 1,
    name: 'Mario Pikachu Special Box Promo #294/XY-P',
    set: 'XY Japanese Promos',
    setNumber: '294/XY-P',
    year: 2016,
    grader: 'PSA',
    grade: '9 MINT',
    gradeNumber: 9,
    certNumber: generateCert(2501),
    marketValue: 500.0,
    rarity: 'grail',
    dropRatePercent: 1.0,
    pokemonType: 'lightning',
    holographicType: 'gold_etched',
    description: 'Iconic Nintendo crossover masterpiece featuring Pikachu dressed as Super Mario. Elite grail.',
    isTopChase: true,
  });

  // #2-5 Ultra Rares (£200 - £350)
  const ultraRares = [
    { name: 'Lugia V Alt Art #186', set: 'Silver Tempest', no: '186/195', yr: 2022, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 320, type: 'colorless' as const, holo: 'alt_art_textured' as const },
    { name: 'Blastoise Base Set Unlimited Holo #2', set: 'Base Set', no: '2/102', yr: 1999, gr: 'PSA' as Grader, g: '8 NM-MT', gn: 8, val: 260, type: 'water' as const, holo: 'vintage_starlight' as const },
    { name: 'Venusaur Base Set Unlimited Holo #15', set: 'Base Set', no: '15/102', yr: 1999, gr: 'PSA' as Grader, g: '8 NM-MT', gn: 8, val: 220, type: 'grass' as const, holo: 'vintage_starlight' as const },
    { name: 'Charizard ex Special Illustration Rare #199', set: 'Scarlet & Violet 151', no: '199/165', yr: 2023, gr: 'PSA' as Grader, g: '10 GEM MT', gn: 10, val: 200, type: 'fire' as const, holo: 'alt_art_textured' as const },
  ];
  ultraRares.forEach((ur, idx) => {
    cards.push({
      id: `p25-${cards.length + 1}`,
      packTierId: 'pack-25',
      cardNumber: cards.length + 1,
      name: ur.name,
      set: ur.set,
      setNumber: ur.no,
      year: ur.yr,
      grader: ur.gr,
      grade: ur.g,
      gradeNumber: ur.gn,
      certNumber: generateCert(2502 + idx),
      marketValue: ur.val,
      rarity: 'ultra_rare',
      dropRatePercent: 1.0,
      pokemonType: ur.type,
      holographicType: ur.holo,
      description: `Crown grail hit with premier market demand.`,
    });
  });

  // #6-20 Rares (£60 - £150)
  const rares = [
    { name: 'Gengar & Mimikyu GX Tag Team Alt Art', set: 'Team Up', val: 140, type: 'psychic' as const },
    { name: 'Magikarp & Wailord GX Alt Art', set: 'Team Up', val: 125, type: 'water' as const },
    { name: 'Latias & Latios GX Tag Team', set: 'Team Up', val: 150, type: 'dragon' as const },
    { name: 'Mewtwo & Mew GX Unified Minds Alt Art', set: 'Unified Minds', val: 110, type: 'psychic' as const },
    { name: 'Pikachu & Zekrom GX Secret Rare', set: 'Team Up', val: 95, type: 'lightning' as const },
    { name: 'Reshiram & Charizard GX Secret Rare', set: 'Unbroken Bonds', val: 90, type: 'fire' as const },
    { name: 'Shining Rayquaza Holo', set: 'Shining Legends', val: 80, type: 'dragon' as const },
    { name: 'Shining Mew Holo', set: 'Shining Legends', val: 85, type: 'psychic' as const },
    { name: 'Shining Lugia SM Promo', set: 'SM Black Star Promos', val: 75, type: 'colorless' as const },
    { name: 'Charizard GX Hidden Fates SV49', set: 'Hidden Fates', val: 130, type: 'fire' as const },
    { name: 'Blastoise ex SAR #202', set: 'Scarlet & Violet 151', val: 70, type: 'water' as const },
    { name: 'Venusaur ex SAR #198', set: 'Scarlet & Violet 151', val: 65, type: 'grass' as const },
    { name: 'Zapdos ex SAR #202', set: 'Scarlet & Violet 151', val: 68, type: 'lightning' as const },
    { name: 'Alakazam ex SAR #201', set: 'Scarlet & Violet 151', val: 62, type: 'psychic' as const },
    { name: 'Dragonite V Alt Art', set: 'Evolving Skies', val: 90, type: 'dragon' as const },
  ];
  rares.forEach((r, idx) => {
    const isPsa10 = idx % 2 === 0;
    cards.push({
      id: `p25-${cards.length + 1}`,
      packTierId: 'pack-25',
      cardNumber: cards.length + 1,
      name: r.name,
      set: r.set,
      setNumber: `${180 + idx}/214`,
      year: 2019 + (idx % 4),
      grader: idx % 3 === 0 ? 'BGS' : 'PSA',
      grade: isPsa10 ? '10 GEM MT' : '9.5 MINT+',
      gradeNumber: isPsa10 ? 10 : 9.5,
      certNumber: generateCert(2520 + idx),
      marketValue: r.val,
      rarity: 'rare',
      dropRatePercent: 1.0,
      pokemonType: r.type,
      holographicType: 'alt_art_textured',
      description: `High-value Tag Team or modern grail hit.`,
    });
  });

  // #21-55 Mid hits (£28.00 - £55.00) (35 cards)
  const midPokemon = [
    'Espeon VMAX Alt Art Promo', 'Sylveon VMAX Alt Art EVS', 'Glaceon VMAX Alt Art',
    'Leafeon VMAX Alt Art', 'Umbreon V Alt Art', 'Rayquaza V Alt Art',
    'Galarian Moltres V Alt Art', 'Galarian Zapdos V Alt Art', 'Galarian Articuno V Alt Art',
    'Darkrai & Umbreon GX Promo', 'Lucario & Melmetal GX Alt Art', 'Pheromosa & Buzzwole GX Alt Art',
    'Muk & Alolan Muk GX Alt Art', 'Marshadow & Machamp GX Alt Art', 'Greninja & Zoroark GX Alt Art',
    'Rowlet & Alolan Exeggutor GX Alt Art', 'Raichu & Alolan Raichu GX Alt Art', 'Slowpoke & Psyduck GX Alt Art',
    'Togepi & Cleffa & Igglybuff GX Alt Art', 'Trevenant & Dusknoir GX Promo', 'Solgaleo & Lunala GX Full Art',
    'Reshiram & Zekrom GX Full Art', 'Blastoise & Piplup GX Full Art', 'Venusaur & Snivy GX Full Art',
    'Charizard V Champions Path Shiny', 'Charizard VMAX Champions Path Rainbow',
    'Pikachu VMAX Vivid Voltage', 'Mew VMAX Fusion Strike Alt Art',
    'Lugia GX Lost Thunder Full Art', 'Tyranitar GX Lost Thunder Full Art',
    'Suicune GX Lost Thunder Full Art', 'Rayquaza GX Celestial Storm Full Art',
    'Salamence GX Celestial Storm Full Art', 'Metagross GX Guardians Rising Secret', 'Tapu Lele GX Secret Rare'
  ];
  midPokemon.forEach((poke, idx) => {
    const val = 28.0 + Number(((idx * 0.8) % 27.0).toFixed(2));
    cards.push({
      id: `p25-${cards.length + 1}`,
      packTierId: 'pack-25',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Sun & Moon / SWSH Grails',
      setNumber: `${85 + idx}/214`,
      year: 2020,
      grader: idx % 3 === 0 ? 'CGC' : 'PSA',
      grade: idx % 2 === 0 ? '10 GEM MT' : '9.5 MINT+',
      gradeNumber: idx % 2 === 0 ? 10 : 9.5,
      certNumber: generateCert(2550 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'mid',
      dropRatePercent: 1.0,
      pokemonType: (['psychic', 'dark', 'water', 'dragon', 'fire', 'lightning'] as const)[idx % 6],
      holographicType: 'alt_art_textured',
      description: `Vaulted premium raw card delivering strong yield.`,
    });
  });

  // #56-100 Standard / Floor cards (£18.00 - £26.00) (45 cards)
  const floorPokemon = [
    'Charizard VSTAR Rainbow', 'Charizard VSTAR Promo', 'Charizard V Promo SWSH260',
    'Charizard VMAX Promo SWSH261', 'Charizard VSTAR Promo SWSH262', 'Mewtwo VSTAR Universe SAR',
    'Charizard VSTAR Universe SAR', 'Arceus VSTAR Universe SAR', 'Giratina VSTAR Universe SAR',
    'Palkia VSTAR Universe SAR', 'Dialga VSTAR Universe SAR', 'Suicune V SAR Universe',
    'Entei V SAR Universe', 'Raikou V SAR Universe', 'Simishear VSTAR SAR',
    'Darkrai VSTAR SAR Universe', 'Zeraora VMAX SAR Universe', 'Zeraora VSTAR SAR Universe',
    'Hatterene VMAX SAR Universe', 'Regigigas VSTAR SAR Universe', 'Drapion V SAR Universe',
    'Lumineon V SAR Universe', 'Gliscor Vintage Holo', 'Weavile Vintage Holo',
    'Honchkrow Vintage Holo', 'Mismagius Vintage Holo', 'Spiritomb Vintage Holo',
    'Garchomp C LV.X', 'Rayquaza C LV.X', 'Charizard G LV.X',
    'Staraptor FB LV.X', 'Electivire FB LV.X', 'Blaziken FB LV.X',
    'Salamence LV.X', 'Arceus LV.X Promo', 'Dialga G LV.X',
    'Palkia G LV.X', 'Giratina Origin LV.X', 'Shaymin Sky LV.X',
    'Darkrai LV.X', 'Cresselia LV.X', 'Mewtwo LV.X',
    'Lucario LV.X', 'Rhyperior LV.X', 'Magmortar LV.X'
  ];
  floorPokemon.forEach((poke, idx) => {
    const val = 18.0 + Number(((idx * 0.18) % 8.0).toFixed(2));
    cards.push({
      id: `p25-${cards.length + 1}`,
      packTierId: 'pack-25',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'VSTAR Universe / Platinum Grails',
      setNumber: `${200 + idx}/262`,
      year: 2022,
      grader: 'PSA',
      grade: '9 MINT',
      gradeNumber: 9,
      certNumber: generateCert(2600 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'standard',
      dropRatePercent: 1.0,
      pokemonType: (['fire', 'psychic', 'lightning', 'steel', 'water', 'dragon'] as const)[idx % 6],
      holographicType: 'cosmic',
      description: 'Physical vaulted raw card with £18.00+ guaranteed floor.',
    });
  });

  return cards.map(makeRaw);
}

// ===== £50 MYSTERY PACK DATA (100 Cards, Top Chase: £1,000 = 20x) =====
function buildPack50Cards(): PokemonCard[] {
  const cards: PokemonCard[] = [];

  // #1 TOP CHASE (20x = £1,000)
  cards.push({
    id: 'p50-1',
    packTierId: 'pack-50',
    cardNumber: 1,
    name: 'Umbreon VMAX Alt Art #215 "Moonbreon"',
    set: 'Evolving Skies',
    setNumber: '215/203',
    year: 2021,
    grader: 'PSA',
    grade: '10 GEM MT',
    gradeNumber: 10,
    certNumber: generateCert(5001),
    marketValue: 1000.0,
    rarity: 'grail',
    dropRatePercent: 1.0,
    pokemonType: 'dark',
    holographicType: 'alt_art_textured',
    description: 'The King of Modern Pokémon: Umbreon reaching for the moon. Perfect Gem Mint. 20x Top Chase of the £50 pack.',
    isTopChase: true,
  });

  // #2-5 Ultra Rares (£450 - £850)
  const ultraRares = [
    { name: '1st Edition Shining Charizard #107', set: 'Neo Destiny', no: '107/105', yr: 2002, gr: 'PSA' as Grader, g: '8 NM-MT', gn: 8, val: 850, type: 'fire' as const, holo: 'vintage_starlight' as const },
    { name: 'Rayquaza Gold Star #107', set: 'EX Deoxys', no: '107/107', yr: 2005, gr: 'PSA' as Grader, g: '7 NM', gn: 7, val: 720, type: 'dragon' as const, holo: 'gold_etched' as const },
    { name: 'Charizard 1st Edition Shadowless', set: 'Base Set', no: '4/102', yr: 1999, gr: 'PSA' as Grader, g: '6 EX-MT', gn: 6, val: 650, type: 'fire' as const, holo: 'vintage_starlight' as const },
    { name: 'Pikachu Illustrator Convention Special Promo', set: 'Wizards Black Star', no: '#1 Promo', yr: 1998, gr: 'BGS' as Grader, g: '9.5 MINT+', gn: 9.5, val: 480, type: 'lightning' as const, holo: 'gold_etched' as const },
  ];
  ultraRares.forEach((ur, idx) => {
    cards.push({
      id: `p50-${cards.length + 1}`,
      packTierId: 'pack-50',
      cardNumber: cards.length + 1,
      name: ur.name,
      set: ur.set,
      setNumber: ur.no,
      year: ur.yr,
      grader: ur.gr,
      grade: ur.g,
      gradeNumber: ur.gn,
      certNumber: generateCert(5002 + idx),
      marketValue: ur.val,
      rarity: 'ultra_rare',
      dropRatePercent: 1.0,
      pokemonType: ur.type,
      holographicType: ur.holo,
      description: `Blue-chip grail card with monumental historical prestige.`,
    });
  });

  // #6-20 Rares (£120 - £350)
  const rares = [
    { name: 'Gengar VMAX Alt Art #271', set: 'Fusion Strike', val: 320, type: 'psychic' as const },
    { name: 'Giratina V Alt Art #186', set: 'Lost Origin', val: 340, type: 'dragon' as const },
    { name: 'Latias & Latios GX Tag Team Alt Art #170', set: 'Team Up', val: 350, type: 'dragon' as const },
    { name: 'Charizard Base Set Shadowless Holo #4', set: 'Base Set', val: 280, type: 'fire' as const },
    { name: 'Torchic Gold Star', set: 'EX Team Rocket Returns', val: 260, type: 'fire' as const },
    { name: 'Treecko Gold Star', set: 'EX Team Rocket Returns', val: 240, type: 'grass' as const },
    { name: 'Mudkip Gold Star', set: 'EX Team Rocket Returns', val: 250, type: 'water' as const },
    { name: 'Pikachu Gold Star', set: 'EX Holon Phantoms', val: 300, type: 'lightning' as const },
    { name: 'Mew Gold Star', set: 'EX Dragon Frontiers', val: 270, type: 'psychic' as const },
    { name: 'Umbreon Gold Star 25th', set: 'Celebrations Classic', val: 180, type: 'dark' as const },
    { name: 'Charizard Base Set Unlimited Holo', set: 'Base Set', val: 220, type: 'fire' as const },
    { name: 'Shining Noctowl 1st Edition', set: 'Neo Destiny', val: 190, type: 'colorless' as const },
    { name: 'Shining Steelix 1st Edition', set: 'Neo Destiny', val: 175, type: 'steel' as const },
    { name: 'Shining Magikarp 1st Edition', set: 'Neo Revelation', val: 160, type: 'water' as const },
    { name: 'Shining Gyarados Unlimited', set: 'Neo Revelation', val: 150, type: 'water' as const },
  ];
  rares.forEach((r, idx) => {
    cards.push({
      id: `p50-${cards.length + 1}`,
      packTierId: 'pack-50',
      cardNumber: cards.length + 1,
      name: r.name,
      set: r.set,
      setNumber: `${100 + idx}/110`,
      year: 2000 + (idx % 22),
      grader: idx % 3 === 0 ? 'BGS' : 'PSA',
      grade: '10 GEM MT',
      gradeNumber: 10,
      certNumber: generateCert(5020 + idx),
      marketValue: r.val,
      rarity: 'rare',
      dropRatePercent: 1.0,
      pokemonType: r.type,
      holographicType: 'vintage_starlight',
      description: `Vintage or modern blue-chip asset vaulted in high grade.`,
    });
  });

  // #21-55 Mid hits (£60.00 - £110.00) (35 cards)
  const midPokemon = [
    'Rayquaza VMAX Alt Art', 'Lugia V Alt Art', 'Charizard V Alt Art',
    'Mew VMAX Alt Art', 'Blastoise 151 SAR', 'Venusaur 151 SAR',
    'Charizard VMAX Shiny Vault', 'Gengar EX Full Art Phantom Forces',
    'Mewtwo GX Secret Shiny Hidden Fates', 'Cynthia Full Art Ultra Prism',
    'Lillie Full Art Ultra Prism', 'Rosa Full Art Cosmic Eclipse',
    'Red’s Challenge Full Art', 'Blue’s Tactics Full Art', 'Green’s Exploration Full Art',
    'Sightseer Full Art Tag All Stars', 'Sabrina’s Suggestion Full Art',
    'Misty & Lorelei Full Art', 'Erika’s Hospitality Full Art',
    'Karen Full Art XY Promo', 'N Full Art Noble Victories',
    'Colress Full Art Plasma Storm', 'Skyla Full Art Boundaries Crossed',
    'Iris Full Art Megalo Cannon', 'Bianca Full Art Emerging Powers',
    'Professor Juniper Full Art Dark Explorers', 'Ghetsis Full Art Plasma Freeze',
    'Lysandre’s Trump Card Full Art', 'Team Flare Grunt Full Art',
    'Wally Full Art Roaring Skies', 'Steven Full Art Roaring Skies',
    'Winona Full Art Roaring Skies', 'Korrina Full Art Furious Fists',
    'Fossil Dragonite 1st Edition Holo', 'Jungle Vaporeon 1st Edition Holo'
  ];
  midPokemon.forEach((poke, idx) => {
    const val = 60.0 + Number(((idx * 1.45) % 50.0).toFixed(2));
    cards.push({
      id: `p50-${cards.length + 1}`,
      packTierId: 'pack-50',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'Vintage WOTC / Sun & Moon Grails',
      setNumber: `${90 + idx}/115`,
      year: 2018,
      grader: idx % 3 === 0 ? 'CGC' : 'PSA',
      grade: '10 GEM MT',
      gradeNumber: 10,
      certNumber: generateCert(5050 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'mid',
      dropRatePercent: 1.0,
      pokemonType: (['dragon', 'fire', 'psychic', 'dark', 'water', 'grass'] as const)[idx % 6],
      holographicType: 'alt_art_textured',
      description: `Solid high-tier pull comfortably covering pack price.`,
    });
  });

  // #56-100 Standard / Floor cards (£38.00 - £55.00) (45 cards)
  const floorPokemon = [
    'Charizard ex 151 Ultra Rare', 'Blastoise ex 151 Ultra Rare', 'Venusaur ex 151 Ultra Rare',
    'Zapdos ex 151 Ultra Rare', 'Alakazam ex 151 Ultra Rare', 'Mew ex 151 Ultra Rare',
    'Iono Paldea Evolved SAR', 'Miriam Scarlet & Violet SAR', 'Pikachu Grey Felt Hat Van Gogh',
    'Charizard Celebrations Holo', 'Blastoise Celebrations Holo', 'Venusaur Celebrations Holo',
    'Mewtwo EX 25th Celebrations', 'Rayquaza EX 25th Celebrations', 'Gengar Holo Gym Heroes',
    'Blastoise Dark Team Rocket Holo', 'Charizard Dark Team Rocket Holo',
    'Dragonite Dark Team Rocket Holo', 'Gyarados Dark Team Rocket Holo',
    'Machamp Dark Team Rocket 1st Ed', 'Raichu Dark Team Rocket Holo',
    'Vileplume Dark Team Rocket Holo', 'Weezing Dark Team Rocket Holo',
    'Hypno Dark Team Rocket Holo', 'Arbok Dark Team Rocket Holo',
    'Golbat Dark Team Rocket Holo', 'Slowbro Dark Team Rocket Holo',
    'Dugtrio Dark Team Rocket Holo', 'Magneton Dark Team Rocket Holo',
    'Alakazam Dark Team Rocket Holo', 'Feraligatr Neo Genesis Holo',
    'Typhlosion Neo Genesis Holo', 'Meganium Neo Genesis Holo',
    'Lugia Neo Genesis', 'Ho-Oh Neo Revelation Holo',
    'Suicune Neo Revelation Holo', 'Raikou Neo Revelation Holo',
    'Entei Neo Revelation Holo', 'Celebi Neo Revelation Holo',
    'Houndoom Neo Discovery Holo', 'Tyranitar Neo Discovery Holo',
    'Espeon Neo Discovery Holo', 'Umbreon Neo Discovery Holo',
    'Smeargle Neo Discovery Holo', 'Politoed Neo Discovery Holo'
  ];
  floorPokemon.forEach((poke, idx) => {
    const val = 38.0 + Number(((idx * 0.38) % 17.0).toFixed(2));
    cards.push({
      id: `p50-${cards.length + 1}`,
      packTierId: 'pack-50',
      cardNumber: cards.length + 1,
      name: `${poke}`,
      set: 'WOTC Vintage / Modern Scarlet & Violet',
      setNumber: `${15 + idx}/111`,
      year: 2001,
      grader: 'PSA',
      grade: idx % 2 === 0 ? '10 GEM MT' : '8 NM-MT',
      gradeNumber: idx % 2 === 0 ? 10 : 8,
      certNumber: generateCert(5100 + idx),
      marketValue: Number(val.toFixed(2)),
      rarity: 'standard',
      dropRatePercent: 1.0,
      pokemonType: (['dark', 'fire', 'water', 'grass', 'psychic', 'lightning'] as const)[idx % 6],
      holographicType: 'vintage_starlight',
      description: 'Physical vaulted raw vintage/modern card with £38.00+ guaranteed floor.',
    });
  });

  return cards.map(makeRaw);
}

export const PACK_TIERS: PackTier[] = [
  {
    id: 'pack-5',
    name: 'Starter Vault',
    tagline: 'Entry-level raw Pokémon cards with 20x Charizard VMAX chase',
    cost: 5,
    topChaseValue: 100, // 20x £5
    topChaseCardName: 'Charizard VMAX Shiny Vault (Raw NM/M)',
    topChaseCardSet: 'Shining Fates SV107',
    topChaseCardGrade: 'Raw NM/M',
    floorValue: 3.5,
    averageValue: 5.25,
    totalCards: 100,
    accentColor: 'from-red-500/20 via-orange-500/10 to-transparent',
    badgeColor: 'border-red-500/30 text-red-400',
    foilGradient: 'from-red-600 via-orange-600 to-amber-900',
    cards: buildPack5Cards(),
  },
  {
    id: 'pack-10',
    name: 'Elite Vault',
    tagline: 'Alt arts & modern secrets with 20x Rayquaza VMAX Alt Art chase',
    cost: 10,
    topChaseValue: 200, // 20x £10
    topChaseCardName: 'Rayquaza VMAX Alt Art (Raw NM/M)',
    topChaseCardSet: 'Evolving Skies #218',
    topChaseCardGrade: 'Raw NM/M',
    floorValue: 7.5,
    averageValue: 10.45,
    totalCards: 100,
    accentColor: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    badgeColor: 'border-emerald-500/30 text-emerald-400',
    foilGradient: 'from-emerald-600 via-teal-800 to-stone-900',
    cards: buildPack10Cards(),
  },
  {
    id: 'pack-25',
    name: 'Master Vault',
    tagline: 'High-tier Tag Teams & WOTC holos with 20x Mario Pikachu chase',
    cost: 25,
    topChaseValue: 500, // 20x £25
    topChaseCardName: 'Mario Pikachu Promo (Raw NM/M)',
    topChaseCardSet: 'XY Promo #294/XY-P',
    topChaseCardGrade: 'Raw NM/M',
    floorValue: 18.0,
    averageValue: 26.1,
    totalCards: 100,
    accentColor: 'from-sky-500/20 via-blue-500/10 to-transparent',
    badgeColor: 'border-sky-500/30 text-sky-400',
    foilGradient: 'from-blue-600 via-indigo-900 to-stone-900',
    cards: buildPack25Cards(),
  },
  {
    id: 'pack-50',
    name: 'Grail Vault',
    tagline: 'Crown collection & vintage grails with 20x Moonbreon raw chase',
    cost: 50,
    topChaseValue: 1000, // 20x £50
    topChaseCardName: 'Umbreon VMAX Moonbreon (Raw NM/M)',
    topChaseCardSet: 'Evolving Skies #215',
    topChaseCardGrade: 'Raw NM/M',
    floorValue: 38.0,
    averageValue: 52.8,
    totalCards: 100,
    accentColor: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    badgeColor: 'border-purple-500/30 text-purple-400',
    foilGradient: 'from-purple-600 via-fuchsia-950 to-stone-900',
    cards: buildPack50Cards(),
  },
];

// Initial mock live drops feed
export const INITIAL_DROPS = [
  {
    id: 'drop-1',
    userName: 'Kieran_UK',
    packName: 'Grail Vault (£50)',
    packCost: 50,
    cardName: 'Umbreon VMAX Moonbreon #215',
    cardSet: 'Evolving Skies',
    cardGrade: 'Raw NM/M',
    marketValue: 1000,
    instantSellValue: 900,
    isGrail: true,
    timeAgo: 'Just now',
  },
  {
    id: 'drop-2',
    userName: 'SnorlaxHODL',
    packName: 'Master Vault (£25)',
    packCost: 25,
    cardName: 'Mario Pikachu Special Box Promo',
    cardSet: 'XY Promo #294',
    cardGrade: 'Raw NM/M',
    marketValue: 500,
    instantSellValue: 450,
    isGrail: true,
    timeAgo: '2m ago',
  },
  {
    id: 'drop-3',
    userName: 'PokeVault_99',
    packName: 'Elite Vault (£10)',
    packCost: 10,
    cardName: 'Rayquaza VMAX Alt Art #218',
    cardSet: 'Evolving Skies',
    cardGrade: 'Raw NM/M',
    marketValue: 200,
    instantSellValue: 180,
    isGrail: true,
    timeAgo: '5m ago',
  },
  {
    id: 'drop-4',
    userName: 'Liam_Cardz',
    packName: 'Starter Vault (£5)',
    packCost: 5,
    cardName: 'Charizard VMAX Shiny Vault',
    cardSet: 'Shining Fates',
    cardGrade: 'Raw NM/M',
    marketValue: 100,
    instantSellValue: 90,
    isGrail: true,
    timeAgo: '9m ago',
  },
  {
    id: 'drop-5',
    userName: 'VaultMasterDave',
    packName: 'Grail Vault (£50)',
    packCost: 50,
    cardName: '1st Edition Shining Charizard',
    cardSet: 'Neo Destiny',
    cardGrade: 'Raw NM/M',
    marketValue: 850,
    instantSellValue: 765,
    isGrail: true,
    timeAgo: '14m ago',
  },
  {
    id: 'drop-6',
    userName: 'Emma_Raw',
    packName: 'Master Vault (£25)',
    packCost: 25,
    cardName: 'Lugia V Alt Art #186',
    cardSet: 'Silver Tempest',
    cardGrade: 'Raw NM/M',
    marketValue: 320,
    instantSellValue: 288,
    isGrail: false,
    timeAgo: '19m ago',
  },
];
