const GameTalents = require('./GameTalents')
const { TalentPointLevels } = require('./rules.yml')
const lodash = require('lodash')
const toInt = x => parseInt(x, 10)
const TalentPointLevelsAsNumbers = TalentPointLevels.map(toInt)

function CharacterTalents(character, onChange = Function.prototype) {
  const talentPoints = GameTalents.getAll().reduce(function(map, { Id }) {
    map[Id] = 0;
    return map
  }, {})

  function getAllowedPoints() {
    const charLevel = character.getLevel()

    return TalentPointLevelsAsNumbers.filter(function(level) {
      return charLevel >= level
    }).length;
  }

  function getAllocatedPoints() {
    return lodash.sum(lodash.values(talentPoints))
  }

  function getRemainingPoints({
    allowedPoints = getAllowedPoints(),
    allocatedPoints = getAllocatedPoints()
  }) {
    return allowedPoints - allocatedPoints
  }

  return {
    getPoints() {
      return talentPoints
    },

    toJSON() {
      const stats = {}
      const allowedPoints = getAllowedPoints()
      const allocatedPoints = getAllocatedPoints()
      const remainingPoints = getRemainingPoints({
        allowedPoints,
        allocatedPoints
      });

      stats.talentPoints = GameTalents.getAll().reduce(function(set, talent) {
        const selected = talentPoints[talent.Id] === 1;

        set[talent.Id] = {
          name: talent.DisplayName,
          canIncrease: !selected && remainingPoints > 0, // TODO: level / constriants
          canDecrease: selected,
          points: talentPoints[talent.Id],
        };

        return set;
      }, {});


      stats.availableTalentPoints = allowedPoints;
      stats.allocatedTalentPoints = allocatedPoints;
      stats.remainingTalentPoints = remainingPoints;

      return stats;
    },

    addPoint(id) {
      if (talentPoints[id] === 0 && getRemainingPoints({}) > 0) {
        talentPoints[id] = 1;

        onChange();

        return true;
      }
    },

    removePoint(attrId) {
      if (talentPoints[attrId] === 1) {
        talentPoints[attrId] = 0;

        onChange();
      }
    },
  }
}

module.exports = CharacterTalents