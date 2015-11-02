const React = require('react');
const AdjustableItem = React.createClass({
  render() {
    return (
      <div className="adjustable-item">
        <button
          className="adjustable-item__btn"
          onClick={this.props.onDecrease}
          disabled={!this.props.canDecrease}
          children="-"
        />

        <span className="adjustable-item__points">
          {this.props.children}
        </span>

        <button
          className="adjustable-item__btn"
          onClick={this.props.onIncrease}
          disabled={!this.props.canIncrease}
          children="+"
        />

        {' '}

        {this.props.withMaxControl && (
          <button
            className="adjustable-item__btn"
            onClick={this.props.onMax}
            disabled={!this.props.canIncrease}
            children="&gt;"
          />
        )}
      </div>
    );
  }
});

module.exports = AdjustableItem;
