#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');
var program = require('commander');
var assert = require('assert');
var collectStats = require('../utils/collectStats');
var Parser = require('./');

var OUTPUT_DIR = path.resolve(__dirname, 'output');
var DATABASE_PATH = path.join(OUTPUT_DIR, 'skills.json');
var DEST_PATH = path.resolve(__dirname, '../../dos1/js/database/abilities_ee.json');
var BLACKLIST = [ 'resuscitate' ];

program
  .command('parse <stats_file> <skill_file>')
  .option('-f, --filter <key,value>')
  .option('--dump-values <attr>')
  .option('--dump-attributes')
  .option('--dump-player-skills')
  .action(function(statsFile, file, options) {
    var skills = Parser.parseDataFile(fs.readFileSync(path.resolve(file), 'utf-8'));
    var gameStats = Parser.parseStatsFile(fs.readFileSync(path.resolve(statsFile), 'utf-8'));
    var playerSkills = skills.filter(Parser.isPlayerSkill);

    var knownKeys = playerSkills.reduce(function(attrs, skill) {
      Object.keys(skill).forEach(function(key) {
        if (attrs.indexOf(key) === -1) {
          attrs.push(key);
        }
      });

      return attrs;
    }, []);

    var stats = collectStats(playerSkills, options.dumpValues || []);

    console.log('Skill count:', skills.length);
    console.log('Player skill count:', playerSkills.length);

    if (options.dumpPlayerSkills) {
      console.log('Player skills:');
      console.log(
        JSON.stringify(
          playerSkills.map(function(skill) {
            var school = [ skill.Element, skill.Ability ].filter(function(e) { return e !== 'None' });
            return [ school[0], skill.$id, skill.Tier, skill['DisplayNameRef']];
          }).sort()
        )
      );
    }

    if (options.dumpAttributes) {
      console.log('Attributes:', stats.keys);
    }

    if (options.dumpValues) {
      console.log('Unique Values:', stats.values);
    }

    if (options.filter) {
      var k = options.filter.split(',')[0];
      var v = options.filter.split(',')[1];
      var focus = skills.filter(function(skill) {
        return skill[k] === v;
      }).map(function(skill) {
        return [ skill['Tier'], skill['DisplayNameRef'] ];
      }).sort();

      console.log('Skills with "%s" = "%s"', k, v);
      console.log(focus);
    }

    var levels = Parser.findSkillLevels(playerSkills, skills);

    var normalizedSkills = playerSkills.map(function(skillSheet) {
      var skill = Parser.parseSkill(skillSheet, knownKeys, gameStats);

      skill.level = levels[skillSheet.$id]

      if (!skill.level) {
        console.warn('[W] Unable to find skill level for "%s"', skill.id);
      }

      return Object.keys(skill).sort().reduce(function(sortedSet, key) {
        sortedSet[key] = skill[key];
        return sortedSet;
      }, {});
    }).filter(function(skill) {
      return BLACKLIST.indexOf( skill.id ) === -1;
    });

    // finally, we group them by ability
    var abilitySkills = normalizedSkills.reduce(function(abilities, skill) {
      var ability = abilities.filter(function(a) { return a.id === skill.ability; })[0];

      if (!ability) {
        ability = { id: skill.ability, name: skill.abilityName, skills: [] };
        abilities.push(ability);
      }

      ability.skills.push(skill);

      return abilities;
    }, []).sort(function(a,b) {
      return a.id >= b.id ? 1 : -1;
    });

    fs.ensureDirSync(OUTPUT_DIR);
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(abilitySkills, null, 2));
  })
;

program
  .command('install')
  .action(function() {
    assert(fs.existsSync(DATABASE_PATH),
      "You must generate the database first using parse!"
    );

    fs.copySync(DATABASE_PATH, DEST_PATH);
  })
;

program.parse(process.argv);
