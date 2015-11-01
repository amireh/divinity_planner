const React = require('react');
const ATTRIBUTES = require('database/attributes.json');
const { shape, object, string, number, func } = React.PropTypes;
const {
  BASE_ATTRIBUTE_POINTS,
  MAX_ATTRIBUTE_POINTS
} = require('constants');

const AttributePanel = React.createClass({
  propTypes: {
    attributePoints: object,
    onAddAttributePoint: func,
    onRemoveAttributePoint: func
  },

  getDefaultProps: function() {
    return {
      onAddAttributePoint: Function.prototype,
      onRemoveAttributePoint: Function.prototype,
    };
  },

  render() {
    return (
      <ul className="attribute-panel">
        {ATTRIBUTES.map(this.renderAttributeControl)}
      </ul>
    );
  },

  renderAttributeControl(attr) {
    const entry = this.props.attributePoints[attr.id];
    const { points, canIncrease, canDecrease } = entry;

    return (
      <li key={attr.id} className="attribute-panel__entry">
        <span className="attribute-panel__label">
          {attr.label}
        </span>

        <div className="attribute-panel__controls">
          <button
            className="attribute-panel__btn"
            onClick={this.props.onRemoveAttributePoint.bind(null, attr.id)}
            disabled={!canDecrease}
          >
            -
          </button>

          <span className="attribute-panel__points">
            {entry.points}
          </span>

          <button
            className="attribute-panel__btn"
            onClick={this.props.onAddAttributePoint.bind(null, attr.id)}
            disabled={!canIncrease}
          >
            +
          </button>
        </div>
      </li>
    );
  }
});

module.exports = AttributePanel;
