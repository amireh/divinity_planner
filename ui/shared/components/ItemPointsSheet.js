const React = require('react');
const ATTRIBUTES = require('database/attributes.json');
const { shape, object, string, number, func } = React.PropTypes;

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
          <button
            className="item-points-sheet__btn"
            onClick={this.props.onDecrease.bind(null, id)}
            disabled={!entry.canDecrease}
            children="-"
          />

          <span className="item-points-sheet__points">
            {entry.points}
          </span>

          <button
            className="item-points-sheet__btn"
            onClick={this.props.onIncrease.bind(null, id)}
            disabled={!entry.canIncrease}
            children="+"
          />
        </div>
      </li>
    );
  }
});

module.exports = ItemPointsSheet;
