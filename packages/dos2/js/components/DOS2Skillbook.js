const React = require('react');
const GameAbilities = require('../GameAbilities');
const GameSkills = require('../GameSkills');
const DOS2Skill = require('./DOS2Skill');

const DOS2Skillbook = React.createClass({
  render() {
    const skills = this.props.skills.map(GameSkills.get);
    const abilitySkills = skills.reduce(function(abilities, skill) {
      if (!abilities[skill.Ability]) {
        abilities[skill.Ability] = [];
      }

      abilities[skill.Ability].push(skill);

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
    const skills = abilitySkills[key];

    if (skills.length === 0) {
      return null;
    }

    return (
      <div key={key}>
        <h4 className="skillbook__ability-header">
          {ability.DisplayName}
        </h4>

        <div>
          {skills.map(this.renderSkill)}
        </div>
      </div>
    );
  },

  renderSkill(skill) {
    return (
      <DOS2Skill
        key={skill.Id}
        {...skill}
        learned
        learnable={false}
      />
    );
  },
});

module.exports = DOS2Skillbook;
