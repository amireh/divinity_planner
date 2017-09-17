const R = require('ramda')

module.exports = R.map(refineRequirement)

function refineRequirement(entity) {
  return Object.assign({}, entity, {
    Constraints: entity.Constraints.split(';').filter(x => !!x).map(refineRequirementConstraint),
  })
}

function refineRequirementConstraint(constraint) {
  const fragments = constraint.match(/^(\!?)(\S+)(?:\s+(.+)$|$)/)

  return {
    Id: fragments[2],
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