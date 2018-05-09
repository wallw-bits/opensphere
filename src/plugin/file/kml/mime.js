goog.provide('plugin.file.kml.mime');

goog.require('os.file.mime.xml');

os.file.mime.register(
    'application/vnd.google-earth.kml+xml',
    os.file.mime.xml.createDetect(/^(document|folder|kml)$/i, /\/kml\//i),
    0, 'text/xml');
