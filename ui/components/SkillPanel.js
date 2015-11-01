const React = require('react');
const ABILITIES = require('database/abilities.json');
const ItemPointsSheet = require('components/ItemPointsSheet');

const SkillPanel = React.createClass({
  render() {
    return (
      <div className="skill-panel">

        <ItemPointsSheet
          items={this.props.abilityPoints}
          onIncrease={this.props.onAbilityPointIncrease}
          onDecrease={this.props.onAbilityPointDecrease}
        />
      </div>
    );
  }
});

module.exports = SkillPanel;
