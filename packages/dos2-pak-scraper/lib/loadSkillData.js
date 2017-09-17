const path = require('path')
const config = require('../config.json')
const fs = require('fs')
const root = path.resolve(__dirname, '../')

module.exports = function loadSkillData({
  filePath = path.join(root, config.assets.SkillData)
}) {
  return fs.readFileSync(filePath, 'utf8')
}