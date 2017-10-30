const { AppVersion, URLManager } = require('dos-common');

exports.isEE = function() {
  const queryParams = URLManager.getQueryParams();

  return queryParams.ee === '1' || queryParams.version === AppVersion.DOS1_EE;
};

exports.setEE = function(flag) {
  if (flag && !exports.isEE()) {
    URLManager.setQueryParam('version', AppVersion.DOS1_EE);
  }
  else if (!flag && exports.isEE()) {
    URLManager.setQueryParam('version', AppVersion.DOS1);
  }
};
