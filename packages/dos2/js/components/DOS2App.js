const React = require('react');
const { CharacterManager, CharacterSelector } = require('dos-components')
const Character = require('../Character')
const { DOS2 } = require('dos-common').AppVersion
const DOS2CharacterSheet = require('./DOS2CharacterSheet')

const DOS2App = React.createClass({
  componentWillMount() {
    this.characters = [
      Character(),
      Character(),
      Character(),
      Character(),
    ]
  },

  componentWillUnmount() {
    this.characters = null
  },

  render() {
    const { queryParams } = this.props
    const character = this.characters[queryParams.p || 0];

    return (
      <CharacterManager
        characters={this.characters}
        versions={[ DOS2 ]}
        queryParams={queryParams}
      >
        <div>
          <CharacterSelector
            activeProfileId={this.characters.indexOf(character)}
            profiles={this.characters}
            onSwitchProfile={this.switchProfile}
          />

          <DOS2CharacterSheet
            character={character}
            queryParams={queryParams}
          />
        </div>
      </CharacterManager>
    );
  },

  switchProfile() {

  }
});

module.exports = DOS2App;
