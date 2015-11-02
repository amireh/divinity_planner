const React = require('react');
const SKILLS = require('database/skills');
const Skill = require('components/Skill');

const Skillbook = React.createClass({
  render() {
    return (
      <div className="skillbook">
        <h3>Skillbook</h3>

        {this.props.skills.map(this.renderSkill)}
      </div>
    );
  },

  renderSkill(id) {
    const skill = SKILLS.filter(s => s.id === id)[0];

    return (
      <Skill
        key={id}
        {...skill}
        learned
      />
    );
  }
});

module.exports = Skillbook;
