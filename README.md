## sampleterrain - Update coordinates of a GeoJSON file from node.js with sampled elevation data from a [Cesium Terrain Provider](https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html)

When you work with [Cesium](https://cesiumjs.org/), often times you need to incorporate elevation data in your geo features so that they are properly positioned relative to the ground when using terrain visualization. You can do it in the browser by invoking the [Cesium.sampleTerrain](https://cesiumjs.org/Cesium/Build/Documentation/sampleTerrain.html) function, but if your features have tons of coordinates, it will be very slow. Many times it will be much better to preprocess the data off-line to include elevation information.

This small library allows you to do that from a node.js application.

Performance note: For large files, it is better to explicitly specify level of detail as the default 'sampleTerrainMostDetailed' can be very slow.

### Install
```
npm install sampleterrain
```

### Use as library

```
var sampleterrain = require('sampleterrain');

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
              token - The Cesium Ion access token (required if accessing Cesium Ion's world terrain provider)
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
  -t, --token STRING     Cesium Ion access token  
  -h, --help             Display help and usage details
```

Note: As an alternative to the ```--token``` option, set the ```CESIUM_ION_TOKEN``` environment variable

### Example
```
node sampleterrain.js -f ./sampledata/test1.json -t 'your Cesium Ion token'  > sampled.json
```

### Running the test suite

Running the test suite (npm run test) requires the ```CESIUM_ION_TOKEN``` environment variable to be set with a valid access token.
