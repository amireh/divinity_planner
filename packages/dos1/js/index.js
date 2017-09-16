require('../css/index.less');

if (process.env.NODE_ENV === 'development') {
  window.DEBUG = {
    abilities: require('./database/abilities'),
    abilitiesEE: require('./database/abilities_ee'),
  };
}

module.exports = require('./components/App')