'use strict';

var traverse = require('traverse');
var Cesium = require('cesium');
var cesiumTerrainProviderUrl = 'http://assets.agi.com/stk-terrain/world/';
var defaultLevel = 11;

var positions = [];
var dPositions = [];
var paths = [];

function sample(data, level, callback) {

  traverse(data).forEach(function() {
    level = level || defaultLevel;

    if (this.isLeaf && Number.isFinite(this.node) && Array.isArray(this.parent.node) && this.parent.node.length > 1 && this.key == 0) {
      positions.push(Cesium.Cartographic.fromDegrees(this.parent.node[0], this.parent.node[1]));
      dPositions.push({longitude: this.parent.node[0], latitude: this.parent.node[1]});
      paths.push(this.parent.path);
    }

  });

  var tp = new Cesium.CesiumTerrainProvider({url : cesiumTerrainProviderUrl});
  var sampleTerrain = Cesium.sampleTerrain(tp, level, positions);

  sampleTerrain.then(function() {
    paths.forEach(function (path, i) {
      traverse(data).set(path, [dPositions[i].longitude, dPositions[i].latitude, Number(positions[i].height.toFixed(2))]);
    });
    return callback(null, data);
  }).otherwise(function (e) {
    return callback(e);
  });
}

module.exports = {
  sample: sample
};
