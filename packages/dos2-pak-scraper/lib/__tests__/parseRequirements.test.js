const subject = require("../parseRequirements");
const { assert, loadAsset } = require('./utils')

describe("dos2-pak-scraper::parseRequirements", function() {
  it('works with the real thing', function() {
    const requirements = subject(loadAsset('Requirements'))

    assert.ok(requirements.length > 0);
  });
});