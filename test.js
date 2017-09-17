const chai = require('chai');
const { URLManager } = require('dos-common');


window.assert = chai.assert;

beforeEach(function resetURL() {
  URLManager.updateURL([], {});
});

if (process.env.MOJO_RUNNER_PATH) {
  require(process.env.MOJO_RUNNER_PATH)
}
else {
  const tests = [
    require.context('./packages/dos-common/js', true, /.test.js$/),
    require.context('./packages/dos1/js', true, /.test.js$/),
    require.context('./packages/dos2/js', true, /.test.js$/),
  ]

  tests.forEach(testContext => {
    testContext.keys().forEach(testContext);
  })
}
