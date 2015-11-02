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

  describe('#toURL', function() {
    it('ignores attributes with no points allocated', function() {
      assert.equal(subject.toURL(), '');

    });

    it('makes no gaps for STR', function() {
      subject.addPoint('str');

      assert.equal(subject.toURL(), 'b');
    });

    it('makes a gap for CON', function() {
      subject.addPoint('con');
      assert.equal(subject.toURL(), 'Cb');
    });

    it('makes only 1 gap for CON + SPE', function() {
      subject.addPoint('con');
      subject.addPoint('spe');
      assert.equal(subject.toURL(), 'Cbb');
    });

    it('makes 2 gaps for INT + SPE', function() {
      subject.addPoint('int');
      subject.addPoint('spe');
      assert.equal(subject.toURL(), 'IbSb');
    });
  });

  describe('#fromURL', function() {
    it('deserializes a full point allocation str "bbbbbb"', function() {
      assert.deepEqual(subject.fromURL('bbbbbb'), {
        str: 1,
        dex: 1,
        int: 1,
        con: 1,
        spe: 1,
        per: 1,
      });
    });

    it('deserializes a point in dex "Db"', function() {
      assert.deepEqual(subject.fromURL('Db'), {
        dex: 1,
      });
    });

    it('deserializes 1 dex and 1 per "DbPb"', function() {
      assert.deepEqual(subject.fromURL('DbPb'), {
        dex: 1,
        per: 1
      });
    });
  });
});