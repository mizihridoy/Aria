-- ====================================================================
-- Migration: 00006_clash_strategy_system.sql
-- Description: Dynamic Clash of Clans Strategies, Hero Equipment, and Town Hall Guides
-- ====================================================================

-- 1. Clash Strategies Table
CREATE TABLE IF NOT EXISTS clash_strategies (
  id SERIAL PRIMARY KEY,
  town_hall INT NOT NULL,
  name TEXT NOT NULL,
  archetype TEXT NOT NULL, -- 'Air', 'Smash', 'Lalo', 'QC', 'Blimp', 'Spam'
  army_composition JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_equipment JSONB NOT NULL DEFAULT '{}'::jsonb,
  execution_guide TEXT NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clash_strategies_th ON clash_strategies(town_hall);
CREATE INDEX IF NOT EXISTS idx_clash_strategies_archetype ON clash_strategies(archetype);

-- 2. Hero Equipment Table
CREATE TABLE IF NOT EXISTS hero_equipment (
  id SERIAL PRIMARY KEY,
  hero TEXT NOT NULL, -- 'Barbarian King', 'Archer Queen', 'Grand Warden', 'Royal Champion', 'Minion Prince'
  name TEXT NOT NULL UNIQUE,
  rarity TEXT NOT NULL, -- 'Common', 'Epic'
  synergy_pairs JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_armies TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  best_playstyles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_equipment_hero ON hero_equipment(hero);

-- 3. Town Hall Guides Table
CREATE TABLE IF NOT EXISTS town_hall_guides (
  town_hall INT PRIMARY KEY,
  theme TEXT NOT NULL,
  key_defenses TEXT[] DEFAULT '{}',
  offense_upgrade_priority TEXT[] DEFAULT '{}',
  defense_upgrade_priority TEXT[] DEFAULT '{}',
  hero_priorities TEXT[] DEFAULT '{}',
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- SEED DATA: Hero Equipment
-- ====================================================================

INSERT INTO hero_equipment (hero, name, rarity, synergy_pairs, recommended_armies, description, best_playstyles)
VALUES
-- Barbarian King
(
  'Barbarian King', 'Giant Gauntlet', 'Epic',
  '[{"pair": "Spiky Ball", "rating": "S+", "notes": "Unmatched area destruction and survivability"}, {"pair": "Rage Vial", "rating": "S", "notes": "Massive burst DPS when enlarged and raging"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Hydra', 'Zap Titans', 'Super Barch', 'Lalo'],
  'Turns the King into an invincible giant, dealing massive area-of-effect splash damage with immense damage reduction.',
  ARRAY['Smash', 'Dive', 'Funneling', 'Core Destruction']
),
(
  'Barbarian King', 'Spiky Ball', 'Epic',
  '[{"pair": "Giant Gauntlet", "rating": "S+", "notes": "Cleans an entire flank and turns King into a solo dive machine"}, {"pair": "Vampstache", "rating": "A+", "notes": "Continuous healing with deep multi-target bouncing damage"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Root Riders', 'Hydra', 'Super Dragons'],
  'Hurls a spiked iron ball that ricochets across up to 8 defensive buildings, dealing devastating ranged damage.',
  ARRAY['Funneling', 'Flank Clearing', 'Sniper Dive']
),
(
  'Barbarian King', 'Rage Vial', 'Common',
  '[{"pair": "Giant Gauntlet", "rating": "S", "notes": "Explosive rage DPS while giant"}, {"pair": "Spiky Ball", "rating": "A", "notes": "Quick burst damage upon ability activation"}]'::jsonb,
  ARRAY['All Armies'],
  'Classic ability that grants speed, damage boost, and instant HP recovery upon activation.',
  ARRAY['Smash', 'Core Push']
),
(
  'Barbarian King', 'Vampstache', 'Common',
  '[{"pair": "Giant Gauntlet", "rating": "A+", "notes": "King sustains through endless defenses"}, {"pair": "Spiky Ball", "rating": "A", "notes": "Excellent outside flank sustain"}]'::jsonb,
  ARRAY['Smash attacks', 'Zap Titan', 'Root Rider'],
  'Passive life-steal on every regular attack, keeping the King alive for long-lasting tanking.',
  ARRAY['Flank Walking', 'Sustained Tanking']
),

-- Archer Queen
(
  'Archer Queen', 'Magic Mirror', 'Epic',
  '[{"pair": "Frozen Arrow", "rating": "S+", "notes": "Clones inherit slow effect and shred enemy heroes/defenses"}, {"pair": "Invisibility Vial", "rating": "S", "notes": "Extreme burst DPS while protected"}]'::jsonb,
  ARRAY['Queen Charge Lalo', 'Hydra', 'Root Rider Smash', 'Fireball Rocket Loon'],
  'Spawns powerful Archer Queen clones that fight alongside her, multiplying DPS and shredding targets.',
  ARRAY['Queen Charge', 'Core Dive', 'Hero Sniping']
),
(
  'Archer Queen', 'Frozen Arrow', 'Epic',
  '[{"pair": "Magic Mirror", "rating": "S+", "notes": "Double/Triple slow effect across multiple high-threat defenses"}, {"pair": "Healer Puppet", "rating": "S", "notes": "Infinite Queen Charge sustain"}]'::jsonb,
  ARRAY['Queen Charge Lalo', 'Zap Titans', 'Super Barch', 'Hydra'],
  'Slows down targeted defenses and enemy heroes by up to 75%, neutralizing Single Infernos and Monoliths.',
  ARRAY['Queen Charge', 'Defense Neutralization', 'Hero Duels']
),
(
  'Archer Queen', 'Invisibility Vial', 'Common',
  '[{"pair": "Magic Mirror", "rating": "S", "notes": "Clones distract while Queen remains invisible"}, {"pair": "Giant Arrow", "rating": "A", "notes": "Snipe key defenses then burst town hall"}]'::jsonb,
  ARRAY['All Armies'],
  'Grants temporary invisibility and massive burst damage to escape fatal focus fire.',
  ARRAY['Clutch Finishes', 'Core Recovery']
),
(
  'Archer Queen', 'Healer Puppet', 'Common',
  '[{"pair": "Frozen Arrow", "rating": "S", "notes": "Instantly provides backup healers during tight QC entries"}, {"pair": "Magic Mirror", "rating": "A+", "notes": "Healers support main Queen and clones"}]'::jsonb,
  ARRAY['Queen Charge', 'Root Rider Smash'],
  'Instantly spawns high-level Healers upon ability activation to restore the Queen to full health.',
  ARRAY['Queen Charge', 'Smash Support']
),

-- Grand Warden
(
  'Grand Warden', 'Fireball', 'Epic',
  '[{"pair": "Rage Gem", "rating": "S+", "notes": "Maximizes the massive area blast to 1-shot entire base compartments"}, {"pair": "Healing Tome", "rating": "S", "notes": "Follows up destructive blast with total army sustain"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Fireball Hydra', 'Super Barch', 'Fireball Root Rider'],
  'Shoots a colossal explosive fireball across the base, dealing immense splash damage capable of wiping out Town Halls, Monoliths, and Spell Towers simultaneously.',
  ARRAY['Warden Walk', 'Compartment Wipe', 'Direct TH Snipe']
),
(
  'Grand Warden', 'Eternal Tome', 'Common',
  '[{"pair": "Healing Tome", "rating": "S+", "notes": "Invulnerability followed by massive HP regeneration for entire army"}, {"pair": "Rage Gem", "rating": "S", "notes": "Immortal push through high DPS areas"}]'::jsonb,
  ARRAY['Hydra', 'Root Rider Smash', 'Lalo', 'Zap Titans'],
  'The quintessential Warden ability making all nearby friendly units completely invulnerable to all damage.',
  ARRAY['Core Push', 'Town Hall Bomb Protection']
),
(
  'Grand Warden', 'Healing Tome', 'Common',
  '[{"pair": "Eternal Tome", "rating": "S+", "notes": "Absolute gold standard combo for smash & air pushes"}, {"pair": "Fireball", "rating": "S", "notes": "Restores troops during cleanup"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Hydra', 'Zap Titans', 'Super Witches'],
  'Emits continuous, high-potency healing aura over friendly troops inside the Warden aura for several seconds.',
  ARRAY['Smash Attacks', 'Poison Recovery']
),
(
  'Grand Warden', 'Rage Gem', 'Common',
  '[{"pair": "Fireball", "rating": "S+", "notes": "Amplifies Fireball impact and surrounding troop speed"}, {"pair": "Eternal Tome", "rating": "S", "notes": "Blasts through core under invulnerability"}]'::jsonb,
  ARRAY['Hydra', 'Super Dragons', 'Root Riders'],
  'Provides a permanent Rage effect to all friendly units within the Grand Warden aura.',
  ARRAY['Air Attacks', 'Fast Smash']
),

-- Royal Champion
(
  'Royal Champion', 'Rocket Spear', 'Epic',
  '[{"pair": "Seeking Shield", "rating": "S+", "notes": "Long-range defense sniping followed by 4-target shield bounce"}, {"pair": "Haste Vial", "rating": "S", "notes": "Ultra-fast long-range defensive obliteration"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Hydra', 'Root Rider Smash', 'Queen Charge'],
  'Empowers the Royal Champion with extended range and explosive spear strikes to take down deep defenses without taking return fire.',
  ARRAY['Sniper Dive', 'Back-end Cleanup', 'Monolith Removal']
),
(
  'Royal Champion', 'Haste Vial', 'Common',
  '[{"pair": "Seeking Shield", "rating": "S+", "notes": "Classic elite meta combo for instant back-end defense clearing"}, {"pair": "Rocket Spear", "rating": "S", "notes": "Hyper speed projectile devastation"}]'::jsonb,
  ARRAY['All Meta Armies'],
  'Grants explosive movement speed and attack speed, allowing the Champion to rapidly dismantle defenses.',
  ARRAY['Back-end Clearing', 'Hero Sniping']
),
(
  'Royal Champion', 'Seeking Shield', 'Common',
  '[{"pair": "Haste Vial", "rating": "S+", "notes": "Rapid cleanup and instant defense removal"}, {"pair": "Rocket Spear", "rating": "S", "notes": "Destroys high-threat defense clusters"}]'::jsonb,
  ARRAY['All Meta Armies'],
  'Hurls a mystical shield that bounces between 4 defenses dealing heavy burst damage regardless of distance.',
  ARRAY['General Defense Clearing']
)
ON CONFLICT (name) DO UPDATE SET
  hero = EXCLUDED.hero,
  rarity = EXCLUDED.rarity,
  synergy_pairs = EXCLUDED.synergy_pairs,
  recommended_armies = EXCLUDED.recommended_armies,
  description = EXCLUDED.description,
  best_playstyles = EXCLUDED.best_playstyles;

-- ====================================================================
-- SEED DATA: Clash Strategies (TH12 - TH17)
-- ====================================================================

INSERT INTO clash_strategies (town_hall, name, archetype, army_composition, hero_equipment, execution_guide, strengths, weaknesses)
VALUES
-- TH17
(
  17, 'Root Rider Valkyrie Smash', 'Smash',
  '{"troops": ["6 Root Riders", "8 Valkyries", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "5 Wizards", "2 Headhunters"], "spells": ["2 Rage", "2 Freeze", "1 Jump", "1 Poison", "2 Overgrowth"], "siege": "Siege Barracks or Battle Drill", "cc": ["Super Miners or Hog Riders", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Rocket Spear + Haste Vial"}'::jsonb,
  '1. FUNNEL: King and Siege Barracks on one flank, Queen and Healers on the other flank to establish a clean funnel.\n2. MAIN PUSH: Deploy Root Riders, Valkyries, and Grand Warden straight down the middle.\n3. SPELLS: Drop Overgrowth on the backside defenses (e.g. Monolith/Spell Towers) to focus all damage forward.\n4. ABILITY: Pop Warden Eternal Tome + Healing Tome as troops enter the Town Hall 17 core.\n5. CLEANUP: Royal Champion enters from the flank with Rocket Spear to clean remaining defenses.',
  ARRAY['Extremely consistent 3-star meta', 'High HP and massive wall destruction', 'Safe Town Hall takedown'],
  ARRAY['Poison Towers and heavy splash if Overgrowth timing is missed']
),
(
  17, 'Fireball Rocket Loon', 'Air',
  '{"troops": ["26 Rocket Balloons", "6 Dragon Riders", "4 Super Wall Breakers", "4 Healers (for Warden Walk)", "6 Minions", "2 Headhunters"], "spells": ["4 Invisibility", "2 Earthquake", "1 Rage", "2 Freeze", "1 Poison"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Spiky Ball + Giant Gauntlet", "AQ": "Magic Mirror + Invisibility Vial", "GW": "Fireball + Rage Gem", "RC": "Rocket Spear + Seeking Shield"}'::jsonb,
  '1. WARDEN WALK & FIREBALL: Start Warden Walk with 4 Healers. Use Invisibility and Earthquake to direct Warden to fire the Fireball into the densest defensive cluster (Monolith + Spell Towers + Ricochet Cannons) to 1-shot the entire compartment.\n2. FLANK FUNNEL: Deploy King with Spiky Ball to create the opposite side boundary.\n3. AIR SURGE: Deploy Rocket Balloons surgically behind Dragon Riders targeting outer defenses.\n4. RC DIVE: Use Royal Champion with Rocket Spear to snipe backside defenses from long range.',
  ARRAY['Deletes 25-30% of the base instantly with Fireball', 'Overwhelms defenses with Rocket Balloon speed', 'Counters anti-2 and box bases'],
  ARRAY['High skill ceiling requiring precise Fireball targeting and Invisibility spell placement']
),

-- TH16
(
  16, 'Hydra (Dragon + Dragon Rider)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "1 Baby Dragon", "2 Headhunters", "3 Minions"], "spells": ["3 Rage", "4 Freeze", "1 Poison", "1 Recall or Skeleton"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers or Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Magic Mirror", "GW": "Eternal Tome + Healing Tome", "RC": "Haste Vial + Seeking Shield"}'::jsonb,
  '1. HERO FUNNEL: Deploy King and Queen on one side of the base to carve out a wide path and pull CC.\n2. MAIN AIR ENTRY: Spread Dragons in a straight line with Dragon Riders behind them, supported by Grand Warden.\n3. BLIMP DROP: Send Battle Blimp through Warden invulnerability to drop directly on the Town Hall 16.\n4. SPELLS: Freeze Air Defenses, Sweepers, and the Monolith while raging Dragons through the core.\n5. RC FLANK: Send Royal Champion on the backside to assist Dragon Riders.',
  ARRAY['Overwhelming aerial DPS', 'Forgiving pathing', 'Great against Ring bases and Box layouts'],
  ARRAY['Air Sweepers and Single Target Infernos if Freezes are mistimed']
),
(
  16, 'Zap Titan Smash', 'Smash',
  '{"troops": ["4 Electro Titans", "2 Ice Golems", "4 Healers", "4 Super Wall Breakers", "1 Baby Dragon", "4 Wizards"], "spells": ["4 Lightning", "1 Earthquake", "2 Rage", "2 Freeze", "1 Poison"], "siege": "Log Launcher or Flame Flinger", "cc": ["Yetis + Super Goblins", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Vampstache", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Rocket Spear + Haste Vial"}'::jsonb,
  '1. ZAP QUAKE: Use 4 Lightning + 1 Earthquake to eliminate Monolith or high-value Spell Tower.\n2. FUNNEL: King and Baby Dragon clear one side; Queen with Healers walk on the other side.\n3. MAIN SMASH: Send Electro Titans, Ice Golems, and Log Launcher directly into the core.\n4. AURA DAMAGE: Electro Titan auras melt all skeleton traps, CC troops, and dense defense clusters.\n5. WARDEN TOME: Protect units as they secure the Town Hall 16 explosion.',
  ARRAY['Completely ignores enemy Clan Castle troops and Skeleton Traps', 'High survivability', 'Reliable 3-star strategy'],
  ARRAY['Can struggle on ultra-open spread bases with wide defense spacing']
),

-- TH15
(
  15, 'Queen Charge Lalo', 'Lalo',
  '{"troops": ["5 Healers", "26 Balloons", "3 Lava Hounds", "4 Super Wall Breakers", "5 Minions", "3 Headhunters", "2 Baby Dragons"], "spells": ["3 Rage", "4 Invisibility", "3 Freeze", "1 Poison", "2 Haste"], "siege": "Flame Flinger or Battle Blimp", "cc": ["Super Minions or Yetis", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Healing Tome", "RC": "Haste Vial + Seeking Shield"}'::jsonb,
  '1. QUEEN CHARGE: Start Queen Charge with 5 Healers to secure the Town Hall 15, Monolith, and Enemy Heroes. Use Rage and Invisibility to keep Queen alive.\n2. KING FUNNEL: King with Giant Gauntlet clears the opposite perimeter to narrow down base width.\n3. LALO DEPLOYMENT: Deploy Lava Hounds followed by groups of 3-4 Balloons per defense moving in a clockwise or counter-clockwise path.\n4. SPELLS: Haste Balloons to key defenses; Warden Eternal Tome over Eagle Artillery / Spell Towers.\n5. CLEANUP: Royal Champion and Minions finish outer buildings.',
  ARRAY['Highest tactical ceiling in Clash of Clans', 'Adaptable to almost any base layout', 'Demolishes tight compartments'],
  ARRAY['Extremely time-sensitive', 'Queen dying early ruins the entire attack']
),
(
  15, 'Super Barch (Super Barbarian + Super Archer)', 'Spam',
  '{"troops": ["38 Super Barbarians", "14 Super Archers", "2 Ice Golems", "3 Super Wall Breakers", "2 Headhunters", "4 Minions"], "spells": ["3 Invisibility", "2 Clone", "1 Rage", "1 Jump", "1 Poison"], "siege": "Battle Blimp", "cc": ["4 Super Archers", "2 Clone", "1 Invisibility"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Haste Vial + Seeking Shield"}'::jsonb,
  '1. BLIMP DROP (SUPER ARCHER): Send Battle Blimp to core protected by Warden Eternal Tome. Clone + Invisibility the Super Archers to wipe out 40% of the core (Town Hall 15, Monolith, Eagle).\n2. HERO SWEEP: Deploy King and Queen on outer flanks to guide remainder of the base.\n3. SUPER BARCH SURGE: Deploy waves of Super Barbarians along the outside edge to clean buildings while Super Archers pick off remaining defenses.',
  ARRAY['Insane core destruction in the first 30 seconds', 'Easy cleanup with fast Super Barbarians', 'Counters compact bases'],
  ARRAY['Bait traps (Giant Bombs / Tornado trap) catching the Blimp']
),

-- TH14
(
  14, 'Queen Charge Hybrid (Miner + Hog Rider)', 'Smash',
  '{"troops": ["5 Healers", "14 Miners", "12 Hog Riders", "3 Super Wall Breakers", "2 Baby Dragons", "5 Wizards", "2 Headhunters"], "spells": ["3 Heal", "2 Rage", "2 Freeze", "1 Poison"], "siege": "Siege Barracks", "cc": ["Hog Riders", "1 Rage", "1 Poison"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Healer Puppet", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Royal Gem"}'::jsonb,
  '1. QUEEN CHARGE: Charge the Queen to eliminate Town Hall 14 (giga poison) and enemy Clan Castle.\n2. SIEGE BARRACKS & KING: Deploy on the outer corner to cut the base in half.\n3. HYBRID SURGE: Deploy Miners first, followed by Hog Riders and Grand Warden down the remaining channel.\n4. SPELLS: Drop Heal spells over Giant Bomb spots and Scattershots. Pop Warden Tome as Hybrid engages heavy defense areas.',
  ARRAY['Fast, surgical defense clearing', 'Healers can switch to Hybrid troops', 'Excellent against TH14 box layouts'],
  ARRAY['Scattershots and TH14 Giga Poison if Heal spells are delayed']
),

-- TH13
(
  13, 'Zap Dragons & Dragon Riders', 'Air',
  '{"troops": ["10 Dragons", "4 Dragon Riders", "6 Balloons", "2 Baby Dragons", "4 Minions"], "spells": ["6 Lightning", "1 Earthquake", "1 Rage", "3 Freeze", "1 Poison"], "siege": "Stone Slammer or Blimp", "cc": ["Balloons or Dragon", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Haste Vial"}'::jsonb,
  '1. ZAP QUAKE: Take out 2 Air Defenses and adjacent Scattershots/Infernos with Lightning + Earthquake.\n2. HERO FLANK: Heroes take out a 3rd Air Defense and funnel.\n3. DRAGON WAVE: Deploy remaining Dragons and Dragon Riders straight through the remaining base section.\n4. WARDEN TOME: Protect against Town Hall 13 Giga Inferno and Scattershots.',
  ARRAY['Simple execution with overwhelming air power', 'Crushes TH13 war bases', 'Low spell dependency in live push'],
  ARRAY['Single target Infernos if Freeze spells are exhausted']
),

-- TH12
(
  12, 'Zap Witch / Golem Witch Smash', 'Smash',
  '{"troops": ["3 Golems", "14 Witches", "2 Super Wall Breakers", "4 Wizards", "2 Archers"], "spells": ["8 Lightning", "2 Earthquake", "1 Rage", "1 Poison"], "siege": "Log Launcher or Wall Wrecker", "cc": ["Yetis or Bowlers", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Rage Gem"}'::jsonb,
  '1. ZAP QUAKE: Destroy both Multi-Inferno Towers using 4 Lightning + 1 Earthquake each.\n2. SPREAD: Deploy 3 Golems across the entry side with Witches spread evenly in a wide line.\n3. CORE RUSH: Send Log Launcher, Heroes, and Grand Warden through the center to crush Town Hall 12 and Eagle Artillery.',
  ARRAY['Undefeatable against multi-inferno TH12 bases', 'Huge skeleton distraction wave', 'Extremely beginner friendly'],
  ARRAY['Bases with 3 Single Target Infernos']
);

-- ====================================================================
-- SEED DATA: Town Hall Guides (TH12 - TH17)
-- ====================================================================

INSERT INTO town_hall_guides (town_hall, theme, key_defenses, offense_upgrade_priority, defense_upgrade_priority, hero_priorities, notes)
VALUES
(
  17, 'Ancient Aztec & Cosmic Energy',
  ARRAY['Town Hall 17 Giga Weapon', 'Monolith', 'Spell Towers', 'Ricochet Cannons', 'Multi-Archer Towers', 'Eagle Artillery'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Blacksmith', 'Pet House Level 10', 'Siege Workshop'],
  ARRAY['Town Hall Weapon', 'Monolith', 'Spell Towers', 'Merged Defenses (Ricochet Cannons & Multi-Archers)', 'Scattershots', 'Inferno Towers'],
  ARRAY['Grand Warden (Level 75)', 'Royal Champion (Level 50)', 'Archer Queen (Level 100)', 'Barbarian King (Level 100)', 'Minion Prince'],
  'Town Hall 17 introduces massive defense merges and explosive Giga weapons. Focus on offensive army camp capacity and high-level Epic Hero Equipments (Giant Gauntlet, Fireball, Magic Mirror, Rocket Spear).'
),
(
  16, 'Nature & Tree of Life (Merged Defenses)',
  ARRAY['Town Hall 16 Giga Inferno', 'Merged Ricochet Cannons', 'Merged Multi-Archer Towers', 'Monolith', 'Spell Towers', 'Scattershots'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Blacksmith (Max Equipments)', 'Pet House (Spirit Fox)', 'Spell Factory'],
  ARRAY['Merged Ricochet Cannons', 'Merged Multi-Archer Towers', 'Monolith', 'Spell Towers', 'Scattershots', 'Giga Inferno'],
  ARRAY['Grand Warden (Level 70)', 'Royal Champion (Level 45)', 'Archer Queen (Level 95)', 'Barbarian King (Level 95)'],
  'Spirit Fox pet unlocks at TH16 and is mandatory on Royal Champion. Upgrade Blacksmith immediately to unlock Magic Mirror and Spiky Ball potential.'
),
(
  15, 'Magic & Arcane (Color: Deep Purple)',
  ARRAY['Monolith (Heavy Anti-Tank)', 'Spell Towers (Invisibility/Poison/Rage)', 'Giga Inferno (Death Poison)', 'Scattershots', 'Eagle Artillery'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Pet House (Diggy & Frosty)', 'Blacksmith (Giant Gauntlet & Fireball)'],
  ARRAY['Monolith', 'Spell Towers', 'Scattershots', 'Giga Inferno', 'Eagle Artillery', 'Inferno Towers'],
  ARRAY['Grand Warden (Level 65)', 'Archer Queen (Level 90)', 'Royal Champion (Level 40)', 'Barbarian King (Level 90)'],
  'The most defensive jump in the game. Monolith and Poison Spell Towers require precise Freeze, Overgrowth, or Fireball counter-play.'
),
(
  14, 'Jungle & Aztec (Color: Green & Gold)',
  ARRAY['Giga Inferno (Heavy Giga Poison on destruction)', 'Scattershots', 'Eagle Artillery', 'Inferno Towers', 'Air Defenses'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Pet House (Unicorn)', 'Hero Equipment Blacksmith'],
  ARRAY['Town Hall Giga Inferno', 'Scattershots', 'Eagle Artillery', 'Inferno Towers', 'Air Defenses'],
  ARRAY['Archer Queen (Level 80 + Unicorn)', 'Grand Warden (Level 55)', 'Royal Champion (Level 30)', 'Barbarian King (Level 80)'],
  'Unicorn pet on Queen enables unstoppable Queen Charges. Watch out for the deadly TH14 Giga Poison death bomb on smash armies.'
),
(
  13, 'Ice & Winter (Color: Dark Blue)',
  ARRAY['Giga Inferno (Slows and freezes troops)', 'Scattershots (Devastating splash)', 'Eagle Artillery', 'Inferno Towers'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Hero Altar (Royal Champion Unlock)', 'Blacksmith'],
  ARRAY['Scattershots', 'Giga Inferno', 'Eagle Artillery', 'Inferno Towers', 'Air Defenses'],
  ARRAY['Royal Champion (Level 1-25 Unlock)', 'Grand Warden (Level 50)', 'Archer Queen (Level 75)', 'Barbarian King (Level 75)'],
  'Unlocks the Royal Champion! Scattershots will decimate grouped troops (Balloons, Miners, Witches) if not frozen or distracted.'
),
(
  12, 'Electric & Blue (Color: Bright Blue)',
  ARRAY['Town Hall 12 Giga Tesla (Weaponized TH + Death Bomb)', 'Eagle Artillery', 'Inferno Towers (Multi/Single)', 'Air Defenses'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Siege Workshop (Unlock Siege Machines)', 'Blacksmith'],
  ARRAY['Giga Tesla (Stars 1-5)', 'Eagle Artillery', 'Inferno Towers', 'Air Defenses', 'Wizard Towers'],
  ARRAY['Grand Warden (Level 40)', 'Archer Queen (Level 65)', 'Barbarian King (Level 65)'],
  'First weaponized Town Hall. Use Grand Warden Eternal Tome to protect your army from the massive Giga Tesla death explosion.'
)
ON CONFLICT (town_hall) DO UPDATE SET
  theme = EXCLUDED.theme,
  key_defenses = EXCLUDED.key_defenses,
  offense_upgrade_priority = EXCLUDED.offense_upgrade_priority,
  defense_upgrade_priority = EXCLUDED.defense_upgrade_priority,
  hero_priorities = EXCLUDED.hero_priorities,
  notes = EXCLUDED.notes;
