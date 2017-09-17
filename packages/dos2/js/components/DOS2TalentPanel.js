const React = require('react');
const { ItemPointsSheet } = require('dos-components');
const { URLManager } = require('dos-common')
const { object, func } = React.PropTypes;

const DOS2TalentPanel = React.createClass({
  propTypes: {
    talentPoints: object,
    onAddTalentPoint: func,
    onRemoveTalentPoint: func
  },

  getDefaultProps() {
    return {
      onAddTalentPoint: Function.prototype,
      onRemoveTalentPoint: Function.prototype,
    };
  },

  componentWillUnmount() {
    URLManager.setQueryParam('talent', null)
  },

  render() {
    return (
      <ItemPointsSheet
        items={this.props.talentPoints}
        onIncrease={this.props.onAddTalentPoint}
        onDecrease={this.props.onRemoveTalentPoint}
        activeItemId={this.props.queryParams.talent}
        onClick={this.inspectTalent}
      />
    );
  },

  inspectTalent(talentId) {
    URLManager.setQueryParam('talent', talentId)
  }
});

module.exports = DOS2TalentPanel;
