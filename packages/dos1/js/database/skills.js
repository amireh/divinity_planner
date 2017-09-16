module.exports = require('./abilities.json').reduce(function(skills, ability) {
  return skills.concat(ability.skills);
}, []);
