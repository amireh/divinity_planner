const React = require('react');
const { object } = React.PropTypes;
const AttributePanel = require('./AttributePanel');

const ProfileSheet = React.createClass({
  propTypes: {
    profile: object
  },

  componentDidMount: function() {
    this.props.profile.addChangeListener(this.reload);
  },

  componentWillUnmount: function() {
    this.props.profile.removeChangeListener(this.reload);
  },

  render() {
    const { profile } = this.props;
    const profileStats = profile.toJSON();

    return (
      <div>
        <AttributePanel
          attributePoints={profileStats.attributePoints}
          onAddAttributePoint={profile.addAttributePoint}
          onRemoveAttributePoint={profile.removeAttributePoint}
        />

        <p>Level required: {profileStats.level}</p>
      </div>
    );
  },

  reload() {
    this.forceUpdate();
  }
});

module.exports = ProfileSheet;
