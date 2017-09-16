const React = require('react');
const ReactDOM = require('react-dom');
const Root = require('./Root');
const AppSwitcher = require('./AppSwitcher')
const { AppVersion, URLManager } = require('dos-common');
const { DOS2 } = AppVersion

let appContainer;

window.addEventListener('DOMContentLoaded', function() {
  appContainer = document.createElement('div');
  document.body.appendChild(appContainer);

  URLManager.addChangeListener(renderCurrentApp);

  renderCurrentApp();
});

function renderCurrentApp() {
  const app = AppVersion.resolve()

  if (!app) {
    render(AppSwitcher)
  }
  else if (app === DOS2) {
    require.ensure([ 'dos2' ], function() {
      const DOS2App = require('dos2')

      render(DOS2App.App);
    })
  }
  else {
    require.ensure([ 'dos1' ], function() {
      const DOS1App = require('dos1')

      render(DOS1App.App);
    })
  }
}

function render(App) {
  ReactDOM.render(
    <Root queryParams={URLManager.getQueryParams()}>
      <App />
    </Root>
  , appContainer);
}
