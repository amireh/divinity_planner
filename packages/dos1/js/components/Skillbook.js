const React = require('react');
const GameAbilities = require('../GameAbilities');
const GameSkills = require('../GameSkills');
const GameState = require('../GameState');
const Skill = require('./Skill');
const CharacterSkillbook = require('../CharacterSkillbook');
const K = require('../constants');
const classSet = require('classnames');
const { URLManager } = require('dos-common');

const Skillbook = React.createClass({
  render() {
    const skills = this.props.skills.map(id => GameSkills.get(id));
    const abilitySkills = skills.reduce(function(abilities, skill) {
      if (!abilities[skill.ability]) {
        abilities[skill.ability] = [];
      }

      abilities[skill.ability].push(skill);

      return abilities;
    }, {});

    return (
      <div className="skillbook">
        <h3 className="skillbook__header">
          Skillbook
        </h3>

        <div className="skillbook__content">
          {this.props.skills.length === 0 && (
            <p><em>Empty.</em></p>
          )}

          {Object.keys(abilitySkills).map(this.renderAbilitySkills.bind(null, abilitySkills))}
        </div>
      </div>
    );
  },

  renderAbilitySkills(abilitySkills, key) {
    const ability = GameAbilities.get(key);

    return (
      <div key={key}>
        <h4 className="skillbook__ability-header">
          {ability.name}
        </h4>

        <div>
          {abilitySkills[key].map(this.renderSkill)}
        </div>
      </div>
    );
  },

  renderSkill(skill) {
    return (
      <Skill
        key={skill.id}
        {...skill}
        learned
        learnable={false}
      />
    );
  },
});

module.exports = Skillbook;
