const React = require('react');
const SKILLS = require('database/skills');
const ABILITIES = require('database/abilities');
const Skill = require('components/Skill');
const CharacterSkillbook = require('CharacterSkillbook');
const K = require('constants');

const Skillbook = React.createClass({
  render() {
    const skills = this.props.skills.map(id => getSkillById(id));

    return (
      <div className="skillbook">
        <h3 className="skillbook__header">Skillbook</h3>

        {this.props.skills.length === 0 && (
          <p><em>Empty.</em></p>
        )}

        {skills.map(this.renderSkill)}

        {this.renderTabs(skills)}
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

  renderTabs(skills) {
    const abilities = Object.keys(this.props.abilityPoints).filter((id) => {
      return this.props.abilityPoints[id].points > 0;
    }).map(function(id) {
      return ABILITIES.filter(a => a.id === id)[0];
    });

    return (
      <nav className="skillbook__abilities">
        {abilities.map(this.renderAbilityTab.bind(null, skills))}
      </nav>
    )
  },

  renderAbilityTab(skills, ability) {
    const skillCount = skills.filter(s => s.ability === ability.id).length;
    const poolSize = CharacterSkillbook.getSkillPoolSize(
      this.props.abilityPoints[ability.id].points
    );

    return (
      <div key={ability.id} data-hint={ability.name} className="hint--left skillbook__ability">
        <span className={`skillbook__ability-icon ability-icon--${ability.id}`} />
        <span className="skillbook__ability-stats">
          {skillCount}
          {poolSize !== K.UNLIMITED && `/ ${poolSize}`}
        </span>
      </div>
    );
  }
});

function getSkillById(id) { return SKILLS.filter(s => s.id === id)[0]; }

module.exports = Skillbook;
