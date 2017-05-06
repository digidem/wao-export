var request = require('request')
var ff = require('feature-filter-geojson')
var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')
var fc = require('@turf/helpers').featureCollection

var layers = {
  'rios_lines': ['all', ['has', 'waterway'], ['==', '$type', 'LineString']],
  'camino_lines': ['all', ['has', 'camino'], ['==', '$type', 'LineString']],
  'rios_not_lines': ['all', ['has', 'waterway'], ['!=', '$type', 'LineString']],
  'camino_not_lines': ['all', ['has', 'camino'], ['!=', '$type', 'LineString']],
  'flora': ['any', ['has', 'arbol'], ['has', 'planta'], ['has', 'flora']],
  'agua': ['has', 'water'],
  'fauna': ['has', 'fauna'],
  'comunidad': ['any', ['has', 'place'], ['has', 'comunidad'], ['has', 'amenity']]
}

var otherFilter = ['none']
Object.keys(layers).forEach(function (name) {
  otherFilter.push(layers[name])
})

layers.other = otherFilter

mkdirp.sync(path.join(__dirname, 'layers'))

request('http://localhost:5000/export.geojson', function (err, res, body) {
  if (err) return console.error(err)
  var geojson = JSON.parse(body)
  for (var name in layers) {
    var layer = fc(geojson.features.filter(ff(layers[name])))
    fs.writeFileSync(path.join(__dirname, 'layers', name + '.geojson'), JSON.stringify(layer, null, 4))
  }
})
