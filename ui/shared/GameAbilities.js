const ABILITIES = require('database/abilities');
const ABILITIES_EE = require('database/abilities_ee');
const GameState = require('GameState');

exports.getAll = function() {
  return GameState.isEE() ? ABILITIES_EE : ABILITIES;
};

exports.get = function(id) {
  return exports.getAll().filter(a => a.id === id)[0];
};