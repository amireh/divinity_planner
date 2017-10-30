const { DOMAIN_URL_KEYS, DOMAIN_URL_SEPARATOR, STARTING_INDEX_CHAR_CODE } = require('./constants');
const { EventEmitter } = require('dos-common');
const CharacterAttributes = require('./CharacterAttributes');
const CharacterAbilities = require('./CharacterAbilities');
const CharacterSkillbook = require('./CharacterSkillbook');
const CharacterTalents = require('./CharacterTalents');
const Rules = require('./rules.yml')
const { assign, partial } = require('lodash');

function Character(attrs = {}) {
  const emitter = EventEmitter();
  const character = {};

  let { emitChange } = emitter;
  let API = assign({}, attrs);

  const attributes = CharacterAttributes(character, emitter.emitChange);
  const abilities = CharacterAbilities(character, emitter.emitChange);
  const skillbook = CharacterSkillbook(character, emitter.emitChange)
  const talents = CharacterTalents(character, emitter.emitChange)

  let level = null;

  emitter.addChangeListener(ensureIntegrity);

  API.addChangeListener = emitter.addChangeListener;
  API.removeChangeListener = emitter.removeChangeListener;

  API.addAttributePoints = attributes.addPoints;
  API.removeAttributePoints = attributes.removePoints;

  API.addAbilityPoint = abilities.addPoint;
  API.removeAbilityPoint = abilities.removePoint;

  API.addTalentPoint = talents.addPoint;
  API.removeTalentPoint = talents.removePoint;

  API.getLevel = function() {
    return level || 1;
  };

  API.setLevel = function(inLevel) {
    if (inLevel > Rules.MaxLevel) {
      level = Rules.MaxLevel;
    }
    else if (inLevel < 1) {
      level = 1;
    }
    else {
      level = inLevel;
    }

    emitChange();
  };

  API.toJSON = function() {
    let stats = {};

    stats.level = API.getLevel();
    stats.canIncreaseLevel = stats.level < Rules.MaxLevel;
    stats.canDecreaseLevel = stats.level > 1;
    stats.skillbook = skillbook.toJSON();

    assign(stats, attributes.toJSON());
    assign(stats, abilities.toJSON());
    assign(stats, talents.toJSON());
    assign(stats, attrs);

    return JSON.parse(JSON.stringify(stats));
  };

  API.toURL = function() {
    const fragments = [];
    const attributesURL = attributes.toURL();
    const abilitiesURL = abilities.toURL();
    const skillbookURL = skillbook.toURL();
    const talentsURL = talents.toURL();

    if (level > 1) {
      fragments.push(DOMAIN_URL_KEYS['level']);
      fragments.push(String.fromCharCode(STARTING_INDEX_CHAR_CODE + level - 1));
    }

    if (attributesURL.length) {
      fragments.push(DOMAIN_URL_KEYS['attributes']);
      fragments.push(attributesURL);
    }

    if (abilitiesURL.length) {
      fragments.push(DOMAIN_URL_KEYS['abilities']);
      fragments.push(abilitiesURL);
    }

    if (skillbookURL.length) {
      fragments.push(DOMAIN_URL_KEYS['skillbook']);
      fragments.push(skillbookURL);
    }

    if (talentsURL.length) {
      fragments.push(DOMAIN_URL_KEYS['talents']);
      fragments.push(talentsURL);
      fragments.push(DOMAIN_URL_SEPARATOR);
    }

    return fragments.join('');
  };

  API.fromURL = function(url) {
    let domain;
    let levelStr = '';
    let attributesStr = '';
    let abilitiesStr = '';
    let skillbookStr = '';
    let talentsStr = '';

    url.split('').forEach(function(char) {
      switch(char) {
        case DOMAIN_URL_KEYS['level']:
        case DOMAIN_URL_KEYS['attributes']:
        case DOMAIN_URL_KEYS['abilities']:
        case DOMAIN_URL_KEYS['skillbook']:
        case DOMAIN_URL_KEYS['talents']:
          // it's because talents uses numbers and those conflict with the
          // domain keys; we stop parsing talents only when we encounter @
          if (domain === DOMAIN_URL_KEYS['talents']) {
            talentsStr += char;
          }
          else {
            domain = char;
          }

          break;

        default:
          if (domain === DOMAIN_URL_KEYS['level']) {
            levelStr += char;
          }
          else if (domain === DOMAIN_URL_KEYS['attributes']) {
            attributesStr += char;
          }
          else if (domain === DOMAIN_URL_KEYS['abilities']) {
            abilitiesStr += char;
          }
          else if (domain === DOMAIN_URL_KEYS['skillbook']) {
            skillbookStr += char;
          }
          else if (domain === DOMAIN_URL_KEYS['talents']) {
            if (char === DOMAIN_URL_SEPARATOR) {
              domain = null;
            }
            else {
              talentsStr += char;
            }
          }
      }
    });

    inSilence(function() {
      if (levelStr.length) {
        API.setLevel(levelStr.charCodeAt(0) - STARTING_INDEX_CHAR_CODE + 1);
      }

      if (attributesStr.length) {
        attributes.fromURL(attributesStr);
      }

      if (abilitiesStr.length) {
        abilities.fromURL(abilitiesStr);
      }

      if (skillbookStr.length) {
        skillbook.fromURL(skillbookStr);
      }

      if (talentsStr.length) {
        talents.saveFromURL(talents.fromURL(talentsStr));
      }

      ensureIntegrity();
    });

    emitChange();
  };


  API.addSkillToSpellbook = skillbook.addSkill;
  API.hasSkillInSpellbook = skillbook.hasSkill;
  API.removeSkillFromSpellbook = skillbook.removeSkill;
  API.skillbook = skillbook;

  character.getLevel = API.getLevel;
  character.getAttributePoints = attributes.getPoints;
  character.getAbilityPoints = abilities.getPoints;
  character.getTalentPoints = talents.getPoints;
  character.hasTalent = talents.selected;
  character.isLoneWolf = partial(talents.selected, 'LoneWolf')

  function inSilence(performer) {
    emitter.inSilence(performer);
  }

  function ensureIntegrity() {
    inSilence(function() {
      if (level > Rules.MaxLevel) {
        level = Rules.MaxLevel;
      }
      else if (level < 1) {
        level = 1;
      }

      skillbook.ensureIntegrity();
      attributes.ensureIntegrity();
      abilities.ensureIntegrity();
      talents.ensureIntegrity();
    });
  }

  API.ensureIntegrity = ensureIntegrity;

  return API;
}

module.exports = Character;