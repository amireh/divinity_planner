const yaml = require('node-yaml')
const lodash = require('lodash')

const dump = data => process.stdout.write(yaml.dump(data))

module.exports = function query(skillData, property, params) {
  const pluck = params.root ?
    x => x[property] :
    x => x.properties[property]
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

    dump(counted)
  }
  else if (params.uniq) {
    dump(lodash.uniq(props))
  }
  else {
    dump(props)
  }
}