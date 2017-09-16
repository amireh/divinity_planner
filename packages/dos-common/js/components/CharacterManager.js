const React = require('react');
const { AppVersion, URLManager } = require('dos-common')
const { PropTypes } = React;

const CharacterManager = React.createClass({
  propTypes: {
    characters: PropTypes.arrayOf(PropTypes.object).isRequired,
    versions: PropTypes.arrayOf(PropTypes.string).isRequired,
  },

  componentWillMount() {
    const profiles = this.props.characters;

    URLManager.getParams().forEach(function(fragment, index) {
      if (profiles[index] && fragment.length > 0) {
        profiles[index].fromURL(fragment);
      }
    });
  },

  componentDidMount() {
    const profiles = this.props.characters;

    profiles.forEach(profile => profile.addChangeListener(this.updateURL));
  },

  componentWillUpdate(nextProps) {
    const profiles = this.props.characters;
    const currVersion = AppVersion.resolve(this.props.queryParams);
    const nextVersion = AppVersion.resolve(nextProps.queryParams)

    if (currVersion !== nextVersion) {
      if (this.props.versions.indexOf(nextVersion) > -1) {
        profiles.forEach(profile => profile.ensureIntegrity());

        this.updateURL();
      }
    }
  },

  componentWillUnmount() {
    const profiles = this.props.characters;
    profiles.forEach(profile => profile.removeChangeListener(this.updateURL));
  },

  render() {
    return React.Children.only(this.props.children);
  },

  updateURL() {
    URLManager.updateURL(this.props.characters.map(p => p.toURL()));
  },
});

module.exports = CharacterManager;
