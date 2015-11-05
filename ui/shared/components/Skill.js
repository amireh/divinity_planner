const React = require('react');
const classSet = require('classnames');
const K = require('constants');
const GameState = require('GameState');

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
      'skill-tree__skill--locked': !skill.learned && !canLearn,
      'hint--top': true
    });

    let iconClassName = {};

    if (GameState.isEE()) {
      iconClassName['skill-icon-ee'] = true;
      iconClassName['skill-icon-ee--' + skill.id] = true;
    }
    else {
      iconClassName['skill-icon'] = true;
      iconClassName['skill-icon--' + skill.id] = true;
    }

    iconClassName = classSet(iconClassName);

    let description = (skill.description || skill.descriptionText || '').trim();

    if (skill.requirement && skill.requirement !== true) {
      description += '\n\n' + this.getRequirementString(skill.requirement);
    }

    return (
      <div
        className={className}
        data-hint={description}
        onClick={this.props.onClick}
      >
        <div className="skill-tree__skill-icon">
          <div className={iconClassName} />

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
  },

  getRequirementString(requirement) {
    switch(requirement) {
      case K.ERR_ABILITY_LEVEL_TOO_LOW:
        return "You need to invest more ability points to learn this skill."
        break;

      case K.ERR_ABILITY_CAP_REACHED:
        return "You have reached the maximum number of skills for this ability at that ability level."
        break;

      case K.ERR_CHAR_LEVEL_TOO_LOW:
        return "Your character needs a higher level to learn this skill."
        break;
    }
  }
});

module.exports = Skill;
