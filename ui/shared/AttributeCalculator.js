const K = require('constants');
const ATTRIBUTES = require('database/attributes.json');

function AttributeCalculator(character, onChange = Function.prototype) {
  let exports = {};

  const attributePoints = ATTRIBUTES.reduce(function(hash, ability) {
    hash[ability.id] = 0;

    return hash;
  }, {});

  exports.addPoint = function(id) {
    if (attributePoints[id] < K.MAX_ATTRIBUTE_POINTS && getRemainingPoints() > 0) {
      attributePoints[id] += 1;

      onChange();

      return true;
    }
  };

  exports.removePoint = function(attrId) {
    if (attributePoints[attrId] > 0) {
      attributePoints[attrId] -= 1;

      onChange();
    }
  };

  exports.toJSON = function() {
    let stats = {};

    const remaining = getRemainingPoints();

    stats.attributePoints = ATTRIBUTES.reduce(function(set, ability) {
      const points = attributePoints[ability.id];

      set[ability.id] = {
        name: ability.name,
        canIncrease: points < K.MAX_ATTRIBUTE_POINTS && remaining > 0,
        canDecrease: points > 0,
        points: points
      };

      return set;
    }, {});


    stats.availableAttributePoints = getPoolSize();
    stats.allocatedAttributePoints = getAllocatedPoints();
    stats.remainingAttributePoints = getRemainingPoints();

    return stats;
  };

  function getPoolSize() {
    return K.STARTING_ATTRIBUTE_POINTS + Math.floor(
      Math.max(0, character.getLevel()) / 2
    );
  }

  function getAllocatedPoints() {
    return Object.keys(attributePoints).reduce((sum, id) => {
      return sum += attributePoints[id];
    }, 0);
  }

  function getRemainingPoints() {
    return getPoolSize() - getAllocatedPoints();
  }


  exports.getPoolSize = getPoolSize;
  exports.getAllocatedPoints = getAllocatedPoints;
  exports.getRemainingPoints = getRemainingPoints;

  return exports;
};

module.exports = AttributeCalculator;