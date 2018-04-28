'use strict';

exports.BattleAbilities = {

/* 
Dimension Warp	Sets up Inverse Room upon switchin. Under Inverse Room, Weakness and Resistances (Not immunities) are reversed
Disperal	Boosts Bullet Seed, Seed Bomb, and Seed Flare by 1.2x power, and Leech Seed deals 20% more damage and heals 30% more HP each turn.
Forecast	If this Pokémon is holding a Weather Rock, its secondary typing becomes Water/Fire/Rock/Ice/Flying/Dark (depending on the rock) and summon the corresponding weather upon entering the field. Under Strong Winds, this mon gains the added Flying type.
Misty Surge	Summons Misty Terrain upon switching-in. Misty Terrain now boosts Fairy-type moves by 1.5x.
Obstinacy	User gains a boost in it's moves the lower it's HP gets. Formula:  (1.0 - [Current percentage of HP in decimal form]) + 1.0
*/
"forecast": {
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "If this Pokémon is holding a Weather Rock, its secondary typing becomes Water/Fire/Rock/Ice/Flying/Dark (depending on the rock) and summon the corresponding weather upon entering the field. Under Strong Winds, this mon gains the added Flying type.",
		onStart: function (pokemon) {
			if (pokemon.item === 'heatrock') {
				pokemon.addType('Fire');
				this.setWeather('sunnyday');
			}
			else if (pokemon.item === 'damprock') {
				pokemon.addType('Water');
				this.setWeather('raindance');
			}
			else if (pokemon.item === 'smoothrock') {
				pokemon.addType('Rock');
				this.setWeather('sandstorm');
			}
			else if (pokemon.item === 'icyrock') {
				pokemon.addType('Ice');
				this.setWeather('hail');
			}
			else if (pokemon.item === 'shadowrock') {
				pokemon.addType('dark');
				this.setWeather('shadowsky');
			}
			else if (pokemon.item === 'breezerock') {
				pokemon.addType('Flying');
				this.setWeather('aircurrent');
			}
			else if (this.isWeather('deltastream')) {
				pokemon.addType('Flying');
			}
		},		
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Forecast');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59,
	},
"schooling": {
		desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form.",
		shortDesc: "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool' && !pokemon.hasItem('graduationscale')) {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		id: "schooling",
		name: "Schooling",
		rating: 3,
		num: 208,
	},
	"knightsblade": {
		shortDesc: "Boosts the power of sword, cut, slash, and blade moves by 1.5x",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.name === 'Psycho Cut' || move.name === 'Cut' || move.name === 'Slash' || move.name === 'Night Slash' || move.name === 'Solar Blade' || move.name === 'Leaf Blade' || move.name === 'X-Scissor' || move.name === 'Cross Poison' || move.name === 'Air Slash' || move.name === 'Air Cutter' || move.name === 'Fury Cutter' || move.name === 'Sacred Sword' || move.name === 'Secret Sword' || move.name === 'Razor Shell') {
				return this.chainModify(1.5);
			}
		},
		id: "knightsblade",
		name: "Knight's Blade",
	},
	"dispersal": {
		shortDesc: "Boosts the power of sword, cut, slash, and blade moves by 1.5x",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.name === 'Bullet Seed' || move.name === 'Seed Bomb' || move.name === 'Seed Flare') {
				return this.chainModify(1.2);
			}
		},
		onTryHealPriority: 1,
		onTryHeal: function (damage, target, source, effect) {
			let heals = {drain: 1, leechseed: 1, ingrain: 1, aquaring: 1, strengthsap: 1};
			if (heals[effect.id]) {
				return Math.ceil((damage * 1.3) - 0.5);
			}
		},
		id: "dispersal",
		name: "Dispersal",
	},
	"megalauncher": {
		desc: "This Pokemon's pulse moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['pulse'] || move.name === 'Steam Eruption' || move.name === 'Flash Cannon' || move.name === 'Techno Blast' || move.name === 'Fire Blast' || move.name === 'Moonblast' || move.name === 'Aeroblast' || move.name === 'Bullet Fire' || move.name === 'Twineedle' || move.name === 'Plume Cannon' || move.name === 'Draco Meteor' || move.name === 'Bullet Punch' || move.name === 'Spike Cannon' || move.name === 'Fleur Cannon' || move.name === 'Meteor Shower' || move.name === 'Hydro Cannon' || move.name === 'Blast Burn') {
				return this.chainModify(1.5);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3.5,
		num: 178,
	},
		"bulletproof": {
		desc: "This Pokemon is immune to ballistic moves. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).",
		onTryHit: function (pokemon, target, move) {
			if (move.flags['bullet'] || move.name === 'Steam Eruption' || move.name === 'Flash Cannon' || move.name === 'Techno Blast' || move.name === 'Fire Blast' || move.name === 'Moonblast' || move.name === 'Aeroblast' || move.name === 'Bullet Fire' || move.name === 'Twineedle' || move.name === 'Plume Cannon' || move.name === 'Draco Meteor' || move.name === 'Bullet Punch' || move.name === 'Spike Cannon' || move.name === 'Fleur Cannon' || move.name === 'Meteor Shower' || move.name === 'Hydro Cannon') {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Bulletproof');
				return null;
			}
		},
		id: "bulletproof",
		name: "Bulletproof",
		rating: 3.5,
		num: 171,
	},
	"shadowsurge": {
		shortDesc: "Summons Shadow Sky upon switching in.",
		onStart: function (source) {
			this.setWeather('shadowsky');
			this.add('-ability', source, 'Shadow Surge');
		},
		id: "shadowsurge",
		name: "Shadow Surge",
	},
	"airstream": {
		shortDesc: "Summons Air Current upon switching in.",
		onStart: function (source) {
			this.setWeather('aircurrent');
			this.add('-ability', source, 'Air Stream');
		},
		id: "airstream",
		name: "Air Stream",
	},
	"timewarp": {
		shortDesc: "On switch-in, this Pokemon summons Trick Room.",
		onStart: function (source) {
			this.useMove("Trick Room", source);
		},
		id: "timewarp",
		name: "Time Warp",
	},
	/*mindtrick: {
		shortDesc: "Stat changes are received by the opposing pokemon and vice versa",
		onStart: function (target, source) {
			let targetBoosts = {};
			let sourceBoosts = {};

			for (let i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] ability: Mind Trick');
		},
		id: "mindtrick",
	name: "Mind Trick",
	},*/
	housekeeping: {
		shortDesc: "Removes hazards upon switch-in.",
		onSwitchInPriority: 6,
		onSwitchIn: function (pokemon, target, source) {
						this.removePseudoWeather('trickroom');
			        this.removePseudoWeather('magicroom');
			 		this.removePseudoWeather('wonderroom');
				//	this.removePseudoWeather('inverseroom');
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] ability: Housekeeping', '[of] ' + pokemon);
					}
				}
			},
		id: "housekeeping",
	name: "Housekeeping",
	},
etheralfist: {
	shortDesc: "Punch Moves become Special and gain 1.2x damage (Same Moves effected as Iron Fist).",
	onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
	onModifyMovePriority: 8,
	onModifyMove: function (move, pokemon) {
		if  (move.flags['punch'] && move.category === 'Physical') move.category = 'Special';
	},
	id: "etheralfist",
	name: "Etheral Fist",
},
	"magichealing": {
		id: "magichealing",
		name: "Magic Healing",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return;
			this.heal(pokemon.maxhp / 16);
		},
		onTerrain: function (pokemon) {
			if (!this.isTerrain('grassyterrain')) return;
			this.heal(pokemon.maxhp / 16);
		},
		desc: "At the end of every turn, the Pokemon restores 1/16 of its max HP.",
	},

	"swarm": {
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Bug-type attack.",
		shortDesc: "This Pokemon's attacking stat is 1.5x with Bug attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Bug') {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Bug') {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	"blaze": {
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Fire-type attack.",
		shortDesc: "This Pokemon's attacking stat is 1.5x with Fire attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		id: "blaze",
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	"torrent": {
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Water-type attack.",
		shortDesc: "This Pokemon's attacking stat is 1.5x with Water attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		id: "torrent",
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	"overgrow": {
		desc: "When this Pokemon has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "This Pokemon's attacking stat is 1.5x with Grass attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Grass') {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		id: "overgrow",
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	"technician": {
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 75) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		id: "technician",
		name: "Technician",
		rating: 4,
		num: 101,
	},
	"megalauncher": {
		desc: "This Pokemon's pulse, ball and bomb moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse, ball and bomb moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['pulse' || 'bullet']) {
				return this.chainModify(1.5);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3.5,
		num: 178,
	},
	"thickfat": {
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice-type moves against this Pokemon deal damage with a halved attacking stat. Immune to hail damage, burn, and freeze.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'hail') return false;
		},
		onUpdate: function (pokemon) {
			if (pokemon.status === 'brn' || pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Thick Fat');
				pokemon.cureStatus();
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	"liquidvoice": {
		desc: "This Pokemon's sound-based moves become Water-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type and power up by 1.2x times.",
		onModifyMovePriority: -1,
		onModifyMove: function (move) {
			if (move.flags['sound']) {
				move.type = 'Water';
				move.liquidvoiceBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.liquidvoiceBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		id: "liquidvoice",
		name: "Liquid Voice",
		rating: 2.5,
		num: 204,
	},
	"scrappy": {
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	"guardup": {
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "Upon switch-in, this Pokemon's Defense or Special Defense goes up by 1 stage depending on the opponent's higher attacking stat (Download clone).",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let totalatk = 0;
			let totalspa = 0;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				totalatk += foeactive[i].getStat('atk', false, true);
				totalspa += foeactive[i].getStat('spa', false, true);
			}
			if (totalspa >= totalatk) {
				this.boost({spd: 1});
			} else if (totalatk > totalspa) {
				this.boost({def: 1});
			}
		},
		id: "guardup",
		name: "Guard Up",
		rating: 4,
		num: 88,
	},
	"corrosion": {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Steel'] = true;
				move.ignoreImmunity['Poison'] = true;
			}
		},
		id: "corrosion",
		name: "Corrosion",
		rating: 3,
		num: 113,
	},
	"flareboost": {
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is burned, its special attacks have 2x power.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(2);
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 2.5,
		num: 138,
	},
};
