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
    if (inLevel <= K.MAX_LEVEL && inLevel >= 1) {
      level = inLevel;
      emitter.emitChange();
    }
  };

  API.toJSON = function() {
    let stats = {};

    stats.level = API.getLevel();
    stats.canIncreaseLevel = stats.level < K.MAX_LEVEL;
    stats.canDecreaseLevel = stats.level > 1;

    assign(stats, attributeCalculator.toJSON());
    assign(stats, abilityCalculator.toJSON());

    return JSON.parse(JSON.stringify(stats));
  };

  API.toURL = function() {
    let fragments = [];
    let attributesURL = attributeCalculator.toURL();

    if (attributesURL.length) {
      fragments.push('X');
      fragments.push(attributesURL);
    }

    return fragments.join('');
  };

  API.fromURL = function(url) {
    let domain;
    let attributesStr = '';

    url.split('').forEach(function(char) {
      switch(char) {
        case 'X':
          domain = 'attributes';
        break;

        default:
          if (domain === 'attributes') {
            attributesStr += char;
          }
      }
    });

    if (attributesStr.length) {
      attributeCalculator.fromURL(attributesStr);
    }
  };

  function inferLevel() {
    return Math.max(
      1,
      Math.max(attributeCalculator.getAllocatedPoints() - K.STARTING_ATTRIBUTE_POINTS, 0) * 2
    );
  }

  emitter.addChangeListener(function() {
    window.location.hash = `#${API.toURL()}`;
  });

  return API;
};

module.exports = Profile;