const Character = require("../Character");
const CharacterTalents = require("../CharacterTalents");
const GameTalents = require('../GameTalents')
const sinon = require('sinon')

describe("dos2::CharacterTalents", function() {
  const talents = GameTalents.getAll()
  let character, onChange, subject;

  beforeEach(function() {
    character = Character()
    character.setLevel(30)
    onChange = sinon.stub()
    subject = CharacterTalents(character, onChange)
  })

  it('works', function() {
  });

  describe('toURL / fromURL', function() {
    const samples = [
      {
        talents: [ 0 ],
        output:  '1'
      },
      {
        talents: [ 0, 1 ],
        output: '11',
      },
      {
        talents: [ 0, 2 ],
        output: '1b1'
      },
      {
        talents: [ 0, 2, 3 ],
        output: '1b11'
      }
    ]

    it('works with the first talent by defining no gap', function() {
      subject.addPoint(talents[0].Id)

      assert.equal(subject.toURL(), '1')
    })

    samples.forEach(({ talents: selected, output }) => {
      it(`${selected.join(', ')} => ${output}`, function() {
        selected.forEach(index => {
          subject.addPoint(talents[index].Id)
        })

        assert.equal(subject.toURL(), output)
        assert.deepEqual(subject.fromURL(output), selected.map(x => talents[x].Id))
      })
    })
  })
});