const React = require('react');
const { AdjustableItem } = require('dos-components');
const GameAbilities = require('../GameAbilities');
const classSet = require('classnames');

const ORDER = [
  'Weapons',
  'Defence',
  'Skills',
  'Personality',
  'Craftsmanship',
  'Nasty Deeds'
];

const AbilityPanel = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  render() {
    const { abilityPoints } = this.props;
    const abilitiesByCategory = Object.keys(abilityPoints).reduce(function(set, abilityId) {
      const ability = GameAbilities.get(abilityId);
      const category = ability.category || 'Skills';

      let categoryEntry = set.filter(e => e.name === category)[0];

      if (!categoryEntry) {
        categoryEntry = { name: category, abilities: [] };

        set.push(categoryEntry);
      }

      categoryEntry.abilities.push(abilityPoints[abilityId]);

      return set;
    }, []).sort(function(a,b) {
      return ORDER.indexOf(a.name) > ORDER.indexOf(b.name);
    });

    return (
      <div className="ability-panel">
        {abilitiesByCategory.map(this.renderCategory)}
      </div>
    )
  },

  renderCategory(category) {
    const collapsed = this.state[`${category.name}Collapsed`];

    return (
      <div key={category.name}>
        <h4 className="ability-panel__category">
          {category.name}

          <button
            className={classSet({
              "ability-panel__category-collapser": true,
              'ability-panel__category-collapser--collapsed': collapsed,
              'ability-panel__category-collapser--expanded': !collapsed,
            })}
            onClick={this.toggleCategory.bind(null, category.name)}
          />
        </h4>

        {!collapsed && (
          <ul className="item-points-sheet">
            {category.abilities.map(this.renderAbility.bind(null, category.name === 'Skills'))}
          </ul>
        )}
      </div>
    );
  },

  renderAbility(isLinkable, entry) {
    const { id } = entry;

    if (id === 'special') {
      return null;
    }

    let Link;

    if (isLinkable) {
      Link = (
        <a
          onClick={this.props.onSelect.bind(null, id)}
          className={`
            item-points-sheet__label
            ${this.props.activeAbilityId === id ? 'active ability-panel__selected-ability-link' : ''}
          `}
        >
          {entry.name}
        </a>
      );
    }
    else {
      Link = (
        <span className="item-points-sheet__label">{entry.name}</span>
      );
    }

    return (
      <li key={id} className="item-points-sheet__entry">
        {Link}

        <div className="item-points-sheet__controls">
          {entry.name !== 'Special' && (
            <AdjustableItem
              canIncrease={entry.canIncrease}
              canDecrease={entry.canDecrease}
              onIncrease={this.props.onIncrease.bind(null, id)}
              onDecrease={this.props.onDecrease.bind(null, id)}
            >
              {entry.points}
            </AdjustableItem>
          )}
        </div>
      </li>
    );
  },

  toggleCategory(name) {
    const newState = {};
    const key = `${name}Collapsed`;
    newState[key] = !this.state[key];
    this.setState(newState);
  }
});

module.exports = AbilityPanel;
