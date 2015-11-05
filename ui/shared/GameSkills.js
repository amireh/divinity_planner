const SKILLS = require('database/skills');
const SKILLS_EE = require('database/skills_ee');
const GameState = require('GameState');

exports.getAll = function() {
  return GameState.isEE() ? SKILLS_EE : SKILLS;
};

exports.get = function(id) {
  return exports.getAll().filter(s => s.id === id)[0];
};