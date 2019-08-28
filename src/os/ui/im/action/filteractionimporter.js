goog.provide('os.ui.im.action.FilterActionImporter');

goog.require('os.color');
goog.require('os.filter.im.OSFilterImporter');
goog.require('os.implements');
goog.require('os.layer.ILayer');


/**
 * @param {os.parse.IParser<T>} parser The parser.
 * @param {string=} opt_layerId The layer id.
 * @extends {os.filter.im.OSFilterImporter}
 * @constructor
 * @template T
 */
os.ui.im.action.FilterActionImporter = function(parser, opt_layerId) {
  os.ui.im.action.FilterActionImporter.base(this, 'constructor', parser, opt_layerId);
};
goog.inherits(os.ui.im.action.FilterActionImporter, os.filter.im.OSFilterImporter);


/**
 * @inheritDoc
 */
os.ui.im.action.FilterActionImporter.prototype.getFilterModel = function(
    title, filter, tooltip, opt_type, opt_match) {
  var children = filter.getChildren();
  var childModels;
  if (children) {
    childModels = [];
    children.forEach(function(child) {
      var model = this.getFilterModel(child.getTitle(), child, this.getFilterTooltip(child), opt_type);
      childModels.push(model);
    }, this);
  }

  return {
    'title': title,
    'filter': filter,
    'tooltip': tooltip,
    'type': opt_type,
    'matches': opt_match,
    'children': childModels
  };
};


/**
 * @inheritDoc
 */
os.ui.im.action.FilterActionImporter.prototype.getFilterTooltip = function(entry) {
  var tooltip = 'Filter: ' + os.ui.filter.toFilterString(entry.getFilterNode(), 1000);

  if (entry instanceof os.im.action.FilterActionEntry && entry.actions.length > 0) {
    var actionText = entry.actions.map(function(action) {
      return action.getLabel();
    }).join(', ') || 'None';

    tooltip += '\nActions: ' + actionText;
  }

  return tooltip;
};
