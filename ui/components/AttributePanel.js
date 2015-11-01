const React = require('react');
const ATTRIBUTES = require('database/attributes.json');
const ItemPointsSheet = require('components/ItemPointsSheet');
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
      <ItemPointsSheet
        items={this.props.attributePoints}
        onIncrease={this.props.onAddAttributePoint}
        onDecrease={this.props.onRemoveAttributePoint}
      />
    );
  },
});

module.exports = AttributePanel;
