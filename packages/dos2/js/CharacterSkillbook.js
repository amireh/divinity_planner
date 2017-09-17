const {
  ABILITY_URL_KEYS,
  ERR_ABILITY_CAP_REACHED,
  ERR_ABILITY_LEVEL_TOO_LOW,
  STARTING_INDEX_CHAR_CODE,
  TIER_STARTER,
  TIER_NOVICE,
  TIER_ADEPT,
  TIER_MASTER,
} = require('./constants');
const GameSkills = require('./GameSkills');
const GameAbilities = require('./GameAbilities');
const { TierAccessibility } = require('./rules.yml')

function CharacterSkillbook(character, onChange = Function.prototype) {
  let exports = {};
  let book = [];

  Object.defineProperty(exports, 'length', {
    get() { return book.length; }
  });

  exports.addSkill = function(id) {
    const skill = getSkillById(id);

    if (skill && canLearnSkill(skill) === true && !exports.hasSkill(id)) {
      book.push(skill.Id);

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
      const ability = GameAbilities.get(skill.Ability);
      const index = ability.Skills.indexOf(skill);

      return String.fromCharCode(STARTING_INDEX_CHAR_CODE + index);
    }

    GameAbilities.getAll().forEach(function(ability) {
      const skills = book.reduce(function(set, id) {
        const skill = getSkillById(id);

        if (skill.Ability === ability.Id) {
          set.push(skill);
        }

        return set;
      }, []);

      if (skills.length > 0) {
        fragments.push(ABILITY_URL_KEYS[ability.Id]);

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

    const indexedAbilities = Object.keys(ABILITY_URL_KEYS).reduce(function(set, id) {
      set[ABILITY_URL_KEYS[id]] = abilities.filter(a => a.Id === id)[0];

      return set;
    }, {})

    url.split('').forEach(function(char) {
      if (indexedAbilities[char]) {
        currentAbility = indexedAbilities[char]
      }
      else {
        const skillIndex = char.charCodeAt(0) - STARTING_INDEX_CHAR_CODE;
        const skill = currentAbility.Skills[skillIndex];

        exports.addSkill(skill.Id);
      }
    });
  };

  function canLearnSkill(skill) {
    return !exports.getSkillRequirement(skill);
  }

  exports.getSkillRequirement = function(skill) {
    if (typeof skill === 'string') {
      skill = getSkillById(skill);
    }

    const abilityId = skill.Ability;
    const abilityPoints = character.getAbilityPoints()[abilityId];
    const poolSize = getSkillPoolSize(abilityPoints);
    const currentTierSkills = book.reduce(function(tierSkills, id) {
      const skillInBook = getSkillById(id);

      if (skillInBook.Ability === abilityId) {
        if (!tierSkills[skillInBook.Tier]) {
          tierSkills[skillInBook.Tier] = 0;
        }

        tierSkills[skillInBook.Tier] += 1;
      }

      return tierSkills;
    }, {});

    if (currentTierSkills[skill.Tier] === poolSize[skill.Tier]) {
      return ERR_ABILITY_CAP_REACHED;
    }

    switch(skill.Tier) {
      case TIER_STARTER:
      case TIER_NOVICE:
        if (abilityPoints < 1) {
          return ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;

      case TIER_ADEPT:
        if (abilityPoints < 2) {
          return ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;

      case TIER_MASTER:
        if (abilityPoints < 4) {
          return ERR_ABILITY_LEVEL_TOO_LOW;
        }

        break;
    }
  };

  exports.canLearnSkill = canLearnSkill;

  return exports;
}

function getSkillById(id) {
  return GameSkills.get(id);
}

//
// 1 - 3 Novice Skills
// 2 - 5 Novice Skills, 2 Adept Skills
// 3 - 6 Novice Skills, 3 Adept Skills
// 4 - 6 Novice Skills, 4 Adept Skills, 1 Master Skill
// 5 - 6 Novice Skills, 4 Adept Skills, 2 Master Skills
function getSkillPoolSize(abilityPoints) {
  const pool = TierAccessibility[String(abilityPoints)];

  return [].concat(pool || []).reduce(function(map, { Tier, Skills }) {
    map[Tier] = Skills;
    return map;
  }, {})
}

module.exports = CharacterSkillbook;
module.exports.getSkillPoolSize = getSkillPoolSize;
