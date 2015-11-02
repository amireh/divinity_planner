const K = require('constants');
const EventEmitter = require('EventEmitter');
const CharacterAttributes = require('CharacterAttributes');
const CharacterAbilities = require('CharacterAbilities');
const CharacterSkillbook = require('CharacterSkillbook');
const assign = require('utils/assign');
const NOOP = Function.prototype;

function Character() {
  const emitter = EventEmitter();
  const character = {};

  let { emitChange } = emitter;
  let API = {};

  const attributes = CharacterAttributes(character, emitter.emitChange);
  const abilities = CharacterAbilities(character, emitter.emitChange);
  const skillbook = CharacterSkillbook(character, emitter.emitChange)

  let level = null;

  emitter.addChangeListener(function() {
    inSilence(validate);
  });

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

    return JSON.parse(JSON.stringify(stats));
  };

  API.toURL = function() {
    const fragments = [];
    const attributesURL = attributes.toURL();

    if (level > 1) {
      fragments.push('0');
      fragments.push(String.fromCharCode(96 + level));
    }

    if (attributesURL.length) {
      fragments.push('1');
      fragments.push(attributesURL);
    }

    const abilitiesURL = abilities.toURL();

    if (abilitiesURL.length) {
      fragments.push('2');
      fragments.push(abilitiesURL);
    }

    return fragments.join('');
  };

  API.fromURL = function(url) {
    let domain;
    let levelStr = '';
    let attributesStr = '';
    let abilitiesStr = '';

    url.split('').forEach(function(char) {
      switch(char) {
        case '0':
          domain = 'level';
          break;

        case '1':
          domain = 'attributes';
          break;
        case '2':
          domain = 'abilities';
          break;

        default:
          if (domain === 'level') {
            levelStr += char;
          }
          else if (domain === 'attributes') {
            attributesStr += char;
          }
          else if (domain === 'abilities') {
            abilitiesStr += char;
          }
      }
    });

    if (levelStr.length) {
      level = levelStr.charCodeAt(0) - 96;
    }

    if (attributesStr.length) {
      attributes.fromURL(attributesStr);
    }

    if (abilitiesStr.length) {
      abilities.fromURL(abilitiesStr);
    }
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
    emitChange = NOOP;
    performer();
    emitChange = emitter.emitChange;
  }

  function validate() {
    skillbook.ensureIntegrity();
    attributes.ensureIntegrity();
    abilities.ensureIntegrity();
  }

  emitter.addChangeListener(function() {
    window.location.hash = `#${API.toURL()}`;
  });

  return API;
}

module.exports = Character;