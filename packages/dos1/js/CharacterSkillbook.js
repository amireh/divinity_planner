const K = require('./constants');
const GameState = require('./GameState');
const GameSkills = require('./GameSkills');
const GameAbilities = require('./GameAbilities');

function CharacterSkillbook(character, onChange = Function.prototype) {
  let exports = {};
  let book = [];

  Object.defineProperty(exports, 'length', {
    get() { return book.length; }
  });

  exports.addSkill = function(id) {
    const skill = getSkillById(id);

    if (skill && canLearnSkill(skill) === true && !exports.hasSkill(id)) {
      book.push(skill.id);

      onChange();

      return true;
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
    const oldBook = [].concat(book);

    book = [];

    oldBook.forEach(exports.addSkill);
  };

  exports.toURL = function() {
    let fragments = [];

    function getIndexCharacter(skill) {
      const ability = GameAbilities.get(skill.ability);
      const index = ability.skills.indexOf(skill);

      return String.fromCharCode(K.STARTING_INDEX_CHAR_CODE + index);
    }

    GameAbilities.getAll().forEach(function(ability) {
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
    const abilities = GameAbilities.getAll();
    let currentAbility = abilities[0];

    book = [];

    const indexedAbilities = Object.keys(K.ABILITY_URL_KEYS).reduce(function(set, id) {
      set[K.ABILITY_URL_KEYS[id]] = abilities.filter(a => a.id === id)[0];

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

  function canLearnSkill(skill) {
    return !exports.getSkillRequirement(skill);
  }

  exports.getSkillRequirement = function(skill) {
    if (GameState.isEE()) {
      return exports.getSkillRequirementEE(skill);
    }

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
      return K.ERR_ABILITY_LEVEL_TOO_LOW;
    }

    if (abilitySkillCount >= allowedSkillCount) {
      return K.ERR_ABILITY_CAP_REACHED;
    }

    if (skill.rqCharacterLevel > 0 && character.getLevel() < skill.rqCharacterLevel) {
      return K.ERR_CHAR_LEVEL_TOO_LOW;
    }
  };

  exports.getSkillRequirementEE = function(skill) {
    if (typeof skill === 'string') {
      skill = getSkillById(skill);
    }

    const abilityId = skill.ability;
    const abilityPoints = character.getAbilityPoints()[abilityId];
    const poolSize = getSkillPoolSizeEE(abilityPoints);
    const currentTierSkills = book.reduce(function(tierSkills, id) {
      const skillInBook = getSkillById(id);

      if (skillInBook.ability === abilityId) {
        if (!tierSkills[skillInBook.tier]) {
          tierSkills[skillInBook.tier] = 0;
        }

        tierSkills[skillInBook.tier] += 1;
      }

      return tierSkills;
    }, {});

    if (currentTierSkills[skill.tier] === poolSize[skill.tier]) {
      return K.ERR_ABILITY_CAP_REACHED;
    }

    if (character.getLevel() < skill.level) {
      return K.ERR_CHAR_LEVEL_TOO_LOW;
    }

    switch(skill.tier) {
      case K.TIER_NOVICE:
        if (abilityPoints < 1) {
          return K.ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;
      case K.TIER_ADEPT:
        if (abilityPoints < 2) {
          return K.ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;

      case K.TIER_MASTER:
        if (abilityPoints < 4) {
          return K.ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;
    }
  };

  exports.canLearnSkill = canLearnSkill;

  return exports;
}

function getSkillById(id) {
  return GameSkills.getAll().filter(s => s.id === id)[0];
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

//
// 1 - 3 Novice Skills
// 2 - 5 Novice Skills, 2 Adept Skills
// 3 - 6 Novice Skills, 3 Adept Skills
// 4 - 6 Novice Skills, 4 Adept Skills, 1 Master Skill
// 5 - 6 Novice Skills, 4 Adept Skills, 2 Master Skills
function getSkillPoolSizeEE(abilityPoints) {
  let pool = {};

  pool[K.TIER_NOVICE] = 0;
  pool[K.TIER_ADEPT]  = 0;
  pool[K.TIER_MASTER] = 0;

  switch(abilityPoints) {
    case 0:
      break;

    case 1:
      pool[K.TIER_NOVICE] = 3;
      break;

    case 2:
      pool[K.TIER_NOVICE] = 5;
      pool[K.TIER_ADEPT]  = 2;
      break;

    case 3:
      pool[K.TIER_NOVICE] = 6;
      pool[K.TIER_ADEPT]  = 3;
      break;

    case 4:
      pool[K.TIER_NOVICE] = 6;
      pool[K.TIER_ADEPT]  = 4;
      pool[K.TIER_MASTER] = 1;
      break;

    case 5:
      pool[K.TIER_NOVICE] = 6;
      pool[K.TIER_ADEPT]  = 4;
      pool[K.TIER_MASTER] = 2;
      break;

    default:
      console.warn('Expected ability points to range from 0 to 5, got "%s"!', abilityPoints);
  }

  return pool;
}

module.exports = CharacterSkillbook;
module.exports.getSkillPoolSize = getSkillPoolSize;
module.exports.getSkillPoolSizeEE = getSkillPoolSizeEE;