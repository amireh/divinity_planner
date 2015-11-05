var PAKParser = require('../');
var assert = require('chai').assert;

describe('PAKParser', function() {
  describe('parseDescriptions', function() {
    it('extracts parameters', function() {
      var skillSheet = {};

      skillSheet['Damage'] = '10';
      skillSheet['ExplodeRadius'] = '5m';
      skillSheet['TargetRadius'] = '7m';
      skillSheet["DescriptionRef"] = "Deal [1] damage to anything within [2] from impact.";
      skillSheet['StatsDescriptionRef'] = "Range: [3]";
      skillSheet['StatsDescriptionParams'] = "Damage;ExplodeRadius;TargetRadius";

      var result = PAKParser.parseDescriptions(skillSheet);

      assert.equal(result.description, 'Deal 10 damage to anything within 5m from impact.');
      assert.deepEqual(result.statDescriptions, ['Range: 7m']);
    });
  });
});