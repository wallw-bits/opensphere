goog.provide('plugin.file.gpx.mime');

goog.require('os.file.mime.xml');

/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {*|undefined}
 */
plugin.file.gpx.mime.isGPX = function(buffer, opt_file, opt_context) {
  if (opt_context && /\/gpx\//i.test(opt_context.rootNS) || /^gpx$/i.test(opt_context.rootTag)) {
    return opt_context;
  }
};

os.file.mime.register('application/gpx+xml', plugin.file.gpx.mime.isGPX, 0, 'text/xml');
