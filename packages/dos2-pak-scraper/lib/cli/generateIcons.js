const cheerio = require('cheerio')
const trimMultilineString = str => str.replace(/\n\s*/gm, ' ').trim()

module.exports = function({
  pngFile,
  xmlFile,
  width = 2048,
  height = 2048,
  className = "dos2-icon",
  imageName = "dos2-icons.png",
}) {
  const icons = [];
  const $ = cheerio.load(xmlFile, { xmlMode: true })

  $("node[id='IconUV']").toArray().forEach(function(node) {
    const icon = $(node).find('attribute').toArray().reduce(function(map, childNode) {
      const { name } = childNode

      if (name === 'attribute' && childNode.attribs.id === 'MapKey') {
        map.Id = childNode.attribs.value;
      }
      else if (name === 'attribute' && childNode.attribs.id === 'U1') {
        map.U1 = width * parseFloat(childNode.attribs.value);
      }
      else if (name === 'attribute' && childNode.attribs.id === 'U2') {
        map.U2 = width * parseFloat(childNode.attribs.value);
      }
      else if (name === 'attribute' && childNode.attribs.id === 'V1') {
        map.V1 = height * parseFloat(childNode.attribs.value);
      }
      else if (name === 'attribute' && childNode.attribs.id === 'V2') {
        map.V2 = height * parseFloat(childNode.attribs.value);
      }

      return map;
    }, {})

    if (icon) {
      icons.push(icon)
    }
  })

  const round = x => Math.round(x)
  const baseCSS = trimMultilineString(`
    .${className} {
      background-image: url('./${imageName}');
      background-size: ${width}px ${height}px;
    }
  `)
  return baseCSS + icons.map(function(icon) {
    const iconWidth   = round(icon.U2 - icon.U1);
    const iconHeight  = round(icon.V2 - icon.V1);
    const iconLeft    = -1 * round(icon.U1);
    const iconTop     = -1 * round(icon.V1);

    return trimMultilineString(`
      .${className}--${icon.Id} {
        background-position: ${iconLeft}px ${iconTop}px;
        width: ${iconWidth}px;
        height: ${iconHeight}px;
      }
    `)
  }).join('\n');
}

