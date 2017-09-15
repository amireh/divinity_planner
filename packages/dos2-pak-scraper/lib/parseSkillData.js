const Directive = {
  Entry: 1,
  Type: 2,
  Using: 3,
  Data: 4,
  Unknown: 0,
};

module.exports = function parseSkillData(sourceFile) {
  return sourceFile.split('\n').reduce(function(list, line) {
    const directive = classifyLine(line)

    switch (directive.type) {
      case Directive.Entry:
        list.push({ id: directive.data, properties: {} })
        break;

      case Directive.Type:
        list[list.length-1].type = directive.data[0];
        break;

      case Directive.Using:
        list[list.length-1].using = directive.data[0];
        break;

      case Directive.Data:
        list[list.length-1].properties[directive.data[0]] = directive.data[1];
        break;

      case Directive.Unknown:
        break;
    }

    return list;
  }, [])
}

function classifyLine(line) {
  return [
    { type: Directive.Entry, matcher: /^new entry "(.+)"$/ },
    { type: Directive.Type, matcher: /^type "(.+)"$/ },
    { type: Directive.Using, matcher: /^using "(.+)"$/ },
    { type: Directive.Data, matcher: /^data "(.+)" "(.+)"$/ },
  ].reduce(function(directive, { matcher, type }) {
    if (directive.type !== Directive.Unknown) {
      return directive;
    }

    const match = line.trim().match(matcher);

    if (match) {
      return { type, data: match.slice(1) }
    }
    else {
      return directive;
    }
  }, { type: Directive.Unknown })
}