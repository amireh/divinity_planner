#!/usr/bin/env node

// normalizes the skills that were scraped from the wiki
//
// see ./divinity_wikia_scraper.js for generating this dump

var path = require('path');
var fs = require('fs');
var assert = require('assert');

var RAW_SKILLS_FILE = path.resolve(__dirname, 'skills.raw.json');
var DESCRIPTIONS_FILE = path.resolve(__dirname, 'skill_descriptions.json');

assert(fs.existsSync(RAW_SKILLS_FILE),
  "You must first generate the raw skills database by using ./divinity_wikia_scraper.js"
);

var database = JSON.parse(fs.readFileSync(RAW_SKILLS_FILE, 'utf-8'));
var descriptions;

if (fs.existsSync(DESCRIPTIONS_FILE)) {
  descriptions = JSON.parse(fs.readFileSync(DESCRIPTIONS_FILE, 'utf-8'));
}

var normalize = require('./utils/normalize');
var COLUMN_MAPPING = {
  'rqLevel': 'rqCharacterLevel',
  'weaponRq': 'rqWeaponType',
  'aoE': 'aoe',
  'actionPoint': 'apCost',
  'rqAbilityLvl': 'rqAbilityLevel',
};

function getKey(rawKey) {
  var key = normalize(rawKey);

  if (COLUMN_MAPPING[key]) {
    return COLUMN_MAPPING[key];
  }
  else {
    return key;
  }
}

function normalizeSkills(database) {
  var db = database.map(function(skill) {
    var info = Object.keys(skill).reduce(function(hsh, rawKey) {
      var key = getKey(rawKey);
      var value = skill[rawKey];

      switch (key) {
        case 'rqAbilityLevel':
          value = parseInt(value.match(/\s\((.+)\)$/)[1], 10) || 0;
          break;

        case 'rqCharacterLevel':
        case 'skillLevel':
        case 'apCost':
        case 'skillLevel':
          value = parseInt(value, 10) || 1;
          break;

        case 'descriptionHTML':
          value = null;
          break;
      }

      if (value !== null) {
        hsh[key] = value;
      }

      return hsh;
    }, {});

    info.id = normalize(info.name);

    if (descriptions[info.name] && descriptions) {
      info.description = descriptions[info.name];
    }

    return info;
  }, []);

  // DEBUG, we track all the keys to make sure we're not missing something
  var lodash = require('lodash');
  var allKeys = {};
  var rawValuesDump = [];
  var parsedValuesDump = [];

  database.forEach(function(skill) {
    Object.keys(skill).forEach(function(rawKey) {
      var key = getKey(rawKey);

      if (!allKeys[key]) {
        allKeys[key] = 0;
      }

      allKeys[key] += 1;

      if (process.env.DUMP_KEY === key) {
        rawValuesDump.push(skill[rawKey]);
        parsedValuesDump.push(
          db.filter(function(s) {
            return s.name === skill.name;
          })[0][key]
        );
      }
    });
  });

  if (rawValuesDump.length) {
    console.log(process.env.DUMP_KEY)
    console.log(lodash.uniq(rawValuesDump));
    console.log(lodash.uniq(parsedValuesDump));
  }

  console.log('Skill attribute keys:')
  console.log(allKeys);

  return db
    .reduce(function(abilities, skill) {
      var ability = abilities.filter(function(a) { return a.name === skill.ability })[0];

      if (!ability) {
        ability = { id: normalize(skill.ability), name: skill.ability, skills: [] };
        abilities.push(ability);
      }

      ability.skills.push(skill);

      skill.ability = normalize(skill.ability);

      return abilities;
    }, [])
    .map(function sortSkillsById(ability) {
      ability.skills.sort(function(a,b) {
        return a.id >= b.id ? 1 : -1;
      });

      return ability;
    })
  ;
}

var normalizedDatabase = normalizeSkills(database);

var OUTPUT_FILE = 'scripts/skills.normalized.json';
var INTENDED_DEST = 'ui/shared/database/abilities.json';

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalizedDatabase, null, 2));

console.log('Done. You should now copy "' + OUTPUT_FILE + '" to "' + INTENDED_DEST + '".')