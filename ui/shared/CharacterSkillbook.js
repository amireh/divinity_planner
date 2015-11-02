const K = require('constants');
const SKILLS = require('database/skills');

function CharacterSkillbook(character, onChange = Function.prototype) {
  let exports = {};
  let book = [];

  exports.addSkill = function(id) {
    const skill = getSkillById(id);

    if (skill && canUseSkill(skill)) {
      book.push(skill.id);

      onChange();
    }
  };

  exports.hasSkill = function(id) {
    return book.indexOf(id) > -1;
  };

  exports.removeSkill = function(id) {
    if (book.indexOf(id) > -1) {
      book.splice(book.indexOf(id), 1);

      onChange();
    }
  };

  exports.toJSON = function() {
    return book;
  };

  exports.ensureIntegrity = function() {
    book = book.filter(function(id) {
      const skill = getSkillById(id);

      return canUseSkill(skill);
    });
  };

  function canUseSkill(skill) {
    if (skill.rqAbilityLevel > 0) {
      if (character.getAbilityPoints()[skill.ability] < skill.rqAbilityLevel) {
        console.debug('Missing ability points on "%s"', skill.ability);
        return false;
      }
    }

    if (skill.rqCharacterLevel > 0) {
      if (character.getLevel() < skill.rqCharacterLevel) {
        console.debug('Higher level required for "%s": %d', skill.id, skill.rqCharacterLevel);
        return false;
      }
    }

    return true;
  }

  exports.canUseSkill = canUseSkill;

  return exports;
}

function getSkillById(id) {
  return SKILLS.filter(s => s.id === id)[0];
}

module.exports = CharacterSkillbook;