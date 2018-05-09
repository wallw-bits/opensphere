goog.provide('os.file.mime.xmlstate');

goog.require('os.file.mime.xml');

/**
 * @const
 * @type {string}
 */
os.file.mime.xmlstate.TYPE = 'text/xml; subtype=STATE';

os.file.mime.register(
    os.file.mime.xmlstate.TYPE,
    os.file.mime.xml.createDetect(/^state$/i, /\/state\//i),
    0, 'text/xml');
