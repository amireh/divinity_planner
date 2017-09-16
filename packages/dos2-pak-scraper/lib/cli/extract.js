const { sortBy } = require('lodash')
const sortObject = require('deep-sort-object')

module.exports = function extract(skillData) {
  return sortObject(sortBy(skillData, 'Id'))
}