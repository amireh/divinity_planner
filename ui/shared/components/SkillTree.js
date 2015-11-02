const React = require('react');
const { array, func } = React.PropTypes;
const classSet = require('classnames');
const Skill = require('components/Skill');

const SkillTree = React.createClass({
  propTypes: {
    skills: array,
    onSkillSelect: func,
  },

  getInitialState: function() {
    return {
      groupBy: 'charLevel'
    };
  },

  getDefaultProps: function() {
    return {
      onSkillSelect: Function.prototype,
    };
  },

  render() {
    const { skills } = this.props;
    const { groupBy } = this.state;

    const skillsByLevel = skills.reduce(function(levels, skill) {
      const level = groupBy === 'charLevel' ?
        (skill.rqCharacterLevel || 1) :
        (skill.skillLevel || 1)
      ;

      if (!levels[level]) {
        levels[level] = [];
      }

      levels[level].push(skill);

      return levels;
    }, {});

    return (
      <div className="skill-tree">
        {this.renderControls()}

        <ul className="skill-tree__listing">
          {Object.keys(skillsByLevel).map(this.renderLevel.bind(null, skillsByLevel))}
        </ul>
      </div>
    );
  },

  renderLevel(hsh, level) {
    const title = this.state.groupBy === 'charLevel' ?
      'The character level required to use these skills.' :
      'The skill level.'
    ;

    return (
      <li key={level} className="skill-tree__level">
        <span className="skill-tree__level-indicator" title={title}>
          {level}
        </span>

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

  renderControls() {
    return (
      <div className="skill-tree__controls">
        <label>
          <input
            type="radio"
            checked={this.state.groupBy === 'charLevel'}
            value="charLevel"
            onChange={this.changeGrouping}
          /> Group by Required Character Level
        </label>

        <label>
          <input
            type="radio"
            checked={this.state.groupBy === 'skillLevel'}
            value="skillLevel"
            onChange={this.changeGrouping}
          /> Group by Skill Level
        </label>

      </div>
    )
  },

  changeGrouping(e) {
    this.setState({ groupBy: e.target.value });
  }
});

module.exports = SkillTree;
