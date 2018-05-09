goog.provide('os.file.mime.filter');

goog.require('os.file.mime.xml');

/**
 * @const
 * @type {string}
 */
os.file.mime.filter.TYPE = 'text/xml; subtype=FILTER';

os.file.mime.register(
    os.file.mime.filter.TYPE,
    os.file.mime.xml.createDetect(/^filters$/i, /\/filters\//i),
    0, 'text/xml');
