const React = require('react');
const { object } = React.PropTypes;
const DOS2CharacterStatsPanel = require('./DOS2CharacterStatsPanel');
// const SkillTree = require('./SkillTree');
const GameAbilities = require('../GameAbilities');
// const Skillbook = require('./Skillbook');
const { assign } = require('lodash');
const { ABILITY_URL_KEYS } = require('../constants');

const DOS2CharacterSheet = React.createClass({
  propTypes: {
    character: object.isRequired,
  },

  render() {
    const { character } = this.props;
    const activeAbilityId = getAbilityIdFromIndex(this.props.queryParams.t);
    const activeAbility = GameAbilities.getAll().filter(a => a.id === activeAbilityId)[0];
    const stats = character.toJSON();

    return (
      <div>
        <div className="column column--left">
          <DOS2CharacterStatsPanel
            abilities={GameAbilities}
            character={character}
            activeAbilityId={activeAbilityId}
            stats={stats}
          />
        </div>

        {/*<div className="column column--right">
          {this.props.queryParams.t === K.SKILLBOOK_TAB_URL_KEY ? (
            <Skillbook
              skills={stats.skillbook}
              abilityPoints={stats.abilityPoints}
            />
          ) : (
            <SkillTree
              activeAbilityName={activeAbility && activeAbility.name}
              level={stats.level}
              attributePoints={stats.attributePoints}
              abilityPoints={stats.abilityPoints}
              skills={this.getSkillsForAbility(activeAbilityId)}
              onSkillSelect={this.toggleSkillSelection}
            />
          )}
        </div>*/}
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

    const sourceAbilities = GameAbilities.getAll();

    const { character } = this.props;
    const { skills } = sourceAbilities.filter(function(ability) {
      return ability.id === abilityId;
    })[0];

    return skills.map(function(skill) {
      const decoratedSkill = assign({}, skill);
      const requirement = character.skillbook.getSkillRequirement(skill);

      decoratedSkill.learned = character.skillbook.hasSkill(skill.id);
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
