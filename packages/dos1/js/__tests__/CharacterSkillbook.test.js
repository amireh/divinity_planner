const CharacterSkillbook = require('../CharacterSkillbook');
const K = require('../constants');
const TestUtils = require('../TestUtils');

describe('CharacterSkillbook', function() {
  let subject;
  let level, abilityPoints;

  beforeEach(function() {
    level = 1;
    abilityPoints = {
      aerotheurge: 0,
      expertMarksman: 0,
      geomancer: 0,
      witchcraft: 0,
    };

    subject = CharacterSkillbook({
      getLevel: () => level,
      getAbilityPoints: () => abilityPoints
    });
  });

  describe('#getSkillRequirement', function() {
    it('is false if ability level is below the required', function() {
      abilityPoints.aerotheurge = 0;

      assert.equal(subject.getSkillRequirement('airShield'), K.ERR_ABILITY_LEVEL_TOO_LOW);
    });

    it('is false if ability skill limit is exceeded', function() {
      abilityPoints.aerotheurge = 1;

      subject.addSkill('headvice');
      subject.addSkill('blitzBolt');
      subject.addSkill('bitterCold');

      assert.equal(subject.getSkillRequirement('teleportation'), K.ERR_ABILITY_CAP_REACHED);
    });

    it('is false if character level is below the required', function() {
      level = 8;
      abilityPoints.aerotheurge = 3;
      assert.equal(subject.getSkillRequirement('airShield'), K.ERR_CHAR_LEVEL_TOO_LOW);
    });
  });

  // Here's a list of the available Aerotheurge skills by tiers, for reference:
  //
  // {
  //   "1": [
  //     "blitzBolt",
  //     "windOfChange",
  //     "bitterCold",
  //     "avatarOfStorms",
  //     "shockingTouch",
  //     "thunderJump",
  //     "teleportation"
  //   ],
  //   "2": [
  //     "headvice",
  //     "tornado",
  //     "summonAirElemental",
  //     "airAbsorptionShield",
  //     "invisibility"
  //   ],
  //   "3": [
  //     "chainLightning",
  //     "makeInvisible",
  //     "storm",
  //     "netherswap"
  //   ]
  // }
  //
  describe('#getSkillRequirementEE', function() {
    beforeEach(function() {
      TestUtils.setEE();
      level = 20;
    });

    it('checks for character level', function() {
      level = 1;

      assert.equal(subject.getSkillRequirementEE('blitzBolt'), K.ERR_CHAR_LEVEL_TOO_LOW);

      level = 4;

      assert.notEqual(subject.getSkillRequirementEE('blitzBolt'), K.ERR_CHAR_LEVEL_TOO_LOW);
    });

    describe('tiers', function() {
      it('requires ability level > 1 to use Novice skills', function() {
        assert.equal(subject.getSkillRequirementEE('blitzBolt'), K.ERR_ABILITY_LEVEL_TOO_LOW);

        abilityPoints.aerotheurge = 1;

        assert.equal(subject.getSkillRequirementEE('blitzBolt'), null);
      });

      it('requires ability level >= 2 to use Adept skills', function() {
        assert.equal(subject.getSkillRequirementEE('headvice'), K.ERR_ABILITY_LEVEL_TOO_LOW);

        abilityPoints.aerotheurge = 2;

        assert.equal(subject.getSkillRequirementEE('headvice'), null);
      });

      it('requires ability level >= 4 to use Adept skills', function() {
        assert.equal(subject.getSkillRequirementEE('netherswap'), K.ERR_ABILITY_LEVEL_TOO_LOW);

        abilityPoints.aerotheurge = 4;

        assert.equal(subject.getSkillRequirementEE('netherswap'), null);
      });
    });

    describe('pool sizes', function() {
      context('with an ability level 1', function() {
        it('only allows for 3 novice spells', function() {
          abilityPoints.aerotheurge = 1;

          assert.ok( subject.addSkill('blitzBolt') );
          assert.ok( subject.addSkill('windOfChange') );
          assert.ok( subject.addSkill('avatarOfStorms') );

          assert.equal(subject.getSkillRequirementEE('shockingTouch'), K.ERR_ABILITY_CAP_REACHED)
        });
      });

      context('with an ability level 2', function() {
        beforeEach(function() {
          abilityPoints.aerotheurge = 2;
        });

        it('allows for 5 novice spells and 2 adept ones', function() {
          assert.ok( subject.addSkill('avatarOfStorms') );
          assert.ok( subject.addSkill('blitzBolt') );
          assert.ok( subject.addSkill('windOfChange') );
          assert.ok( subject.addSkill('shockingTouch') );
          assert.ok( subject.addSkill('teleportation') );

          assert.equal(subject.getSkillRequirementEE('thunderJump'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('headvice') );
          assert.ok( subject.addSkill('tornado') );

          assert.equal(subject.getSkillRequirementEE('invisibility'), K.ERR_ABILITY_CAP_REACHED)
        });
      });

      context('with an ability level 3', function() {
        beforeEach(function() {
          abilityPoints.aerotheurge = 3;
        });

        it('allows for 6 novice spells and 3 adept ones', function() {
          assert.ok( subject.addSkill('avatarOfStorms') );
          assert.ok( subject.addSkill('blitzBolt') );
          assert.ok( subject.addSkill('windOfChange') );
          assert.ok( subject.addSkill('shockingTouch') );
          assert.ok( subject.addSkill('teleportation') );
          assert.ok( subject.addSkill('thunderJump') );

          assert.equal(subject.getSkillRequirementEE('bitterCold'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('headvice') );
          assert.ok( subject.addSkill('tornado') );
          assert.ok( subject.addSkill('invisibility') );

          assert.equal(subject.getSkillRequirementEE('summonAirElemental'), K.ERR_ABILITY_CAP_REACHED)
        });
      });

      context('with an ability level 4', function() {
        beforeEach(function() {
          abilityPoints.aerotheurge = 4;
        });

        it('allows for 6 novice, 4 adept, and 1 master spells', function() {
          assert.ok( subject.addSkill('avatarOfStorms') );
          assert.ok( subject.addSkill('blitzBolt') );
          assert.ok( subject.addSkill('windOfChange') );
          assert.ok( subject.addSkill('shockingTouch') );
          assert.ok( subject.addSkill('teleportation') );
          assert.ok( subject.addSkill('thunderJump') );

          assert.equal(subject.getSkillRequirementEE('bitterCold'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('headvice') );
          assert.ok( subject.addSkill('tornado') );
          assert.ok( subject.addSkill('invisibility') );
          assert.ok( subject.addSkill('summonAirElemental') );

          assert.equal(subject.getSkillRequirementEE('airAbsorptionShield'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('chainLightning') );
          assert.equal(subject.getSkillRequirementEE('makeInvisible'), K.ERR_ABILITY_CAP_REACHED)
        });
      });

      context('with an ability level 5', function() {
        beforeEach(function() {
          abilityPoints.aerotheurge = 5;
        });

        it('allows for 6 novice, 4 adept, and 2 master spells', function() {
          assert.ok( subject.addSkill('avatarOfStorms') );
          assert.ok( subject.addSkill('blitzBolt') );
          assert.ok( subject.addSkill('windOfChange') );
          assert.ok( subject.addSkill('shockingTouch') );
          assert.ok( subject.addSkill('teleportation') );
          assert.ok( subject.addSkill('thunderJump') );

          assert.equal(subject.getSkillRequirementEE('bitterCold'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('headvice') );
          assert.ok( subject.addSkill('tornado') );
          assert.ok( subject.addSkill('invisibility') );
          assert.ok( subject.addSkill('summonAirElemental') );

          assert.equal(subject.getSkillRequirementEE('airAbsorptionShield'), K.ERR_ABILITY_CAP_REACHED)

          assert.ok( subject.addSkill('chainLightning') );
          assert.ok( subject.addSkill('makeInvisible') );

          assert.equal(subject.getSkillRequirementEE('storm'), K.ERR_ABILITY_CAP_REACHED)
        });
      });
    });
  });

  describe('#toURL', function() {
    beforeEach(function() {
      level = 20;
      abilityPoints = {
        aerotheurge: 5,
        expertMarksman: 5,
        geomancer: 5,
        witchcraft: 5,
      };
    });

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
    beforeEach(function() {
      level = 20;
      abilityPoints = {
        aerotheurge: 5,
        expertMarksman: 5,
        geomancer: 5,
        witchcraft: 5,
      };
    });

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