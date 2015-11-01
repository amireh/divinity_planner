const K = require('constants');
const EventEmitter = require('EventEmitter');
const ATTRIBUTES = require('database/attributes.json');
const {
  BASE_ATTRIBUTE_POINTS,
  MAX_ATTRIBUTE_POINTS,
  STARTING_ATTRIBUTE_POINTS
} = K;

function Profile() {
  let API = {};

  const emitter = EventEmitter();
  const attributePoints = ATTRIBUTES.reduce(function(set, attr) {
    set[attr.id] = BASE_ATTRIBUTE_POINTS;
    return set;
  }, {});

  API.addAttributePoint = function(attrId) {
    if (API.getLevel() === K.MAX_LEVEL) {
      return;
    }

    if (attributePoints[attrId] < MAX_ATTRIBUTE_POINTS) {
      attributePoints[attrId] += 1;
      emitter.emitChange();
    }
  };

  API.removeAttributePoint = function(attrId) {
    if (attributePoints[attrId] > BASE_ATTRIBUTE_POINTS) {
      attributePoints[attrId] = attributePoints[attrId] - 1;
      emitter.emitChange();
    }
  };

  API.getLevel = function() {
    return Math.max(
      1,
      Math.max(getAllocatedPoints() - STARTING_ATTRIBUTE_POINTS, 0) * 2
    );
  };

  API.toJSON = function() {
    let stats = {};

    stats.level = API.getLevel();
    stats.attributePoints = ATTRIBUTES.reduce(function(set, attr) {
      const points = attributePoints[attr.id];

      set[attr.id] = {
        canIncrease: points < MAX_ATTRIBUTE_POINTS && stats.level < K.MAX_LEVEL,
        canDecrease: points > BASE_ATTRIBUTE_POINTS,
        points: points
      };

      return set;
    }, {});

    stats.allocatedPoints = getAllocatedPoints();

    return JSON.parse(JSON.stringify(stats));
  };

  API.addChangeListener = emitter.addChangeListener;
  API.removeChangeListener = emitter.removeChangeListener;

  function getAllocatedPoints() {
    return Object.keys(attributePoints).reduce((sum, attrId) => {
      return sum += (attributePoints[attrId] - BASE_ATTRIBUTE_POINTS);
    }, 0);
  }

  return API;
};

module.exports = Profile;