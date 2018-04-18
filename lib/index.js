'use strict';

var traverse = require('traverse');
var Cesium = require('cesium');

var positions = [];
var dPositions = [];
var paths = [];

function sample(data, options) {

  return new Promise(function (resolve, reject) {

    traverse(data).forEach(function() {
      if (this.isLeaf && Number.isFinite(this.node) && Array.isArray(this.parent.node) && this.parent.node.length > 1 && this.key == '0') {
        positions.push(Cesium.Cartographic.fromDegrees(this.parent.node[0], this.parent.node[1]));
        dPositions.push({longitude: this.parent.node[0], latitude: this.parent.node[1]});
        paths.push(this.parent.path);
      }

    });

    if (positions.length && dPositions.length) {
      var tp;
      if (options && options.terrainProviderUrl) {
        tp = new Cesium.CesiumTerrainProvider({url : options.terrainProviderUrl});
      } else {
        tp = Cesium.createWorldTerrain();
      }

      tp.readyPromise.then(function() {
        var sampleTerrain;
        if (options && options.level) {
          if ((options.level < 0) || (options.level > 11)) {return reject(new Error('Level must between 0 and 11'));}
          sampleTerrain = Cesium.sampleTerrain(tp, options.level, positions);
        } else {
          sampleTerrain = Cesium.sampleTerrainMostDetailed(tp, positions);
        }

        sampleTerrain.then(function() {

          paths.forEach(function (path, i) {
            if (path.length) {
              traverse(data).set(path, [dPositions[i].longitude, dPositions[i].latitude, Number(positions[i].height.toFixed(2))]);
            } else {
              return reject (new Error('Invalid GeoJSON input file'));
            }
          });
          return resolve(data);
        }).otherwise(function (e) {
          return reject(e);
        });

      }).otherwise(function (e) {
        return reject(e);
      });
    } else {
      return reject(new Error('No coordinates found in input file'));
    }
  });
}

module.exports = {
  sample: sample
};
