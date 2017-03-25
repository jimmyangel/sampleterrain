## sampleterrain - Update coordinates of a GeoJSON file with sampled elevation data from [Cesium Terrain Provider](https://cesiumjs.org/data-and-assets/terrain/stk-world-terrain.html) from node.js

Whe you work with [Cesium](https://cesiumjs.org/), often times you need to incorporate elevation data in your geo features so that they are properly positioned relative to the ground when using terrain visualization. You can do it in the browser by invoking the [Cesium.sampleTerrain](https://cesiumjs.org/Cesium/Build/Documentation/sampleTerrain.html) function, but if your features have tons of coordinates, it will be very slow. Most of the time it will be much better to preprocess the data off-line to include elevation information. This small library allows you to do that from a node.js application.

Caveat: Cesium.js does not currently support invoking Cesium.sampleTerrain from a node.js application. I have created a [branch](https://github.com/jimmyangel/cesium/tree/loadWithXhr-for-node) (and a [pull request](https://github.com/AnalyticalGraphicsInc/cesium/pull/5138)) to include such support. While this functionality makes it into the official Cesium release, npm install will get [this](https://github.com/jimmyangel/cesium/tree/lhxr-build) branch from my repo.

### Install
```
npm install sampleterrain
```

### Use as library

```
var sampleterrain = require('sampleterrain');

sampleterrain.sample(data, level, function(err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result);
  }
});

```

### Use from the command line
```
Sampling terrain...
Usage:
  sampleterrain.js [OPTIONS] [ARGS]

Options: 
  -f, --file FILE        GeoJson File
  -l, --level [NUMBER]   Terrain level of detail (Default is 11)
  -h, --help             Display help and usage details
```

### Example
```
node sampleterrain.js -f ./sampledata/test1.json -l 11 > sampled.json
```