const React = require('react');
const GameAbilities = require('../GameAbilities');
const GameSkills = require('../GameSkills');
const DOS2Skill = require('./DOS2Skill');
const CharacterSkillbook = require('../CharacterSkillbook');
const K = require('../constants');
const classSet = require('classnames');
const { URLManager } = require('dos-common');

require('./DOS2SkillbookStats.less');

const Counter = React.createClass({
  render() {
    const { value, maxValue = 0 } = this.props;
    const className = classSet({
      'dos2-skillbook-stats__counter': true,
      'dos2-skillbook-stats__counter--max': value === maxValue,
    });

    return (
      <span title={this.props.title} className={className}>
        {value}/{maxValue}
      </span>
    )
  }
});

const DOS2SkillbookStats = React.createClass({
  render() {
    const skills = this.props.skills.map(id => GameSkills.get(id));

    return (
      <div className="dos2-skillbook-stats">
        <h3 className="dos2-skillbook-stats__header header">
          <a
            onClick={this.openSkillbook}
            className={classSet({ 'active': this.props.active })}
          >
            Skillbook
          </a>
        </h3>

        {this.props.skills.length === 0 && (
          <p><em>Empty.</em></p>
        )}

        {this.renderCounters(skills)}
      </div>
    );
  },

  renderSkill(skill) {
    return (
      <DOS2Skill
        key={skill.Id}
        {...skill}
        learned
        learnable={false}
      />
    );
  },

  renderCounters(skills) {
    const abilities = Object.keys(this.props.abilityPoints).filter((id) => {
      return this.props.abilityPoints[id].points > 0;
    }).map(function(id) {
      return GameAbilities.get(id);
    })
    // TODO
    /*.filter(function(ability) {
      return ability.category === 'Skills';
    })*/;

    return (
      <nav className="dos2-skillbook-stats__abilities">
        {abilities.map(this.renderAbilitySkillCounts.bind(null, skills))}
      </nav>
    )
  },

  renderAbilitySkillCounts(skills, ability) {
    return (
      <div key={ability.Id} className="dos2-skillbook-stats__ability">
        <span
          className={`dos2-skillbook-stats__ability-icon dos2-icon--${ability.Icon}`}
          title={ability.DisplayName}
        />
        <span className="dos2-skillbook-stats__ability-stats">
          {this.renderAbilityCounters(skills, ability)}
        </span>
      </div>
    );
  },

  renderAbilityCounters(skills, ability) {
    const tieredSkillCount = skills
      .filter(s => s.Ability === ability.Id)
      .reduce(function(hsh, skill) {
        if (!hsh[skill.Tier]) {
          hsh[skill.Tier] = 0;
        }

        hsh[skill.Tier] += 1;

        return hsh
      }, {})
    ;

    const poolSize = CharacterSkillbook.getSkillPoolSize(
      this.props.abilityPoints[ability.Id].points
    );

    return (
      <span>
        <Counter
          title="Novice skills"
          value={tieredSkillCount[K.TIER_NOVICE] || 0}
          maxValue={poolSize[K.TIER_NOVICE]}
        />
        {' - '}
        <Counter
          title="Adept skills"
          value={tieredSkillCount[K.TIER_ADEPT] || 0}
          maxValue={poolSize[K.TIER_ADEPT]}
        />
        {' - '}
        <Counter
          title="Master skills"
          value={tieredSkillCount[K.TIER_MASTER] || 0}
          maxValue={poolSize[K.TIER_MASTER]}
        />
      </span>
    )
  },

  openSkillbook() {
    URLManager.setQueryParam('t', K.SKILLBOOK_TAB_URL_KEY);
  }
});

module.exports = DOS2SkillbookStats;
