const URLManager = require('./shared/URLManager')
const DOS1 = 'DOS1'
const DOS1_EE = 'DOS1_EE'
const DOS2 = 'DOS2'

exports.resolve = function(queryParams = URLManager.getQueryParams()) {
  if (location.hash === '') {
    return null;
  }
  else if (queryParams.version === DOS1_EE || queryParams.ee === '1') {
    return DOS1_EE;
  }
  else if (queryParams.version === DOS2) {
    return DOS2;
  }
  else {
    return DOS1;
  }
}

exports.DOS1 = DOS1
exports.DOS1_EE = DOS1_EE
exports.DOS2 = DOS2
