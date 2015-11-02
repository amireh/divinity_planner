#!/usr/bin/env node

// parses a single skill info from a page like
//
// http://divinity.wikia.com/wiki/Shocking_Touch

var cheerio = require('cheerio');

function parseHTML(file) {
  var $ = cheerio.load(file);

  function parseSkillInfo() {
    var info = {};

    $('table.infobox').find('tr').each(function(index, el) {
      var $tr = $(el);

      if (index === 0) {
        info.name = $tr.text().trim();
      }
      else if (index === 1) {
        info.image = $tr.find('img').attr('src').replace(/\/revision\/.+$/, '');
      }
      else {
        var $th = $tr.find('th');
        if ($th.length) {
          var key = $th.text().trim();
          var value = $tr.find('td').text().trim();

          info[key] = value;
        }
      }
    });

    var contentHeading = $('.mw-content-text h2');
    var contentTableReached = false;
    var contentElements = contentHeading.nextAll().filter(function() {
      if ($(this).is('table')) {
        contentTableReached = true;
        return false;
      }

      return !contentTableReached;
    });

    var $description = $('<div />').append(contentElements);

    info.descriptionText = $description.text().trim();
    info.descriptionHTML = $.html($description);

    return info;
  }

  return parseSkillInfo();
}

module.exports = parseHTML;

if (process.argv[1] === __filename) {
  var fs = require('fs');
  var path = require('path');
  var file = fs.readFileSync(path.resolve(process.argv[2]), 'utf-8');

  console.log(JSON.stringify(parseHTML(file), null, 2));
}