const {
  Attributes,
  BaseAttributePoints,
  MaxAttributePoints,
  StartingAttributePoints
} = require('./rules.yml')
const { ATTRIBUTE_URL_KEYS, STARTING_INDEX_CHAR_CODE } = require('./constants')

function CharacterAttributes(character, onChange = Function.prototype) {
  let exports = {};

  const attributePoints = Attributes.reduce(function(hash, attribute) {
    hash[attribute.Id] = 0;

    return hash;
  }, {});

  exports.addPoint = function(id) {
    if (attributePoints[id] < MaxAttributePoints && getRemainingPoints() > 0) {
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

    stats.attributePoints = Attributes.reduce(function(set, attribute) {
      const points = attributePoints[attribute.Id];

      set[attribute.Id] = {
        name: attribute.DisplayName,
        canIncrease: points < MaxAttributePoints && remaining > 0,
        canDecrease: points > 0,
        points: points + BaseAttributePoints
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
      return String.fromCharCode(STARTING_INDEX_CHAR_CODE+index);
    }

    Attributes.forEach(function(attribute, index) {
      const points = attributePoints[attribute.Id];

      if (points > 0) {
        if (lastAttrIndex !== index - 1) {
          const key = ATTRIBUTE_URL_KEYS[attribute.Id];
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
    let nextAttribute = Attributes[0];

    const attrKeys = Object.keys(ATTRIBUTE_URL_KEYS).reduce(function(set, id) {
      const key = ATTRIBUTE_URL_KEYS[id];

      set[key] = Attributes.filter(a => a.Id === id)[0];

      return set;
    }, {})

    url.split('').forEach(function(char) {
      if (attrKeys[char]) {
        nextAttribute = attrKeys[char]
      }
      else {
        const points = char.charCodeAt(0) - 97;

        distribution[nextAttribute.Id] = points;
        attributePoints[nextAttribute.Id] = points;

        nextAttribute = Attributes[Attributes.indexOf(nextAttribute) + 1];
      }
    });

    return distribution;
  };

  function getPoolSize() {
    return StartingAttributePoints + Math.floor(
      Math.max(0, character.getLevel()) / 2
    );
  }

  function getAllocatedPoints() {
    return Object.keys(attributePoints).reduce((sum, id) => {
      return sum + attributePoints[id];
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
}

module.exports = CharacterAttributes;