var sampleterrain = require('../lib/');

describe('my test suite',function(){

  it('should add elevation coordinates to a json file with long/lat', function(done) {
    var geojson = require('../sampledata/test1.json');
    sampleterrain.sample(geojson).then(function(result) {
      expect(result.features[0].geometry.coordinates[0].length).toEqual(3);
      done();
    }).catch(function(e) {
      expect(e).toBeFalsy();
      console.log(e);
      done();
    });
  });

  it('should add elevation coordinates to a large GeoJSON json file with long/lat', function(done) {
    var geojson = require('../sampledata/test3.json');
    sampleterrain.sample(geojson, {level: 6}).then(function(result) {
      expect(result.features[0].geometry.coordinates[0][0].length).toEqual(3);
      done();
    }).catch(function(e) {
      expect(e).toBeFalsy();
      console.log(e);
      done();
    });
  });

  it('should return error if an invalid detail level is used', function(done) {
    var geojson = require('../sampledata/test1.json');
    sampleterrain.sample(geojson, {level: 100}).then(function(result) {
      expect(result).toBeFalsy();
      done();
    }).catch(function(e) {
      expect(e).toBeTruthy();
      done();
    });
  });

  it('should return error if an invalid url is used', function(done) {
    var geojson = require('../sampledata/test1.json');
    sampleterrain.sample(geojson, {terrainProviderUrl: 'xyz:'}).then(function(result) {
      expect(result).toBeFalsy();
      done();
    }).catch(function(e) {
      expect(e).toBeTruthy();
      done();
    });
  });

  it('should return error if an invalid GeoJSON file is used', function(done) {
    var geojson = require('../sampledata/test0.json');
    sampleterrain.sample(geojson).then(function(result) {
      expect(result).toBeFalsy();
      done();
    }).catch(function(e) {
      expect(e).toBeTruthy();
      done();
    });
  });

  it('should return error if GeoJSON file with invalid data is used', function(done) {
    var geojson = require('../sampledata/test5.json');
    sampleterrain.sample(geojson).then(function(result) {
      expect(result).toBeFalsy();
      done();
    }).catch(function(e) {
      expect(e).toBeTruthy();
      done();
    });
  });

});
