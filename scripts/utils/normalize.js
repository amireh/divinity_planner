var camelize = require('./camelize');

module.exports = function normalize(str) {
  return camelize(str.replace(/\W+/g, '_').replace(/^_+|_+$/g, ''), true);
}
