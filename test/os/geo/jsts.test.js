goog.require('ol.geom.LineString');
goog.require('ol.geom.MultiPolygon');
goog.require('ol.geom.Polygon');
goog.require('os.geo.jsts');
goog.require('os.proj');

ddescribe('os.geo.jsts', function() {
  it('should split polygons properly', function() {
    var polygon = new ol.geom.Polygon.fromExtent([-2, -2, 2, 2]);
    var line = new ol.geom.LineString([[0, -4], [0, 4]]);

    var result = os.geo.jsts.splitPolygonByLine(polygon, line);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(2);

    expect(polys[0].getExtent()).toEqual([-2, -2, 0, 2]);
    expect(polys[1].getExtent()).toEqual([0, -2, 2, 2]);

    polys.forEach(function(poly) {
      expect(os.geo.isClosed(poly.getCoordinates()[0])).toBe(true);
    });
  });

  // This test is deactivated because JSTS does not linearly interpolate the Z
  // coordinate when splitting/polygonizing
  xit('should split polygons with a z-coord properly', function() {
    var polygon = new ol.geom.Polygon([[
      [-2, -2, 2],
      [2, -2, 4],
      [2, 2, 4],
      [-2, 2, 2],
      [-2, -2, 2]]]);

    var line = new ol.geom.LineString([[0, -4, 0], [0, 4, 0]]);

    var result = os.geo.jsts.splitPolygonByLine(polygon, line);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(2);

    expect(polys[0].getExtent()).toEqual([-2, -2, 0, 2]);
    expect(polys[1].getExtent()).toEqual([0, -2, 2, 2]);

    polys.forEach(function(poly) {
      var rings = poly.getCoordinates();
      expect(os.geo.isClosed(rings[0])).toBe(true);

      for (var i = 0, n = rings[0].length; i < n; i++) {
        var coord = rings[0][i];
        if (coord[0] === -2) {
          expect(coord[2]).toBe(2);
        } else if (coord[0] === 0) {
          expect(coord[2]).toBe(3);
        } else if (coord[0] === 2) {
          expect(coord[2]).toBe(4);
        }
      }
    });
  });

  it('should split north polar polygons properly', function() {
    var polygon = new ol.geom.Polygon([[
      [0, 85],
      [90, 85],
      [180, 85],
      [270, 85],
      [0, 85]]]);

    var result = os.geo.jsts.splitPolarPolygon(polygon);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(2);

    expect(polys[0].getExtent()).toEqual([-180, 85, 0, 90]);
    expect(polys[1].getExtent()).toEqual([0, 85, 180, 90]);

    polys.forEach(function(poly) {
      expect(os.geo.isClosed(poly.getCoordinates()[0])).toBe(true);
    });
  });

  it('should split south polar polygons properly', function() {
    var polygon = new ol.geom.Polygon([[
      [0, -85],
      [90, -85],
      [180, -85],
      [270, -85],
      [0, -85]]]);

    var result = os.geo.jsts.splitPolarPolygon(polygon);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(2);

    expect(polys[0].getExtent()).toEqual([-180, -90, 0, -85]);
    expect(polys[1].getExtent()).toEqual([0, -90, 180, -85]);

    polys.forEach(function(poly) {
      expect(os.geo.isClosed(poly.getCoordinates()[0])).toBe(true);
    });
  });

  it('should split north-only multi polygons properly', function() {
    var multi = new ol.geom.MultiPolygon([[[
      [0, 85],
      [90, 85],
      [180, 85],
      [270, 85],
      [0, 85]
    ]], [[
      [0, 80],
      [5, 80],
      [5, 84],
      [0, 84],
      [0, 80]
    ]]]);

    var result = os.geo.jsts.splitPolarPolygon(multi);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(3);

    expect(polys[0].getExtent()).toEqual([-180, 85, 0, 90]);
    expect(polys[1].getExtent()).toEqual([0, 85, 180, 90]);
    expect(polys[2].getExtent()).toEqual([0, 80, 5, 84]);
  });

  it('should split south-only multi polygons properly', function() {
    var multi = new ol.geom.MultiPolygon([[[
      [0, -85],
      [90, -85],
      [180, -85],
      [270, -85],
      [0, -85]
    ]], [[
      [0, -84],
      [5, -84],
      [5, -80],
      [0, -80],
      [0, -84]
    ]]]);

    var result = os.geo.jsts.splitPolarPolygon(multi);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(3);

    expect(polys[0].getExtent()).toEqual([-180, -90, 0, -85]);
    expect(polys[1].getExtent()).toEqual([0, -90, 180, -85]);
    expect(polys[2].getExtent()).toEqual([0, -84, 5, -80]);
  });

  it('should split north and south multi polygons properly', function() {
    var multi = new ol.geom.MultiPolygon([[[
      [0, 85],
      [90, 85],
      [180, 85],
      [270, 85],
      [0, 85]
    ]], [[
      [0, -85],
      [90, -85],
      [180, -85],
      [270, -85],
      [0, -85]
    ]]]);

    var result = os.geo.jsts.splitPolarPolygon(multi);
    expect(result instanceof ol.geom.MultiPolygon).toBe(true);
    var polys = result.getPolygons();
    expect(polys.length).toBe(4);

    expect(polys[0].getExtent()).toEqual([-180, 85, 0, 90]);
    expect(polys[1].getExtent()).toEqual([0, 85, 180, 90]);
    expect(polys[2].getExtent()).toEqual([-180, -90, 0, -85]);
    expect(polys[3].getExtent()).toEqual([0, -90, 180, -85]);
  });

  xit('should split polygons containing a pole and crossing the equator properly', function() {
  });

  xit('should split polygons containing both poles properly', function() {
  });
});
