const React = require('react');
const ReactDOM = require('react-dom');
const Root = require('./Root');
const { URLManager } = require('dos-common');

let appContainer;

window.addEventListener('DOMContentLoaded', function() {
  appContainer = document.createElement('div');
  document.body.appendChild(appContainer);

  URLManager.addChangeListener(renderCurrentApp);

  renderCurrentApp();
});

function renderCurrentApp() {
  if (location.hash.indexOf('DOS2') > -1) {
    require.ensure([ 'dos2' ], function() {
      const DOS2 = require('dos2')

      render(DOS2);
    })
  }
  else {
    require.ensure([ 'dos1' ], function() {
      const DOS1 = require('dos1')

      render(DOS1);
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
