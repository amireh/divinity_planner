require('../css/index.less');

if (process.env.NODE_ENV === 'development') {
  window.DEBUG = {
    abilities: require('./database/abilities'),
    abilitiesEE: require('./database/abilities_ee'),
  };
}

exports.App = require('./components/App')