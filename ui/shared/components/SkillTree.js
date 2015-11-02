const React = require('react');
const { array } = React.PropTypes;

const SkillTree = React.createClass({
  propTypes: {
    skills: array,
  },

  render() {
    const { skills } = this.props;

    const skillsByLevel = skills.reduce(function(levels, skill) {
      const level = skill.rqCharacterLevel || 1;

      if (!levels[level]) {
        levels[level] = [];
      }

      levels[level].push(skill);

      return levels;
    }, {});

    return (
      <div className="skill-tree">
        <ul className="skill-tree__listing">
          {Object.keys(skillsByLevel).map(this.renderLevel.bind(null, skillsByLevel))}
        </ul>
      </div>
    );
  },

  renderLevel(hsh, level) {
    return (
      <li key={level} className="skill-tree__level">
        <span className="skill-tree__level-indicator">
          {level}
        </span>

        {hsh[level].map(this.renderSkill)}
      </li>
    );
  },

  renderSkill(skill) {
    let canLearn = true;

    if (skill.rqAbilityLevel) {
      canLearn = canLearn && (
        this.props.abilityPoints[this.props.abilityId].points >= skill.rqAbilityLevel
      );
    }

    if (skill.rqCharacterLevel) {
      canLearn = canLearn && (
        this.props.level >= skill.rqCharacterLevel
      );
    }

    return (
      <div
        key={skill.name}
        className={`skill-tree__skill ${
          canLearn ?
            'skill-tree__skill--unlocked' :
            'skill-tree__skill--locked'
        }`}
        title={skill.descriptionText}
      >
        <div className="skill-tree__skill-icon">
          <img src={skill.image} />
        </div>

        <span className="skill-tree__skill-name">
          {skill.name}
        </span>
      </div>
    );
  }
});

module.exports = SkillTree;
