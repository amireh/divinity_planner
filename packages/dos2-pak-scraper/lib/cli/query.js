const lodash = require('lodash')

module.exports = function query(skillData, property, params) {
  const pluck = params.root ?
    x => x[property] :
    x => x.Properties[property]
  ;

  const props = skillData.map(pluck).filter(value => {
    if (params.present) {
      return !!value;
    }
    else {
      return true;
    }
  })

  if (params.count) {
    const counted = props.reduce(function(map, value) {
      if (!map[value]) {
        map[value] = 0;
      }

      map[value] += 1

      return map
    }, {})

    return counted
  }
  else if (params.uniq) {
    return lodash.uniq(props)
  }
  else {
    return props
  }
}