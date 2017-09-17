const React = require('react');
const DOS2CharacterStatsPanel = require('./DOS2CharacterStatsPanel');
const DOS2SkillTree = require('./DOS2SkillTree');
const DOS2Skillbook = require('./DOS2Skillbook');
const DOS2TalentDetail = require('./DOS2TalentDetail');
const GameAbilities = require('../GameAbilities');
const GameSkills = require('../GameSkills');
const { assign } = require('lodash');
const { ABILITY_URL_KEYS, SKILLBOOK_TAB_URL_KEY } = require('../constants');
const { object } = React.PropTypes;

const DOS2CharacterSheet = React.createClass({
  propTypes: {
    character: object.isRequired,
  },

  render() {
    const { character } = this.props;
    const activeAbilityId = getAbilityIdFromIndex(this.props.queryParams.t);
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

        <div className="column column--right">
          {this.renderContent()}
        </div>
      </div>
    );
  },

  renderContent() {
    const { panel: activePanelId } = this.props.queryParams;
    const { character } = this.props;
    const activeAbilityId = getAbilityIdFromIndex(this.props.queryParams.t);
    const activeAbility = GameAbilities.get(activeAbilityId);
    const stats = character.toJSON();

    if (this.props.queryParams.t === SKILLBOOK_TAB_URL_KEY) {
      return (
        <DOS2Skillbook
          skills={stats.skillbook}
          abilityPoints={stats.abilityPoints}
        />
      )
    }
    else if (activePanelId === 'talents') {
      return (
        <DOS2TalentDetail
          activeTalentId={this.props.queryParams.talent}
        />
      )
    }
    else {
      return (
        <DOS2SkillTree
          activeAbilityName={activeAbility && activeAbility.DisplayName}
          level={stats.level}
          attributePoints={stats.attributePoints}
          abilityPoints={stats.abilityPoints}
          skills={this.getSkillsForAbility(activeAbilityId)}
          onSkillSelect={this.toggleSkillSelection}
        />
      )
    }
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

    const skills = GameSkills.getByAbility(abilityId);
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
