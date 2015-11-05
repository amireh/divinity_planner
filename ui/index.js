const React = require("react");
const ReactDOM = require("react-dom");
const Root = require('./components/Root');
const URLManager = require('URLManager');

let appContainer;

if (process.env.NODE_ENV === 'development') {
  window.DEBUG = {
    abilities: require('database/abilities'),
    abilitiesEE: require('database/abilities_ee'),
  };
}

require('./index.less');

window.addEventListener('DOMContentLoaded', function() {
  appContainer = document.createElement('div');
  document.body.appendChild(appContainer);

  URLManager.addChangeListener(render);

  render();
});

function render() {
  ReactDOM.render(
    <Root queryParams={URLManager.getQueryParams()}
  />, appContainer);
}