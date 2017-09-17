const {
  Attributes,
  AttributeSoftCap,
  AttributeLoneWolfCap,
  BaseAttributePoints,
  StartingCharacterAttributePoints
} = require('./rules.yml')
const { ATTRIBUTE_URL_KEYS, STARTING_INDEX_CHAR_CODE } = require('./constants')

function CharacterAttributes(character, onChange = Function.prototype) {
  let exports = {};

  const attributePoints = Attributes.reduce(function(hash, attribute) {
    hash[attribute.Id] = 0;

    return hash;
  }, {});

  const getCap = () => {
    return character.isLoneWolf() ? AttributeLoneWolfCap : AttributeSoftCap
  }

  exports.addPoints = function(id, count = 1) {
    const allocated = attributePoints[id]
    const allocatable = Math.min(count, getRemainingPoints())

    if (allocatable === 0) {
      return false;
    }

    const capped = Math.min(allocatable + allocated, getCap());

    attributePoints[id] = capped;

    onChange();

    return true;
  };

  exports.removePoints = function(id, count = 1) {
    if (attributePoints[id] > 0) {
      attributePoints[id] = Math.max(0, attributePoints[id] - count);

      onChange();

      return true;
    }
  };

  exports.toJSON = function() {
    let stats = {};

    const remaining = getRemainingPoints();
    const isLoneWolf = character.isLoneWolf()
    const cap = isLoneWolf ? AttributeLoneWolfCap : AttributeSoftCap

    stats.attributePoints = Attributes.reduce(function(set, attribute) {
      const points = attributePoints[attribute.Id];

      set[attribute.Id] = {
        name: attribute.DisplayName,
        canIncrease: points < cap && remaining > 0,
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
    const modifier = character.isLoneWolf() ? 2 : 1

    return StartingCharacterAttributePoints + (
      Math.max(0, character.getLevel()) * modifier
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