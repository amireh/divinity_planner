const path = require('path')
const root = path.resolve(__dirname, '..')

module.exports = {
  toString: root,
  join: path.join.bind(path, root)
}