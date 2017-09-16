const React = require('react');
const { AdjustableItem } = require('dos-components');
const DOS2AttributePanel = require('./DOS2AttributePanel');
// const AbilityPanel = require('./AbilityPanel');
// const SkillbookStats = require('./SkillbookStats');
const { URLManager } = require('dos-common');
const classSet = require('classnames');
const K = require('../constants');

const PANEL_CHAR = 'character';
const PANEL_ABILITIES = 'abilities';
const PANEL_TALENTS = 'talents';
const PANEL_TRAITS = 'traits';

const Tabs = React.createClass({
  render() {
    return (
      <div className="stats-panel__tabs">
        {this.renderLink(PANEL_CHAR, 'Character')}
        {false && this.renderLink(PANEL_ABILITIES, 'Abilities')}
        {false &&this.renderLink(PANEL_TALENTS, 'Talents')}
        {false &&this.renderLink(PANEL_TRAITS, 'Traits')}
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

const DOS2CharacterStatsPanel = React.createClass({
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
    const { character, stats } = this.props;

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

        <DOS2AttributePanel
          attributePoints={stats.attributePoints}
          onAddAttributePoint={character.addAttributePoint}
          onRemoveAttributePoint={character.removeAttributePoint}
        />
      </div>
    )
  },

  renderAbilitiesPanel() {
    const { character, stats, activeAbilityId } = this.props;

    return (
      <div>
        <h3 className="header">
          Abilities

          <span className="header-auxiliary">
            {stats.allocatedAbilityPoints} / {stats.availableAbilityPoints}
          </span>
        </h3>

        {/*<AbilityPanel
          abilityPoints={stats.abilityPoints}
          onIncrease={character.addAbilityPoint}
          onDecrease={character.removeAbilityPoint}
          onSelect={this.showAbilitySkillTree}
          activeAbilityId={activeAbilityId}
        />*/}

        {/*<SkillbookStats
          skills={stats.skillbook}
          abilityPoints={stats.abilityPoints}
        />*/}
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
    const { character } = this.props;
    character.setLevel(character.getLevel() + 1);
  },

  setMaxLevel() {
    const { character } = this.props;
    character.setLevel(K.MAX_LEVEL);
  },

  lowerLevel() {
    const { character } = this.props;
    character.setLevel(character.getLevel() - 1);
  },

});

module.exports = DOS2CharacterStatsPanel;
