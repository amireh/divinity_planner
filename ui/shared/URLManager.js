const EventEmitter = require('EventEmitter');
const URLManager = EventEmitter();

URLManager.getParams = function() {
  const pathName = getPathName();

  return pathName.split('-');
};

URLManager.setQueryParam = function(key, value) {
  const queryParams = URLManager.getQueryParams();

  if (value === undefined || value === null) {
    delete queryParams[key];
  }
  else {
    queryParams[key] = value;
  }

  URLManager.updateURL(null, queryParams);
};

URLManager.getQueryParams = function() {
  const queryString = window.location.hash.split('?')[1];

  if (!queryString) {
    return {};
  }

  return queryString
    .match(/[^=]+\=[^\&]+/g)
    .reduce(function(params, entry) {
      const keyValue = entry.replace(/^&/, '').split('=');

      params[keyValue[0]] = keyValue[1];

      return params;
    }, {})
  ;
};

URLManager.updateURL = function(params = null, queryParams = null) {
  const paramString = params ? generateParamString(params) : getPathName();
  const queryString = generateQueryString(queryParams || URLManager.getQueryParams());

  let fragments = ['#', paramString];

  if (queryString && queryString.length) {
    fragments.push('?');
    fragments.push(queryString);
  }

  window.location.hash = fragments.join('');

  URLManager.emitChange();
}

function generateQueryString(queryParams) {
  return Object.keys(queryParams).map(function(key) {
    return `${key}=${queryParams[key]}`;
  }).join('&');
}

function generateParamString(params) {
  return params.join('-');
}

function getPathName() {
  return window.location.hash.replace(/\?.+$/, '').replace(/^\#+/, '');
}

module.exports = URLManager;