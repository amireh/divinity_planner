const Directive = {
  Entry: 1,
  Type: 2,
  Using: 3,
  Data: 4,
  Unknown: 0,
};

const Classifiers = [
  { type: Directive.Entry, matcher: /^new entry "(.+)"$/ },
  { type: Directive.Type, matcher: /^type "(.+)"$/ },
  { type: Directive.Using, matcher: /^using "(.+)"$/ },
  { type: Directive.Data, matcher: /^data "(.+)" "([^"]*)"$/ },
]

const trim = x => x.trim()
const notEmpty = x => x.length > 0

module.exports = function parseSkillData(sourceFile) {
  const lines = sourceFile.split('\n').map(trim).filter(notEmpty);

  return lines.reduce(function(list, line, index) {
    const directive = classifyLine(line, lines, index)

    switch (directive.type) {
      case Directive.Entry:
        list.push({ Id: directive.data[0], Properties: {} })
        break;

      case Directive.Type:
        list[list.length-1].Type = directive.data[0];
        break;

      case Directive.Using:
        list[list.length-1].Using = directive.data[0];
        break;

      case Directive.Data:
        list[list.length-1].Properties[directive.data[0]] = directive.data[1];
        break;

      case Directive.Unknown:
        // console.warn(`Unrecognized entry: ${line}`)
        break;
    }

    return list;
  }, [])
}

function classifyLine(line, lines, index) {
  const tryWithNextLine = () => {
    if (!lines) {
      return null;
    }

    const nextLine = lines[index + 1]

    if (!nextLine) {
      return null;
    }

    return classifyLine(line + ' ' + nextLine)
  }

  return Classifiers.reduce(function(directive, { matcher, type }) {
    if (directive) {
      return directive;
    }

    const match = line.match(matcher);

    if (match) {
      return { type, data: match.slice(1) }
    }
    else {
      return directive;
    }
  }, null) || tryWithNextLine() || { type: Directive.Unknown }
}