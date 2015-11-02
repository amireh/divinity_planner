const K = require('constants');
const ATTRIBUTES = require('database/attributes.json');

function CharacterAttributes(character, onChange = Function.prototype) {
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
        points: points + K.BASE_ATTRIBUTE_POINTS
      };

      return set;
    }, {});


    stats.availableAttributePoints = getPoolSize();
    stats.allocatedAttributePoints = getAllocatedPoints();
    stats.remainingAttributePoints = getRemainingPoints();

    return stats;
  };

  exports.toURL = function() {
    let fragments = [];
    let lastAttrIndex = -1;

    function getIndexCharacter(index) {
      return String.fromCharCode(97+index);
    }

    ATTRIBUTES.forEach(function(attr, index) {
      const points = attributePoints[attr.id];

      if (points > 0) {
        if (lastAttrIndex !== index - 1) {
          const key = K.ATTRIBUTE_URL_KEYS[attr.id];
          fragments.push(key);
        }

        lastAttrIndex = index;
        fragments.push(getIndexCharacter(points));
      }
    });

    return fragments.join('');
  };

  exports.fromURL = function(url) {
    let distribution = {};
    let nextAttribute = ATTRIBUTES[0];

    const attrKeys = Object.keys(K.ATTRIBUTE_URL_KEYS).reduce(function(set, id) {
      const key = K.ATTRIBUTE_URL_KEYS[id];

      set[key] = ATTRIBUTES.filter(a => a.id === id)[0];

      return set;
    }, {})

    url.split('').forEach(function(char) {
      if (attrKeys[char]) {
        nextAttribute = attrKeys[char]
      }
      else {
        const points = char.charCodeAt(0) - 97;

        distribution[nextAttribute.id] = points;
        attributePoints[nextAttribute.id] = points;

        nextAttribute = ATTRIBUTES[ATTRIBUTES.indexOf(nextAttribute) + 1];
      }
    });

    return distribution;
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
  exports.getPoints = function() {
    return attributePoints;
  };

  exports.ensureIntegrity = function() {
    while (getAllocatedPoints() > getPoolSize()) {
      reduceOne();
    }

    function reduceOne() {
      Object.keys(attributePoints).some(function(id) {
        if (attributePoints[id] > 0) {
          attributePoints[id] -= 1;
          return true;
        }
      });
    }
  };

  return exports;
};

module.exports = CharacterAttributes;