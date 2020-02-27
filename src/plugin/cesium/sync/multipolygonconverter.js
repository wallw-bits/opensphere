goog.module('plugin.cesium.sync.MultiPolygonConverter');

const {createAndAddPolygon} = goog.require('plugin.cesium.sync.polygon');
const StrokeConverter = goog.require('plugin.cesium.sync.StrokeConverter');

const Feature = goog.requireType('ol.Feature');
const MultiPolygon = goog.requireType('ol.geom.MultiPolygon');
const Style = goog.requireType('ol.style.Style');
const VectorContext = goog.requireType('plugin.cesium.VectorContext');


/**
 * Converter for MultiPolygons
 * @extends {StrokeConverter<MultiPolygon>}
 */
class MultiPolygonConverter extends StrokeConverter {
  /**
   * @inheritDoc
   */
  create(feature, geometry, style, context) {
    createMultiPolygon(feature, geometry, style, context);
    return true;
  }
}


/**
 * @param {!Feature} feature
 * @param {!MultiPolygon} multipoly
 * @param {!Style} style
 * @param {!VectorContext} context
 */
const createMultiPolygon = (feature, multipoly, style, context) => {
  const polyFlats = multipoly.getFlatCoordinates();
  const polyEnds = multipoly.getEndss();

  const extrudes = /** @type {Array<boolean>|undefined} */ (multipoly.get('extrude'));
  let offset = 0;

  for (let i = 0, ii = polyEnds.length; i < ii; i++) {
    const ringEnds = polyEnds[i];
    const extrude = extrudes && extrudes.length === polyEnds.length ? extrudes[i] : false;

    createAndAddPolygon(feature, multipoly, style, context, polyFlats, offset,
        ringEnds, extrude, i);

    offset = ringEnds[ringEnds.length - 1];
  }
};


exports = MultiPolygonConverter;
