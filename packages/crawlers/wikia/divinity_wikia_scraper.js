#!/usr/bin/env node

// scrape the divinity wikia wiki for all the available skills and dump them
// onto a JSON file "./database.json"
//
var async = require('async');
var http = require('http');
var BASE_URL = 'http://divinity.wikia.com';
var SKILLS_PAGE_URL = BASE_URL + '/wiki/Skills_(Divinity:_Original_Sin)';
var fs = require('fs');

var parseAvailableSkills = require('./parseAvailableSkills');
var parseSkill = require('./parseSkill');
var CONCURRENCY = process.env.CONCURRENCY || 5;

function onError(msg) {
  throw new Error(msg);
}

http.get(SKILLS_PAGE_URL, function(res) {
  var body = '';

  res.on('data', function(chunk) {
    body += chunk;
  });

  res.on('end', function() {
    var abilities = parseAvailableSkills(body);
    var abilitySkills = abilities.reduce(function(flatSet, ability) {
      return flatSet.concat(
        ability.skills.map(function(skill) {
          skill.ability = ability.name;
          return skill;
        })
      );
    }, []);

    console.log('Downloading data for "%s" skills.', abilitySkills.length);

    async.parallelLimit(abilitySkills.map(function(skill) {
      return function(done) {
        downloadSkill(skill, done);
      }
    }), CONCURRENCY, function(err, skills) {
      if (err) {
        return onError(err);
      }

      fs.writeFileSync('./database.json', JSON.stringify(skills));

      console.log('Done! "%d" skills were downloaded.', skills.length);
    });
  });
});

function downloadSkill(skill, done) {
  var url = BASE_URL + skill.href;

  console.log('Downloading skill "%s" from "%s"', skill.name, url);

  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var skillInfo = parseSkill(body);

      skillInfo.ability = skill.ability;

      done(null, skillInfo);
    });
  });
}