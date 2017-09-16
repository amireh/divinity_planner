const Skills = require('dos2-pak-scraper/db/01-refined.yml');

exports.getAll = function() {
  return Skills;
};

exports.get = function(id) {
  return exports.getAll().filter(s => s.id === id)[0];
};