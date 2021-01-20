'use strict';

const cli = require('cli');
const sampleterrain = require('./lib/');
const fs = require('fs');

let start = new Date();

console.warn('Sampling terrain...');

let options = cli.parse({
    file: ['f', 'GeoJson File', 'file'],
    level: ['l', 'Terrain level of detail', 'int'],
    url: ['u', 'Terrain provider url', 'url'],
    token: ['t', 'Cesium Ion access token', 'string']
});

options.token = options.token ? options.token : process.env.CESIUM_ION_TOKEN

let fOptions;
if (options.level || options.url || options.token) {
  fOptions = {level: options.level, terrainProviderUrl: options.url, token: options.token};
}

if (options.file) {
  fs.readFile(options.file, 'utf8', (err, data) => {
    if (err) {throw err;}
    sampleterrain.sample(JSON.parse(data), fOptions).then((o) => {
      console.warn('Terrain sampled...', new Date() - start, 'ms');
      console.log(JSON.stringify(o));
    }).catch(e => {
      console.warn('Sample terrain error', e);
    });
  });
} else {
  cli.getUsage();
  return;
}
