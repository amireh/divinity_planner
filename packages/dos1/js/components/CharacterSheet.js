const React = require('react');
const { object } = React.PropTypes;
const CharacterStatsPanel = require('./CharacterStatsPanel');
const SkillTree = require('./SkillTree');
const GameAbilities = require('../GameAbilities');
const Skillbook = require('./Skillbook');
const assign = require('../utils/assign');
const K = require('../constants');

const CharacterSheet = React.createClass({
  propTypes: {
    profile: object
  },

  render() {
    const { profile } = this.props;
    const activeAbilityId = getAbilityIdFromIndex(this.props.queryParams.t);
    const activeAbility = GameAbilities.getAll().filter(a => a.id === activeAbilityId)[0];
    const stats = profile.toJSON();

    return (
      <div>
        <div className="column column--left">
          <CharacterStatsPanel
            profile={profile}
            activeAbilityId={activeAbilityId}
            stats={stats}
          />
        </div>

        <div className="column column--right">
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
        </div>
      </div>
    );
  },

  toggleSkillSelection(id) {
    const { profile } = this.props;

    if (profile.hasSkillInSpellbook(id)) {
      profile.removeSkillFromSpellbook(id);
    }
    else {
      profile.addSkillToSpellbook(id);
    }
  },

  getSkillsForAbility(abilityId) {
    if (!abilityId) {
      return [];
    }

    const sourceAbilities = GameAbilities.getAll();

    const { profile } = this.props;
    const { skills } = sourceAbilities.filter(function(ability) {
      return ability.id === abilityId;
    })[0];

    return skills.map(function(skill) {
      const decoratedSkill = assign({}, skill);
      const requirement = profile.skillbook.getSkillRequirement(skill);

      decoratedSkill.learned = profile.skillbook.hasSkill(skill.id);
      decoratedSkill.canLearn = !requirement;
      decoratedSkill.requirement = requirement;

      return decoratedSkill;
    });
  },
});


function getAbilityIdFromIndex(index) {
  let id;

  Object.keys(K.ABILITY_URL_KEYS).some(function(key) {
    if (K.ABILITY_URL_KEYS[key] === index) {
      id = key;

      return true;
    }
  });

  return id;
}

module.exports = CharacterSheet;
