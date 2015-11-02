#!/usr/bin/env node

var http = require('http');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Stream = require('stream').Transform;
var normalize = require('./utils/normalize');

var file = fs.readFileSync(path.resolve(process.argv[2]), 'utf-8');
var database = JSON.parse(file);
var CONCURRENCY = process.env.CONCURRENCY || 5;
var rootDir = path.resolve(__dirname, 'images');

if (!fs.existsSync(rootDir)) {
  throw new Error('You must create the directory ' + rootDir);
}

async.parallelLimit(database.map(function(skill) {
  var id = normalize(skill.name);

  return function(done) {
    downloadImage(id, skill.image, done);
  }
}), CONCURRENCY, function(err) {
  console.log('Done!');
});

function downloadImage(id, url, done) {
  console.log('Downloading image for "%s" from "%s"', id, url);

  http.get(url, function(res) {
    var data = new Stream();

    res.on('data', function(chunk) {
      data.push(chunk);
    });

    res.on('end', function() {
      var filePath = path.resolve(rootDir, id + path.extname(url));

      fs.writeFileSync(filePath, data.read());

      done();
    });
  });
}