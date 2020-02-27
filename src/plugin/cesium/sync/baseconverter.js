goog.module('plugin.cesium.sync.BaseConverter');

const {getPrimitive, deletePrimitive} = goog.require('plugin.cesium.primitive');

const IConverter = goog.requireType('plugin.cesium.sync.IConverter');
const Geometry = goog.requireType('ol.geom.Geometry');


/**
 * @abstract
 * @implements {IConverter<GeomType>}
 * @template {!Geometry} GeomType
 */
class BaseConverter {}


/**
 * @inheritDoc
 */
BaseConverter.prototype.retrieve = getPrimitive;

/**
 * @inheritDoc
 */
BaseConverter.prototype.delete = deletePrimitive;

exports = BaseConverter;
