const chai = require('chai');
const uiTests = require.context('./ui', true, /.test.js$/);
const URLManager = require('./ui/shared/URLManager');

window.assert = chai.assert;

beforeEach(function resetURL() {
  URLManager.updateURL([], {});
});

uiTests.keys().forEach(uiTests);
it('gives us something', function() {
  assert.ok(true);
});