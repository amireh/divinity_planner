const K = require('./constants');
const GameAbilities = require('./GameAbilities');

function CharacterAbilities(character, onChange = Function.prototype) {
  let exports = {};

  const abilityPoints = GameAbilities.getAll().reduce(function(hash, ability) {
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

  exports.getAllocatedPointsFor = function(ability) {
    return abilityPoints[ability];
  }

  exports.removePoint = function(id) {
    if (abilityPoints[id] > 0) {
      abilityPoints[id] -= 1;

      onChange();
    }
  };

  exports.toJSON = function() {
    let stats = {};

    const remaining = getRemainingPoints();

    stats.abilityPoints = GameAbilities.getAll().reduce(function(set, ability) {
      const points = abilityPoints[ability.id];

      set[ability.id] = {
        id: ability.id,
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
      return sum + getAccumulativeCost(abilityPoints[id]);
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

  exports.getPoints = function() {
    return abilityPoints;
  };

  exports.ensureIntegrity = function() {
    while (getAllocatedPoints() > getPoolSize()) {
      reduceOne();
    }

    function reduceOne() {
      Object.keys(abilityPoints).some(function(id) {
        if (abilityPoints[id] > 0) {
          abilityPoints[id] -= 1;
          return true;
        }
      });
    }
  };

  exports.toURL = function() {
    let fragments = [];
    let lastAbilityIndex = -1;

    function getIndexCharacter(index) {
      return String.fromCharCode(97+index);
    }

    GameAbilities.getAll().forEach(function(ability, index) {
      const points = abilityPoints[ability.id];

      if (points > 0) {
        if (lastAbilityIndex !== index - 1) {
          const key = K.ABILITY_URL_KEYS[ability.id];
          fragments.push(key);
        }

        lastAbilityIndex = index;
        fragments.push(getIndexCharacter(points));
      }
    });

    return fragments.join('');
  };

  exports.fromURL = function(url) {
    const abilities = GameAbilities.getAll();

    let distribution = {};
    let nextAbility = abilities[0];

    const attrKeys = Object.keys(K.ABILITY_URL_KEYS).reduce(function(set, id) {
      const key = K.ABILITY_URL_KEYS[id];

      set[key] = abilities.filter(a => a.id === id)[0];

      return set;
    }, {})

    url.split('').forEach(function(char) {
      if (attrKeys[char]) {
        nextAbility = attrKeys[char]
      }
      else {
        const points = char.charCodeAt(0) - 97;

        distribution[nextAbility.id] = points;
        abilityPoints[nextAbility.id] = points;

        nextAbility = abilities[abilities.indexOf(nextAbility) + 1];
      }
    });

    return distribution;
  };

  return exports;
}

module.exports = CharacterAbilities;