const React = require("react");
const ReactDOM = require("react-dom");
const Root = require('./components/Root');

require('./index.less');

window.addEventListener('DOMContentLoaded', function() {
  const container = document.createElement('div');

  document.body.appendChild(container);

  ReactDOM.render(<Root />, container);
});