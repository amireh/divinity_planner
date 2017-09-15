const path = require('path')
const config = require('../config.json')
const fs = require('fs')
const root = path.resolve(__dirname, '../')

module.exports = function loadSkillData() {
  return fs.readFileSync(path.join(root, config.assets.SkillData), 'utf8')
}