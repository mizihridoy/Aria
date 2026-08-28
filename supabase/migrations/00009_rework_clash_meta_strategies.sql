-- ====================================================================
-- Migration: 00009_rework_clash_meta_strategies.sql
-- Description: Complete rework and modernization of Clash of Clans meta strategies (TH12 to TH18)
-- ====================================================================

DELETE FROM clash_strategies;

INSERT INTO clash_strategies (town_hall, name, archetype, army_composition, hero_equipment, execution_guide, strengths, weaknesses)
VALUES
-- ==================== TH18 STRATEGIES ====================
(
  18, 'TH18 Air Obliteration (Hydra + Dragon Duke Surge)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "2 Headhunters", "4 Minions", "1 Baby Dragon"], "spells": ["3 Rage", "4 Freeze", "1 Overgrowth", "1 Poison"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Rocket Spear", "Duke": "Fire Heart + Flame Blower"}'::jsonb,
  '1. FLANK FUNNEL: King with Spiky Ball clears one outer flank; Queen with Magic Mirror cuts the opposite side.\n2. MAIN AIR FLEET: Deploy Dragons and Dragon Riders in a tight wave followed by Grand Warden and Dragon Duke.\n3. DRAGON DUKE SURGE: Activate Dragon Duke Flame Blower to melt the outer defensive quadrant while Fire Heart burns surrounding structures.\n4. WARDEN TOME: Pop Eternal Tome + Healing Tome as the fleet enters the Town Hall 18 Cosmic Giga Star range.\n5. BACKEND RC: Royal Champion with Electro Boots & Rocket Spear snipes the remaining Monolith and defenses from safe range.',
  ARRAY['Absolute peak 2026 air meta', 'Dragon Duke flame cone incinerates merged defenses', 'Overgrowth controls backside quad spell towers'],
  ARRAY['Air Sweepers pushing into Monolith 2.0 if Freezes are mistimed']
),
(
  18, 'TH18 Root Rider & Minion Prince Smash', 'Smash',
  '{"troops": ["6 Root Riders", "6 Valkyries", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "4 Wizards", "2 Headhunters"], "spells": ["2 Rage", "2 Overgrowth", "2 Freeze", "1 Jump", "1 Poison"], "siege": "Siege Barracks or Battle Drill", "cc": ["Super Miners or Hog Riders", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Snake Bracelet", "AQ": "Action Figure + Frozen Arrow", "GW": "Eternal Tome + Heroic Torch", "RC": "Electro Boots + Haste Vial", "Prince": "Meteor Staff + Dark Crown"}'::jsonb,
  '1. FUNNEL: King and Siege Barracks establish flank boundaries. Queen deploys Action Figure decoy to absorb Monolith fire.\n2. SMASH ENTRY: Root Riders, Valkyries, and Grand Warden enter through the center with Minion Prince.\n3. METEOR STRIKE: Activate Minion Prince Meteor Staff under Dark Crown aura to obliterate the core compartment.\n4. HEROIC TORCH: Warden Heroic Torch allows troops to jump over all remaining walls while invincible under Eternal Tome.\n5. RC CLEANUP: Royal Champion with Electro Boots chains lightning through all remaining backend defenses.',
  ARRAY['Near unstoppable ground smash meta', 'Minion Prince meteors delete high-density compartments', 'Action Figure neutralizes single-target defense focus'],
  ARRAY['Requires precise Overgrowth timing on backside merged defenses']
),
(
  18, 'TH18 Fireball Meteor Quad-Hero Dive', 'Air',
  '{"troops": ["24 Rocket Balloons", "6 Dragon Riders", "4 Healers", "4 Super Wall Breakers", "6 Minions", "2 Headhunters"], "spells": ["4 Invisibility", "2 Earthquake", "1 Rage", "2 Freeze", "1 Poison"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Stick Horse + Spiky Ball", "AQ": "Monolith Arrow + Magic Mirror", "GW": "Fireball + Rage Gem", "RC": "Rocket Spear + Frost Flake", "Duke": "Stun Blaster + Electro Fangs"}'::jsonb,
  '1. FIREBALL OPENER: Warden Walk with 4 Healers. Use Invisibility + Earthquake to trigger Grand Warden Fireball, 1-shotting the Town Hall 18 or Monolith 2.0 core.\n2. MONOLITH ARROW: Queen fires Monolith Arrow across the remaining heavy defenses to chunk 40% of their max HP.\n3. DUKE DIVE: Dragon Duke enters with Stun Blaster to reset single infernos and chain-lightning defenses.\n4. ROCKET BALLOON SURGE: Surgical deployment of Rocket Balloons in groups of 3-4 behind Dragon Riders.\n5. RC SNIPER: Royal Champion with Rocket Spear & Frost Flake freezes and finishes the remaining perimeter.',
  ARRAY['Highest theoretical ceiling in Clash of Clans history', 'Wipes out over 40% of TH18 base before main troops deploy', 'Counters tight war bases'],
  ARRAY['Extremely high skill ceiling requiring pixel-perfect Warden Walk and Invisibility placement']
),

-- ==================== TH17 STRATEGIES ====================
(
  17, 'TH17 Root Rider Valkyrie Smash', 'Smash',
  '{"troops": ["6 Root Riders", "8 Valkyries", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "5 Wizards", "2 Headhunters"], "spells": ["2 Rage", "2 Freeze", "1 Jump", "1 Poison", "2 Overgrowth"], "siege": "Siege Barracks or Battle Drill", "cc": ["Super Miners or Hog Riders", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Rocket Spear"}'::jsonb,
  '1. FUNNEL: King and Siege Barracks on one flank, Queen and Healers on the other flank to establish a clean funnel.\n2. MAIN PUSH: Deploy Root Riders, Valkyries, and Grand Warden straight down the middle.\n3. SPELLS: Drop Overgrowth on the backside defenses (e.g. Monolith/Spell Towers) to focus all damage forward.\n4. ABILITY: Pop Warden Eternal Tome + Healing Tome as troops enter the Town Hall 17 core.\n5. CLEANUP: Royal Champion enters from the flank with Electro Boots to clean remaining defenses.',
  ARRAY['Extremely consistent 3-star meta', 'High HP and massive wall destruction', 'Safe Town Hall takedown'],
  ARRAY['Poison Towers and heavy splash if Overgrowth timing is missed']
),
(
  17, 'TH17 Fireball Rocket Loon', 'Air',
  '{"troops": ["26 Rocket Balloons", "6 Dragon Riders", "4 Super Wall Breakers", "4 Healers (for Warden Walk)", "6 Minions", "2 Headhunters"], "spells": ["4 Invisibility", "2 Earthquake", "1 Rage", "2 Freeze", "1 Poison"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Spiky Ball + Giant Gauntlet", "AQ": "Magic Mirror + Invisibility Vial", "GW": "Fireball + Rage Gem", "RC": "Rocket Spear + Seeking Shield"}'::jsonb,
  '1. WARDEN WALK & FIREBALL: Start Warden Walk with 4 Healers. Use Invisibility and Earthquake to direct Warden to fire the Fireball into the densest defensive cluster (Monolith + Spell Towers + Ricochet Cannons) to 1-shot the entire compartment.\n2. FLANK FUNNEL: Deploy King with Spiky Ball to create the opposite side boundary.\n3. AIR SURGE: Deploy Rocket Balloons surgically behind Dragon Riders targeting outer defenses.\n4. RC DIVE: Use Royal Champion with Rocket Spear to snipe backside defenses from long range.',
  ARRAY['Deletes 25-30% of the base instantly with Fireball', 'Overwhelms defenses with Rocket Balloon speed', 'Counters anti-2 and box bases'],
  ARRAY['High skill ceiling requiring precise Fireball targeting and Invisibility spell placement']
),
(
  17, 'TH17 Hydra Air Surge (Dragons + Dragon Riders)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "1 Baby Dragon", "2 Headhunters", "4 Minions"], "spells": ["3 Rage", "4 Freeze", "1 Poison", "1 Overgrowth"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers or Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Rocket Spear"}'::jsonb,
  '1. FLANK CUT: King with Spiky Ball clears one flank, Queen with Magic Mirror clears the other.\n2. AIR MAIN BODY: Line deployment of Dragons and Dragon Riders backed by Grand Warden.\n3. BLIMP DROP: Blimp drops Super Archers over the Town Hall 17.\n4. OVERGROWTH & SPELLS: Overgrowth the Monolith and backside Spell Towers while raging Dragons through the core.\n5. CLEANUP: Royal Champion with Electro Boots stuns remaining point defenses.',
  ARRAY['Very forgiving and resilient air push', 'High HP and massive splash coverage'],
  ARRAY['Air Sweepers and Single Target Infernos']
),

-- ==================== TH16 STRATEGIES ====================
(
  16, 'TH16 Hydra (Dragon + Dragon Rider)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "1 Baby Dragon", "2 Headhunters", "3 Minions"], "spells": ["3 Rage", "4 Freeze", "1 Poison", "1 Recall or Skeleton"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers or Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Magic Mirror", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Seeking Shield"}'::jsonb,
  '1. HERO FUNNEL: Deploy King and Queen on one side of the base to carve out a wide path and pull CC.\n2. MAIN AIR ENTRY: Spread Dragons in a straight line with Dragon Riders behind them, supported by Grand Warden.\n3. BLIMP DROP: Send Battle Blimp through Warden invulnerability to drop directly on the Town Hall 16.\n4. SPELLS: Freeze Air Defenses, Sweepers, and the Monolith while raging Dragons through the core.\n5. RC FLANK: Send Royal Champion with Electro Boots on the backside to assist Dragon Riders.',
  ARRAY['Overwhelming aerial DPS', 'Forgiving pathing', 'Great against Ring bases and Box layouts'],
  ARRAY['Air Sweepers and Single Target Infernos if Freezes are mistimed']
),
(
  16, 'TH16 Root Rider Valkyrie Smash', 'Smash',
  '{"troops": ["6 Root Riders", "8 Valkyries", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "4 Wizards", "2 Headhunters"], "spells": ["2 Rage", "2 Overgrowth", "2 Freeze", "1 Poison", "1 Jump"], "siege": "Siege Barracks", "cc": ["Super Miners / Hogs", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Haste Vial"}'::jsonb,
  '1. FUNNEL: King and Siege Barracks on the corner; Queen on the opposite flank.\n2. MAIN PUSH: Root Riders, Valkyries, and Grand Warden enter through the center.\n3. OVERGROWTH: Cast Overgrowth on Monolith/Spell Tower compartment.\n4. WARDEN TOME: Pop Eternal Tome + Healing Tome as troops enter the Town Hall 16 core.\n5. RC SWEEP: Royal Champion sweeps remaining defense quadrant.',
  ARRAY['Crushes merged Ricochet Cannons and Multi-Archers', 'High HP and fast wall demolition'],
  ARRAY['Poison Spell Towers']
),
(
  16, 'TH16 Zap Titan Smash', 'Smash',
  '{"troops": ["4 Electro Titans", "2 Ice Golems", "4 Healers", "4 Super Wall Breakers", "1 Baby Dragon", "4 Wizards"], "spells": ["4 Lightning", "1 Earthquake", "2 Rage", "2 Freeze", "1 Poison"], "siege": "Log Launcher or Flame Flinger", "cc": ["Yetis + Super Goblins", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Vampstache", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Rocket Spear + Haste Vial"}'::jsonb,
  '1. ZAP QUAKE: Use 4 Lightning + 1 Earthquake to eliminate Monolith or high-value Spell Tower.\n2. FUNNEL: King and Baby Dragon clear one side; Queen with Healers walk on the other side.\n3. MAIN SMASH: Send Electro Titans, Ice Golems, and Log Launcher directly into the core.\n4. AURA DAMAGE: Electro Titan auras melt all skeleton traps, CC troops, and dense defense clusters.\n5. WARDEN TOME: Protect units as they secure the Town Hall 16 explosion.',
  ARRAY['Completely ignores enemy Clan Castle troops and Skeleton Traps', 'High survivability', 'Reliable 3-star strategy'],
  ARRAY['Can struggle on ultra-open spread bases with wide defense spacing']
),

-- ==================== TH15 STRATEGIES ====================
(
  15, 'TH15 Root Rider Smash', 'Smash',
  '{"troops": ["6 Root Riders", "8 Valkyries", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "4 Wizards", "2 Headhunters"], "spells": ["2 Rage", "2 Freeze", "1 Poison", "2 Overgrowth"], "siege": "Siege Barracks or Battle Drill", "cc": ["Super Miners / Hogs", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Magic Mirror + Frozen Arrow", "GW": "Eternal Tome + Healing Tome", "RC": "Electro Boots + Haste Vial"}'::jsonb,
  '1. FUNNEL: King and Siege Barracks carve one side; Queen on the opposite side.\n2. MAIN ENTRY: Root Riders and Valkyries charge into the Town Hall 15 core.\n3. OVERGROWTH: Cast Overgrowth on the Monolith and Poison Spell Tower.\n4. WARDEN TOME: Protect troops through Town Hall 15 Giga Poison.\n5. RC CLEANUP: Royal Champion with Electro Boots clears the remaining perimeter.',
  ARRAY['Completely bypasses TH15 walls', 'Dominates Poison Spell Towers with Overgrowth'],
  ARRAY['Mistimed Overgrowth']
),
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
),
(
  15, 'TH15 Queen Charge Lalo', 'Lalo',
  '{"troops": ["5 Healers", "26 Balloons", "3 Lava Hounds", "4 Super Wall Breakers", "5 Minions", "3 Headhunters", "2 Baby Dragons"], "spells": ["3 Rage", "4 Invisibility", "3 Freeze", "1 Poison", "2 Haste"], "siege": "Flame Flinger or Battle Blimp", "cc": ["Super Minions or Yetis", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Spiky Ball", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Healing Tome", "RC": "Haste Vial + Seeking Shield"}'::jsonb,
  '1. QUEEN CHARGE: Start Queen Charge with 5 Healers to secure the Town Hall 15, Monolith, and Enemy Heroes. Use Rage and Invisibility to keep Queen alive.\n2. KING FUNNEL: King with Giant Gauntlet clears the opposite perimeter to narrow down base width.\n3. LALO DEPLOYMENT: Deploy Lava Hounds followed by groups of 3-4 Balloons per defense moving in a clockwise or counter-clockwise path.\n4. SPELLS: Haste Balloons to key defenses; Warden Eternal Tome over Eagle Artillery / Spell Towers.\n5. CLEANUP: Royal Champion and Minions finish outer buildings.',
  ARRAY['Highest tactical ceiling in Clash of Clans', 'Adaptable to almost any base layout', 'Demolishes tight compartments'],
  ARRAY['Extremely time-sensitive', 'Queen dying early ruins the entire attack']
),

-- ==================== TH14 STRATEGIES ====================
(
  14, 'TH14 Hydra (Dragon + Dragon Rider)', 'Air',
  '{"troops": ["8 Dragons", "5 Dragon Riders", "6 Balloons", "1 Baby Dragon", "2 Headhunters", "3 Minions"], "spells": ["3 Rage", "4 Freeze", "1 Poison", "1 Recall"], "siege": "Battle Blimp or Stone Slammer", "cc": ["Super Archers / Yetis", "1 Clone", "1 Rage"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Magic Mirror", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Royal Gem"}'::jsonb,
  '1. FUNNEL: King and Queen clear the trash buildings on one flank.\n2. AIR WAVE: Dragons and Dragon Riders spread across the entry side with Grand Warden.\n3. BLIMP DROP: Battle Blimp flies to Town Hall 14 protected by Warden invulnerability.\n4. SPELLS: Freeze Scattershots and Single Infernos; Rage Dragons through the core.\n5. RC CLEANUP: Royal Champion finishes backside defenses.',
  ARRAY['Destroys TH14 war bases with ease', 'Very forgiving against Scattershots'],
  ARRAY['Air Sweepers slowing Dragon advance']
),
(
  14, 'TH14 Queen Charge Hybrid (Miner + Hog Rider)', 'Smash',
  '{"troops": ["5 Healers", "14 Miners", "12 Hog Riders", "3 Super Wall Breakers", "2 Baby Dragons", "5 Wizards", "2 Headhunters"], "spells": ["3 Heal", "2 Rage", "2 Freeze", "1 Poison"], "siege": "Siege Barracks", "cc": ["Hog Riders", "1 Rage", "1 Poison"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Healer Puppet", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Royal Gem"}'::jsonb,
  '1. QUEEN CHARGE: Charge the Queen to eliminate Town Hall 14 (giga poison) and enemy Clan Castle.\n2. SIEGE BARRACKS & KING: Deploy on the outer corner to cut the base in half.\n3. HYBRID SURGE: Deploy Miners first, followed by Hog Riders and Grand Warden down the remaining channel.\n4. SPELLS: Drop Heal spells over Giant Bomb spots and Scattershots. Pop Warden Tome as Hybrid engages heavy defense areas.',
  ARRAY['Fast, surgical defense clearing', 'Healers can switch to Hybrid troops', 'Excellent against TH14 box layouts'],
  ARRAY['Scattershots and TH14 Giga Poison if Heal spells are delayed']
),

-- ==================== TH13 STRATEGIES ====================
(
  13, 'TH13 Yeti Bowler Smash', 'Smash',
  '{"troops": ["6 Yetis", "8 Bowlers", "4 Healers", "2 Ice Golems", "3 Super Wall Breakers", "4 Wizards"], "spells": ["2 Rage", "2 Jump", "3 Freeze", "1 Poison"], "siege": "Log Launcher", "cc": ["Yetis + Valkyrie", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Haste Vial"}'::jsonb,
  '1. FUNNEL: King and Warden Walk on outer edges.\n2. SMASH ENTRY: Send Yetis, Bowlers, Ice Golems, and Log Launcher down the center.\n3. WARDEN TOME: Protect units through Town Hall 13 Giga Inferno and Scattershots.\n4. JUMP & RAGE: Jump spells path troops through core compartments.\n5. RC FINISH: Royal Champion cleans up backside defenses.',
  ARRAY['Heavy DPS with Yeti mite distraction', 'Overwhelms TH13 multi-infernos and scattershots'],
  ARRAY['Single target infernos if Freeze spells run out']
),
(
  13, 'TH13 Zap Dragons & Dragon Riders', 'Air',
  '{"troops": ["10 Dragons", "4 Dragon Riders", "6 Balloons", "2 Baby Dragons", "4 Minions"], "spells": ["6 Lightning", "1 Earthquake", "1 Rage", "3 Freeze", "1 Poison"], "siege": "Stone Slammer or Blimp", "cc": ["Balloons or Dragon", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Healing Tome", "RC": "Seeking Shield + Haste Vial"}'::jsonb,
  '1. ZAP QUAKE: Take out 2 Air Defenses and adjacent Scattershots/Infernos with Lightning + Earthquake.\n2. HERO FLANK: Heroes take out a 3rd Air Defense and funnel.\n3. DRAGON WAVE: Deploy remaining Dragons and Dragon Riders straight through the remaining base section.\n4. WARDEN TOME: Protect against Town Hall 13 Giga Inferno and Scattershots.',
  ARRAY['Simple execution with overwhelming air power', 'Crushes TH13 war bases', 'Low spell dependency in live push'],
  ARRAY['Single target Infernos if Freeze spells are exhausted']
),

-- ==================== TH12 STRATEGIES ====================
(
  12, 'TH12 Zap Witch / Golem Witch Smash', 'Smash',
  '{"troops": ["3 Golems", "14 Witches", "2 Super Wall Breakers", "4 Wizards", "2 Archers"], "spells": ["8 Lightning", "2 Earthquake", "1 Rage", "1 Poison"], "siege": "Log Launcher or Wall Wrecker", "cc": ["Yetis or Bowlers", "1 Rage", "1 Freeze"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Rage Gem"}'::jsonb,
  '1. ZAP QUAKE: Destroy both Multi-Inferno Towers using 4 Lightning + 1 Earthquake each.\n2. SPREAD: Deploy 3 Golems across the entry side with Witches spread evenly in a wide line.\n3. CORE RUSH: Send Log Launcher, Heroes, and Grand Warden through the center to crush Town Hall 12 and Eagle Artillery.',
  ARRAY['Undefeatable against multi-inferno TH12 bases', 'Huge skeleton distraction wave', 'Extremely beginner friendly'],
  ARRAY['Bases with 3 Single Target Infernos']
),
(
  12, 'TH12 DragBat (Dragons + Bat Spells)', 'Air',
  '{"troops": ["12 Dragons", "8 Balloons", "2 Baby Dragons", "4 Minions"], "spells": ["6 Bat Spells", "4 Freeze", "1 Rage"], "siege": "Stone Slammer", "cc": ["Loons / Dragon", "1 Freeze", "1 Bat"]}'::jsonb,
  '{"BK": "Giant Gauntlet + Rage Vial", "AQ": "Frozen Arrow + Invisibility Vial", "GW": "Eternal Tome + Rage Gem"}'::jsonb,
  '1. HERO FUNNEL: King and Queen take down one corner and an Air Defense.\n2. DRAGON PUSH: Deploy Dragons and Balloons with Grand Warden in a line into the remaining Air Defenses and Town Hall 12.\n3. BAT WAVE: Deploy Bat Spells from behind the Dragon push once Wizard Towers and Multi-Infernos are frozen or distracted.\n4. FREEZE CONTROL: Continuously freeze Wizard Towers so Bats wipe out the remainder of the base.',
  ARRAY['Bats dismantle base in 20 seconds when splash is frozen', 'Crushes TH12 bases with Single Infernos'],
  ARRAY['Unfrozen Wizard Towers or Multi-Inferno hitting the Bat swarm']
);
