goog.provide('plugin.file.kml.mime');

goog.require('os.file.mime.xml');

/**
 * @const
 * @type {string}
 */
plugin.file.kml.mime.TYPE = 'application/vnd.google-earth.kml+xml';

os.file.mime.register(
    plugin.file.kml.mime.TYPE,
    os.file.mime.xml.createDetect(/^(document|folder|kml)$/i, /\/kml\//i),
    0, 'text/xml');
