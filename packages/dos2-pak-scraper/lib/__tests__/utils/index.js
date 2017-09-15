const path = require('path')
const config = require('../../../config.json')
const root = path.resolve(__dirname, '../../../')
const fixtures = path.resolve(__dirname, '../fixtures')

exports.root = {
  toString: () => root,
  join: path.join.bind(path, root)
}

exports.fixtures = {
  toString: () => fixtures,
  join: path.join.bind(path, fixtures)
}

exports.config = config
exports.assert = require('chai').assert