const React = require("react");
const ReactDOM = require("react-dom");
const Root = require('./components/Root');

if (process.env.NODE_ENV === 'development') {
  window.DEBUG = {
    abilities: require('database/abilities'),
    abilitiesEE: require('database/abilities_ee'),
  };
}

require('./index.less');

window.addEventListener('DOMContentLoaded', function() {
  const container = document.createElement('div');

  document.body.appendChild(container);

  ReactDOM.render(<Root />, container);
});