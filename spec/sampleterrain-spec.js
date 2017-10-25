var sampleterrain = require('../lib/');

describe('my test suite',function(){

  it('should add elevation coordinates to a json file with long/lat', function(done) {
    var geojson = require('../sampledata/test1.json');
    sampleterrain.sample(geojson, function(err, result) {
      expect(result.features[0].geometry.coordinates[0].length).toEqual(3);
      done();
    });
  });



});
