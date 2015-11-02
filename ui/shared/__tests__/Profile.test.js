const Profile = require('../Profile');

describe('Profile', function() {
  let subject;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    subject = Profile();
  });

  describe('#serialize', function() {
    it('works', function() {
      serialize();
    });
  });

  describe('#toURL', function() {
    it('works with an empty state', function() {
      assert.equal(subject.toURL(), '');
    });
  });

  describe('#fromURL', function() {
    it('accepts attributes "XDb"', function() {
      subject.fromURL('XDb');

      assert.equal(serialize().allocatedAttributePoints, 1);
    });
  });
});