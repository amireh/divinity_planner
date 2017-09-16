module.exports = require('./abilities_ee.json').reduce(function(skills, ability) {
  return skills.concat(ability.skills);
}, []);
