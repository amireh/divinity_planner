const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const classSet = require('classnames');
const K = require('../constants');
const GameAbilities = require('../GameAbilities');
const Tooltip = require('tooltip');
const { Tiers } = require('../rules.yml')

const DOS2Skill = React.createClass({
  componentDidMount() {
    this.tip = new Tooltip();
  },

  componentWillUnmount() {
    this.tip = null;
  },

  render() {
    const skill = this.props;
    const { canLearn } = skill;

    const className = classSet({
      'skill-tree__skill': true,
      'skill-tree__skill--unlocked': canLearn && !skill.learned,
      'skill-tree__skill--learned': skill.learned,
      'skill-tree__skill--locked': !skill.learned && !canLearn,
      'hint--top': true
    });

    let iconClassName = {};

    iconClassName['skill-icon-ee'] = true;
    iconClassName[`dos2-icon`] = true;
    iconClassName[`dos2-icon--${skill.Icon}`] = true;

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

          <span className="skill-tree__skill-icon-highlighter" />
        </div>

        <span className="skill-tree__skill-name">
          <a>{skill.DisplayName}</a>
        </span>
      </div>
    );
  },

  renderTooltip() {
    const skill = this.props;

    let description = (skill.Description || '').trim();
    let extraInfo;

    extraInfo = this.renderEETooltipData(skill);

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
        {skill.StatsDescriptions && skill.StatsDescriptions.length > 0 && (
          <div>
            <h3>Additional Information</h3>

            <ul>
              {skill.StatsDescriptions.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    )
  },

  getRequirementString(requirement, skill) {
    const [ tier ] = Tiers.filter(x => x.Id === skill.Tier)

    switch(requirement) {
      case K.ERR_ABILITY_LEVEL_TOO_LOW:
        const requiredLevel = tier.AbilityPointRequirement;

        const abilityName = GameAbilities.get(skill.Ability).DisplayName;

        return `You need ${requiredLevel} points in ${abilityName} to learn this skill.`;
        break;

      case K.ERR_ABILITY_CAP_REACHED:
        return "You have learned the maximum number of skills at this ability level."
        break;
    }
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

module.exports = DOS2Skill;
