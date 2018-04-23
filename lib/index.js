'use strict';

const traverse = require('traverse');
const Cesium = require('cesium');
const GJV = require("geojson-validation");
const ThrottledPromise = require('throttled-promise');

const MAX_PROMISES = 5;

function sample(data, options) {
  return new Promise((resolve, reject) => {
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
          getElevations(options, positions).then(() => {
            paths.forEach((path, i) => {
              if (path.length) {
                traverse(data).set(path, [dPositions[i].longitude, dPositions[i].latitude, Number(positions[i].height.toFixed(2))]);
              } else {
                return reject (new Error('Invalid GeoJSON input file'));
              }
            });
            return resolve(data);
          }).catch((e) => {
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

function getElevations(options, positions) {
  return new Promise((resolve, reject) => {

    let p = [];
    let segmentedPositions = new Array(MAX_PROMISES);

    let segmentSize = Math.ceil(positions.length/MAX_PROMISES);

    for (let i = 0; i<segmentedPositions.length; i++) {
      segmentedPositions[i] = [];
      for (let j = i*segmentSize; j < Math.min((i+1)*segmentSize, positions.length); j++) {
        segmentedPositions[i].push(positions[j]);
      }
      p.push(getElevationsTask(options, segmentedPositions[i]));
    }

    ThrottledPromise.all(p, MAX_PROMISES).then(() => {
      return resolve();
    }).catch((e) => {
      return reject(e);
    });
  });
}

function getElevationsTask(options, positions) {
  return new ThrottledPromise((resolve, reject) => {
    let tp;
    if (options && options.terrainProviderUrl) {
      tp = new Cesium.CesiumTerrainProvider({url : options.terrainProviderUrl});
    } else {
      tp = Cesium.createWorldTerrain();
    }
    if (tp) {
      tp.readyPromise.then(() => {
        let sampleTerrain;
        if (options && options.level) {
          if ((options.level < 0) || (options.level > 11)) {return reject(new Error('Level must between 0 and 11'));}
          sampleTerrain = Cesium.sampleTerrain(tp, options.level, positions);
        } else {
          sampleTerrain = Cesium.sampleTerrainMostDetailed(tp, positions);
        }
        sampleTerrain.then(() => {
          return resolve();
        }).otherwise((e) => {
          return reject(e);
        });
      }).otherwise((e) => {
        return reject(e);
      });
    } else {
      return reject(new Error('Error creating terrain provider'));
    }
  });
}

module.exports = {
  sample: sample
};
