const React = require('react');
const GameAbilities = require('GameAbilities');
const GameSkills = require('GameSkills');
const GameState = require('GameState');
const Skill = require('components/Skill');
const CharacterSkillbook = require('CharacterSkillbook');
const K = require('constants');
const classSet = require('classnames');
const URLManager = require('URLManager');

const Counter = React.createClass({
  render() {
    const { value, maxValue } = this.props;
    const className = classSet({
      'skillbook-stats__counter': true,
      'skillbook-stats__counter--max': value === maxValue,
    });

    return (
      <span title={this.props.title} className={className}>
        {value}/{maxValue}
      </span>
    )
  }
});

const SkillbookStats = React.createClass({
  render() {
    const skills = this.props.skills.map(id => GameSkills.get(id));

    return (
      <div className="skillbook-stats">
        <h3 className="skillbook-stats__header header">
          <a onClick={this.openSkillbook}>
            Skillbook
          </a>
        </h3>

        {this.props.skills.length === 0 && (
          <p><em>Empty.</em></p>
        )}

        {false && skills.map(this.renderSkill)}

        {this.renderCounters(skills)}
      </div>
    );
  },

  renderSkill(skill) {
    return (
      <Skill
        key={skill.id}
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
    });

    return (
      <nav className="skillbook-stats__abilities">
        {abilities.map(this.renderAbilitySkillCounts.bind(null, skills))}
      </nav>
    )
  },

  renderAbilitySkillCounts(skills, ability) {
    return (
      <div key={ability.id} className="skillbook-stats__ability">
        <span className={`skillbook-stats__ability-icon ability-icon--${ability.id}`} />
        <span className="skillbook-stats__ability-stats">
          {GameState.isEE() ?
            this.renderEECounts(skills, ability) :
            this.renderStandardCounts(skills, ability)
          }
        </span>
      </div>
    );
  },

  renderEECounts(skills, ability) {
    const tieredSkillCount = skills
      .filter(s => s.ability === ability.id)
      .reduce(function(hsh, skill) {
        if (!hsh[skill.tier]) {
          hsh[skill.tier] = 0;
        }

        hsh[skill.tier] += 1;

        return hsh
      }, {})
    ;

    const poolSize = CharacterSkillbook.getSkillPoolSizeEE(
      this.props.abilityPoints[ability.id].points
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

  renderStandardCounts(skills, ability) {
    const skillCount = skills.filter(s => s.ability === ability.id).length;
    const poolSize = CharacterSkillbook.getSkillPoolSize(
      this.props.abilityPoints[ability.id].points
    );

    return (
      <span>
        {skillCount}
        {poolSize !== K.UNLIMITED && `/${poolSize}`}
      </span>
    );
  },

  openSkillbook() {
    URLManager.setQueryParam('t', K.SKILLBOOK_TAB_URL_KEY);
  }
});

module.exports = SkillbookStats;
