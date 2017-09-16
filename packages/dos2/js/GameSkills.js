const Skills = require('dos2-pak-scraper/db/01-refined.yml');
const SkillIndex = Skills.reduce(function(map, skill) {
  map[skill.Id] = skill;
  return map;
}, {})

exports.getAll = function() {
  return Skills;
};

exports.get = function(id) {
  return SkillIndex[id];
};