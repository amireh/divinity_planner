#!/usr/bin/env node

// normalizes the skills that were scraped from the wiki
//
// see ./divinity_wikia_scraper.js for generating this dump

var path = require('path');
var fs = require('fs');
var file = fs.readFileSync(path.resolve(process.argv[2]), 'utf-8');
var database = JSON.parse(file);
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

  return db.reduce(function(abilities, skill) {
    var ability = abilities.filter(function(a) { return a.name === skill.ability })[0];

    if (!ability) {
      ability = { id: normalize(skill.ability), name: skill.ability, skills: [] };
      abilities.push(ability);
    }

    delete skill.ability;

    ability.skills.push(skill);

    return abilities;
  }, []);
}

var normalizedDatabase = normalizeSkills(database);

fs.writeFileSync(
  './skills.normalized.json',
  JSON.stringify(normalizedDatabase, null, 2)
);
