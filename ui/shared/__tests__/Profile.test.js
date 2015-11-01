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
});