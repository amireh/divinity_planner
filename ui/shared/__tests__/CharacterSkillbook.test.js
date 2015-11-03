const CharacterSkillbook = require('../CharacterSkillbook');

describe('CharacterSkillbook', function() {
  let subject;
  let level, abilityPoints;

  function serialize() {
    return subject.toJSON();
  }

  beforeEach(function() {
    level = 20;
    abilityPoints = {
      aerotheurge: 5,
      expertMarksman: 5,
      geomancer: 5,
      witchcraft: 5,
    };

    subject = CharacterSkillbook({
      getLevel: () => level,
      getAbilityPoints: () => abilityPoints
    });
  });

  describe('#toURL', function() {
    it('ignores an empty skillbook', function() {
      assert.equal(subject.toURL(), '');
    });

    it('works with 1 Aerotheurge skill', function() {
      subject.addSkill('bitterCold');

      assert.equal(subject.length, 1);
      assert.equal(subject.toURL(), 'Ac');
    });

    it('works with 2 Aerotheurge skill', function() {
      subject.addSkill('airShield');
      subject.addSkill('bitterCold');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'Aac');
    });

    it('is order aware', function() {
      subject.addSkill('bitterCold');
      subject.addSkill('airShield');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'Aca');

      subject.removeSkill('bitterCold');
      subject.removeSkill('airShield');

      assert.equal(subject.length, 0);

      subject.addSkill('airShield');
      subject.addSkill('bitterCold');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'Aac');
    });

    it('works with 1 Aerotheurge and 1 Expert Marksman skills', function() {
      subject.addSkill('bitterCold');
      subject.addSkill('firstAid');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'AcEd');
    });

    it('works with 1 Aerotheurge and 2 Expert Marksman skills', function() {
      subject.addSkill('bitterCold');
      subject.addSkill('firstAid');
      subject.addSkill('ricochet');

      assert.equal(subject.length, 3);
      assert.equal(subject.toURL(), 'AcEdk');
    });

    it('works with 1 Expert Marksman and 1 Geomancer skills', function() {
      subject.addSkill('firstAid');
      subject.addSkill('bless');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'EdGb');
    });

    it('works with 1 Geomancer skill and 1 Witchcraft skills', function() {
      subject.addSkill('bless');
      subject.addSkill('bloodletting');

      assert.equal(subject.length, 2);
      assert.equal(subject.toURL(), 'GbWc');
    });
  });

  describe('#fromURL', function() {
    it('works with 1 Aerotheurge skill', function() {
      subject.fromURL('Ac');

      assert.equal(subject.length, 1);
      assert.ok(subject.hasSkill('bitterCold'));
    });

    it('works with 2 Aerotheurge skills', function() {
      subject.fromURL('Aac');

      assert.equal(subject.length, 2);
      assert.ok(subject.hasSkill('bitterCold'));
      assert.ok(subject.hasSkill('airShield'));
    });

    it('works with 1 Expert Marskan and 1 Geomancer skills', function() {
      subject.fromURL('EdGb');

      assert.equal(subject.length, 2);
      assert.ok(subject.hasSkill('firstAid'));
      assert.ok(subject.hasSkill('bless'));
    });

  });
});