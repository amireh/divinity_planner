const GameTalents = require('./GameTalents')

function CharacterTalents(character, onChange = Function.prototype) {
  return {
    getPoints() {
      return 0
    },

    toJSON() {
      const stats = {}

      stats.talentPoints = GameTalents.getAll().reduce(function(set, talent) {
        set[talent.Id] = {
          name: talent.DisplayName,
          canIncrease: false, // TODO
          canDecrease: false, // TODO
          points: 0, // TODO
        };

        return set;
      }, {});


      stats.availableTalentPoints = 0; // TODO
      stats.allocatedTalentPoints = 0; // TODO
      stats.remainingTalentPoints = 0; // TODO

      return stats;
    }
  }
}

module.exports = CharacterTalents