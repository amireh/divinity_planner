const K = require('constants');
const ABILITIES = require('database/abilities.json');

function AbilityCalculator(character, onChange = Function.prototype) {
  let exports = {};

  const abilityPoints = ABILITIES.reduce(function(hash, ability) {
    hash[ability.id] = 0;

    return hash;
  }, {});

  exports.addPoint = function(id) {
    if (abilityPoints[id] < K.MAX_ABILITY_POINTS) {
      const remaining = getRemainingPoints();
      const cost = abilityPoints[id] + 1;

      if (remaining >= cost) {
        abilityPoints[id] += 1;

        onChange();

        return true;
      }
    }
  };

  exports.removePoint = function(attrId) {
    if (abilityPoints[attrId] > 0) {
      abilityPoints[attrId] -= 1;

      onChange();
    }
  };

  exports.toJSON = function() {
    let stats = {};

    const remaining = getRemainingPoints();

    stats.abilityPoints = ABILITIES.reduce(function(set, ability) {
      const points = abilityPoints[ability.id];

      set[ability.id] = {
        name: ability.name,
        canIncrease: points < K.MAX_ABILITY_POINTS && remaining >= getCost(points+1),
        canDecrease: points > 0,
        points: points
      };

      return set;
    }, {});


    stats.availableAbilityPoints = getPoolSize();
    stats.allocatedAbilityPoints = getAllocatedPoints();
    stats.remainingAbilityPoints = getRemainingPoints();

    return stats;
  };

  function getPoolSize() {
    const charLevel = character.getLevel();

    // TODO: Lone Wolf support
    return Array(charLevel).join(' ').split(' ').reduce(function(sum, _, index) {
      const level = index + 1;

      if (level === 1) {
        return sum + 5;
      }
      else if (level < 6) {
        return sum + 1;
      }
      else if (level < 11) {
        return sum + 2;
      }
      else {
        return sum + 3;
      }
    }, 0);
  }

  function getAllocatedPoints() {
    return Object.keys(abilityPoints).reduce((sum, id) => {
      return sum += getAccumulativeCost(abilityPoints[id]);
    }, 0);
  }

  function getRemainingPoints() {
    return getPoolSize() - getAllocatedPoints();
  }

  function getAccumulativeCost(abilityLevel) {
    switch(abilityLevel) {
      case  5: return 15; break;
      case  4: return 10; break;
      case  3: return  6; break;
      case  2: return  3; break;
      case  1: return  1; break;
      default: return  0; break;
    }
  }

  function getCost(abilityLevel) {
    return abilityLevel;
  }

  exports.getPoolSize = getPoolSize;
  exports.getAllocatedPoints = getAllocatedPoints;
  exports.getRemainingPoints = getRemainingPoints;
  exports.getAccumulativeCost = getAccumulativeCost;
  exports.getCost = getCost;

  return exports;
};

module.exports = AbilityCalculator;