const path = require('path')
const config = require('../../../config.json')
const root = path.resolve(__dirname, '../../../')
const fixtures = path.resolve(__dirname, '../fixtures')
const fs = require('fs')

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

exports.loadFile = filePath => {
  return fs.readFileSync(filePath, 'utf8')
}

exports.loadAsset = name => {
  return exports.loadFile(exports.root.join(config.assets[name]))
}