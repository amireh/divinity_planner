const chai = require('chai');
const uiTests = require.context('./ui', true, /.test.js$/);

window.assert = chai.assert;

uiTests.keys().forEach(uiTests);

it('gives us something', function() {
  assert.ok(true);
});