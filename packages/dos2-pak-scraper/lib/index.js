exports.parseSkillData = require('./parseSkillData')
exports.loadSkillData = require('./loadSkillData')
exports.cli = {
  extract: require('./cli/extract'),
  refine: require('./cli/refine'),
  query: require('./cli/query'),
  listProperties: require('./cli/listProperties')
}