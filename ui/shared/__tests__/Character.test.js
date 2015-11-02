const Character = require('../Character');

describe('Character', function() {
  let subject;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    subject = Character();
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

    it('serializes the character level', function() {
      subject.setLevel(2);
      assert.equal(subject.toURL(), '0b');
    });
  });

  describe('#fromURL', function() {
    it('accepts attributes "1Db"', function() {
      subject.fromURL('1Db');

      assert.equal(serialize().allocatedAttributePoints, 1);
    });

    it('accepts attributes and abilities "1Db2c"', function() {
      subject.fromURL('1Db2c');
      assert.equal(serialize().allocatedAttributePoints, 1);
      assert.equal(serialize().allocatedAbilityPoints, 3);
    });
  });
});