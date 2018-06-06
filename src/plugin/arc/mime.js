goog.provide('plugin.arc.mime');

goog.require('os.file.mime');
goog.require('os.file.mime.xml');
goog.require('plugin.arc');


/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File} file
 * @param {*=} opt_context
 * @return {!goog.Promise<*|undefined>}
 */
plugin.arc.mime.detectArc = function(buffer, file, opt_context) {
  return /** @type {!goog.Promise<*|undefined>} */ (goog.Promise.resolve((opt_context &&
    plugin.arc.CONTENT_REGEXP.test(/** @type {os.file.mime.xml.Context} */ (opt_context.content))) ||
    (file && file.getUrl() && plugin.arc.URI_REGEXP.test(file.getUrl()))));
};


os.file.mime.register(plugin.arc.ID, plugin.arc.mime.detectArc, 0, os.file.mime.xml.TYPE);
