const subject = require("../parseSkills");
const fs = require('fs')
const { assert, loadAsset, fixtures } = require('./utils')

describe("dos2-pak-scraper::parseSkills", function() {
  it('works with the real thing', function() {
    const skillData = subject(loadAsset('SkillData'))

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