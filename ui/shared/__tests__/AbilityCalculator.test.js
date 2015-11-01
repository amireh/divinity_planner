const AbilityCalculator = require('../AbilityCalculator');

describe('AbilityCalculator', function() {
  let subject;
  let level;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    level = 1;
    subject = AbilityCalculator({ getLevel: () => level });
  });

  describe('#getCost', function() {
    it('works', function() {
      assert.equal(subject.getCost(1), 1);
    });
  });

  describe('#getAccumulativeCost', function() {
    it('works', function() {
      assert.equal(subject.getAccumulativeCost(1), 1);
      assert.equal(subject.getAccumulativeCost(2), 3);
      assert.equal(subject.getAccumulativeCost(3), 6);
      assert.equal(subject.getAccumulativeCost(4), 10);
      assert.equal(subject.getAccumulativeCost(5), 15);
    });
  });

  describe('#getPoolSize', function() {
    it('works for a level 1 character', function() {
      assert.equal(subject.getPoolSize(), 5);
    });

    it('works for a level [2-5] character', function() {
      [ 2,3,4,5 ].forEach(function(charLevel) {
        level = charLevel;
        assert.equal(subject.getPoolSize(), charLevel + 4);
      });
    });

    it('works for a level [6-10] character by increasing increments of 2', function() {
      level = 6;
      assert.equal(subject.getPoolSize(), 11);

      level = 7;
      assert.equal(subject.getPoolSize(), 13);
    });

    it('works for a level [11-20] character by increasing increments of 3', function() {
      level = 11;
      assert.equal(subject.getPoolSize(), 22);
      level = 12;
      assert.equal(subject.getPoolSize(), 25);
    });

    it('gives me 49 points at level 20', function() {
      level = 20;
      assert.equal(subject.getPoolSize(), 49);
    });
  });

  describe('adding and removing ability points', function() {
    it('takes allocated points into account when calculating the remainder', function() {
      subject.addPoint('man_at_arms');

      assert.equal(serialize().allocatedAbilityPoints, 1);
      assert.equal(serialize().remainingAbilityPoints, 4);
    });

    it('does not allow me to add a point if there no points left', function() {
      assert.ok( subject.addPoint('man_at_arms') );
      assert.ok( subject.addPoint('man_at_arms') );

      assert.equal(serialize().allocatedAbilityPoints, 3);
      assert.equal(serialize().remainingAbilityPoints, 2);

      assert.notOk( subject.addPoint('man_at_arms') );
    });
  });
});