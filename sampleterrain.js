'use strict';

var cli = require('cli');
var sampleterrain = require('./lib/');
var fs = require('fs');

console.warn('Sampling terrain...');

var options = cli.parse({
    file: ['f', 'GeoJson File', 'file'],
    level: ['l', 'Terrain level of detail', 'int'],
    url: ['u', 'Terrain provider url', 'url']
});

if (options.level || options.url) {
  var fOptions = {level: options.level, terrainProviderUrl: options.url};
}

if (options.file) {
  fs.readFile(options.file, 'utf8', function(err, data) {
    if (err) {throw err;}
    sampleterrain.sample(JSON.parse(data), fOptions).then((o) => {
      console.log(JSON.stringify(o));
    }).catch(e => {
      console.warn('Sample terrain error', e);
    });
  });
} else {
  cli.getUsage();
  return;
}
