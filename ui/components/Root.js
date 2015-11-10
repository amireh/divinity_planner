const React = require('react');
const GameState = require('GameState');
const CharacterSheet = require('./CharacterSheet');
const CharacterSelector = require('./CharacterSelector');
const URLManager = require('URLManager');
const Character = require('Character');
const Checkbox = require('components/Checkbox');

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
    profiles.forEach(profile => profile.addChangeListener(this.updateURL));
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextProps.queryParams.ee !== this.props.queryParams.ee) {
      profiles.forEach(profile => profile.ensureIntegrity());

      this.updateURL();
    }
  },

  componentWillUnmount: function() {
    profiles.forEach(profile => profile.removeChangeListener(this.updateURL));
  },

  render() {
    const { queryParams } = this.props;
    const profile = profiles[queryParams.p || 0];

    return (
      <div>
        <h1 className="app-header">
          Divinity: Original Sin Character Planner
        </h1>

        <div style={{ position: 'relative' }}>
          <CharacterSelector
            activeProfileId={profiles.indexOf(profile)}
            profiles={profiles}
            onSwitchProfile={this.switchProfile}
          />

          <div className="root__ee-toggler">
            <Checkbox
              onChange={this.toggleEnhancedMode}
              checked={queryParams.ee}
              label="Enhanced Edition"
            />
          </div>
        </div>

        <CharacterSheet
          profile={profile}
          queryParams={queryParams}
        />

        <div className="app-footer">
          <p>
            Made with <span style={{ color: 'red' }}>&hearts;</span> and a lot of care by {rainbow('KANDIE')}. &copy; 2015
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

  toggleEnhancedMode() {
    GameState.setEE(!GameState.isEE());
  }
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
