#!/usr/bin/env node

var nsg = require('node-sprite-generator');
var path = require('path');
var assetDir = path.resolve(__dirname, '..', 'ui', 'sprites');

nsg({
  src: [
    'images/*.png'
  ],

  spritePath:     path.join(assetDir, 'skill_icons.png'),
  stylesheetPath: path.join(assetDir, 'skill_icons.less'),
  stylesheet: 'css',
  stylesheetOptions: {
    prefix: 'skill-icon--',
    pixelRatio: 2
  }

}, function (err) {
  console.log('Sprite generated!');
});

nsg({
  src: [
    'fextralife_wiki_scraper/skill_icons/*.jpg'
  ],

  spritePath:     path.join(assetDir, 'skill_icons_ee.jpg'),
  stylesheetPath: path.join(assetDir, 'skill_icons_ee.less'),
  stylesheet: 'css',
  compositor: require('node-sprite-generator-jimp'),
  stylesheetOptions: {
    prefix: 'skill-icon-ee--',
    pixelRatio: 2
  }

}, function (err) {
  if (err) {
    throw err;
  }

  console.log('Sprite generated!');
});

nsg({
  src: [
    'ability_icons/*.png'
  ],

  spritePath:     path.join(assetDir, 'ability_icons.png'),
  stylesheetPath: path.join(assetDir, 'ability_icons.less'),
  stylesheet: 'css',
  stylesheetOptions: {
    prefix: 'ability-icon--',
    pixelRatio: 1
  }

}, function (err) {
  console.log('Sprite generated!');
});