-- ====================================================================
-- Migration: 00007_update_clash_2026_meta.sql
-- Description: Comprehensive 2026 Clash of Clans Update (6 Heroes, all 42 Equipments, TH18 Meta)
-- ====================================================================

-- 1. Insert/Update all 42 Hero Equipments across 6 Heroes
INSERT INTO hero_equipment (hero, name, rarity, synergy_pairs, recommended_armies, description, best_playstyles)
VALUES
-- ==================== BARBARIAN KING ====================
(
  'Barbarian King', 'Giant Gauntlet', 'Epic',
  '[{"pair": "Spiky Ball", "rating": "S+", "notes": "Top tier destruction: King cleans flanks then destroys core as an invincible giant"}, {"pair": "Rage Vial", "rating": "S", "notes": "Explosive burst DPS while enlarged"}, {"pair": "Snake Bracelet", "rating": "S+", "notes": "Poison aura while giant melts defending heroes"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Hydra', 'Zap Titans', 'Super Barch', 'Lalo', 'TH18 Air Obliteration'],
  'Turns the King into an invincible giant, dealing massive area-of-effect splash damage with immense damage reduction.',
  ARRAY['Smash', 'Dive', 'Core Push', 'Funneling']
),
(
  'Barbarian King', 'Spiky Ball', 'Epic',
  '[{"pair": "Giant Gauntlet", "rating": "S+", "notes": "Best-in-slot King combo: 8-target ranged snipe + giant survivability"}, {"pair": "Vampstache", "rating": "S", "notes": "Continuous healing with deep multi-target bouncing damage"}, {"pair": "Stick Horse", "rating": "A+", "notes": "Fast galloping flank dive with high-range ball strike"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Root Riders', 'Hydra', 'TH18 Quad Dive'],
  'Hurls a spiked iron ball that ricochets across up to 8 defensive buildings, dealing devastating ranged damage.',
  ARRAY['Funneling', 'Flank Clearing', 'Sniper Dive']
),
(
  'Barbarian King', 'Snake Bracelet', 'Epic',
  '[{"pair": "Giant Gauntlet", "rating": "S+", "notes": "Venomous snakes distract single-target defenses while King crushes compartments"}, {"pair": "Spiky Ball", "rating": "S", "notes": "Heavy poison pressure on defending heroes and CC"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Zap Titan', 'TH18 Smash'],
  'Spawns mystical venomous serpents upon ability activation that poison enemy troops and defenses, slowing their attack speed and dealing continuous damage.',
  ARRAY['Anti-Hero Duel', 'Core Disruption', 'CC Melter']
),
(
  'Barbarian King', 'Stick Horse', 'Epic',
  '[{"pair": "Giant Gauntlet", "rating": "S", "notes": "King gallops over walls directly into key defense compartments"}, {"pair": "Spiky Ball", "rating": "A+", "notes": "High speed flank maneuver with ranged destruction"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Hybrid', 'Lalo'],
  'Grants galloping movement speed boost and allows the King to leap over walls, charging into enemy defenses with high initial impact damage.',
  ARRAY['Fast Rush', 'Wall Bypass', 'Surgical Dive']
),
(
  'Barbarian King', 'Rage Vial', 'Common',
  '[{"pair": "Giant Gauntlet", "rating": "S", "notes": "Explosive rage DPS while giant"}, {"pair": "Spiky Ball", "rating": "A", "notes": "Instant recovery and quick attack boost"}]'::jsonb,
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
(
  'Barbarian King', 'Earthquake Boots', 'Common',
  '[{"pair": "Giant Gauntlet", "rating": "A", "notes": "Shatters all surrounding walls opening the entire base for smash armies"}, {"pair": "Rage Vial", "rating": "A", "notes": "Breaks core walls and rages through"}]'::jsonb,
  ARRAY['Pekka Smash', 'Super Witch', 'Zap Titan'],
  'Causes a colossal earthquake stomp upon activation, obliterating all walls in a wide radius and dealing percentage damage to buildings.',
  ARRAY['Wall Breaker', 'Core Opener']
),
(
  'Barbarian King', 'Barbarian Puppet', 'Common',
  '[{"pair": "Rage Vial", "rating": "B+", "notes": "Classic starter combo spawning raged Barbarians"}, {"pair": "Vampstache", "rating": "B", "notes": "Provides distraction wave"}]'::jsonb,
  ARRAY['Starter Armies', 'Barch'],
  'Spawns a swarm of Barbarians to fight alongside the King with an instant health restoration boost.',
  ARRAY['Distraction', 'Cleanup']
),

-- ==================== ARCHER QUEEN ====================
(
  'Archer Queen', 'Magic Mirror', 'Epic',
  '[{"pair": "Frozen Arrow", "rating": "S+", "notes": "S-Tier: Queen clones inherit slow effect, freezing multiple high-threat defenses simultaneously"}, {"pair": "Invisibility Vial", "rating": "S", "notes": "Extreme burst DPS while protected by invisibility"}, {"pair": "Action Figure", "rating": "S+", "notes": "Decoy tanks focus fire while Queen & clones shred the compartment"}]'::jsonb,
  ARRAY['Queen Charge Lalo', 'Hydra', 'Root Rider Smash', 'TH18 Air Obliteration', 'TH18 Quad Dive'],
  'Spawns powerful Archer Queen clones that fight alongside her, multiplying DPS and shredding targets.',
  ARRAY['Queen Charge', 'Core Dive', 'Hero Sniping']
),
(
  'Archer Queen', 'Frozen Arrow', 'Epic',
  '[{"pair": "Magic Mirror", "rating": "S+", "notes": "Double/Triple slow effect across multiple high-threat defenses"}, {"pair": "Healer Puppet", "rating": "S", "notes": "Infinite Queen Charge sustain"}, {"pair": "Monolith Arrow", "rating": "S", "notes": "Slows targets while piercing beam melts max HP"}]'::jsonb,
  ARRAY['Queen Charge Lalo', 'Zap Titans', 'Super Barch', 'Hydra', 'Root Rider Smash'],
  'Slows down targeted defenses and enemy heroes by up to 75%, neutralizing Single Infernos, Monoliths, and Giga weapons.',
  ARRAY['Queen Charge', 'Defense Neutralization', 'Hero Duels']
),
(
  'Archer Queen', 'Action Figure', 'Epic',
  '[{"pair": "Magic Mirror", "rating": "S+", "notes": "Top 2026 meta combo: Decoy draws Monolith fire while Queen and clones eliminate the core"}, {"pair": "Frozen Arrow", "rating": "S", "notes": "Decoy absorbs hits while Queen locks down defenses"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Queen Charge', 'TH18 Smash'],
  'Summons an animated Champion Action Figure decoy that aggressively taunts nearby defenses, absorbing immense damage and protecting the Queen.',
  ARRAY['Tanking Decoy', 'Core Dive', 'Queen Protection']
),
(
  'Archer Queen', 'Monolith Arrow', 'Epic',
  '[{"pair": "Frozen Arrow", "rating": "S", "notes": "Snipe high HP defenses while freezing them in place"}, {"pair": "Magic Mirror", "rating": "S", "notes": "Triple piercing beams through dense base compartments"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'TH18 Quad Dive', 'Hydra'],
  'Fires a colossal dark-infused piercing arrow across the battlefield that deals percentage-based damage scaling with the target maximum health.',
  ARRAY['Sniper Beam', 'Monolith Removal', 'Anti-Giga Weapon']
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
(
  'Archer Queen', 'Giant Arrow', 'Common',
  '[{"pair": "Invisibility Vial", "rating": "A+", "notes": "Align across base to snipe 2 Air Defenses and Sweepers"}, {"pair": "Healer Puppet", "rating": "A", "notes": "Queen Charge opener with instant line snipe"}]'::jsonb,
  ARRAY['Hydra', 'Super Dragons', 'Fireball Rocket Loon'],
  'Fires an immense arrow across the entire map, damaging all buildings in its straight-line trajectory.',
  ARRAY['Map Line Snipe', 'Air Defense Takedown']
),
(
  'Archer Queen', 'Archer Puppet', 'Common',
  '[{"pair": "Invisibility Vial", "rating": "B+", "notes": "Classic starter Queen ability"}, {"pair": "Giant Arrow", "rating": "B", "notes": "Basic distraction spawn"}]'::jsonb,
  ARRAY['Starter Armies'],
  'Spawns a group of stealth Archers to assist the Queen with health recovery.',
  ARRAY['Distraction', 'Cleanup']
),

-- ==================== MINION PRINCE ====================
(
  'Minion Prince', 'Meteor Staff', 'Epic',
  '[{"pair": "Dark Crown", "rating": "S+", "notes": "Unrivaled 2026 Meta: Dark aura multiplies the destructive splash of orbital dark meteor strikes"}, {"pair": "Dark Orb", "rating": "S", "notes": "Continuous explosive bombardment over defensive clusters"}]'::jsonb,
  ARRAY['TH18 Root Rider Smash', 'TH18 Air Obliteration', 'Lalo'],
  'Channels celestial dark energy to call down a barrage of orbital dark meteors that pulverize defenses and wall compartments.',
  ARRAY['Area Obliteration', 'Core Bombardment', 'Spell Tower Wipe']
),
(
  'Minion Prince', 'Dark Crown', 'Epic',
  '[{"pair": "Meteor Staff", "rating": "S+", "notes": "Emits dark radiation boosting surrounding dark elixir troops (Root Riders, Minions, Bowlers)"}, {"pair": "Henchmen Puppet", "rating": "S", "notes": "Empowers spawned Henchmen with enraged damage"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Super Minion Dive', 'TH18 Smash'],
  'Crowns the Prince with a dark aura that substantially increases the damage of all nearby Dark Elixir units and shields them from damage.',
  ARRAY['Dark Army Buff', 'Aura Support', 'Smash Amplifier']
),
(
  'Minion Prince', 'Dark Orb', 'Epic',
  '[{"pair": "Meteor Staff", "rating": "S", "notes": "Weakens defensive damage reduction before meteor impact"}, {"pair": "Noble Iron", "rating": "A+", "notes": "High single-target DPS with bouncing projectile"}]'::jsonb,
  ARRAY['TH18 Air Obliteration', 'Hydra', 'Lalo'],
  'Hurls an unstable bouncing sphere of dark plasma that ricochets between defenses, suppressing their damage output and breaking shields.',
  ARRAY['Defense Suppression', 'Shield Breaker']
),
(
  'Minion Prince', 'Henchmen Puppet', 'Common',
  '[{"pair": "Dark Crown", "rating": "S", "notes": "Spawns elite armored Henchmen under dark damage aura"}, {"pair": "Metal Pants", "rating": "A", "notes": "Prince tanks while Henchmen swarm defenses"}]'::jsonb,
  ARRAY['Air Armies', 'Barch', 'Smash Support'],
  'Summons a swarm of elite armored Henchmen Minions to overwhelm point defenses and provide air distraction.',
  ARRAY['Air Swarm', 'Distraction', 'Point Defense Overwhelm']
),
(
  'Minion Prince', 'Noble Iron', 'Common',
  '[{"pair": "Dark Crown", "rating": "A+", "notes": "Heavy piercing melee/ranged strikes under dark aura"}, {"pair": "Metal Pants", "rating": "A", "notes": "Balanced frontline combatant"}]'::jsonb,
  ARRAY['Smash Armies', 'Surgical Dive'],
  'Enhances the Prince weapon with dense noble iron, granting armor-piercing damage and increased attack speed.',
  ARRAY['Single Target DPS', 'Hero Dueling']
),
(
  'Minion Prince', 'Metal Pants', 'Common',
  '[{"pair": "Henchmen Puppet", "rating": "A", "notes": "Prince absorbs heavy fire while minions dismantle compartments"}, {"pair": "Dark Crown", "rating": "A", "notes": "Frontline durability with team buff"}]'::jsonb,
  ARRAY['Smash Armies', 'All-Around Defense'],
  'Equips reinforced heavy metal armor that provides passive damage reduction against both ground and air attacks.',
  ARRAY['Tanking', 'Damage Absorption']
),

-- ==================== GRAND WARDEN ====================
(
  'Grand Warden', 'Fireball', 'Epic',
  '[{"pair": "Rage Gem", "rating": "S+", "notes": "Maximizes the massive area blast to 1-shot entire base compartments (Monolith + Spell Towers)"}, {"pair": "Healing Tome", "rating": "S", "notes": "Follows up destructive blast with total army sustain"}, {"pair": "Heroic Torch", "rating": "S", "notes": "Blast core and leap entire army over remaining walls"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Fireball Hydra', 'Super Barch', 'TH18 Quad Dive'],
  'Shoots a colossal explosive fireball across the base, dealing immense splash damage capable of wiping out Town Halls, Monoliths, and Spell Towers simultaneously.',
  ARRAY['Warden Walk', 'Compartment Wipe', 'Direct TH Snipe']
),
(
  'Grand Warden', 'Heroic Torch', 'Epic',
  '[{"pair": "Eternal Tome", "rating": "S+", "notes": "Immortal army rushing directly over all walls with extreme speed"}, {"pair": "Healing Tome", "rating": "S", "notes": "Endless wall-jumping smash sustain"}]'::jsonb,
  ARRAY['TH18 Root Rider Smash', 'Zap Titans', 'Super Pekka Smash'],
  'Empowers the Grand Warden with a radiant torch that allows all nearby friendly troops to leap freely over walls with increased movement speed.',
  ARRAY['Wall Bypass', 'Fast Smash', 'Core Rush']
),
(
  'Grand Warden', 'Lavaloon Puppet', 'Epic',
  '[{"pair": "Eternal Tome", "rating": "S", "notes": "Spawns a tanking Lava Hound and high-DPS Balloons protected by invulnerability"}, {"pair": "Rage Gem", "rating": "S", "notes": "Fast air surge under permanent rage"}]'::jsonb,
  ARRAY['Hydra', 'Lalo', 'TH18 Air Obliteration'],
  'Instantly summons a mini Lava Hound and elite Balloons directly inside the Warden aura upon ability activation.',
  ARRAY['Air Surge', 'Trap Absorption', 'Core Dive']
),
(
  'Grand Warden', 'Eternal Tome', 'Common',
  '[{"pair": "Healing Tome", "rating": "S+", "notes": "The undisputed #1 Warden combo: Invulnerability followed by massive HP regeneration for the entire army"}, {"pair": "Heroic Torch", "rating": "S+", "notes": "Invulnerable wall-jumping push"}, {"pair": "Rage Gem", "rating": "S", "notes": "Immortal push through high DPS areas"}]'::jsonb,
  ARRAY['Hydra', 'Root Rider Smash', 'Lalo', 'Zap Titans', 'TH18 Armies'],
  'The quintessential Warden ability making all nearby friendly units completely invulnerable to all damage.',
  ARRAY['Core Push', 'Town Hall Bomb Protection']
),
(
  'Grand Warden', 'Healing Tome', 'Common',
  '[{"pair": "Eternal Tome", "rating": "S+", "notes": "Absolute gold standard combo for smash & air pushes"}, {"pair": "Fireball", "rating": "S", "notes": "Restores troops during cleanup"}, {"pair": "Heroic Torch", "rating": "S", "notes": "Continuous healing as troops jump walls"}]'::jsonb,
  ARRAY['Root Rider Smash', 'Hydra', 'Zap Titans', 'Super Witches', 'TH18 Smash'],
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
(
  'Grand Warden', 'Life Gem', 'Common',
  '[{"pair": "Eternal Tome", "rating": "A", "notes": "Solid passive HP buffer for squishy units (Hog Riders, Balloons, Miners)"}, {"pair": "Healing Tome", "rating": "A", "notes": "Massive total health pool sustain"}]'::jsonb,
  ARRAY['Hybrid', 'Lalo', 'Barch'],
  'Passively increases the maximum hitpoints of all friendly troops inside the Warden aura.',
  ARRAY['Squishy Troop Buff', 'Hybrid Push']
),

-- ==================== ROYAL CHAMPION ====================
(
  'Royal Champion', 'Electro Boots', 'Epic',
  '[{"pair": "Rocket Spear", "rating": "S+", "notes": "Top 2026 Meta: Long-range sniper strikes combined with passive chain-lightning stunning all nearby defenses"}, {"pair": "Haste Vial", "rating": "S+", "notes": "Hyper-speed chain-lightning blitz clearing entire back-ends"}]'::jsonb,
  ARRAY['TH18 Root Rider Smash', 'TH18 Air Obliteration', 'Hydra', 'Queen Charge Lalo'],
  'Electrifies the Royal Champion stomps, passively releasing continuous chain-lightning arcs that stun nearby defenses and vaporize ground swarms.',
  ARRAY['Passive Stun', 'Defense Lockdown', 'Swarm Clearing']
),
(
  'Royal Champion', 'Rocket Spear', 'Epic',
  '[{"pair": "Electro Boots", "rating": "S+", "notes": "Elite sniper + stun combination"}, {"pair": "Seeking Shield", "rating": "S+", "notes": "Long-range defense sniping followed by 4-target shield bounce"}, {"pair": "Haste Vial", "rating": "S", "notes": "Ultra-fast long-range defensive obliteration"}]'::jsonb,
  ARRAY['Fireball Rocket Loon', 'Hydra', 'Root Rider Smash', 'Queen Charge', 'TH18 Quad Dive'],
  'Empowers the Royal Champion with extended range and explosive spear strikes to take down deep defenses without taking return fire.',
  ARRAY['Sniper Dive', 'Back-end Cleanup', 'Monolith Removal']
),
(
  'Royal Champion', 'Frost Flake', 'Epic',
  '[{"pair": "Electro Boots", "rating": "S", "notes": "Dual stun + freeze locking down Town Hall and Single Infernos"}, {"pair": "Rocket Spear", "rating": "S", "notes": "Long-range chilling strikes neutralizing defense clusters"}]'::jsonb,
  ARRAY['TH18 Smash', 'Lalo', 'Hydra'],
  'Releases frost shards that freeze hit defenses and slows down their firing speed, creating safe zones for backend troops.',
  ARRAY['Freeze Control', 'Defense Slowdown']
),
(
  'Royal Champion', 'Haste Vial', 'Common',
  '[{"pair": "Electro Boots", "rating": "S+", "notes": "Hyper speed lightning clearing"}, {"pair": "Seeking Shield", "rating": "S+", "notes": "Classic elite meta combo for instant back-end defense clearing"}, {"pair": "Rocket Spear", "rating": "S", "notes": "Hyper speed projectile devastation"}]'::jsonb,
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
),
(
  'Royal Champion', 'Hog Puppet', 'Common',
  '[{"pair": "Haste Vial", "rating": "A", "notes": "Spawns Hog pack jumping walls with haste speed boost"}, {"pair": "Seeking Shield", "rating": "A", "notes": "Hogs tank while shield eliminates remaining towers"}]'::jsonb,
  ARRAY['Hybrid', 'Root Rider Smash'],
  'Spawns a loyal pack of Hog Riders to assist the Royal Champion while restoring a portion of her health.',
  ARRAY['Distraction', 'Wall Hopping']
),
(
  'Royal Champion', 'Royal Gem', 'Common',
  '[{"pair": "Seeking Shield", "rating": "A", "notes": "Classic burst heal and high shield bounce damage"}, {"pair": "Haste Vial", "rating": "A", "notes": "Quick survival reset"}]'::jsonb,
  ARRAY['Starter Armies', 'General Push'],
  'Provides an instant massive health restoration and permanent DPS boost upon ability activation.',
  ARRAY['Health Recovery', 'Clutch Survival']
),

-- ==================== DRAGON DUKE ====================
(
  'Dragon Duke', 'Fire Heart', 'Epic',
  '[{"pair": "Flame Blower", "rating": "S+", "notes": "Apex Dragon Duke combo: Fiery aura + directional flame cone incinerates entire defensive quadrants"}, {"pair": "Revenge Deck", "rating": "S+", "notes": "Continuous burning aura combined with enraging strike cards for air armies"}]'::jsonb,
  ARRAY['TH18 Air Obliteration', 'Hydra', 'Super Dragons', 'Fireball Rocket Loon'],
  'Imbues the Duke with a scorching dragon core that passively burns all nearby structures with continuous thermal damage and triggers an explosive resurrection blast upon defeat.',
  ARRAY['Thermal Burn', 'Aura Melting', 'Resurrection Blast']
),
(
  'Dragon Duke', 'Flame Blower', 'Epic',
  '[{"pair": "Fire Heart", "rating": "S+", "notes": "Unmatched aerial cone devastation"}, {"pair": "Stun Blaster", "rating": "S", "notes": "Stuns defenses before unleashing high-heat cone breath"}]'::jsonb,
  ARRAY['TH18 Air Obliteration', 'Hydra', 'TH18 Quad Dive'],
  'Unleashes a concentrated directional cone of infernal dragon breath that pierces through walls and melts defenses, heroes, and Clan Castle troops.',
  ARRAY['Directional Melt', 'Hero Shredder', 'Compartment Wipe']
),
(
  'Dragon Duke', 'Revenge Deck', 'Epic',
  '[{"pair": "Fire Heart", "rating": "S+", "notes": "Empowers air fleets with berserk damage boosts as the Duke takes incoming fire"}, {"pair": "Rocket Backpack", "rating": "S", "notes": "Jet surge into core activating heavy fleet damage buffs"}]'::jsonb,
  ARRAY['TH18 Air Obliteration', 'Hydra', 'Lalo'],
  'Deploys tactical aerial strike cards whenever the Duke takes damage, granting stacking attack speed and rage bonuses to all nearby air units.',
  ARRAY['Air Fleet Amplifier', 'Counter-Attack', 'Berserk Push']
),
(
  'Dragon Duke', 'Stun Blaster', 'Common',
  '[{"pair": "Flame Blower", "rating": "S", "notes": "Stuns Town Hall 18 weapon or Monolith before melting with flame cone"}, {"pair": "Electro Fangs", "rating": "A+", "notes": "Dual lightning stun control"}]'::jsonb,
  ARRAY['Air Attacks', 'Smash Support'],
  'Fires high-voltage electrical breath that temporarily stuns targeted defenses and resets Single Infernos and Giga charge weapons.',
  ARRAY['Defense Reset', 'Single Inferno Neutralizer']
),
(
  'Dragon Duke', 'Electro Fangs', 'Common',
  '[{"pair": "Fire Heart", "rating": "S", "notes": "Chain lightning melee bites combined with fiery area aura"}, {"pair": "Stun Blaster", "rating": "A+", "notes": "Heavy electrical disruption"}]'::jsonb,
  ARRAY['Air Armies', 'General Push'],
  'Empowers the Duke melee bites with chain lightning arcs that jump to up to 5 adjacent defensive structures.',
  ARRAY['Chain Damage', 'Swarm Clearing']
),
(
  'Dragon Duke', 'Rocket Backpack', 'Common',
  '[{"pair": "Fire Heart", "rating": "S", "notes": "Jet boosts directly into core triggering massive burning aura"}, {"pair": "Revenge Deck", "rating": "S", "notes": "Rapid core engagement"}]'::jsonb,
  ARRAY['Fast Air Surge', 'Core Dive'],
  'Ignites rocket thrusters for an explosive forward surge, rushing the Dragon Duke directly into high-threat compartments with immense velocity.',
  ARRAY['Gap Closer', 'Core Dive', 'Fast Repositioning']
)
ON CONFLICT (name) DO UPDATE SET
  hero = EXCLUDED.hero,
  rarity = EXCLUDED.rarity,
  synergy_pairs = EXCLUDED.synergy_pairs,
  recommended_armies = EXCLUDED.recommended_armies,
  description = EXCLUDED.description,
  best_playstyles = EXCLUDED.best_playstyles;

-- ====================================================================
-- 2. Insert TH18 Meta Strategies & Town Hall 18 Guide
-- ====================================================================

INSERT INTO clash_strategies (town_hall, name, archetype, army_composition, hero_equipment, execution_guide, strengths, weaknesses)
VALUES
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
);

-- ====================================================================
-- 3. Insert Town Hall 18 Guide
-- ====================================================================

INSERT INTO town_hall_guides (town_hall, theme, key_defenses, offense_upgrade_priority, defense_upgrade_priority, hero_priorities, notes)
VALUES
(
  18, 'Cosmic Dragon & Solar Eclipse (Color: Obsidian & Prismatic Gold)',
  ARRAY['Town Hall 18 Cosmic Giga Star', 'Monolith 2.0', 'Quad Spell Towers', 'Apex Eagle Artillery', 'Merged Ricochet Cannons', 'Merged Multi-Archer Towers', 'Super Wizard Towers'],
  ARRAY['Laboratory', 'Clan Castle', 'Army Camps', 'Blacksmith (Level 11+ Max Equipments)', 'Dragon Duke Altar', 'Minion Prince Altar', 'Pet House (Level 11)', 'Siege Workshop'],
  ARRAY['Town Hall Cosmic Weapon', 'Monolith 2.0', 'Quad Spell Towers', 'Apex Eagle Artillery', 'Merged Ricochet Cannons & Multi-Archers', 'Scattershots'],
  ARRAY['Dragon Duke (Level 50)', 'Grand Warden (Level 80)', 'Royal Champion (Level 55)', 'Minion Prince (Level 50)', 'Archer Queen (Level 105)', 'Barbarian King (Level 105)'],
  'Town Hall 18 introduces 6 active Heroes and Apex defenses. Prioritize the Blacksmith and Dragon Duke immediately. Top 2026 meta builds revolve around Dragon Duke Fire Heart, Minion Prince Meteor Staff, Queen Magic Mirror + Action Figure, and Royal Champion Electro Boots.'
)
ON CONFLICT (town_hall) DO UPDATE SET
  theme = EXCLUDED.theme,
  key_defenses = EXCLUDED.key_defenses,
  offense_upgrade_priority = EXCLUDED.offense_upgrade_priority,
  defense_upgrade_priority = EXCLUDED.defense_upgrade_priority,
  hero_priorities = EXCLUDED.hero_priorities,
  notes = EXCLUDED.notes;
