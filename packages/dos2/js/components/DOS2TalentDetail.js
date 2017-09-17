const React = require('react');
const GameTalents = require('../GameTalents')

require('./DOS2TalentDetail.less')

const DOS2TalentDetail = React.createClass({
  render() {
    const talent = GameTalents.get(this.props.activeTalentId)

    if (!talent) {
      return null
    }

    return (
      <div className="dos2-talent-detail">
        <h3>
          <div
            className={`dos2-icon--talent dos2-icon--${talent.Icon}`}
          />
          {talent.DisplayName}
        </h3>
        <p>
          {talent.Description || <em>Talent description is unavailable.</em>}
        </p>
      </div>
    );
  }
});

module.exports = DOS2TalentDetail;
