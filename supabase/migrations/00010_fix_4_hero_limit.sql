-- ====================================================================
-- Migration: 00010_fix_4_hero_limit.sql
-- Description: Enforce Clash of Clans 4-Hero limit per attack (4 active hero slots out of 6 roster heroes)
-- ====================================================================

-- 1. Update TH18 Strategies to strictly use 4 active heroes
UPDATE clash_strategies
SET 
  hero_equipment = '{"Duke": "Fire Heart + Flame Blower", "GW": "Eternal Tome + Healing Tome", "AQ": "Magic Mirror + Frozen Arrow", "RC": "Electro Boots + Rocket Spear"}'::jsonb,
  execution_guide = '1. HERO SELECTION: Select 4 Active Heroes (Dragon Duke, Grand Warden, Archer Queen, Royal Champion — Barbarian King is benched for pure air speed).\n2. QUEEN FLANK: Deploy Queen with Magic Mirror & Frozen Arrow on one outer flank to create a funnel.\n3. MAIN AIR FLEET: Deploy Dragons, Dragon Riders, Grand Warden, and Dragon Duke in a tight wave.\n4. DRAGON DUKE SURGE: Activate Dragon Duke Flame Blower to melt merged defenses while Fire Heart burns surrounding core structures.\n5. WARDEN TOME: Pop Eternal Tome + Healing Tome as the fleet enters the Town Hall 18 Cosmic Giga Star.\n6. BACKEND RC: Royal Champion with Electro Boots & Rocket Spear snipes the backend Monolith 2.0 safely.',
  strengths = ARRAY['Absolute peak 2026 air meta', 'Dragon Duke replaces King for 100% aerial fleet synergy', 'Overgrowth controls backside quad spell towers'],
  weaknesses = ARRAY['Air Sweepers pushing into Monolith 2.0 if Freezes are mistimed']
WHERE name = 'TH18 Air Obliteration (Hydra + Dragon Duke Surge)';

UPDATE clash_strategies
SET 
  hero_equipment = '{"BK": "Giant Gauntlet + Snake Bracelet", "AQ": "Action Figure + Frozen Arrow", "GW": "Eternal Tome + Heroic Torch", "Prince": "Meteor Staff + Dark Crown"}'::jsonb,
  execution_guide = '1. HERO SELECTION: Select 4 Active Heroes (Barbarian King, Archer Queen, Grand Warden, Minion Prince — Royal Champion is benched for maximum ground smash & dark meteor power).\n2. FUNNEL: King and Siege Barracks establish flank boundaries. Queen deploys Action Figure decoy to absorb Monolith 2.0 fire.\n3. SMASH ENTRY: Root Riders, Valkyries, Grand Warden, and Minion Prince push through the center.\n4. METEOR STRIKE: Activate Minion Prince Meteor Staff under Dark Crown aura to wipe out the Town Hall 18 core compartment.\n5. HEROIC TORCH: Warden Heroic Torch lets Root Riders and Valkyries jump over all walls while invincible under Eternal Tome.',
  strengths = ARRAY['Near unstoppable ground smash meta', 'Minion Prince meteors delete high-density compartments', 'Action Figure neutralizes single-target defense focus'],
  weaknesses = ARRAY['Requires precise Overgrowth timing on backside merged defenses']
WHERE name = 'TH18 Root Rider & Minion Prince Smash';

UPDATE clash_strategies
SET 
  hero_equipment = '{"GW": "Fireball + Rage Gem", "Duke": "Stun Blaster + Electro Fangs", "AQ": "Monolith Arrow + Magic Mirror", "RC": "Rocket Spear + Frost Flake"}'::jsonb,
  execution_guide = '1. HERO SELECTION: Select 4 Active Heroes (Grand Warden, Dragon Duke, Archer Queen, Royal Champion — Barbarian King is benched for aerial dive).\n2. FIREBALL OPENER: Warden Walk with 4 Healers. Use Invisibility + Earthquake to trigger Grand Warden Fireball, 1-shotting the Town Hall 18 or Monolith 2.0 core.\n3. MONOLITH ARROW: Queen fires Monolith Arrow across heavy defenses to chunk 40% of their max HP.\n4. DUKE DIVE: Dragon Duke enters with Stun Blaster to reset single infernos and chain-lightning defenses.\n5. ROCKET BALLOON SURGE: Surgical deployment of Rocket Balloons in groups of 3-4 behind Dragon Riders.\n6. RC SNIPER: Royal Champion with Rocket Spear & Frost Flake freezes and finishes the remaining perimeter.',
  strengths = ARRAY['Highest theoretical ceiling in Clash of Clans history', 'Wipes out over 40% of TH18 base before main troops deploy', 'Counters tight war bases'],
  weaknesses = ARRAY['Extremely high skill ceiling requiring pixel-perfect Warden Walk and Invisibility placement']
WHERE name = 'TH18 Fireball Meteor Quad-Hero Dive';

-- 2. Update TH18 Town Hall Guide notes
UPDATE town_hall_guides
SET 
  notes = 'Town Hall 18 features 6 total Heroes in the game roster, with 4 Active Hero slots available per attack. Choose your 4 heroes based on attack archetype (e.g. Dragon Duke + Warden + Queen + RC for Air; Minion Prince + King + Queen + Warden for Ground Smash). Prioritize the Blacksmith and Dragon Duke immediately. Top 2026 meta builds revolve around Dragon Duke Fire Heart, Minion Prince Meteor Staff, Queen Magic Mirror + Action Figure, and Royal Champion Electro Boots.'
WHERE town_hall = 18;
