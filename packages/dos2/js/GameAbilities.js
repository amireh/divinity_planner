const Abilities = require('dos2-pak-scraper/db/01-skills.yml');
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