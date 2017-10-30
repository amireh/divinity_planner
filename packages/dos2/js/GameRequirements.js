const Requirements = require('dos2-pak-scraper/db/01-requirements.yml');
const RequirementIndex = Requirements.reduce(function(map, req) {
  map[req.Id] = req.Constraints;

  return map;
}, {})

exports.getAll = function() {
  return Requirements;
};

exports.getConstraintsFor = function(id) {
  return RequirementIndex[id] || [];
};