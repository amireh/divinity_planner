const React = require('react');
const { object } = React.PropTypes;
const AttributePanel = require('./AttributePanel');
const AbilityPanel = require('./AbilityPanel');
const CharacterSheet = require('./CharacterSheet');
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

  componentDidMount: function() {
    const { hash } = window.location;

    this.props.profile.addChangeListener(this.reload);

    if (hash.length > 1) {
      this.props.profile.fromURL(hash.slice(1));
      this.reload();
    }
  },

  componentWillUnmount: function() {
    this.props.profile.removeChangeListener(this.reload);
  },

  render() {
    const { profile } = this.props;
    const { activeAbilityId } = this.state;
    const stats = profile.toJSON();

    return (
      <div>
        <div className="column type-small">
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
                withMaxControl
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
            selectedAbilityId={activeAbilityId}
          />
        </div>

        <div className="column">
          {activeAbilityId && (
            <SkillTree
              abilityId={activeAbilityId}
              level={stats.level}
              attributePoints={stats.attributePoints}
              abilityPoints={stats.abilityPoints}
              skills={this.getSkillsForAbility(activeAbilityId)}

              onSkillSelect={this.toggleSkillSelection}
            />
          )}
        </div>

        {stats.skillbook.length > 0 && (
          <div className="column">
            <Spellbook skills={stats.skillbook} />
          </div>
        )}
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
    const { profile } = this.props;
    const { skills } = ABILITIES.filter(function(ability) {
      return ability.id === abilityId;
    })[0];

    return skills.map(function(skill) {
      const decoratedSkill = assign({}, skill);

      decoratedSkill.learned = profile.skillbook.hasSkill(skill.id);
      decoratedSkill.canLearn = profile.skillbook.canUseSkill(skill);

      return decoratedSkill;
    });
  },

  reload() {
    this.forceUpdate();
  }
});

module.exports = ProfileSheet;
