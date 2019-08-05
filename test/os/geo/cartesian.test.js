goog.require('os.geo');
goog.require('os.geo.cartesian');

describe('os.geo.cartesian', function() {
  it('should convert to cartesians and back', function() {
    var epsilon = 1E-12;
    for (var alt = -100000; alt <= 100000; alt += 1000) {
      for (var lon = -180; lon <= 180; lon += 10) {
        for (var lat = -90; lat <= 90; lat += 10) {
          var cesium = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
          var cartesian = os.geo.cartesian.fromLonLat([lon, lat, alt]);
          expect(cartesian[0]).toBeCloseTo(cesium.x, epsilon);
          expect(cartesian[1]).toBeCloseTo(cesium.y, epsilon);
          expect(cartesian[2]).toBeCloseTo(cesium.z, epsilon);

          var lonlat = os.geo.cartesian.toLonLat(cartesian, cartesian);
          cesium = Cesium.Cartographic.fromCartesian(cesium);

          expect(lonlat[0]).toBeCloseTo(os.geo.R2D * cesium.longitude, epsilon);
          expect(lonlat[1]).toBeCloseTo(os.geo.R2D * cesium.latitude, epsilon);
          expect(lonlat[2]).toBeCloseTo(cesium.height, epsilon);
        }
      }
    }
  });

  it('should properly copy to incoming result arrays', function() {
    var lonlat = [0, 0, 0];
    var cartesian = os.geo.cartesian.fromLonLat(lonlat);
    expect(cartesian).not.toBe(lonlat);
    cartesian = os.geo.cartesian.fromLonLat(lonlat, lonlat);
    expect(cartesian).toBe(lonlat);

    lonlat = os.geo.cartesian.toLonLat(cartesian);
    expect(lonlat).not.toBe(cartesian);
    lonlat = os.geo.cartesian.toLonLat(cartesian, cartesian);
    expect(lonlat).toBe(cartesian);
  });

  xit('should split polylines by the meridian plane', function() {
    var tests = [{
      original: [[-2, -2, 0], [2, -2, 0], [2, 2, 0], [-2, 2, 0], [-2, -2, 0]],
      expected: [
        [[0, -2, 0], [2, -2, 0], [2, 2, 0], [0, 2, 0], [0, -2, 0]],
        [[-2, -2, 0], [0, -2, 0], [0, 2, 0], [-2, 2, 0], [-2, -2, 0]]
      ]
    }];

    tests.forEach(function(test) {
      var split = os.geo.cartesian.splitOnMeridianPlane(test.original);
      console.log('east: ', JSON.stringify(split[0]));
      console.log('west: ', JSON.stringify(split[1]));

      console.log('expe: ', JSON.stringify(test.expected[0]));
      console.log('expw: ', JSON.stringify(test.expected[1]));
    });
  });
});
