function interpolateTemplate({
  skillSheet,
  gameStats = null,
  template,
  templateParams = '',
}) {
  const paramIndex = templateParams.split(';');

  return interpolate(template)
    .split(/<br\/?>/)
    .map(function(entry) {
      return entry.trim().replace(/^\||\|$/g, '');
    })
    .filter(function(entry) {
      return entry.length > 0;
    })
    .join("\n")
  ;

  function interpolate(str) {
    return str.replace(/\[\d+\]/g, function(idStr) {
      var index = parseInt(idStr.slice(1,-1), 10) - 1;
      var paramKey = paramIndex[index];
      var param = skillSheet[paramKey];

      if (!param && paramKey === 'Damage' && skillSheet['DamageType']) {
        var multiplier = skillSheet['Damage Multiplier'] || '100';
        param = multiplier + '% (' + skillSheet['DamageType'] + ')';
      }
      else if (!param && paramKey === 'Damage' && skillSheet['UseWeaponDamage']) {
        param = 'X-Y';
      }
      else if (!param && paramKey.match(/^Stats:(.+):(.+)$/)) {
        var statKey = RegExp.$1;
        var statAttr = RegExp.$2;

        if (gameStats && gameStats[statKey]) {
          param = gameStats[statKey][statAttr];
        }
      }

      if (!param) {
        console.warn("[W] Unable to interpolate description parameter '%s' for '%s'.",
          paramKey,
          `${skillSheet.Ability}::${skillSheet.Id}`
        );
      }

      return param || idStr;
    });
  }
}

module.exports = interpolateTemplate