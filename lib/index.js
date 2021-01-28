'use strict';

const traverse = require('traverse');
const Cesium = require('cesium');
const GJV = require("geojson-validation");

function sample(data, options) {
  if (options && options.token) Cesium.Ion.defaultAccessToken = options.token
  return new Promise(function (resolve, reject) {
    let positions = [];
    let dPositions = [];
    let paths = [];
    if (GJV.valid(data, (valid, errors) => {
      if (valid) {
        traverse(data).forEach(function() {
          if (this.isLeaf && Number.isFinite(this.node) && Array.isArray(this.parent.node) && this.parent.node.length > 1 && this.key == '0') {
            positions.push(Cesium.Cartographic.fromDegrees(this.parent.node[0], this.parent.node[1]));
            dPositions.push({longitude: this.parent.node[0], latitude: this.parent.node[1]});
            paths.push(this.parent.path);
          }
        });
        if (positions.length && dPositions.length) {
          let tp;
          if (options && options.terrainProviderUrl) {
            tp = new Cesium.CesiumTerrainProvider({url : options.terrainProviderUrl});
          } else {
            tp = Cesium.createWorldTerrain();
          }
          let sampleTerrain;
          if (options && options.level) {
            if ((options.level < 0) || (options.level > 11)) {return reject(new Error('Level must between 0 and 11'));}
            sampleTerrain = Cesium.sampleTerrain(tp, options.level, positions);
          } else {
            sampleTerrain = Cesium.sampleTerrainMostDetailed(tp, positions);
          }
          sampleTerrain.then(() => {
            paths.forEach(function (path, i) {
              if (path.length) {
                traverse(data).set(path, [dPositions[i].longitude, dPositions[i].latitude, positions[i].height ? Number(positions[i].height.toFixed(2)) : undefined]);
              } else {
                return reject (new Error('Invalid GeoJSON input file'));
              }
            });
            return resolve(data);
          }).otherwise(function (e) {
            return reject(e);
          });
        } else {
          return reject(new Error('No coordinates found in input file'));
        }
      } else {
        return reject(new Error('Invalid GeoJSON: ' + errors[0]));
      }
    }));
  });
}

module.exports = {
  sample: sample
};
