const Talents = require('dos2-pak-scraper/db/01-talents.yml');
const TalentIndex = Talents.reduce(function(map, talent) {
  map[talent.Id] = talent;

  return map;
}, {})

exports.getAll = function() {
  return Talents;
};

exports.get = function(id) {
  return TalentIndex[id];
};