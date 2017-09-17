const React = require('react');
const { AdjustableItem } = require('dos-components');
const DOS2AttributePanel = require('./DOS2AttributePanel');
const DOS2AbilityPanel = require('./DOS2AbilityPanel');
const DOS2TalentPanel = require('./DOS2TalentPanel');
const DOS2SkillbookStats = require('./DOS2SkillbookStats');
// const SkillbookStats = require('./SkillbookStats');
const { URLManager } = require('dos-common');
const classSet = require('classnames');
const { ABILITY_URL_KEYS, SKILLBOOK_TAB_URL_KEY } = require('../constants');
const { MaxLevel } = require('../rules.yml')

const PANEL_CHAR = 'character';
const PANEL_ABILITIES = 'abilities';
const PANEL_TALENTS = 'talents';

const Tabs = React.createClass({
  render() {
    return (
      <div className="stats-panel__tabs">
        {this.renderLink(PANEL_CHAR, 'Character')}
        {this.renderLink(PANEL_ABILITIES, 'Abilities')}
        {this.renderLink(PANEL_TALENTS, 'Talents')}
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
  render() {
    const { panel: activePanelId = PANEL_CHAR } = this.props.queryParams;

    let panel;

    switch (activePanelId) {
      case PANEL_CHAR:
        panel = this.renderCharacterPanel();
        break;
      case PANEL_ABILITIES:
        panel = this.renderAbilitiesPanel();
        break;

      case PANEL_TALENTS:
        panel = this.renderTalentsPanel();
        break;
    }

    return (
      <div className="type-small character-panel">
        <Tabs
          onChange={this.activatePanel}
          activePanelId={activePanelId}
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
              withMaxControl
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
          onAddAttributePoints={character.addAttributePoints}
          onRemoveAttributePoints={character.removeAttributePoints}
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

        <DOS2AbilityPanel
          abilities={this.props.abilities}
          abilityPoints={stats.abilityPoints}
          onIncrease={character.addAbilityPoint}
          onDecrease={character.removeAbilityPoint}
          onSelect={this.showAbilitySkillTree}
          activeAbilityId={activeAbilityId}
        />

        <DOS2SkillbookStats
          skills={stats.skillbook}
          abilityPoints={stats.abilityPoints}
          active={this.props.queryParams.t === SKILLBOOK_TAB_URL_KEY}
        />
      </div>
    )
  },

  renderTalentsPanel() {
    const { character, stats } = this.props;

    return (
      <div>
        <DOS2TalentPanel
          queryParams={this.props.queryParams}
          talentPoints={stats.talentPoints}
          onAddTalentPoint={character.addTalentPoint}
          onRemoveTalentPoint={character.removeTalentPoint}
        />
      </div>
    )
  },

  activatePanel(panel) {
    URLManager.setQueryParam('panel', panel)
  },

  showAbilitySkillTree(abilityId) {
    URLManager.setQueryParam('t', ABILITY_URL_KEYS[abilityId]);
  },

  raiseLevel() {
    const { character } = this.props;
    character.setLevel(character.getLevel() + 1);
  },

  setMaxLevel() {
    const { character } = this.props;
    character.setLevel(MaxLevel);
  },

  lowerLevel() {
    const { character } = this.props;
    character.setLevel(character.getLevel() - 1);
  },

});

module.exports = DOS2CharacterStatsPanel;
