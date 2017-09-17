const { parseDataFile } = require('dos-pak-utils')
const sortObject = require('deep-sort-object')
const R = require('ramda')
const sortById = R.sortBy(R.prop('Id'))

module.exports = function parseRequirements(resource) {
  return sortById(
    parseDataFile({ file: resource, warn: true })
      .map(sortObject)
  )
};