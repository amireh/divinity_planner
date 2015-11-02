const React = require('react');
const Character = require('Character');
const ProfileSheet = require('./ProfileSheet');
const profile = new Character();

const Root = React.createClass({
  render() {
    return (
      <div>
        <h1 className="app-header">
          Divinity: Original Sin Character Planner
        </h1>

        <ProfileSheet profile={profile} />
      </div>
    );
  }
});

module.exports = Root;
