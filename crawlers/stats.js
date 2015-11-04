#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var lodash = require('lodash');

var database = JSON.parse(fs.readFileSync(process.argv[2]));
var values = [];
var attrKeys = database.reduce(function(keys, entry) {
  Object.keys(entry).forEach(function(key) {
    if (!keys[key]) {
      keys[key] = 0;
    }

    if (entry[key] !== undefined) {
      keys[key] += 1;
    }

    if (process.argv[3] === key) {
      values.push(entry[key]);
    }
  });

  return keys;
}, {});

console.log(attrKeys);

if (values.length) {
  console.log(lodash.uniq(values).sort());
}