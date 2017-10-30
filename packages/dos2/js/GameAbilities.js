const CombatAbilities = require('dos2-pak-scraper/db/01-combat-abilities.yml');
const CivilAbilities = require('dos2-pak-scraper/db/01-civil-abilities.yml');
const Abilities = CombatAbilities.concat(CivilAbilities)

const AbilityIndex = Abilities.reduce(function(map, ability) {
  map[ability.Id] = ability;

  return map;
}, {})

exports.getAll = function() {
  return Abilities;
};

exports.get = function(id) {
  return AbilityIndex[id];
};