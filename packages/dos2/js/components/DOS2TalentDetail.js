const React = require('react');
const GameTalents = require('../GameTalents')
const DOS2ItemRequirements = require('./DOS2ItemRequirements')
const GameRequirements = require('../GameRequirements')

require('./DOS2TalentDetail.less')

const DOS2TalentDetail = React.createClass({
  render() {
    const talent = GameTalents.get(this.props.activeTalentId)

    if (!talent) {
      return null
    }

    const constraints = GameRequirements.getConstraintsFor(talent.Id)

    return (
      <div className="dos2-talent-detail">
        <h3>
          <div
            className={`dos2-icon--talent dos2-icon--${talent.Icon}`}
          />
          {talent.DisplayName}
        </h3>

        {talent.Description && (
          <p className="type-secondary">
            <em>The description below may be inaccurate and is provided only for convenience.</em>
          </p>
        )}

        <p>
          {talent.Description || <em>Talent description is unavailable.</em>}
        </p>

        {constraints.length > 0 && (
          <div>
            <header className="dos2-talent-detail__constraints-header">
              Conditions
            </header>

            <DOS2ItemRequirements constraints={constraints} />
          </div>
        )}
      </div>
    );
  },

});

module.exports = DOS2TalentDetail;
