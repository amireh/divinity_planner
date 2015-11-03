const K = require('constants');
const SKILLS = require('database/skills');
const ABILITIES = require('database/abilities');

function CharacterSkillbook(character, onChange = Function.prototype) {
  let exports = {};
  let book = [];

  Object.defineProperty(exports, 'length', {
    get() { return book.length; }
  });

  exports.addSkill = function(id) {
    const skill = getSkillById(id);

    if (skill && canUseSkill(skill) === true) {
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

      return canUseSkill(skill) === true;
    });
  };

  exports.toURL = function() {
    let fragments = [];

    function getIndexCharacter(skill) {
      const ability = ABILITIES.filter(a => a.id === skill.ability)[0];
      const index = ability.skills.indexOf(skill);

      return String.fromCharCode(K.STARTING_INDEX_CHAR_CODE + index);
    }

    ABILITIES.forEach(function(ability, index) {
      const skills = book.reduce(function(set, id) {
        const skill = getSkillById(id);

        if (skill.ability === ability.id) {
          set.push(skill);
        }

        return set;
      }, []);

      if (skills.length > 0) {
        fragments.push(K.ABILITY_URL_KEYS[ability.id]);

        skills.forEach(function(skill) {
          fragments.push(getIndexCharacter(skill));
        });
      }
    });

    return fragments.join('');
  };

  exports.fromURL = function(url) {
    let distribution = {};
    let currentAbility = ABILITIES[0];

    book = [];

    const indexedAbilities = Object.keys(K.ABILITY_URL_KEYS).reduce(function(set, id) {
      set[K.ABILITY_URL_KEYS[id]] = ABILITIES.filter(a => a.id === id)[0];

      return set;
    }, {})

    url.split('').forEach(function(char) {
      if (indexedAbilities[char]) {
        currentAbility = indexedAbilities[char]
      }
      else {
        const skillIndex = char.charCodeAt(0) - K.STARTING_INDEX_CHAR_CODE;
        const skill = currentAbility.skills[skillIndex];

        exports.addSkill(skill.id);
      }
    });
  };

  function canUseSkill(skill) {
    if (typeof skill === 'string') {
      skill = getSkillById(skill);
    }

    const abilityId = skill.ability;
    const abilityPoints = character.getAbilityPoints()[abilityId];
    const abilitySkillCount = book.filter(function(id) {
      return getSkillById(id).ability === abilityId;
    }).length;

    const allowedSkillCount = getSkillPoolSize(abilityPoints);

    if (skill.rqAbilityLevel > 0 && abilityPoints < skill.rqAbilityLevel) {
      console.debug('Missing ability points on "%s"', abilityId);
      return K.ERR_ABILITY_LEVEL_TOO_LOW;
    }

    if (allowedSkillCount <= abilitySkillCount) {
      console.debug('Ability skill limit "%d" reached.', allowedSkillCount);
      return K.ERR_ABILITY_CAP_REACHED;
    }

    if (skill.rqCharacterLevel > 0 && character.getLevel() < skill.rqCharacterLevel) {
      console.debug('Higher level required for "%s": %d', skill.id, skill.rqCharacterLevel);
      return K.ERR_CHAR_LEVEL_TOO_LOW;
    }

    return true;
  }

  exports.canUseSkill = canUseSkill;

  return exports;
}

function getSkillById(id) {
  return SKILLS.filter(s => s.id === id)[0];
}

function getSkillPoolSize(abilityPoints) {
  switch(abilityPoints) {
    case 0:
      return 0;
      break;

    case 1:
      return K.BASE_ABILITY_SKILL_COUNT;
      break;

    case 2:
    case 3:
    case 4:
      return K.BASE_ABILITY_SKILL_COUNT + abilityPoints * 2;
      break;

    case 5:
      return K.UNLIMITED;

    default:
      console.warn('Expected ability points to range from 0 to 5, got "%s"!', abilityPoints);
      return 0;
  }
}

module.exports = CharacterSkillbook;
module.exports.getSkillPoolSize = getSkillPoolSize;