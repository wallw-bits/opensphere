goog.provide('os.file.mime.filteraction');

goog.require('os.file.mime.xml');
goog.require('os.im.action.ImportActionManager');

/**
 * @type {string}
 * @const
 */
os.file.mime.filteraction.TYPE = os.file.mime.xml.TYPE + '; subtype=FILTERACTION';

(function() {
  var xmlGroup = os.im.action.ImportActionManager.getInstance().xmlGroup;
  var nsRegExp = new RegExp('/' + xmlGroup, 'i');
  var rootRegExp = new RegExp('^' + xmlGroup + '$', 'i');

  os.file.mime.register(
      os.file.mime.filteraction.TYPE,
      os.file.mime.xml.createDetect(rootRegExp, nsRegExp),
      0, os.file.mime.xml.TYPE);
})();

