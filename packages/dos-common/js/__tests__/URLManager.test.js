const URLManager = require('URLManager');

describe('URLManager', function() {
  describe('#getQueryParams', function() {
    it('works', function() {
      assert.deepEqual(URLManager.getQueryParams(), {});
    });
  });

  describe('#setQueryParam', function() {
    it('works', function() {
      URLManager.setQueryParam('foo', 'bar');

      assert.equal(URLManager.getQueryParams().foo, 'bar');
    });
  });

  describe('#updateURL', function() {
    it('works with nothing', function() {
      URLManager.updateURL();
    });

    it('works with a param', function() {
      URLManager.updateURL([ 'foo' ]);

      assert.include(window.location.hash, 'foo');
    });

    it('works with a couple of params', function() {
      URLManager.updateURL([ 'foo', 'bar' ]);

      assert.include(window.location.hash, 'foo-bar');
    });

    it('works with a couple of params and a query param', function() {
      URLManager.updateURL([ 'foo', 'bar' ], { ee: '1' });

      assert.include(window.location.hash, 'foo-bar?ee=1');
    });
  });
});