const subject = require("../parseSkillData");
const utils = require('./utils')
const { loadSkillData } = require('../')

describe("dos2-pak-scraper::parseSkillData", function() {
  it('works', function() {
    const skillDataSource = loadSkillData();
    const skillData = subject(skillDataSource)

    console.log('Skills?', skillData.length)
    // console.log('Skills?', skillData.map(x => x.id))
    console.log(skillData[0])
  });
});