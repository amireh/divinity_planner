const React = require('react');
const Character = require('Character');
const ProfileSheet = require('./ProfileSheet');
const CharacterSelector = require('./CharacterSelector');
const URLManager = require('URLManager');

const profiles = [
  Character(),
  Character(),
  Character(),
  Character(),
];

const Root = React.createClass({
  // Deserialize the profiles from the URL if possible.
  componentWillMount: function() {
    document.querySelector('#splash').className += ' hidden';

    setTimeout(() => {
      document.querySelector('#splash').remove();
    }, 500);

    URLManager.getParams().forEach(function(fragment, index) {
      if (profiles[index] && fragment.length > 0) {
        profiles[index].fromURL(fragment);
      }
    });
  },

  componentDidMount: function() {
    URLManager.addChangeListener(this.reload);
    profiles.forEach(profile => profile.addChangeListener(this.updateURL));
  },

  componentWillUnmount: function() {
    profiles.forEach(profile => profile.removeChangeListener(this.updateURL));
    URLManager.removeChangeListener(this.reload);
  },

  render() {
    const queryParams = URLManager.getQueryParams();
    const profile = profiles[queryParams.p || 0];

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

        <ProfileSheet
          profile={profile}
          queryParams={queryParams}
        />

        <div className="app-footer">
          <p>
            Made with <span style={{ color: 'red' }}>&hearts;</span> and <em>a lot</em> of care by {rainbow('KANDIE')}. &copy; 2015
          </p>

          <p>Source code on <a href="https://github.com/amireh/divinity_planner" target="_blank">github</a>.</p>
        </div>
      </div>
    );
  },

  switchProfile(index) {
    URLManager.setQueryParam('p', index === 0 ? null : index);
  },

  updateURL() {
    URLManager.updateURL(profiles.map(p => p.toURL()));
  },

  reload() {
    this.forceUpdate();
  },
});

function rainbow(string) {
  const COLORS = [ 'magenta', 'yellow', 'green', 'red', 'steelblue', 'orange' ];

  return string.split('').map(function(char, index) {
    return (
      <span
        key={`${char}--${index}`}
        style={{ color: COLORS[index % COLORS.length] }}
        children={char}
      />
    );
  });
}

module.exports = Root;
