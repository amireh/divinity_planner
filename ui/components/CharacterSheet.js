const React = require('react');
const { object } = React.PropTypes;
const AttributePanel = require('./AttributePanel');
const AbilityPanel = require('./AbilityPanel');
const SkillTree = require('components/SkillTree');
const AdjustableItem = require('components/AdjustableItem');
const GameAbilities = require('GameAbilities');
const SkillbookStats = require('components/SkillbookStats');
const Skillbook = require('components/Skillbook');
const assign = require('utils/assign');
const K = require('constants');
const URLManager = require('URLManager');

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

          <div className="type-small character-panel">
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

            <SkillbookStats
              skills={stats.skillbook}
              abilityPoints={stats.abilityPoints}
            />
          </div>
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
