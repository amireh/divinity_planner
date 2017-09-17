const Abilities = require('dos2-pak-scraper/db/01-refined.yml');
const SkillIndex = Abilities.reduce(function(map, ability) {
  ability.Skills.forEach(skill => {
    map[skill.Id] = skill;
  })

  return map;
}, {})

exports.getAll = function() {
  return Abilities;
};

exports.get = function(id) {
  return SkillIndex[id];
};