goog.module('plugin.cesium.sync.DynamicLineStringConverter');

const BaseConverter = goog.require('plugin.cesium.sync.BaseConverter');
const {shouldUpdatePrimitive} = goog.require('plugin.cesium.primitive');
const {createPolyline, updatePolyline} = goog.require('plugin.cesium.sync.DynamicLineString');

const LineString = goog.requireType('ol.geom.LineString');

/**
 * Converter for DynamicFeature lines
 * @extends {BaseConverter<LineString>}
 */
class DynamicLineStringConverter extends BaseConverter {
  /**
   * @inheritDoc
   */
  create(feature, geometry, style, context) {
    const polylineOptions = createPolyline(feature, geometry, style, context);
    context.addPolyline(polylineOptions, feature, geometry);
    return true;
  }

  /**
   * @inheritDoc
   */
  update(feature, geometry, style, context, primitive) {
    if (!shouldUpdatePrimitive(feature, geometry, style, context, primitive)) {
      return false;
    }

    updatePolyline(feature, geometry, style, context, primitive);
    return true;
  }
}


exports = DynamicLineStringConverter;
