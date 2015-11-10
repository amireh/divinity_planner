const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const classSet = require('classnames');
const K = require('constants');
const GameState = require('GameState');
const GameAbilities = require('GameAbilities');
const Tooltip = require('shims/tooltip');

const Skill = React.createClass({
  getDefaultProps: function() {
    return {
      learnable: true
    };
  },

  componentDidMount: function() {
    this.tip = new Tooltip();
  },

  componentWillUnmount: function() {
    this.tip = null;
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

    return (
      <div
        className={className}
        onMouseOver={this.showTooltip}
        onMouseLeave={this.hideTooltip}
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

  getRequirementString(requirement, skill) {
    switch(requirement) {
      case K.ERR_ABILITY_LEVEL_TOO_LOW:
        const requiredLevel = GameState.isEE() ? (
          K.TIER_AP_REQUIREMENTS[skill.tier]
        ) : (
          skill.rqAbilityLevel
        );

        const abilityName = GameAbilities.get(skill.ability).name;

        return `You need ${requiredLevel} points in ${abilityName} to learn this skill.`;
        break;

      case K.ERR_ABILITY_CAP_REACHED:
        return "You have learned the maximum number of skills at this ability level."
        break;

      case K.ERR_CHAR_LEVEL_TOO_LOW:
        return `Your character needs to be level ${skill.level || skill.rqCharacterLevel} to learn this skill.`
        break;
    }
  },

  renderTooltip() {
    const skill = this.props;

    let description = (skill.description || skill.descriptionText || '').trim();
    let extraInfo;

    if (GameState.isEE()) {
      extraInfo = this.renderEETooltipData(skill);
    }

    return ReactDOMServer.renderToStaticMarkup(
      <div>
        {description}

        {extraInfo}

        {skill.requirement && (
          <p className="skill__tooltip-requirement">
            {this.getRequirementString(skill.requirement, skill)}
          </p>
        )}
      </div>
    );
  },

  renderEETooltipData(skill) {
    return (
      <div className="type-small">
        {skill.statDescriptions && skill.statDescriptions.length > 0 && (
          <div>
            <h3>Additional Information</h3>

            <ul>
              {skill.statDescriptions.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    )
  },

  showTooltip() {
    if (this.tip.hidden) {
      this.tip.content(this.renderTooltip());
      this.tip.show(ReactDOM.findDOMNode(this));
      this.tip.position();
    }
  },

  hideTooltip() {
    this.tip.hide();
  }
});

module.exports = Skill;
