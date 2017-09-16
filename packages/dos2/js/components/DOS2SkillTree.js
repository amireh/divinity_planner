const React = require('react');
const DOS2Skill = require('./DOS2Skill');
const { Tiers } = require('../rules.yml');
const classSet = require('classnames');
const UNKNOWN_TIER = {
  Id: 'Unknown',
  DisplayName: 'Unknown ???'
}
const { array, func } = React.PropTypes;
const { sortBy } = require('lodash')

const Order = Tiers.map(x => x.Id).concat(UNKNOWN_TIER.Id)

const DOS2SkillTree = React.createClass({
  propTypes: {
    skills: array,
    onSkillSelect: func,
  },

  getDefaultProps: function() {
    return {
      onSkillSelect: Function.prototype,
    };
  },

  render() {
    const { skills } = this.props;

    const skillsByTier = skills.reduce(function(map, skill) {
      const tier = skill.Tier || UNKNOWN_TIER.Id;

      map[tier].push(skill);

      return map;
    }, Tiers.reduce(function(map, tier) {
      map[tier.Id] = []
      return map;
    }, { Unknown: [] }));

    return (
      <div className="skill-tree">
        <h3 className="header--framed">
          {this.props.activeAbilityName || 'Skill Tree'}
        </h3>

        <ul className="skill-tree__listing">
          {skills.length === 0 && (
            <li className="skill-tree__level skill-tree__empty-message">
              <p>
                <em>Choose an ability from the panel to the left to explore its skills.</em>
              </p>
            </li>
          )}

          {Object
            .keys(skillsByTier)
            .sort(function(a, b) {
              return Order.indexOf(a) > Order.indexOf(b);
            })
            .map(this.renderLevel.bind(null, skillsByTier))}
        </ul>
      </div>
    );
  },

  renderLevel(map, tier) {
    const title = 'The skill tier.';

    const className = classSet({
      'skill-tree__level': true,
      'skill-tree__level--ee': true
    });

    return (
      <li key={tier} className={className}>
        <h4 className="skill-tree__level-indicator skill-tree__level-indicator--tier">
          {(Tiers.find(x => x.Id === tier) || UNKNOWN_TIER).DisplayName}
        </h4>

        {map[tier].map(this.renderSkill)}
      </li>
    );
  },

  renderSkill(skill) {
    return (
      <DOS2Skill
        key={skill.Id}
        {...skill}
        onClick={this.props.onSkillSelect.bind(null, skill.Id)}
      />
    );
  },
});

module.exports = DOS2SkillTree;