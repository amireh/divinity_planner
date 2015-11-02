const React = require('react');
const classSet = require('classnames');

const Skill = React.createClass({
  render() {
    const skill = this.props;
    const { canLearn } = skill;

    const className = classSet({
      'skill-tree__skill': true,
      'skill-tree__skill--unlocked': canLearn && !skill.learned,
      'skill-tree__skill--learned': skill.learned,
      'skill-tree__skill--locked': !skill.learned && !canLearn,
    });

    return (
      <div
        className={className}
        title={skill.description || skill.descriptionText}
        onClick={this.props.onClick}
      >
        <div className="skill-tree__skill-icon">
          <div className={`skill-icon skill-icon--${skill.id}`} />
        </div>

        <span className="skill-tree__skill-name">
          <a>
            {skill.name}
          </a>
        </span>
      </div>
    );
  }
});

module.exports = Skill;
