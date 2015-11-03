const React = require('react');
const Character = require('Character');
const ProfileSheet = require('./ProfileSheet');
const CharacterSelector = require('./CharacterSelector');

const profiles = [
  Character({ portrait: 'portrait-1.png' }),
  Character({ portrait: 'portrait-2.png' })
];

let profile = profiles[0];

const Root = React.createClass({
  componentDidMount: function() {
    const { hash } = window.location;

    profiles.forEach(profile => profile.addChangeListener(this.reload));

    if (hash.length > 1) {
      hash.slice(1).split(/\-/).forEach(function(fragment, index) {
        if (profiles[index] && fragment.length > 0) {
          profiles[index].fromURL(fragment);
        }
      });

      this.reload();
    }
  },

  componentWillUnmount: function() {
    profiles.forEach(profile => profile.removeChangeListener(this.reload));
  },

  render() {
    return (
      <div>
        <h1 className="app-header">
          Divinity: Original Sin Character Planner
        </h1>

        <CharacterSelector
          activeProfileId={profiles.indexOf(profile)}
          profiles={profiles}
          onSwitchProfile={this.switchProfile}
        />

        <ProfileSheet profile={profile} />
      </div>
    );
  },

  switchProfile(index) {
    profile = profiles[index];

    this.forceUpdate();
  },

  reload() {
    window.location.hash = '#' + profiles.map(p => p.toURL()).join('-');

    this.forceUpdate();
  }
});

module.exports = Root;
