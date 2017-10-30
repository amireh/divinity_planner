const React = require('react');
const { ItemPointsSheet } = require('dos-components');
const { object, func } = React.PropTypes;

const DOS2AttributePanel = React.createClass({
  propTypes: {
    attributePoints: object,
    onAddAttributePoints: func,
    onRemoveAttributePoints: func
  },

  getDefaultProps: function() {
    return {
      onAddAttributePoints: Function.prototype,
      onRemoveAttributePoints: Function.prototype,
    };
  },

  render() {
    return (
      <ItemPointsSheet
        items={this.props.attributePoints}
        onIncrease={this.props.onAddAttributePoints}
        onDecrease={this.props.onRemoveAttributePoints}
        bulk
      />
    );
  },
});

module.exports = DOS2AttributePanel;
