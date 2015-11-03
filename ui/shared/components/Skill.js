const React = require('react');
const classSet = require('classnames');

const Skill = React.createClass({
  getDefaultProps: function() {
    return {
      learnable: true
    };
  },

  render() {
    const skill = this.props;
    const { canLearn, learnable } = skill;

    const className = classSet({
      'skill-tree__skill': true,
      'skill-tree__skill--unlocked': learnable && canLearn && !skill.learned,
      'skill-tree__skill--learned': learnable && skill.learned,
      'skill-tree__skill--locked': learnable && !skill.learned && !canLearn,
      'hint--top': true
    });

    const description = (skill.description || skill.descriptionText || '').trim();

    return (
      <div
        className={className}
        data-hint={description}
        onClick={this.props.onClick}
      >
        <div className="skill-tree__skill-icon">
          <div className={`skill-icon skill-icon--${skill.id}`} />
          {learnable && (
            <span className="skill-tree__skill-icon-highlighter" />
          )}
        </div>

        <span className="skill-tree__skill-name">
          {learnable && (<a>
            {skill.name}
          </a>)}

          {!learnable && skill.name}
        </span>
      </div>
    );
  }
});

module.exports = Skill;
