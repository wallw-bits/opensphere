goog.module('plugin.cesium.sync.LineStringConverter');

const StrokeConverter = goog.require('plugin.cesium.sync.StrokeConverter');
const {createLineStringPrimitive} = goog.require('plugin.cesium.sync.linestring');

const LineString = goog.requireType('ol.geom.LineString');


/**
 * Converter for LineStrings
 * @extends {StrokeConverter<LineString>}
 */
class LineStringConverter extends StrokeConverter {
  /**
   * @inheritDoc
   */
  create(feature, geometry, style, context) {
    const line = createLineStringPrimitive(feature, geometry, style, context);
    context.addPrimitive(line, feature, geometry);
    return true;
  }
}


exports = LineStringConverter;
