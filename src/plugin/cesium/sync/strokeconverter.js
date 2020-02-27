goog.module('plugin.cesium.sync.StrokeConverter');

const BaseConverter = goog.require('plugin.cesium.sync.BaseConverter');
const {updatePrimitive} = goog.require('plugin.cesium.primitive');
const {isGeometryDirty, isLineWidthChanging, isDashChanging} =
  goog.require('plugin.cesium.sync.linestring');

const Geometry = goog.requireType('ol.geom.Geometry');

/**
 * Converter for items which have a stroke/outline
 * @abstract
 * @extends {BaseConverter<GeomType>}
 * @template {!Geometry} GeomType
 */
class StrokeConverter extends BaseConverter {
  /**
   * @inheritDoc
   */
  update(feature, geometry, style, context, primitive) {
    if (Array.isArray(primitive)) {
      for (let i = 0, n = primitive.length; i < n; i++) {
        if (!this.update(feature, geometry, style, geometry, primitive[i])) {
          return false;
        }
      }

      return true;
    }

    if (isGeometryDirty(geometry) ||
        isLineWidthChanging(primitive, style) ||
        isDashChanging(primitive, style)) {
      return false;
    }

    return updatePrimitive(feature, geometry, style, context, primitive);
  }
}


exports = StrokeConverter;
