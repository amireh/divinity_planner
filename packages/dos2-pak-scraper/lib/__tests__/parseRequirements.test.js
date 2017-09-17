const subject = require("../parseRequirements");
const fs = require('fs')
const { assert, fixtures, loadAsset } = require('./utils')
const { loadSkillData } = require('../')
const { inspect } = require('util')

describe("dos2-pak-scraper::parseRequirements", function() {
  it('works with the real thing', function() {
    const requirements = subject(loadAsset('Requirements'))

    console.log(inspect(requirements, { depth: null, color: true }))

    assert.ok(requirements.length > 0);
  });

  // context('with a sample...', function() {
  //   const sample = fs.readFileSync(fixtures.join('SkillData.txt'), 'utf8')
  //   const [ skill ] = subject(sample)

  //   it('extracts skill id', function() {
  //     assert.deepEqual(skill.Id, 'Projectile_StaffOfMagus');
  //   })
  // })
});