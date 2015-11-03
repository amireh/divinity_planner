const React = require('react');
const ATTRIBUTES = require('database/attributes.json');
const { shape, object, string, number, func } = React.PropTypes;
const AdjustableItem = require('components/AdjustableItem');

const ItemPointsSheet = React.createClass({
  propTypes: {
    items: object,
    onIncrease: func,
    onDecrease: func
  },

  getDefaultProps: function() {
    return {
      onIncrease: Function.prototype,
      onDecrease: Function.prototype,
    };
  },

  render() {
    return (
      <ul className="item-points-sheet">
        {Object.keys(this.props.items).map(this.renderItem)}
      </ul>
    );
  },

  renderItem(id) {
    const entry = this.props.items[id];
    const { points, canIncrease, canDecrease } = entry;

    return (
      <li key={id} className="item-points-sheet__entry">
        <span className="item-points-sheet__label">
          {entry.name}
        </span>

        <div className="item-points-sheet__controls">
          <AdjustableItem
            canIncrease={entry.canIncrease}
            canDecrease={entry.canDecrease}
            onIncrease={this.props.onIncrease.bind(null, id)}
            onDecrease={this.props.onDecrease.bind(null, id)}
          >
            {entry.points}
          </AdjustableItem>
        </div>
      </li>
    );
  }
});

module.exports = ItemPointsSheet;
