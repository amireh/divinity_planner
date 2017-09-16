var assert = require('assert');
var normalize = require('../utils/normalize');

var NAME_MAP = {
  // RANGER
  'Target Corpses': 'Shrapnel Scatter',

  // AIR
  'Lightning Strike': 'Thunder Jump',
  'Air Resistance Shield': 'Air Absorption Shield',

  // EARTH
  'Earth Resistance Shield': 'Earth Absorption Shield',
  'Summon Ooze': 'Summon Poison Slug',

  // FIRE
  'Fire Resistance Shield': 'Fire Absorption Shield',
  'Small Fireball': 'Fireball',

  // WATER
  'Regenerate': 'Regeneration',
  'Water Resistance Shield': 'Water Absorption Shield',
  'Mass Healing': 'Mass Heal',

  // ROGUE
  'Winged Feet': 'Hoverfeet',
};

var ELEMENT_MAP = {
  'Air': 'Aerotheurge',
  'Earth': 'Geomancer',
  'Water': 'Hydrosophist',
  'Fire': 'Pyrokinetic',
  'Source': 'Witchcraft',
};

var ABILITY_MAP = {
  'Warrior': 'Man-at-Arms',
  'Ranger': 'Expert Marksman',
  'Rogue': 'Scoundrel',
};

var TIER_MAP = {
  'Novice': 1,
  'Adept': 2,
  'Master': 3,
};

exports.parseStatsFile = function(file) {
  return parseDataFile(file).reduce(function(hsh, entry) {
    hsh[entry.$id] = entry;
    return hsh;
  }, {});
};

function parseDataFile(file) {
  var entries = [];

  file.split('\n').forEach(function(line) {
    if (line.match(/^new entry "(.+)"$/)) {
      entries.push({ $id: RegExp.$1, $extends: [] });
    }
    else if (line.match(/^using "(.+)"$/)) {
      entries[entries.length - 1].$extends.push(RegExp.$1);
    }
    else if (line.match(/^data "(.+)" "(.+)"$/)) {
      entries[entries.length - 1][RegExp.$1] = RegExp.$2;
    }
  });

  return entries;
}

exports.parseDataFile = parseDataFile;

exports.isPlayerSkill = function(skill) {
  return !skill.$id.match(/Enemy/) && skill.Tier && skill.Tier !== 'None' && (
    [ 'Air', 'Earth', 'Fire', 'Water', 'Source' ].indexOf(skill.Element) > -1 ||
    [ 'Warrior', 'Rogue', 'Ranger' ].indexOf(skill.Ability) > -1
  );
};

exports.parseSkill = function(skillSheet, knownKeys, gameStats) {
  var skill = {};

  function getItem(key) {
    assert(knownKeys.indexOf(key) > -1,
      "Unknown (or mis-spelled) key '" + key + "'"
    );

    return skillSheet[key];
  }

  function write(key, value) {
    if (value !== undefined) {
      skill[key] = value;
    }
  }

  var displayName = getItem('DisplayNameRef');
  var descriptions = parseDescriptions(skillSheet, gameStats);

  if (NAME_MAP[displayName]) {
    displayName = NAME_MAP[displayName];
  }

  write('name', displayName);
  write('id', normalize(displayName));

  write('abilityName', ABILITY_MAP[getItem('Ability')] || ELEMENT_MAP[getItem('Element')]);
  write('ability', normalize(skill.abilityName));

  write('accuracy', getItem('Accuracy'));
  write('actionPoints', getItem('ActionPoints'));
  write('angle', getItem('Angle'));
  write('areaRadius', getItem('AreaRadius'));
  write('canTargetCharacters', getItem('CanTargetCharacters'));

  if (getItem('CleanseStatuses')) {
    write('cleanseStatuses', getItem('CleanseStatuses').split(';'))
  }

  // @type {Number}
  write('cooldown', getItem('Cooldown'));

  // @type {Number}
  write('cooldownReduction', getItem('CooldownReduction'));

  // @type {Number}
  write('damage', getItem('Damage'));
  write('damageRange', getItem('Damage Range'));
  write('damageMultiplier', getItem('Damage Multiplier'));
  write('damageType', getItem('DamageType'));
  write('deathType', getItem('DeathType'));

  write('description', descriptions.description);
  write('statDescriptions', descriptions.statDescriptions);

  write('explodeRadius', getItem('ExplodeRadius'));
  write('forceTarget', getItem('ForceTarget'));

  write('forkChance', getItem('ForkChance'));
  write('forkLevels', getItem('ForkLevels'));

  write('healAmount', getItem('HealAmount'));
  write('healingMultiplier', getItem('Healing Multiplier'));

  write('hitRadius', getItem('HitRadius'));
  write('hitPointsPercent', getItem('HitPointsPercent'));

  write('range', getItem('Range'));
  write('weaponRequirement', getItem('Requirement'));

  write('skillProperties', getItem('SkillProperties'))
  write('skillType', getItem('SkillType'))

  write('targetConditions', getItem('TargetConditions'));
  write('targetRadius', getItem('TargetRadius'));

  write('tier', TIER_MAP[getItem('Tier')] || getItem('Tier'));

  write('useCharacterStats', getItem('UseCharacterStats'));
  write('useWeaponDamage', getItem('UseWeaponDamage'));

  return skill;
};

function parseDescriptions(skillSheet, gameStats) {
  var paramKeys = (skillSheet['StatsDescriptionParams'] || '').split(';');
  var description = skillSheet['DescriptionRef'];
  var statDescriptions = skillSheet['StatsDescriptionRef'];

  if (description) {
    description = template(description);
  }

  if (statDescriptions) {
    statDescriptions = template(statDescriptions)
      .split(/<br\/?>/)
      .map(function(entry) {
        return entry.trim();
      })
      .filter(function(entry) {
        return entry.length > 0;
      })
    ;
  }

  function template(str) {
    return str.replace(/\[\d+\]/g, function(idStr) {
      var index = parseInt(idStr.slice(1,-1), 10) - 1;
      var paramKey = paramKeys[index];
      var param = skillSheet[paramKey];

      if (!param && paramKey === 'Damage' && skillSheet['DamageType']) {
        var multiplier = skillSheet['Damage Multiplier'] || '100';
        param = multiplier + '% (' + skillSheet['DamageType'] + ')';
      }
      else if (!param && paramKey === 'Damage' && skillSheet['UseWeaponDamage']) {
        param = 'X-Y';
      }
      else if (!param && paramKey.match(/^Stats:(.+):(.+)$/)) {
        var statKey = RegExp.$1;
        var statAttr = RegExp.$2;

        param = gameStats[statKey][statAttr];
      }

      if (!param) {
        console.log("[W] No description param mapping found for '%s' within '%s'",
          paramKey,
          skillSheet.$id
        );
      }

      return param || idStr;
    });
  }

  return {
    description: description,
    statDescriptions: statDescriptions,
  };
}

exports.parseDescriptions = parseDescriptions;


exports.findSkillLevels = function(playerSkills, allSkills) {
  var levels = {};

  playerSkills.forEach(function(skillSheet) {
    var $id = skillSheet.$id;

    allSkills.filter(function(entry) {
      if (entry['Level'] && entry.$extends.indexOf($id) > -1) {
        levels[$id] = parseInt(entry['Level'], 10);
      }
    });
  });

  return levels;
};