const GameTalents = require('./GameTalents')
const { TalentPointLevels } = require('./rules.yml')
const lodash = require('lodash')
const { STARTING_INDEX_CHAR_CODE } = require('./constants')
const toInt = x => parseInt(x, 10)
const TalentPointLevelsAsNumbers = TalentPointLevels.map(toInt)

function CharacterTalents(character, onChange = Function.prototype) {
  const talentPoints = GameTalents.getAll().reduce(function(map, { Id }) {
    map[Id] = 0;
    return map
  }, {})

  const talentIds = Object.keys(talentPoints)

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

    toURL() {
      const pool = GameTalents.getAll()
      const separator = (a, b) => {
        return String.fromCharCode(STARTING_INDEX_CHAR_CODE + (b - a -1))
      };

      return talentIds
        .filter(x => talentPoints[x] === 1)
        .map(Id => pool.indexOf(GameTalents.get(Id)))
        .reduce((list, at) => {
          const lastEntry = list[list.length - 1]

          // add separator only if they are more than 1 index apart
          if (lastEntry && at - lastEntry.index > 1) {
            return list.concat({
              padding: separator(lastEntry.index, at),
              index: at,
            })
          }
          else {
            return list.concat({
              padding: '',
              index: at,
            })
          }
        }, [])
        .map(x => `${x.padding}1`)
        .join('')
    },

    fromURL(string) {
      const pool = GameTalents.getAll()
      const distanceFrom = char => char.charCodeAt(0) - STARTING_INDEX_CHAR_CODE

      return string
        .split('')
        .reduce(function({ cursor, selection }, char) {
          if (char === '1') {
            return {
              cursor: cursor + 1,
              selection: selection.concat(pool[cursor].Id)
            }
          }
          else {
            return {
              cursor: cursor + distanceFrom(char),
              selection: selection
            }
          }
        }, { cursor: 0, selection: [] })
        .selection
    },

    saveFromURL(selection) {
      talentIds.forEach(id => {
        talentPoints[id] = 0;
      });

      selection.forEach(talentId => {
        talentPoints[talentId] = 1;
      });
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

    ensureIntegrity() {
      const allocated = talentIds.filter(x => talentPoints[x] === 1);
      const valid = allocated.slice(0, getAllowedPoints())

      talentIds.forEach(function(id) {
        if (valid.indexOf(id) > -1) {
          talentPoints[id] = 1
        }
        else {
          talentPoints[id] = 0
        }
      })
    },

    selected(id) {
      return talentPoints[id] === 1;
    }
  }
}

module.exports = CharacterTalents