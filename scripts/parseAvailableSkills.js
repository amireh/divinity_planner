#!/usr/bin/env node

// parses the list of available skills from the wikia page:
//
// http://divinity.wikia.com/wiki/Skills_(Divinity:_Original_Sin)

var cheerio = require('cheerio');
var normalize = require('./utils/normalize');

function parseHTML(html) {
  var $ = cheerio.load(html);
  var $table = $('table.article-table:last-of-type');

  function parse() {
    var abilities = [];

    $table.find('tr').slice(1).each(function(index, el) {
      var $tr = $(el);
      var ability = $tr.find('> th:nth-of-type(1)').text().trim();
      var skills = [];

      $tr.find('td a').each(function() {
        var name = $(this).attr('title');

        skills.push({
          id: normalize(name),
          name: name,
          href: $(this).attr('href')
        });
      });

      abilities.push({
        id: normalize(ability),
        name: ability,
        skills: skills
      });
    });

    return abilities;
  }

  return parse();
}

module.exports = parseHTML;

if (process.argv[1] === __filename) {
  var fs = require('fs');
  var path = require('path');
  var file = fs.readFileSync(path.resolve(process.argv[2]), 'utf-8');

  console.log(JSON.stringify(parseHTML(file), null, 2));
}