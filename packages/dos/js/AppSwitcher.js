const React = require('react');
const { AppVersion, URLManager } = require('dos-common')
const { DOS1, DOS1_EE, DOS2 } = AppVersion

const AppSwitcher = React.createClass({
  render() {
    return (
      <div>
        <p>
          <a onClick={this.switchVersion(DOS2)}>
            D:OS 2
          </a>
        </p>

        <p>
          <a onClick={this.switchVersion(DOS1_EE)}>
            D:OS 1 - Enhanced Edition
          </a>
        </p>

        <p>
          <a onClick={this.switchVersion(DOS1)}>
            D:OS 1
          </a>
        </p>
      </div>
    );
  },

  switchVersion(version) {
    return function() {
      URLManager.setQueryParam('version', version)
    }
  }
});

module.exports = AppSwitcher;
