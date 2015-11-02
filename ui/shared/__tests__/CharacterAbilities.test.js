const CharacterAbilities = require('../CharacterAbilities');

describe('CharacterAbilities', function() {
  let subject;
  let level;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    level = 1;
    subject = CharacterAbilities({ getLevel: () => level });
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
      subject.addPoint('manAtArms');

      assert.equal(serialize().allocatedAbilityPoints, 1);
      assert.equal(serialize().remainingAbilityPoints, 4);
    });

    it('does not allow me to add a point if there no points left', function() {
      assert.ok( subject.addPoint('manAtArms') );
      assert.ok( subject.addPoint('manAtArms') );

      assert.equal(serialize().allocatedAbilityPoints, 3);
      assert.equal(serialize().remainingAbilityPoints, 2);

      assert.notOk( subject.addPoint('manAtArms') );
    });
  });

  describe('#toURL', function() {
    it('ignores abilities with no points allocated', function() {
      assert.equal(subject.toURL(), '');
    });

    it('makes no gaps for Aerotheurge', function() {
      subject.addPoint('aerotheurge');

      assert.equal(subject.toURL(), 'b');
    });

    it('makes a gap for Hydrosophist', function() {
      subject.addPoint('hydrosophist');
      assert.equal(subject.toURL(), 'Hb');
    });

    it('makes only 1 gap for Geomancer + Hydrosophist', function() {
      subject.addPoint('geomancer');
      subject.addPoint('hydrosophist');
      assert.equal(subject.toURL(), 'Gbb');
    });

    it('makes 2 gaps for Geomancer + Scoundrel', function() {
      subject.addPoint('geomancer');
      subject.addPoint('scoundrel');
      assert.equal(subject.toURL(), 'GbSb');
    });
  });

  describe('#fromURL', function() {
    it('deserializes a full point allocation str "bbbbbb"', function() {
      assert.deepEqual(subject.fromURL('bbbbbbbb'), {
        aerotheurge: 1,
        expertMarksman: 1,
        geomancer: 1,
        hydrosophist: 1,
        manAtArms: 1,
        pyrokinetic: 1,
        scoundrel: 1,
        witchcraft: 1,
      });
    });

    it('deserializes a point in geomancer "Gb"', function() {
      assert.deepEqual(subject.fromURL('Gb'), {
        geomancer: 1,
      });
    });

    it('deserializes 1 geomancer and 1 witchcraft "GbWb"', function() {
      assert.deepEqual(subject.fromURL('GbWb'), {
        geomancer: 1,
        witchcraft: 1
      });
    });
    it('deserializes 2 aerotheurge 1 geomancer and 1 witchcraft "cGbWb"', function() {
      assert.deepEqual(subject.fromURL('cGbWb'), {
        aerotheurge: 2,
        geomancer: 1,
        witchcraft: 1
      });
    });
  });
});