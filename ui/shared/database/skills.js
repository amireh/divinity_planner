module.exports = require('database/abilities.json').reduce(function(skills, ability) {
  return skills.concat(ability.skills);
}, []);
