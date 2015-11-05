const K = require('constants');
const EventEmitter = require('EventEmitter');
const CharacterAttributes = require('CharacterAttributes');
const CharacterAbilities = require('CharacterAbilities');
const CharacterSkillbook = require('CharacterSkillbook');
const assign = require('utils/assign');

function Character(attrs = {}) {
  const emitter = EventEmitter();
  const character = {};

  let { emitChange } = emitter;
  let API = assign({}, attrs);

  const attributes = CharacterAttributes(character, emitter.emitChange);
  const abilities = CharacterAbilities(character, emitter.emitChange);
  const skillbook = CharacterSkillbook(character, emitter.emitChange)

  let level = null;

  emitter.addChangeListener(ensureIntegrity);

  API.addChangeListener = emitter.addChangeListener;
  API.removeChangeListener = emitter.removeChangeListener;

  API.addAttributePoint = attributes.addPoint;
  API.removeAttributePoint = attributes.removePoint;

  API.addAbilityPoint = abilities.addPoint;
  API.removeAbilityPoint = abilities.removePoint;

  API.getLevel = function() {
    return level || inferLevel();
  };

  API.setLevel = function(inLevel) {
    if (inLevel <= K.MAX_LEVEL && inLevel >= 1) {
      level = inLevel;
      emitChange();
    }
  };

  API.toJSON = function() {
    let stats = {};

    stats.level = API.getLevel();
    stats.canIncreaseLevel = stats.level < K.MAX_LEVEL;
    stats.canDecreaseLevel = stats.level > 1;
    stats.skillbook = skillbook.toJSON();

    assign(stats, attributes.toJSON());
    assign(stats, abilities.toJSON());
    assign(stats, attrs);

    return JSON.parse(JSON.stringify(stats));
  };

  API.toURL = function() {
    const fragments = [];
    const attributesURL = attributes.toURL();
    const abilitiesURL = abilities.toURL();
    const skillbookURL = skillbook.toURL();

    if (level > 1) {
      fragments.push(K.DOMAIN_URL_KEYS['level']);
      fragments.push(String.fromCharCode(K.STARTING_INDEX_CHAR_CODE + level - 1));
    }

    if (attributesURL.length) {
      fragments.push(K.DOMAIN_URL_KEYS['attributes']);
      fragments.push(attributesURL);
    }

    if (abilitiesURL.length) {
      fragments.push(K.DOMAIN_URL_KEYS['abilities']);
      fragments.push(abilitiesURL);
    }

    if (skillbookURL.length) {
      fragments.push(K.DOMAIN_URL_KEYS['skillbook']);
      fragments.push(skillbookURL);
    }

    return fragments.join('');
  };

  API.fromURL = function(url) {
    let domain;
    let levelStr = '';
    let attributesStr = '';
    let abilitiesStr = '';
    let skillbookStr = '';

    url.split('').forEach(function(char) {
      switch(char) {
        case K.DOMAIN_URL_KEYS['level']:
        case K.DOMAIN_URL_KEYS['attributes']:
        case K.DOMAIN_URL_KEYS['abilities']:
        case K.DOMAIN_URL_KEYS['skillbook']:
          domain = char;
          break;

        default:
          if (domain === K.DOMAIN_URL_KEYS['level']) {
            levelStr += char;
          }
          else if (domain === K.DOMAIN_URL_KEYS['attributes']) {
            attributesStr += char;
          }
          else if (domain === K.DOMAIN_URL_KEYS['abilities']) {
            abilitiesStr += char;
          }
          else if (domain === K.DOMAIN_URL_KEYS['skillbook']) {
            skillbookStr += char;
          }
      }
    });

    inSilence(function() {
      if (levelStr.length) {
        API.setLevel(levelStr.charCodeAt(0) - K.STARTING_INDEX_CHAR_CODE + 1);
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

  function inferLevel() {
    return Math.max(
      1,
      Math.max(attributes.getAllocatedPoints() - K.STARTING_ATTRIBUTE_POINTS, 0) * 2
    );
  }

  function inSilence(performer) {
    emitter.inSilence(performer);
  }

  function ensureIntegrity() {
    inSilence(function() {
      if (level > K.MAX_LEVEL) {
        level = K.MAX_LEVEL;
      }
      else if (level < 1) {
        level = 1;
      }

      skillbook.ensureIntegrity();
      attributes.ensureIntegrity();
      abilities.ensureIntegrity();
    });
  }

  API.ensureIntegrity = ensureIntegrity;

  return API;
}

module.exports = Character;