goog.module('os.interaction.Modify');
goog.module.declareLegacyNamespace();

const Circle = goog.require('ol.style.Circle');
const Feature = goog.require('ol.Feature');
const Fill = goog.require('ol.style.Fill');
const I3DSupport = goog.require('os.I3DSupport');
const KeyCodes = goog.require('goog.events.KeyCodes');
const KeyHandler = goog.require('goog.events.KeyHandler');
const OLModify = goog.require('ol.interaction.Modify');
const PayloadEvent = goog.require('os.events.PayloadEvent');
const Point = goog.require('ol.geom.Point');
const RecordField = goog.require('os.data.RecordField');
const Stroke = goog.require('ol.style.Stroke');
const Style = goog.require('ol.style.Style');
const osImplements = goog.require('os.implements');
const {MODAL_SELECTOR} = goog.require('os.ui');
const {ModifyEventType} = goog.require('os.interaction');
const {notifyStyleChange} = goog.require('os.style');
const osWindow = goog.require('os.ui.window');
const windowSelector = goog.require('os.ui.windowSelector');

const KeyEvent = goog.requireType('goog.events.KeyEvent');
const OSMap = goog.requireType('os.Map');


/**
 * Allows the user to modify geometries on the map directly.
 *
 * @implements {I3DSupport}
 */
class Modify extends OLModify {
  /**
   * Constructor.
   * @param {olx.interaction.ModifyOptions=} opt_options Options.
   *
   * @suppress {accessControls}
   */
  constructor(opt_options) {
    const options = opt_options || {};

    super(options);

    /**
     * @type {KeyHandler}
     * @protected
     */
    this.keyHandler = new KeyHandler(document, true);

    this.keyHandler.listen(KeyHandler.EventType.KEY, this.handleKeyEvent, true, this);

    // jank alert: the functions that are called when the interaction starts and ends are hard to override, so instead
    // listen to our own events and toggle the map movement on and off
    ol.events.listen(this, ol.interaction.ModifyEventType.MODIFYSTART, this.handleStart, this);
    ol.events.listen(this, ol.interaction.ModifyEventType.MODIFYEND, this.handleEnd, this);

    // use the drawing layer as the overlay layer so that geometries are synced to WebGL automatically
    this.overlay_ = os.map.mapContainer.getDrawingLayer();

    this.showControls();
  }

  /**
   * @inheritDoc
   */
  disposeInternal() {
    goog.dispose(this.keyHandler);

    ol.events.unlisten(this, ol.interaction.ModifyEventType.MODIFYSTART, this.handleStart, this);
    ol.events.unlisten(this, ol.interaction.ModifyEventType.MODIFYEND, this.handleEnd, this);

    this.removeControls();
  }

  /**
   * @inheritDoc
   */
  is3DSupported() {
    return true;
  }

  /**
   * Handles modify start events by disabling map movement.
   * @param {OLModify.Event} event The event.
   * @protected
   */
  handleStart(event) {
    /** @type {OSMap} */ (this.getMap()).toggleMovement(false);
  }

  /**
   * Handles modify end events by enabling map movement.
   * @param {OLModify.Event} event The event.
   * @protected
   */
  handleEnd(event) {
    /** @type {OSMap} */ (this.getMap()).toggleMovement(true);
  }

  /**
   * Handles keydown events for stopping the interaction.
   * @param {KeyEvent} event The key event.
   * @protected
   *
   * @suppress {accessControls}
   */
  handleKeyEvent(event) {
    if (!document.querySelector(MODAL_SELECTOR)) {
      switch (event.keyCode) {
        case KeyCodes.ESC:
          this.dispatchEvent(new PayloadEvent(ModifyEventType.CANCEL, this.features_));
          this.setActive(false);
          break;
        case KeyCodes.ENTER:
          this.dispatchEvent(new PayloadEvent(ModifyEventType.COMPLETE, this.features_));
          this.setActive(false);
          break;
        default:
          break;
      }

      notifyStyleChange(this.overlay_, [this.features_.getArray()[0]]);
    }
  }

  /**
   * Shows control information for this interaction.
   */
  showControls() {
    const injector = angular.element(windowSelector.CONTAINER).injector();
    const scope = injector.get('$rootScope').$new();
    const controls = [
      {
        'text': 'Remove Vertex',
        'keys': [KeyCodes.ALT, '+'],
        'other': [os.ui.help.Controls.MOUSE.LEFT_MOUSE]
      },
      {
        'text': 'Save Changes',
        'keys': [KeyCodes.ENTER]
      },
      {
        'text': 'Cancel',
        'keys': [KeyCodes.ESC]
      }
    ];

    const scopeOptions = {
      'controls': controls
    };

    const windowOptions = {
      'id': WIN_ID,
      'label': 'Modify Geometry Controls',
      'x': 'center',
      'y': 1100,
      'width': 290,
      'height': 'auto',
      'show-close': true
    };

    const template = '<controlblock class="u-bg-body-offset" controls="controls"></controlblock>';
    osWindow.create(windowOptions, template, undefined, scope, undefined, scopeOptions);
  }

  /**
   * Remove the controls element.
   */
  removeControls() {
    const win = osWindow.getById(WIN_ID);
    osWindow.close(win);
  }

  /**
   * @inheritDoc
   *
   * @suppress {accessControls}
   */
  createOrUpdateVertexFeature_(coordinates) {
    let feature = this.vertexFeature_;
    if (!feature) {
      feature = new Feature(new Point(coordinates));
      feature.set(RecordField.DRAWING_LAYER_NODE, false);
      feature.setStyle(VERTEX_STYLE);

      this.vertexFeature_ = feature;
      os.map.mapContainer.addFeature(feature);
    } else {
      var geometry = /** @type {Point} */ (feature.getGeometry());
      geometry.setCoordinates(coordinates);
      feature.changed();
    }

    notifyStyleChange(this.overlay_, [feature]);

    return feature;
  }
}


/**
 * Style for the feature being modified.
 * @type {Array<Style>}
 * @const
 */
Modify.STYLE = [
  new Style({
    stroke: new Stroke({
      color: [0, 153, 255, 1],
      width: 3
    }),
    image: new Circle({
      radius: 6,
      fill: new Fill({
        color: [0, 153, 255, 1]
      }),
      stroke: new Stroke({
        color: [255, 255, 255, 1],
        width: 2
      })
    }),
    zIndex: Infinity
  })
];


/**
 * Style for the vertex feature.
 * @type {Array<Style>}
 * @const
 */
const VERTEX_STYLE = [
  new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({
        color: [0, 153, 255, 1]
      }),
      stroke: new Stroke({
        color: [255, 255, 255, 1],
        width: 2
      })
    }),
    zIndex: Infinity
  })
];


/**
 * ID for the control window.
 * @type {string}
 * @const
 */
const WIN_ID = 'modifyControls';

osImplements(Modify, I3DSupport.ID);

exports = Modify;
