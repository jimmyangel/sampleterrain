'use strict';

const cli = require('cli');
const sampleterrain = require('./lib/');
const fs = require('fs');

console.warn('Sampling terrain...');

let options = cli.parse({
    file: ['f', 'GeoJson File', 'file'],
    level: ['l', 'Terrain level of detail', 'int'],
    url: ['u', 'Terrain provider url', 'url']
});

let fOptions;
if (options.level || options.url) {
  fOptions = {level: options.level, terrainProviderUrl: options.url};
}

if (options.file) {
  fs.readFile(options.file, 'utf8', (err, data) => {
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
