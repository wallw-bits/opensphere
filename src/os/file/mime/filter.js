goog.provide('os.file.mime.filter');

goog.require('os.file.mime.xml');

/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {boolean|undefined}
 */
os.file.mime.filter.isFilter = function(buffer, opt_file, opt_context) {
  if (opt_context && /\/filters\//i.test(opt_context.rootNS) || /^filters/i.test(opt_context.rootTag)) {
    return opt_context;
  }
};

os.file.mime.register('text/xml; subtype=FILTER', os.file.mime.filter.isFilter, 0, 'text/xml');
