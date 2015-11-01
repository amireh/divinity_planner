const React = require('react');
const Profile = require('Profile');
const ProfileSheet = require('./ProfileSheet');
const profile = new Profile();

const Root = React.createClass({
  render() {
    return (
      <div>
        <h1>Divinity: Original Sin Talent Calculator</h1>

        <ProfileSheet profile={profile} />
      </div>
    );
  }
});

module.exports = Root;
