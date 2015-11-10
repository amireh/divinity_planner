const React = require('react');
const AdjustableItem = require('components/AdjustableItem');
const AttributePanel = require('./AttributePanel');
const AbilityPanel = require('./AbilityPanel');
const SkillbookStats = require('components/SkillbookStats');
const URLManager = require('URLManager');
const classSet = require('classnames');
const K = require('constants');

const PANEL_CHAR = 'character';
const PANEL_ABILITIES = 'abilities';
const PANEL_TALENTS = 'talents';
const PANEL_TRAITS = 'traits';

const Tabs = React.createClass({
  render() {
    return (
      <div className="stats-panel__tabs">
        {this.renderLink(PANEL_CHAR, 'Character')}
        {this.renderLink(PANEL_ABILITIES, 'Abilities')}
        {this.renderLink(PANEL_TALENTS, 'Talents')}
        {this.renderLink(PANEL_TRAITS, 'Traits')}
      </div>
    )
  },

  renderLink(name, text) {
    const className = {};

    className['stats-panel__link'] = true;
    className[`stats-panel__link--${name}`] = true;
    className['active'] = this.props.activePanelId === name;

    return (
      <a
        className={classSet(className)}
        onClick={this.props.onChange.bind(null, name)}
        title={text}
      />
    )
  }
})
const CharacterStatsPanel = React.createClass({
  getInitialState: function() {
    return {
      activePanelId: PANEL_CHAR
    };
  },

  render() {
    let panel;

    switch(this.state.activePanelId) {
      case PANEL_CHAR:
        panel = this.renderCharacterPanel();
        break;
      case PANEL_ABILITIES:
        panel = this.renderAbilitiesPanel();
        break;

      case PANEL_TALENTS:
        panel = <p>Talents will be available soon!</p>;
        break;

      case PANEL_TRAITS:
        panel = <p>Traits will also be available soon!</p>;
        break;
    }

    return (
      <div className="type-small character-panel">
        <Tabs
          onChange={this.activatePanel}
          activePanelId={this.state.activePanelId}
        />

        {panel}
      </div>
    );
  },

  renderCharacterPanel() {
    const { profile, stats } = this.props;

    return (
      <div>
        <h3 className="header">Character</h3>

        <div className="item-points-sheet__entry">
          <span className="item-points-sheet__label">Level</span>

          <div className="item-points-sheet__controls">
            <AdjustableItem
              canIncrease={stats.canIncreaseLevel}
              canDecrease={stats.canDecreaseLevel}
              onIncrease={this.raiseLevel}
              onDecrease={this.lowerLevel}
              onMax={this.setMaxLevel}
              withMaxControl={false}
              children={stats.level}
            />
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
      </div>
    )
  },

  renderAbilitiesPanel() {
    const { profile, stats, activeAbilityId } = this.props;

    return (
      <div>
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

        <SkillbookStats
          skills={stats.skillbook}
          abilityPoints={stats.abilityPoints}
        />
      </div>
    )
  },

  activatePanel(panel) {
    this.setState({ activePanelId: panel });
  },

  showAbilitySkillTree(abilityId) {
    URLManager.setQueryParam('t', K.ABILITY_URL_KEYS[abilityId]);
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

});

module.exports = CharacterStatsPanel;
