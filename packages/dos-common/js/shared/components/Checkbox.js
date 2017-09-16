const React = require('react');
const classSet = require('classnames');

const Checkbox = React.createClass({
  propTypes: {
    label: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      spanner: false
    };
  },

  render: function() {
    const className = classSet(this.props.className, {
      'checkbox': true,
      'checkbox--checked': !!this.props.checked
    });

    return(
      <label style={this.props.style} title={this.props.title} className={className}>
        <input
          tabIndex="0"
          type="checkbox"
          name={this.props.name}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />

        <span className="checkbox__indicator icon" />

        {this.props.label || this.props.children}
      </label>
    );
  }
});

module.exports = Checkbox;