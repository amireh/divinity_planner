#!/usr/bin/env node

var nsg = require('node-sprite-generator');
var path = require('path');
var assetDir = path.resolve(__dirname, '..', 'public', 'assets');

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