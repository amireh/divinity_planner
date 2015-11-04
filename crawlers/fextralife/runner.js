#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');
var assert = require('assert');
var normalize = require('../utils/normalize');
var program = require('commander');
var Crawler = require('./');

var OUTPUT_DIR = path.resolve(__dirname, 'output');
var DATABASE_PATH = path.join(OUTPUT_DIR, 'database.json');
var NORMALIZED_DATABASE_PATH = path.join(OUTPUT_DIR, 'database.normalized.json');
var ICONS_PATH = path.join(OUTPUT_DIR, 'skill_icons');
var DEST_PATH = path.resolve(__dirname, '..', '..', 'ui', 'shared', 'database', 'abilities_ee.json');

program.name('fextra-crawler');

program
  .command('crawl')
  .option('--load-cookies <FILE>', 'A file containing Mozilla-compliant cookie listing.', path.resolve(__dirname, 'cookies.txt'))
  .option('-c, --concurrency [VALUE]', 'Number of threads to operate.', 5)
  .option('-b, --bulk [FLAG]', 'Should we parse skill info from the base ability pages?', true)
  .action(function(options) {
    assert(!options.loadCookies || fs.existsSync(options.loadCookies),
      "Expected the cookies file to exist! Path: " + options.loadCookies
    );

    var crawlerMethod = options.bulk ? 'crawlBulk' : 'crawl';

    Crawler[crawlerMethod].call(Crawler, {
      cookies: options.loadCookies,
      concurrency: options.concurrency
    }, function(err, database) {
      if (err) {
        throw new Error(err);
      }

      fs.writeFileSync(DATABASE_PATH, JSON.stringify(database, null, 2));

      console.log('Number of skills:', database.length);
      console.log('Done! written to "%s"', DATABASE_PATH);
    });
  })
;

program
  .command('normalize')
  .action(function() {
    assert(fs.existsSync(DATABASE_PATH),
      "You must generate the skill database first using `crawl`."
    );

    var database = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf-8'));
    var normalizedDatabase = Crawler.normalize(database);

    fs.writeFileSync(NORMALIZED_DATABASE_PATH, JSON.stringify(normalizedDatabase, null, 2));
  })
;

program
  .command('download-icons')
  .option('-c, --concurrency <VALUE>', 'Number of threads to operate.', 15)
  .action(function(options) {
    assert(fs.existsSync(DATABASE_PATH),
      "You must generate the skill database first using `crawl`."
    );

    fs.ensureDirSync(ICONS_PATH);

    Crawler.downloadImages(JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf-8')), function(err, results) {
      if (err) {
        throw new Error(err);
      }

      results.forEach(function(entry) {
        var fileName = normalize(entry.name) + path.extname(entry.fileName);

        fs.writeFileSync(path.join(ICONS_PATH, fileName), entry.blob);
      })
    });
  })
;

program
  .command('parse-skill <path>')
  .action(function(filePath) {
    console.log(
      Crawler.parseSkillPage(
        fs.readFileSync(path.resolve(filePath), 'utf-8')
      )
    );
  })
;
program
  .command('parse-ability <path>')
  .action(function(filePath) {
    console.log(
      Crawler.parseAbilityPage(
        fs.readFileSync(path.resolve(filePath), 'utf-8')
      )
    );
  })
;

program
  .command('install')
  .action(function() {
    assert(fs.existsSync(NORMALIZED_DATABASE_PATH),
      "You must generate the normalized database first!"
    );

    fs.copySync(NORMALIZED_DATABASE_PATH, DEST_PATH);
  })
;

// program
//   .command('test <host> <path>')
//   .action(function(host, path) {
//     var SCrawler = require("simplecrawler");

//     console.log('Crawling "%s"', host)
//     var crawler = new SCrawler(host);

//     crawler.on("fetchstart", function(queueItem) {
//       console.log("fetchstart");
//     });

//     crawler.on("fetchredirect", function(queueItem, parsedURL) {
//       console.error('fetchredirect!', parsedURL)
//     });

//     crawler.on("fetchtimeout", function(queueItem) {
//       console.log("fetchtimeout");
//     });

//     crawler.on("fetchclienterror", function(queueItem) {
//       console.log("fetchclienterror");
//     });

//     crawler.on("fetchcomplete", function(queueItem) {
//       console.log("Completed fetching resource:", queueItem.url);
//     });

//     crawler.on("fetchheaders", function(queueItem) {
//       console.log("fetchheaders");
//     });

//     crawler.on("fetchdataerror", function(queueItem) {
//       console.error('fetchdataerror!')
//     });
//     crawler.on("fetch404", function(queueItem) {
//       console.error('fetch404!')
//     });
//     crawler.on("fetcherror", function(queueItem, response) {
//       // debugger
//       console.error('fetcherror!', queueItem.url, response.statusCode)
//     });

//     crawler.initialPath = path;
//     crawler.cookies.add(
//       'cdmblk',
//       '0:0:0:0:0:0:0:0:0,0:0:0:0:0:0:0:0:0,0:0:0:0:0:0:0:0:0,0:0:0:0:0:0:0:0:0,0:0:0:0:0:0:0:0:0',
//       new Date(1449251240 * 1000),
//       '/',
//       'divinityoriginalsin.wiki.fextralife.com',
//       false
//     );
//     crawler.discoverResources = null;
//     crawler.acceptCookies = true;
//     crawler.maxDepth = 1;
//     crawler.filterByDomain = false;

//     crawler.start();
//   })
// ;
// DEBUG
// console.log(
//   Crawler.parseSkillListing(
//     fs.readFileSync('./fixtures/Skills Overview.html', 'utf-8')
//   )
// );

// console.log(
//   Crawler.parseSkillPage(
//     fs.readFileSync('./fixtures/Avatar of Storms.html', 'utf-8')
//   )
// );


program.parse(process.argv);