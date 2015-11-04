const React = require('react');
const classSet = require('classnames');

const CharacterSelector = React.createClass({
  render() {
    return (
      <ul className="character-selector">
        {this.props.profiles.map(this.renderCharacterSlot)}
        <li key="children">{this.props.children}</li>
      </ul>
    );
  },

  renderCharacterSlot(character, index) {
    const className = classSet({
      'character-selector__slot': true,
      'character-selector__slot--active': index === this.props.activeProfileId,
      'character-selector__slot--inactive': index !== this.props.activeProfileId,
    })
    return (
      <li
        key={index}
        className={className}
        onClick={this.props.onSwitchProfile.bind(null, index)}
      >
        <span
          className={`
            character-selector__portrait
            character-selector__portrait--${index}
          `}
        />
      </li>
    )
  }
});

module.exports = CharacterSelector;
