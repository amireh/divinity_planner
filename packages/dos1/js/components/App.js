const React = require('react');
const GameState = require('../GameState');
const CharacterSheet = require('./CharacterSheet');
const CharacterSelector = require('./CharacterSelector');
const { CharacterManager, Checkbox } = require('dos-components');
const { AppVersion, URLManager } = require('dos-common');
const Character = require('../Character');
const { DOS1, DOS1_EE } = AppVersion;

const App = React.createClass({
  componentWillMount() {
    this.profiles = [
      Character(),
      Character(),
      Character(),
      Character(),
    ];
  },

  componentWillUnmount() {
    this.profiles = null
  },

  render() {
    const { queryParams } = this.props;
    const profile = this.profiles[queryParams.p || 0];

    return (
      <CharacterManager
        characters={this.profiles}
        versions={[ DOS1, DOS1_EE ]}
        queryParams={this.props.queryParams}
      >
        <div>
          <div style={{ position: 'relative' }}>
            <CharacterSelector
              activeProfileId={this.profiles.indexOf(profile)}
              profiles={this.profiles}
              onSwitchProfile={this.switchProfile}
            />

            <div className="root__ee-toggler">
              <Checkbox
                onChange={this.toggleEnhancedMode}
                checked={GameState.isEE()}
                label="Enhanced Edition"
              />
            </div>
          </div>

          <CharacterSheet
            profile={profile}
            queryParams={queryParams}
          />
        </div>
      </CharacterManager>
    );
  },

  switchProfile(index) {
    URLManager.setQueryParam('p', index === 0 ? null : index);
  },

  toggleEnhancedMode() {
    GameState.setEE(!GameState.isEE());
  }
});

module.exports = App;
