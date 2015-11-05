const React = require('react');
const { array, func } = React.PropTypes;
const Skill = require('components/Skill');
const GameState = require('GameState');
const { TIER_NAMES } = require('constants');

const SkillTree = React.createClass({
  statics: {
    getGroupingScope() {
      return GameState.isEE() ? 'tier' : 'rqCharacterLevel';
    }
  },

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
    const groupBy = SkillTree.getGroupingScope();

    const skillsByLevel = skills.reduce(function(levels, skill) {
      const level = skill[groupBy] || 1;

      if (!levels[level]) {
        levels[level] = [];
      }

      levels[level].push(skill);

      return levels;
    }, {});

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

          {Object.keys(skillsByLevel).map(this.renderLevel.bind(null, skillsByLevel))}
        </ul>
      </div>
    );
  },

  renderLevel(hsh, level) {
    const title = SkillTree.getGroupingScope() === 'rqCharacterLevel' ?
      'The character level required to use these skills.' :
      'The tier of the skills.'
    ;

    return (
      <li key={level} className="skill-tree__level">
        {!GameState.isEE() && (
          <span className="skill-tree__level-indicator" title={title}>
            {level}
          </span>
        )}

        {GameState.isEE() && (
          <h4 className="skill-tree__level-indicator skill-tree__level-indicator--tier">
            {TIER_NAMES[level]}
          </h4>
        )}

        {hsh[level].map(this.renderSkill)}
      </li>
    );
  },

  renderSkill(skill) {
    return (
      <Skill
        key={skill.id}
        {...skill}
        onClick={this.props.onSkillSelect.bind(null, skill.id)}
      />
    );
  },
});

module.exports = SkillTree;
