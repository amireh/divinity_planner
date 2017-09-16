const GameState = require('../GameState');
const URLManager = require('URLManager');

describe('GameState', function() {
  describe('#isEE', function() {
    it('is true if ?ee=1', function() {
      URLManager.setQueryParam('ee', '1');

      assert.ok(GameState.isEE());
    });

    it('is false otherwise', function() {
      assert.notOk(GameState.isEE());
    });
  });
});