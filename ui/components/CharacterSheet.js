const React = require('react');
const K = require('constants');
const CharacterSheet = React.createClass({
  render() {
    const { stats } = this.props;

    return (
      <div>
        <p>Level required: {stats.level}</p>
        <p>Attribute points: {stats.allocatedAttributePoints} / {stats.availableAttributePoints}</p>
        <p>
          Ability points:
          {' '}
          {stats.allocatedAbilityPoints} / {stats.availableAbilityPoints}
        </p>
      </div>
    );
  }
});

module.exports = CharacterSheet;
