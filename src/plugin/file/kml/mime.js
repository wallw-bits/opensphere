goog.provide('plugin.file.kml.mime');

goog.require('os.file.mime.xml');

/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {*|undefined}
 */
plugin.file.kml.mime.isKML = function(buffer, opt_file, opt_context) {
  if (opt_context && /\/kml\//i.test(opt_context.rootNS) || /^(document|folder|kml)$/i.test(opt_context.rootTag)) {
    return opt_context;
  }
};

os.file.mime.register('application/vnd.google-earth.kml+xml', plugin.file.kml.mime.isKML, 0, 'text/xml');
