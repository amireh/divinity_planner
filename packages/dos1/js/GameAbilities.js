const ABILITIES = require('./database/abilities');
const ABILITIES_EE = require('./database/abilities_ee');
const GameState = require('./GameState');
const normalize = require('./utils/normalize');

const StaticAbilities = [];

[
  {
    name: 'Weapons',
    abilities: [
      'Bow',
      'Crossbow',
      'Single-Handed',
      'Two-Handed',
      'Tenebrium'
    ]
  },
  {
    name: 'Defence',
    abilities: [
      'Armour Specialist',
      'Body Building',
      'Shield Specialist',
      'Willpower'
    ]
  },
  {
    name: 'Personality',
    abilities: [
      'Bartering',
      'Charisma',
      'Leadership',
      'Lucky Charm'
    ]
  },
  {
    name: 'Craftsmanship',
    abilities: [
      'Blacksmithing',
      'Crafting',
      'Loremaster',
      'Telekinesis'
    ]
  },
  {
    name: 'Nasty Deeds',
    abilities: [
      'Lockpicking',
      'Pickpocketing',
      'Sneaking'
    ]
  }
].forEach(function(category) {
  category.abilities.forEach(function(name) {
    StaticAbilities.push({
      id: normalize(name),
      name: name,
      category: category.name
    });
  });
});

ABILITIES.forEach(function(ability) { ability.category = 'Skills'; });
ABILITIES_EE.forEach(function(ability) { ability.category = 'Skills'; });

const StandardAbilities = StaticAbilities.concat(
  ABILITIES
);

const EnhancedAbilities = StaticAbilities.concat(
  ABILITIES_EE
);

exports.getAll = function() {
  return StaticAbilities.concat(
    GameState.isEE() ? EnhancedAbilities : StandardAbilities
  );
};

exports.get = function(id) {
  return exports.getAll().filter(a => a.id === id)[0];
};

// function sort(a, b) {
//   // console.log(ORDER.indexOf(a.category), ORDER.indexOf(b.category));
//   return ORDER.indexOf(a.category) >= ORDER.indexOf(b.category) ? -1 : 1;
// }
