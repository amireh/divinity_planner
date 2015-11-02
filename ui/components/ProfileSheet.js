const React = require('react');
const { object } = React.PropTypes;
const AttributePanel = require('./AttributePanel');
const AbilityPanel = require('./AbilityPanel');
const CharacterSheet = require('./CharacterSheet');
const SkillTree = require('components/SkillTree');
const AdjustableItem = require('components/AdjustableItem');
const ABILITIES = require('database/abilities.json');
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
    const profileStats = profile.toJSON();

    return (
      <div>
        <div className="column">
          <div className="item-points-sheet__entry">
            <span className="item-points-sheet__label">
              Character level
            </span>

            <div className="item-points-sheet__controls">
              <AdjustableItem
                canIncrease={profileStats.canIncreaseLevel}
                canDecrease={profileStats.canDecreaseLevel}
                onIncrease={this.raiseLevel}
                onDecrease={this.lowerLevel}
                onMax={this.setMaxLevel}
                withMaxControl
              >
                {profileStats.level}
              </AdjustableItem>
            </div>

          </div>

          <AttributePanel
            attributePoints={profileStats.attributePoints}
            onAddAttributePoint={profile.addAttributePoint}
            onRemoveAttributePoint={profile.removeAttributePoint}
          />

          <AbilityPanel
            abilityPoints={profileStats.abilityPoints}
            onIncrease={profile.addAbilityPoint}
            onDecrease={profile.removeAbilityPoint}
            onSelect={this.showAbilitySkillTree}
            selectedAbilityId={activeAbilityId}
          />

          <CharacterSheet stats={profileStats} />
        </div>

        {activeAbilityId && (
          <SkillTree
            abilityId={activeAbilityId}
            level={profileStats.level}
            attributePoints={profileStats.attributePoints}
            abilityPoints={profileStats.abilityPoints}
            skills={ABILITIES.filter(function(ability) {
              return ability.id === activeAbilityId;
            })[0].skills}
          />
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

  reload() {
    this.forceUpdate();
  }
});

module.exports = ProfileSheet;
