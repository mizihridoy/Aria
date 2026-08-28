-- Add TH15 Air Meta Strategies
INSERT INTO clash_strategies (town_hall, name, archetype, army_composition, hero_equipment, execution_guide, strengths, weaknesses)
VALUES
(
  15, 'TH15 Hydra (Dragon + Dragon Rider)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "1 Baby Dragon", "2 Headhunters", "3 Minions"], "spells": ["3 Rage", "4 Freeze", "1 Poison", "1 Recall"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Rocket Spear"}'::jsonb,
  '1. HERO FUNNEL: Deploy King with Spiky Ball and Queen on one side to cut the outer perimeter.\n2. MAIN AIR SURGE: Spread Dragons and Dragon Riders in a line with Grand Warden behind them.\n3. BLIMP DROP: Fly Battle Blimp through Warden Eternal Tome directly onto Town Hall 15.\n4. SPELLS: Freeze Monolith, Spell Towers, and Sweepers while raging Dragons through the core.\n5. RC FLANK: Send Royal Champion with Electro Boots to stun and finish backend defenses.',
  ARRAY['Overwhelming aerial DPS', 'Crushes Box and Ring bases', 'Very reliable 3-star meta on TH15'],
  ARRAY['Air Sweepers pushing into Monolith if Freezes are missed']
),
(
  15, 'TH15 Fireball Rocket Loon', 'Air',
  '{"troops": ["24 Rocket Balloons", "5 Dragon Riders", "4 Healers", "4 Super Wall Breakers", "6 Minions", "2 Headhunters"], "spells": ["4 Invisibility", "2 Earthquake", "1 Rage", "2 Freeze", "1 Poison"], "siege": "Battle Blimp", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Spiky Ball + Giant Gauntlet", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Fireball + Rage Gem", "RC": "Rocket Spear + Seeking Shield"}'::jsonb,
  '1. WARDEN FIREBALL: Warden Walk with 4 Healers. Direct Warden with Invisibility + Earthquake to 1-shot the Monolith or Spell Tower compartment.\n2. FLANK FUNNEL: King and Queen clean the outer side boundary.\n3. AIR SURGE: Surgical Rocket Balloons behind Dragon Riders pathing along defenses.\n4. RC SNIPER: Royal Champion with Rocket Spear picks off backend defenses safely.',
  ARRAY['Deletes dense core compartments instantly', 'Overwhelms defenses with fast Rocket Loons'],
  ARRAY['High skill ceiling requiring accurate Fireball targeting']
);
