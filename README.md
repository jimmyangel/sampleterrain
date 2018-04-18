## sampleterrain - Update coordinates of a GeoJSON file from node.js with sampled elevation data from a [Cesium Terrain Provider](https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html)

When you work with [Cesium](https://cesiumjs.org/), often times you need to incorporate elevation data in your geo features so that they are properly positioned relative to the ground when using terrain visualization. You can do it in the browser by invoking the [Cesium.sampleTerrain](https://cesiumjs.org/Cesium/Build/Documentation/sampleTerrain.html) function, but if your features have tons of coordinates, it will be very slow. Many times it will be much better to preprocess the data off-line to include elevation information. This small library allows you to do that from a node.js application.

Caveat: Cesium.js does not currently support invoking Cesium.sampleTerrain from a node.js application. I have created a [branch](https://github.com/jimmyangel/cesium/tree/loadWithHttpRequest) (and a [pull request](https://github.com/AnalyticalGraphicsInc/cesium/pull/6454)) to include such support. While this functionality makes it into the official Cesium release, npm install will get [this](https://github.com/jimmyangel/cesium/tree/loadWithHttpRequest-build) branch from my repo.

### Install
```
npm install sampleterrain
```

### Use as library

```
var sampleterrain = require('sampleterrain');

sampleterrain.sample(data, function(err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(result);
  }
});

sampleterrain.sample(data, fOptions).then((result) => {
  console.log(JSON.stringify(result));
}).catch(e => {
  console.warn('Sample terrain error', e);
});

Where:
  data - GeoJSON object
  fOptions - {level: level, terrainProviderUrl: url}
              level - The terrain level-of-detail from which to sample terrain heights (defaults to maximum detail)
              url - The url of the terrain provider (default to the Cesium Ion world terrain provider)
  result - Updated GeoJSON object

```

### Use from the command line
```
Usage:
  sampleterrain.js [OPTIONS] [ARGS]

Options:
  -f, --file FILE        GeoJson File
  -l, --level NUMBER     Terrain level of detail
  -u, --url URL          Terrain provider url
  -h, --help             Display help and usage details
```

### Example
```
node sampleterrain.js -f ./sampledata/test1.json  > sampled.json
```
