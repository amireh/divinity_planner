var lodash = require('lodash');

module.exports = function(database, collectAttrs) {
  var values = {};
  var attrKeys = database.reduce(function(keys, entry) {
    Object.keys(entry).forEach(function(key) {
      if (!keys[key]) {
        keys[key] = 0;
      }

      if (entry[key] !== undefined) {
        keys[key] += 1;
      }

      if (collectAttrs && collectAttrs.indexOf(key) > -1) {
        if (!values[key]) {
          values[key] = [];
        }

        values[key].push(entry[key]);
      }
    });

    return keys;
  }, {});

  return {
    keys: Object.keys(attrKeys).sort().reduce(function(hsh, key) {
      hsh[key] = attrKeys[key];
      return hsh;
    }, {}),

    values: Object.keys(values).reduce(function(hsh, key) {
      hsh[key] = values[key].reduce(function(set, value) {
        if (!set[value]) { set[value] = 0; }

        set[value] += 1;

        return set;
      }, {});

      return hsh;
    }, {})
  };
};