module.exports = function listProperties({ abilities }) {
  return abilities.reduce((map, ability) => {
    ability.skills.forEach(skill => {
      Object.keys(skill).map(propName => {
        if (!map.hasOwnProperty(propName)) {
          map[propName] = 0;
        }

        map[propName] += 1;
      })
    })

    return map;
  }, {})
}