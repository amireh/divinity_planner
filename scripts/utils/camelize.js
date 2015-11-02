module.exports = function camelize(str, lowerFirst) {
  return (str || '').replace(/(?:^|[-_])(\w)/g, function(_, c, index) {
    if (index === 0 && lowerFirst) {
      return c ? c.toLowerCase() : '';
    } else {
      return c ? c.toUpperCase() : '';
    }
  });
};
