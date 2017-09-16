const React = require('react');
const { ItemPointsSheet } = require('dos-components');
const { object, func } = React.PropTypes;

const DOS2AttributePanel = React.createClass({
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

module.exports = DOS2AttributePanel;
