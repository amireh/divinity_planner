const config = require('../../config.json')
const R = require('ramda')
const sortObject = require('deep-sort-object')
const sortById = R.sortWith([ R.ascend(R.prop('Id'))])
const { interpolateTemplate } = require('../pakUtils')

const Cast = {
  number: x => parseFloat(x),
  boolean: x => x === 'Yes',
}

module.exports = R.pipe(
  R.filter(isPlayerSkill),

  R.map(flattenSkill),

  R.map(R.omit([
    'AiCalculationSkillOverride',
    'CastAnimation',
    'CastTextEvent',
    'FXScale',
    'PrepareAnimationInit',
    'PrepareAnimationLoop',
    'StartTextEvent',
    'StopTextEvent',
    'TeleportTextEvent',
    'Template',
    'Template1',
    'Template2',
    'Template3',
    'TemplateAdvanced',
    'TemplateOverride',
  ])),

  // Effect properties
  //
  //     bin/dos2-pak list-properties | grep 'Effect' | cut -d':' -f1
  R.map(R.omit([
    'BeamEffect',
    'CastEffect',
    'CastEffectTextEvent',
    'DisappearEffect',
    'FemaleImpactEffects',
    'HitEffect',
    'LandingEffect',
    'MaleImpactEffects',
    'PositionEffect',
    'PrepareEffect',
    'PreviewEffect',
    'RainEffect',
    'ReappearEffect',
    'SkillEffect',
    'SourceTargetEffect',
    'StormEffect',
    'TargetCastEffect',
    'TargetEffect',
    'TargetGroundEffect',
    'TargetHitEffect',
    'TargetTargetEffect',
  ])),

  R.map(renameProperties({
    'Autocast': 'AutoCast',
    'DescriptionRef': 'Description',
    'DisplayNameRef': 'DisplayName',
    'StatsDescriptionRef': 'StatsDescription',
  })),

  // Abilities with spaces in their names
  //
  // To generate this list:
  //
  //    bin/dos2-pak list-properties | sort | cut -d':' -f1 | egrep "[ ]"
  R.map(renameProperties({
    'Damage Multiplier':          'DamageMultiplier',
    'Damage On Jump':             'DamageOnJump',
    'Damage On Landing':          'DamageOnLanding',
    'Damage Range':               'DamageRange',
    'Distance Damage Multiplier': 'DistanceDamageMultiplier',
    'Magic Cost':                 'MagicCost',
    'Memory Cost':                'MemoryCost',
    'Stealth Damage Multiplier':  'StealthDamageMultiplier',

  })),

  R.map(interpolateStrings([
    'Description',
    'DisplayName',
    'StatsDescription',
  ])),

  R.map(castValues({
    'ActionPoints': Cast.number,
    'AddWeaponRange': Cast.boolean,
    'AreaRadius': Cast.number,
    'AutoCast': Cast.boolean,
    'CanTargetCharacters': Cast.boolean,
    'CanTargetItems': Cast.boolean,
    'Cooldown': Cast.number,
    'DamageMultiplier': Cast.number,
    'DamageRange': Cast.number,
    'ForGameMaster': Cast.boolean,
    'Lifetime': Cast.number,
    'MagicCost': Cast.number,
    'Totem': Cast.boolean,
    'UseCharacterStats': Cast.boolean,
    'UseWeaponDamage': Cast.boolean,
    'UseWeaponProperties': Cast.boolean,
  })),

  R.map(renameStarterTierToNovice),

  R.map(sortObject),

  groupByAbility
)

function isPlayerSkill(skill) {
  return (
    skill.Type === 'SkillData' &&
    skill.Properties.IsEnemySkill !== 'Yes' &&
    // e.g. Projectile_Grenade_ChemicalWarfare_-1
    !skill.Id.match(/.+_\-\d$/) &&
    // e.g. Zone_EnemyAutomatonElectricRay
    !skill.Id.match(/^Zone_/) &&
    !skill.Id.match(/^Projectile_Quest_/) &&
    skill.Properties.DisplayNameRef &&
    skill.Properties.Ability &&
    // "None" is the "Special" category of skills in Wikis; they are not learnable
    skill.Properties.Ability !== 'None'
  )
}

function interpolateStrings(keys) {
  return function(skill) {
    return keys.reduce(function(map, key) {
      if (map.hasOwnProperty(key)) {
        map[key] = interpolateTemplate({
          template: skill[key],
          // it seems both Description and StatsDescription keys use this
          // same property
          templateParams: skill['StatsDescriptionParams'],
          skillSheet: skill,
          gameStats: null // TODO
        })
      }

      return map;
    }, Object.assign({}, skill))
  }
}

function castValues(mapping) {
  return function(skill) {
    return Object.keys(mapping).reduce(function(map, key) {
      if (map.hasOwnProperty(key)) {
        map[key] = mapping[key](map[key])
      }

      return map;
    }, Object.assign({}, skill))
  }
}

function renameStarterTierToNovice(skill) {
  if (skill.Tier === 'Starter') {
    return Object.assign({}, skill, { Tier: 'Novice', Starter: true })
  }
  else {
    return skill
  }
}

function flattenSkill(skill) {
  return Object.assign({}, skill.Properties, {
    Id: skill.Id,
  })
}

function renameProperties(rewrites) {
  return function(skill) {
    return Object.keys(skill).reduce(function(map, key) {
      if (rewrites[key]) {
        map[rewrites[key]] = skill[key]
      }
      else {
        map[key] = skill[key]
      }

      return map;
    }, {})
  }
}

function groupByAbility(skills) {
  const abilityMap = Object.keys(config.abilityIdMapping).sort().reduce(function(map, id) {
    const abilitySkills = skills.filter(x => x.Ability === id)

    // ignore schools that have no skills (e.g. all filtered like in "None")
    if (abilitySkills.length === 0) {
      return map;
    }

    map[id] = {
      Id: id,
      DisplayName: config.abilityIdMapping[id],
      Icon: config.abilityIcons[id],
      Skills: sortById(abilitySkills),
    }

    return map
  }, {})

  return Object.keys(abilityMap).map(function(id) {
    return abilityMap[id]
  }, [])
}