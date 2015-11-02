const React = require('react');
const AdjustableItem = require('components/AdjustableItem');

const AbilityPanel = React.createClass({
  render() {
    return (
      <div className="ability-panel">
        <ul className="item-points-sheet">
          {Object.keys(this.props.abilityPoints).map(this.renderAbility)}
        </ul>
      </div>
    );
  },

  renderAbility(id) {
    const entry = this.props.abilityPoints[id];
    const { points, canIncrease, canDecrease } = entry;

    return (
      <li key={id} className="item-points-sheet__entry">
        <a
          onClick={this.props.onSelect.bind(null, id)}
          className={`
            item-points-sheet__label
            ${this.props.selectedAbilityId === id ? 'ability-panel__selected-ability-link' : ''}
          `}
        >
          {entry.name}
        </a>

        <div className="item-points-sheet__controls">
          {entry.name !== 'Special' && (
            <AdjustableItem
              canIncrease={entry.canIncrease}
              canDecrease={entry.canDecrease}
              onIncrease={this.props.onIncrease.bind(null, id)}
              onDecrease={this.props.onDecrease.bind(null, id)}
            >
              {entry.points}
            </AdjustableItem>
          )}
        </div>
      </li>
    );
  }
});

module.exports = AbilityPanel;
