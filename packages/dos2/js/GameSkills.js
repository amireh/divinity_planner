const Abilities = require('dos2-pak-scraper/db/01-skills.yml');
const SkillIndex = Abilities.reduce(function(map, ability) {
  ability.Skills.forEach(skill => {
    map[skill.Id] = skill;
  })

  return map;
}, {})

const AbilityIndex = Abilities.reduce(function(map, ability) {
  map[ability.Id] = ability.Skills;
  return map
}, {})

exports.getAll = function() {
  return Abilities;
};

exports.get = function(id) {
  return SkillIndex[id];
};

exports.getByAbility = function(abilityId) {
  return AbilityIndex[abilityId]
}
