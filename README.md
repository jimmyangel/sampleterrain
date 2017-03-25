## sampleterrain - Update coordinates of a GeoJSON file with sampled elevation data from [Cesium Terrain Provider](https://cesiumjs.org/data-and-assets/terrain/stk-world-terrain.html)

### As library

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

### Command line
```
Sampling terrain...
Usage:
  sampleterrain.js [OPTIONS] [ARGS]

Options: 
  -f, --file FILE        GeoJson File
  -l, --level [NUMBER]   Terrain level of detail (Default is 11)
  -h, --help             Display help and usage details
```

### Examples