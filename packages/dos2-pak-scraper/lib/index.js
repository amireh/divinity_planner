exports.parseRequirements = require('./parseRequirements')
exports.parseSkills = require('./parseSkills')
exports.refineRequirements = require('./refineRequirements')
exports.refineSkills = require('./refineSkills')
exports.cli = {
  query: require('./cli/query'),
  listProperties: require('./cli/listProperties'),
  generateIcons: require('./cli/generateIcons'),
}