const React = require('react');
const GameTalents = require('../GameTalents')
const GameAbilities = require('../GameAbilities')
const { PropTypes } = React;

const DOS2ItemRequirements = React.createClass({
  propTypes: {
    constraints: PropTypes.array.isRequired,
  },

  render() {
    const { constraints } = this.props;

    return (
      <ul className="dos2-item-requirements">
        {constraints.map(con => (
          <li key={con.Id}>
            {this.renderConstraint(con)}
          </li>
        ))}
      </ul>
    );
  },

  renderConstraint(con) {
    if (con.Type === 'Talent' && con.Negated) {
      const target = GameTalents.get(con.Id)

      return (
        <span>Mutually exclusive with the talent {target.DisplayName}</span>
      )
    }
    else if (con.Type === 'Ability' && con.Parameter) {
      const target = GameAbilities.get(con.Id)

      return (
        <span>Requires {target.DisplayName} level {con.Parameter}</span>
      )
    }

    else if (con.Type === 'Ability') {
      const target = GameAbilities.get(con.Id)

      return (
        <span>Requires {target.DisplayName}</span>
      )
    }

    return JSON.stringify(con)
  }
});

module.exports = DOS2ItemRequirements;
