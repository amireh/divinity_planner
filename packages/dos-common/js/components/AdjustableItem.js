const React = require('react');
const AdjustableItem = React.createClass({
  render() {
    return (
      <div className="adjustable-item">
        <button
          className="btn adjustable-item__btn btn--minus"
          onClick={this.emitDecrease}
          disabled={!this.props.canDecrease}
          children="-"
        />

        <span className="adjustable-item__points">
          {this.props.children}
        </span>

        <button
          className="btn adjustable-item__btn btn--plus"
          onClick={this.emitIncrease}
          disabled={!this.props.canIncrease}
          children="+"
        />

        {' '}

        {this.props.withMaxControl && (
          <button
            className="btn adjustable-item__btn"
            onClick={this.props.onMax}
            disabled={!this.props.canIncrease}
            children="&gt;"
          />
        )}
      </div>
    );
  },

  emitIncrease(e) {
    if (this.props.bulk) {
      this.props.onIncrease(getCount(e))
    }
    else {
      this.props.onIncrease()
    }
  },

  emitDecrease(e) {
    if (this.props.bulk) {
      this.props.onDecrease(getCount(e))
    }
    else {
      this.props.onDecrease()
    }
  }
});

function getCount(e) {
  if (e.altKey) {
    return 100
  }
  else if (e.ctrlKey || e.shiftKey || e.modKey) {
    return 10
  }
  else {
    return 1
  }
}

module.exports = AdjustableItem;
