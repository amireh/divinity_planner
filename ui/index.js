const React = require("react");
const ReactDOM = require("react-dom");
const Root = require('./components/Root');

require('./index.less');

window.addEventListener('DOMContentLoaded', function() {
  const container = document.createElement('div');

  document.body.appendChild(container);

  ReactDOM.render(<Root />, container);
});

if (process.env.GA_TRACKER_ID) {
  (function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', process.env.GA_TRACKER_ID, 'auto');
    ga('send', 'pageview');
  }());
}