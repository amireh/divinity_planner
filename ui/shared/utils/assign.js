module.exports = function assign(out = {}, ...sources) {
  sources.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      out[key] = source[key];
    });
  });

  return out;
};