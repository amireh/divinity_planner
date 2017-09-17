const subject = require("../parseSkillData");
const fs = require('fs')
const { assert, fixtures } = require('./utils')
const { loadSkillData } = require('../')

describe("dos2-pak-scraper::parseSkillData", function() {
  it('works with the real thing', function() {
    const skillDataSource = loadSkillData({});
    const skillData = subject(skillDataSource)

    assert.ok(skillData.length > 0);
  });

  context('with a sample...', function() {
    const sample = fs.readFileSync(fixtures.join('SkillData.txt'), 'utf8')
    const [ skill ] = subject(sample)

    it('extracts skill id', function() {
      assert.deepEqual(skill.Id, 'Projectile_StaffOfMagus');
    })
  })
});