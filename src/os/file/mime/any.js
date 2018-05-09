goog.provide('os.file.mime.any');

goog.require('os.file.mime');


/**
 * @const
 * @type {string}
 */
os.file.mime.any.TYPE = '*/*';


/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {*|undefined}
 */
os.file.mime.any.isSomething = function(buffer, opt_file, opt_context) {
  return !!(buffer && buffer.length);
};

os.file.mime.register(os.file.mime.any.TYPE, os.file.mime.any.isSomething, 10000);
