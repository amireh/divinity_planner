const K = require('constants');
const EventEmitter = require('EventEmitter');
const AttributeCalculator = require('AttributeCalculator');
const AbilityCalculator = require('AbilityCalculator');
const assign = require('utils/assign');

function Profile() {
  let API = {};
  const emitter = EventEmitter();

  const attributeCalculator = AttributeCalculator({
    getLevel: () => API.getLevel()
  }, emitter.emitChange);

  const abilityCalculator = AbilityCalculator({
    getLevel: () => API.getLevel()
  }, emitter.emitChange);

  let level = null;

  API.addChangeListener = emitter.addChangeListener;
  API.removeChangeListener = emitter.removeChangeListener;

  API.addAttributePoint = attributeCalculator.addPoint;
  API.removeAttributePoint = attributeCalculator.removePoint;

  API.addAbilityPoint = abilityCalculator.addPoint;
  API.removeAbilityPoint = abilityCalculator.removePoint;

  API.getLevel = function() {
    return level || inferLevel();
  };

  API.setLevel = function(inLevel) {
    level = inLevel;
    emitter.emitChange();
  };

  API.toJSON = function() {
    let stats = {};

    stats.level = API.getLevel();

    assign(stats, attributeCalculator.toJSON());
    assign(stats, abilityCalculator.toJSON());

    return JSON.parse(JSON.stringify(stats));
  };

  function inferLevel() {
    return Math.max(
      1,
      Math.max(attributeCalculator.getAllocatedPoints() - K.STARTING_ATTRIBUTE_POINTS, 0) * 2
    );
  }

  return API;
};

module.exports = Profile;