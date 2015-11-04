var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var assert = require('assert');
var spawn = require('child_process').spawn;
var request = require('request');
var async = require('async');
var normalize = require('../utils/normalize');
var assign = require('lodash').assign;
var groupBy = require('lodash').groupBy;

var BASE_URL = 'http://divinityoriginalsin.wiki.fextralife.com';

function parseSkillListing(html) {
  var $ = cheerio.load(html);
  var abilityColumns = {};
  var skills = [];
  var currentTier = 1;

  $('.wiki_table td[rowspan], .wiki_table tr:first-of-type th:first-of-type').remove();
  $('.wiki_table tr').each(function(rowIndex) {
    // header columns
    if (rowIndex === 0) {
      $(this).find('th').each(function(colIndex) {
        var ability = $(this).text().trim();

        if (ability.length > 0) {
          abilityColumns[String(colIndex)] = ability;
        }
      });
    }
    // a skill row
    else {
      if ($(this).text().trim() === '') {
        currentTier += 1;

        return;
      }

      $(this).find('td').each(function(colIndex) {
        var $anchor, skill;

        if ($(this).find('h4').length === 0) {
          return;
        }

        $anchor = $(this).find('a.wiki_link');

        skill = {};
        skill.ability = abilityColumns[String(colIndex)];
        skill.name = $anchor.text().trim();
        skill._wikiURL = $anchor.attr('href').replace(BASE_URL, '').replace(/^\/+/, '/');
        skill.image = $(this).find('img').attr('src');
        skill.tier = currentTier;

        if (!isSkillValid(skill)) {
          console.error('Invalid skill!');
          console.warn(skill);
          console.warn("[%d,%d]", rowIndex, colIndex);
          console.warn($.html(this));

          throw new Error('Invalid skill!');
        }

        skills.push(skill);
      });
    }
  });

  function isSkillValid(skill) {
    return (
      skill.ability && skill.ability.length > 0 &&
      skill.name && skill.name.length > 0 &&
      skill.image && skill.image.length > 0
    );
  }

  return skills;
}

function parseSkillPage(html) {
  var $ = cheerio.load(html);
  var skillInfo = {};

  $('.infobox .wiki_table tr').each(function(rowIndex) {
    // description
    if (rowIndex === 1) {
      skillInfo.description = $(this).text().trim();
    }
    // SPECIAL effects
    else if (rowIndex === 2) {
      skillInfo.specialEffects = [];

      $(this).find('li').each(function() {
        skillInfo.specialEffects.push($(this).text().trim());
      });
    }
    // AP cost
    else if (rowIndex === 3) {
      skillInfo.apCost = parseInt(
        $(this).find('li:first-of-type').text().match(/^\d+/),
        10
      ) || 0;
    }
    else if (rowIndex === 4) {
      skillInfo.savingThrows = [];

      $(this).find('li').each(function() {
        skillInfo.savingThrows.push($(this).text().trim());
      });
    }
    else if (rowIndex === 5) {
      var $propertyList = $(this).find('ul');
      var notes;

      skillInfo.properties = [];

      if ($propertyList) {
        $propertyList.find('li').each(function() {
          var property = $(this).text().trim();

          if (property.match(/(.+) Range$/i)) {
            skillInfo.range = RegExp.$1;
          }
          else if (property.match(/(\d)+.*Duration$/i)) {
            skillInfo.duration = parseInt(RegExp.$1, 10);
          }
          else if (property.match(/(\d)+.*Cooldown$/i)) {
            skillInfo.cooldown = parseInt(RegExp.$1, 10);
          }
          else {
            skillInfo.properties.push(property);
          }
        });

        // gather any trailing notes
        notes = $propertyList.nextAll().text().trim();
      }
      else {
        notes = $(this).text().trim().replace(/^PROPERTIES/, '').trim();
      }

      if (notes.length > 0) {
        skillInfo.notes = notes;
      }
    }
  });

  return skillInfo;
}

function parseAbilityPage(html) {
  var $ = cheerio.load(html);
  var skills = [];
  var ability = $('.pageTitle').text().trim();

  function parseTierSkills($table, tier) {
    $table.find('.section .col').each(function() {
      var name = $(this).find('h4[id^="toc"]').text().trim();
      var skill = {};

      if (name.length > 0) {
        skill.name = name;
        skill.ability = ability;
        skill.image = $(this).find('h4[id^="toc"] img').attr('src');
        skill.tier = tier;

        $(this).find('li').each(function() {
          var property = $(this).text().trim();

          if (property.match(/^Effect: (.+)/im)) {
            skill.effect = RegExp.$1;
          }
          else if (property.match(/Action Points: (\d+)/)) {
            skill.apCost = RegExp.$1;
          }
          else if (property.match(/^Status Effect: (.+)/im)) {
            skill.statusEffect = RegExp.$1;
          }
          else if (property.match(/Cooldown: (.+)$/i)) {
            skill.cooldown = RegExp.$1;
          }
          else if (property.match(/Saving Throws: (.+)$/i)) {
            skill.savingThrows = RegExp.$1;
          }
          else if (property.match(/Range: (.+)$/i)) {
            skill.range = RegExp.$1;
          }
          else if (property.match(/Recommended \S+ Level: (.+)$/i)) {
            skill.recommendedAbilityLevel = RegExp.$1;
          }
          else if (property.match(/Recommended (.+): (.+)$/i)) {
            skill.recommendedAttribute = [ RegExp.$1, RegExp.$2 ];
          }
          else if (property.match(/Note: (.+)$/im)) {
            skill.note = RegExp.$1;
          }
        });

        skills.push(skill);
      }
    });
  }

  $('div[class^="includeBody-"]').each(function() {
    var $section = $(this);
    var className = $section.attr('class');
    if (className.match(/novice[\_\-]/i)) {
      parseTierSkills($section, 1);
    }
    else if (className.match(/adept[\_\-]/i)) {
      parseTierSkills($section, 2);
    }
    else if (className.match(/master[\_\-]/i)) {
      parseTierSkills($section, 3);
    }
  });

  return skills;
}

exports.parseSkillListing = parseSkillListing;
exports.parseAbilityPage = parseAbilityPage;
exports.parseSkillPage = parseSkillPage;

exports.crawl = function(options, done) {
  console.log('Downloading skill database.');

  wgetRequest(BASE_URL + '/Skills%20Overview', options.cookies, function(err, body) {
    if (err) {
      throw err;
    }

    var skills = parseSkillListing(body);
    var concurrency = options.concurrency || process.env.CONCURRENCY || 5;

    console.log('Skill listing retrieved, will now be fetching skills %d at a time.', concurrency);

    async.parallelLimit(skills.map(function(skill) {
      return function(asyncDone) {
        fetchSkill(skill, asyncDone);
      }
    }), concurrency, done);
  })

  function fetchSkill(skill, asyncDone) {
    wgetRequest(BASE_URL + skill._wikiURL, options.cookies, function(err, body) {
      assert(!err, "Fetching skill " + skill.name + " failed");

      asyncDone(null, assign({}, skill, parseSkillPage(body)));
    });
  }
};

exports.crawlBulk = function(options, done) {
  var concurrency = options.concurrency || process.env.CONCURRENCY || 5;
  var URLs = [
    '/Aerotheurge',
    '/Geomancer',
    '/Pyrokinetic',
    '/Hydrosophist',
    '/Witchcraft',
    '/Man-At-Arms',
    '/Expert%20Marksman',
    '/Scoundrel'
  ];

  async.parallelLimit(URLs.map(function(abilityURL) {
    return function(asyncDone) {
      wgetRequest(BASE_URL + abilityURL, options.cookies, function(err, body) {
        if (err) {
          return asyncDone(err);
        }

        asyncDone(null, parseAbilityPage(body));
      });
    }
  }), concurrency, function(err, resultSet) {
    if (err) {
      return done(err);
    }

    var flattenedSet = resultSet.reduce(function(mainSet, abilitySkills) {
      return mainSet.concat(abilitySkills);
    }, []);

    done(null, flattenedSet);
  });
};

exports.downloadImages = function(skills, done) {
  async.parallelLimit(skills.map(function(skill) {
    return function(asyncDone) {
      console.log('Downloading image for "%s"', skill.name);

      request({ url: BASE_URL + skill.image, encoding: null }, function(err, _, buffer) {
        if (err) {
          return asyncDone(err);
        }

        asyncDone(null, {
          name: skill.name,
          fileName: skill.image,
          blob: buffer
        });
      });
    }
  }), process.env.CONCURRENCY || 10, done);
};

exports.normalize = function(database) {
  var skillSheet = loadSkillSheet();
  var skills = database.map(function(skill) {
    skill.id = normalize(skill.name);
    skill.abilityName = skill.ability;
    skill.ability = normalize(skill.ability);

    var sheetInfo = skillSheet.filter(function(e) {
      return normalize(e.name) === skill.id;
    })[0];

    if (sheetInfo) {
      skill.rqAbilityLevel = parseInt(sheetInfo.rqAbilityLevel, 10);
    }
    else {
      if (skill.tier === 1) {
        skill.rqAbilityLevel = 1;
      }
      else if (skill.tier === 2) {
        skill.rqAbilityLevel = 2;
      }
      else {
        skill.rqAbilityLevel = 4;
      }
    }

    delete skill._wikiURL;
    delete skill.image;

    return skill;
  });

  var abilitySkills = groupBy(skills, 'abilityName');

  return Object.keys(abilitySkills).map(function(name) {
    return {
      id: normalize(name),
      name: name,
      skills: abilitySkills[name].sort(function(a,b) {
        return a.name >= b.name ? 1 : -1;
      }).map(function(skill) {
        return Object.keys(skill).sort().reduce(function(sortedHash, key) {
          sortedHash[key] = skill[key];
          return sortedHash;
        }, {});
      })
    }
  }).sort(function(a,b) {
    return a.id >= b.id ? 1 : -1;
  });
};

function wgetRequest(url, cookies, done) {
  console.log('Requesting "%s"...', url);

  var runArgs = [];

  if (cookies) {
    runArgs.push('--load-cookies=' + cookies);
  }

  runArgs.push('-q');
  runArgs.push('-O');
  runArgs.push('-');
  runArgs.push(url);

  var buf = '';
  var errBuf = '';
  var fd = spawn('wget', runArgs, {
    stdio: [ null, 'pipe', 'pipe' ]
  });

  fd.stdout.on('data', function(chunk) {
    buf += chunk;
  });

  fd.stderr.on('data', function(chunk) {
    errBuf += chunk;
  });

  fd.on('exit', function(exitCode) {
    if (exitCode !== 0 && buf.length === 0) {
      done('wget closed with ' + exitCode + '; ' + errBuf);
    }
    else {
      done(null, buf);
    }
  });
}

function loadSkillSheet() {
  var csv = fs.readFileSync(path.resolve(__dirname, 'skill_sheet.csv'), 'utf-8');
  var COLUMNS = [
    '_',
    'ability',
    'name',
    'effectType',
    'tier',
    'apCost',
    'minStat',
    'rqAbilityLevel'
  ];

  return csv.split('\n').slice(1).map(function(line) {
    var info = {};

    line.split(',').forEach(function(item, index) {
      info[COLUMNS[index]] = item;
    });

    return info;
  });
}