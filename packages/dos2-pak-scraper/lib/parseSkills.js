const { parseDataFile } = require('dos-pak-utils')
const sortObject = require('deep-sort-object')
const R = require('ramda')
const sortById = R.sortBy(R.prop('Id'))
const omitType = R.omit([ 'Type' ])

module.exports = function parseSkills(resource) {
  return sortById(
    parseDataFile({ file: resource, warn: true })
      .map(omitType)
      .map(sortObject)
  )
};