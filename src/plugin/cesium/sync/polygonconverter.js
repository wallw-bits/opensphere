goog.module('plugin.cesium.sync.PolygonConverter');

const {createAndAddPolygon} = goog.require('plugin.cesium.sync.polygon');
const StrokeConverter = goog.require('plugin.cesium.sync.StrokeConverter');

const Polygon = goog.requireType('ol.geom.Polygon');

/**
 * Converter for Polygons
 * @extends {StrokeConverter<Polygon>}
 */
class PolygonConverter extends StrokeConverter {
  /**
   * @inheritDoc
   */
  create(feature, geometry, style, context) {
    createAndAddPolygon(feature, geometry, style, context);
    return true;
  }
}


exports = PolygonConverter;
