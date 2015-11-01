#!/usr/bin/env node

var BASE_URL = 'http://divinity.wikia.com/wiki/Divinity:_Original_Sin_';

function parse() {
  var table = document.querySelector('table:first-of-type');
  var columnMap = getColumnMap();

  return [].map.call(table.querySelectorAll('tbody tr'), function(node) {
    return columnMap.reduce(function(set, column, columnIndex) {
      var columnNode = node.querySelector('td:nth-of-type(' + (columnIndex+1) + ')');

      if (column === 'skill') {
        set.name = columnNode.querySelector('a[title]:last-of-type').textContent;
        set.image = columnNode.querySelector('img').src;
      }
      else if (column === 'description') {
        set.description_text = columnNode.innerText;
        set.description_html = columnNode.innerHTML;
      }
      else {
        set[column] = columnNode.textContent;
      }

      return set;
    }, {});
  });

  function getColumnMap() {
    return [].map.call(table.querySelectorAll('thead th'), function(node, i) {
      return node.innerText.trim().replace(/\W+/g, '_').toLowerCase();
    });
  }
}
