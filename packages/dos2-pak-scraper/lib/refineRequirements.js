const R = require('ramda')
const { requirementMapping } = require('../config.json')

module.exports = R.map(refineRequirement)

function refineRequirement(entity) {
  return Object.assign({}, entity, {
    Constraints: entity.Constraints.split(';').filter(x => !!x).map(refineRequirementConstraint),
  })
}

function refineRequirementConstraint(constraint) {
  const fragments = constraint.match(/^(\!?)(\S+)(?:\s+(.+)$|$)/)
  const { Id, Type } = inferTypeFromName(fragments[2])

  return {
    Id,
    Type,
    Negated: fragments[1] === '!',
    Parameter: inferAndCoerceType(fragments[3]) || null,
  }
}

function inferAndCoerceType(value) {
  if (String(parseInt(value, 10)) === value) {
    return parseInt(value, 10)
  }
  else {
    return value
  }
}

function inferTypeFromName(name) {
  if (name.startsWith('TALENT_')) {
    return {
      Id: name.slice('TALENT_'.length),
      Type: 'Talent'
    }
  }
  else if (requirementMapping[name]) {
    return requirementMapping[name]
  }
  else {
    return { Id: name, Type: 'Unknown' }
  }
}