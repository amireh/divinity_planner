const React = require('react');
const { object } = React.PropTypes;
const AttributePanel = require('./AttributePanel');
const AbilityPanel = require('./AbilityPanel');
const SkillTree = require('components/SkillTree');
const AdjustableItem = require('components/AdjustableItem');
const Spellbook = require('components/Spellbook');
const ABILITIES = require('database/abilities.json');
const assign = require('utils/assign');
const K = require('constants');

const ProfileSheet = React.createClass({
  propTypes: {
    profile: object
  },

  getInitialState: function() {
    return {
      activeAbilityId: null
    };
  },

  render() {
    const { profile } = this.props;
    const { activeAbilityId } = this.state;
    const activeAbility = ABILITIES.filter(a => a.id === activeAbilityId)[0];
    const stats = profile.toJSON();

    return (
      <div>
        <div className="column type-small character-panel">
          <h3 className="header">
            Character
          </h3>

          <div className="item-points-sheet__entry">
            <span className="item-points-sheet__label">
              Level
            </span>

            <div className="item-points-sheet__controls">
              <AdjustableItem
                canIncrease={stats.canIncreaseLevel}
                canDecrease={stats.canDecreaseLevel}
                onIncrease={this.raiseLevel}
                onDecrease={this.lowerLevel}
                onMax={this.setMaxLevel}
                withMaxControl={false}
              >
                {stats.level}
              </AdjustableItem>
            </div>

          </div>

          <h3 className="header">
            Attributes

            <span className="header-auxiliary">
              {stats.allocatedAttributePoints} / {stats.availableAttributePoints}
            </span>
          </h3>

          <AttributePanel
            attributePoints={stats.attributePoints}
            onAddAttributePoint={profile.addAttributePoint}
            onRemoveAttributePoint={profile.removeAttributePoint}
          />

          <h3 className="header">
            Abilities

            <span className="header-auxiliary">
              {stats.allocatedAbilityPoints} / {stats.availableAbilityPoints}
            </span>
          </h3>

          <AbilityPanel
            abilityPoints={stats.abilityPoints}
            onIncrease={profile.addAbilityPoint}
            onDecrease={profile.removeAbilityPoint}
            onSelect={this.showAbilitySkillTree}
            activeAbilityId={activeAbilityId}
          />
        </div>

        <div className="column">
          <SkillTree
            activeAbilityName={activeAbility && activeAbility.name}
            level={stats.level}
            attributePoints={stats.attributePoints}
            abilityPoints={stats.abilityPoints}
            skills={this.getSkillsForAbility(activeAbilityId)}

            onSkillSelect={this.toggleSkillSelection}
          />
        </div>

        <div className="column">
          <Spellbook
            skills={stats.skillbook}
            abilityPoints={stats.abilityPoints}
          />
        </div>
      </div>
    );
  },

  showAbilitySkillTree(abilityId) {
    this.setState({
      activeAbilityId: abilityId
    });
  },

  raiseLevel() {
    const { profile } = this.props;
    profile.setLevel(profile.getLevel() + 1);
  },

  setMaxLevel() {
    const { profile } = this.props;
    profile.setLevel(K.MAX_LEVEL);
  },

  lowerLevel() {
    const { profile } = this.props;
    profile.setLevel(profile.getLevel() - 1);
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

    const { profile } = this.props;
    const { skills } = ABILITIES.filter(function(ability) {
      return ability.id === abilityId;
    })[0];

    return skills.map(function(skill) {
      const decoratedSkill = assign({}, skill);
      const requirement = profile.skillbook.canUseSkill(skill);

      decoratedSkill.learned = profile.skillbook.hasSkill(skill.id);
      decoratedSkill.canLearn = requirement === true;
      decoratedSkill.requirement = requirement;

      return decoratedSkill;
    });
  },
});

module.exports = ProfileSheet;
