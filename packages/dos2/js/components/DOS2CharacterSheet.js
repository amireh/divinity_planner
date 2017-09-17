const React = require('react');
const { object } = React.PropTypes;
const DOS2CharacterStatsPanel = require('./DOS2CharacterStatsPanel');
const DOS2SkillTree = require('./DOS2SkillTree');
const GameAbilities = require('../GameAbilities');
const DOS2Skillbook = require('./DOS2Skillbook');
const { assign } = require('lodash');
const { ABILITY_URL_KEYS, SKILLBOOK_TAB_URL_KEY } = require('../constants');

const DOS2CharacterSheet = React.createClass({
  propTypes: {
    character: object.isRequired,
  },

  render() {
    const { character } = this.props;
    const activeAbilityId = getAbilityIdFromIndex(this.props.queryParams.t);
    const activeAbility = GameAbilities.get(activeAbilityId);
    const stats = character.toJSON();

    return (
      <div>
        <div className="column column--left">
          <DOS2CharacterStatsPanel
            queryParams={this.props.queryParams}
            abilities={GameAbilities}
            character={character}
            activeAbilityId={activeAbilityId}
            stats={stats}
          />
        </div>

        {<div className="column column--right">
          {this.props.queryParams.t === SKILLBOOK_TAB_URL_KEY ? (
            <DOS2Skillbook
              skills={stats.skillbook}
              abilityPoints={stats.abilityPoints}
            />
          ) : (
            <DOS2SkillTree
              activeAbilityName={activeAbility && activeAbility.DisplayName}
              level={stats.level}
              attributePoints={stats.attributePoints}
              abilityPoints={stats.abilityPoints}
              skills={this.getSkillsForAbility(activeAbilityId)}
              onSkillSelect={this.toggleSkillSelection}
            />
          )}
        </div>}
      </div>
    );
  },

  toggleSkillSelection(id) {
    const { character } = this.props;

    if (character.hasSkillInSpellbook(id)) {
      character.removeSkillFromSpellbook(id);
    }
    else {
      character.addSkillToSpellbook(id);
    }
  },

  getSkillsForAbility(abilityId) {
    if (!abilityId) {
      return [];
    }

    const { Skills: skills } = GameAbilities.get(abilityId);
    const { character } = this.props;

    return skills.map(function(skill) {
      const decoratedSkill = assign({}, skill);
      const requirement = character.skillbook.getSkillRequirement(skill);

      decoratedSkill.learned = character.skillbook.hasSkill(skill.Id);
      decoratedSkill.canLearn = !requirement;
      decoratedSkill.requirement = requirement;

      return decoratedSkill;
    });
  },
});


function getAbilityIdFromIndex(index) {
  let id;

  Object.keys(ABILITY_URL_KEYS).some(function(key) {
    if (ABILITY_URL_KEYS[key] === index) {
      id = key;

      return true;
    }
  });

  return id;
}

module.exports = DOS2CharacterSheet;
