const React = require('react');
const { CharacterSelector } = require('dos-components')
const Character = require('../Character')

const App = React.createClass({
  componentWillMount: function() {
    this.profiles = [
      Character(),
      Character(),
      Character(),
      Character(),
    ]
  },

  componentWillUnmount() {
    this.profiles = null
  },

  render() {
    return (
      <div>
        <CharacterSelector
          activeProfileId={this.profiles[0]}
          profiles={this.profiles}
          onSwitchProfile={this.switchProfile}
        />
      </div>
    );
  },

  switchProfile() {

  }
});

module.exports = App;
