'use strict';

/**@type {{[k: string]: TemplateData}} */
let BattlePokedex = {

heatblast: {
num: 8001,
species: "Heat Blast",
types: ["Fire", "Flying"],
baseStats: {hp: 80, atk: 120, def: 80, spa: 120, spd: 80, spe: 150},
abilities: {0: "Flame Body", 1: "Rock Head", H: "Adaptability"},
},

heatblastomnienhanced: {
		num: 3,
		species: "Heat Blast-Omni Enhanced",
		baseSpecies: "Heat Blast",
		forme: "Omni Enhanced",
		formeLetter: "O",
		types: ["Fire", "Electric"],
		baseStats: {hp: 80, atk: 150, def: 100, spa: 150, spd: 100, spe: 180},
		abilities: {0: "Pure Power"},
	},
  
 };

exports.BattlePokedex = BattlePokedex;