const { sortBy } = require('lodash')
const sortObject = require('deep-sort-object')

module.exports = function extract() {
  return sortObject(sortBy(skillData, 'Id'))
}