'use strict';

var cli = require('cli');
var sampleterrain = require('./lib/');
var fs = require('fs');

console.warn('Sampling terrain...');

var options = cli.parse({
    file: ['f', 'GeoJson File', 'file'],
    level: ['l', 'Terrain level of detail', 'int', 11]
});

if (options.file) {
  fs.readFile(options.file, 'utf8', function(err, data) {
    if (err) {throw err;}
    sampleterrain.sample(JSON.parse(data), options.level, function(e, o) {
      if (e) {
        console.warn('Sample terrain error', e);
      } else {
        console.log(JSON.stringify(o));
      }
    });
  });
} else {
  cli.getUsage();
  return;
}
