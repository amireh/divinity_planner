const AttributeCalculator = require('../AttributeCalculator');

describe('AttributeCalculator', function() {
  let subject;
  let level;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    level = 1;
    subject = AttributeCalculator({ getLevel: () => level });
  });

  describe('#getPoolSize', function() {
    it('works for a level 1 character', function() {
      assert.equal(subject.getPoolSize(), 5);
    });

    it('increases by 1 for a level 2 character (every even level)', function() {
      level = 2;
      assert.equal(subject.getPoolSize(), 6);
    });

    it('does not increase for a level 3 character', function() {
      level = 3;
      assert.equal(subject.getPoolSize(), 6);
    });

    it('gives me 15 points at level 20', function() {
      level = 20;
      assert.equal(subject.getPoolSize(), 15);
    });
  });

  describe('adding and removing attribute points', function() {
    it('takes allocated points into account when calculating the remainder', function() {
      subject.addPoint('dex');

      assert.equal(serialize().allocatedAttributePoints, 1);
      assert.equal(serialize().remainingAttributePoints, 4);
    });

    it('does not allow me to add a point if there no points left', function() {
      assert.ok( subject.addPoint('dex') );
      assert.ok( subject.addPoint('dex') );
      assert.ok( subject.addPoint('dex') );
      assert.ok( subject.addPoint('dex') );
      assert.ok( subject.addPoint('dex') );

      assert.equal(serialize().allocatedAttributePoints, 5);
      assert.equal(serialize().remainingAttributePoints, 0);

      assert.notOk( subject.addPoint('dex') );
    });
  });
});