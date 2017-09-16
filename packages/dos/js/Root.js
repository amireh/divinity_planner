const React = require('react');

const Root = React.createClass({
  componentWillMount() {
    const splashNode = document.querySelector('#splash');

    splashNode.classList.add('hidden');

    setTimeout(() => {
      splashNode.remove();
    }, 1000);
  },

  render() {
    return (
      <div>
        <h1 className="app-header">
          Divinity: Original Sin Character Planner
        </h1>

        {React.cloneElement(
          React.Children.only(this.props.children), this.props
        )}

        <div className="app-footer">
          <p>
            Made with <span style={{ color: 'red' }}>&hearts;</span> and a lot of care by {rainbow('KANDIE')}. &copy; 2017
          </p>

          <p>Source code on <a href="https://github.com/amireh/divinity_planner" target="_blank">github</a>.</p>
        </div>
      </div>
    );
  },
});

function rainbow(string) {
  const COLORS = [ 'magenta', 'yellow', 'green', 'red', 'steelblue', 'orange' ];

  return string.split('').map(function(char, index) {
    return (
      <span
        key={`${char}--${index}`}
        style={{ color: COLORS[index % COLORS.length] }}
        children={char}
      />
    );
  });
}

module.exports = Root;
