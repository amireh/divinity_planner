const React = require('react');
const GameState = require('../GameState');
const CharacterSheet = require('./CharacterSheet');
const CharacterSelector = require('./CharacterSelector');
const { Checkbox } = require('dos-components');
const { URLManager } = require('dos-common');
const Character = require('../Character');

const profiles = [
  Character(),
  Character(),
  Character(),
  Character(),
];

const App = React.createClass({
  // Deserialize the profiles from the URL if possible.
  componentWillMount: function() {
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
      </div>
    );
  },

  switchProfile(index) {
    URLManager.setQueryParam('p', index === 0 ? null : index);
  },

  updateURL() {
    URLManager.updateURL(profiles.map(p => p.toURL()));
  },

  toggleEnhancedMode() {
    GameState.setEE(!GameState.isEE());
  }
});

module.exports = App;
