const URLManager = require('URLManager');

exports.isEE = function() {
  return URLManager.getQueryParams().ee === '1';
};

exports.setEE = function(flag) {
  if (flag && !exports.isEE()) {
    URLManager.setQueryParam('ee', '1');
  }
  else if (!flag && exports.isEE()) {
    URLManager.setQueryParam('ee', null);
  }
};
