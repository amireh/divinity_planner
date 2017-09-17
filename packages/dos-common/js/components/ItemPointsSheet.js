const React = require('react');
const AdjustableItem = require('./AdjustableItem');
const classSet = require('classnames')
const { object, string, func } = React.PropTypes;

const ItemPointsSheet = React.createClass({
  propTypes: {
    activeItemId: string,
    items: object,
    onIncrease: func,
    onDecrease: func,
    onClick: func,
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
    const linkable = typeof this.props.onClick === 'function';
    const { onClick = Function.prototype } = this.props;

    return (
      <li key={id} className="item-points-sheet__entry">
        <span className="item-points-sheet__label" onClick={onClick.bind(null, id)}>
          {linkable ? (
            <a className={classSet({ active: this.props.activeItemId === id })}>
              {entry.name}
            </a>
          ) : (
            entry.name
          )}
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
