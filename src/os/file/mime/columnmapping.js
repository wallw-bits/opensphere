goog.provide('os.file.mime.columnmapping');

goog.require('os.file.mime.xml');

/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {*|undefined}
 */
os.file.mime.columnmapping.isColumnMapping = function(buffer, opt_file, opt_context) {
  if (opt_context && /\/columnmappings\//i.test(opt_context.rootNS) || /^columnmappings/i.test(opt_context.rootTag)) {
    return opt_context;
  }
};

os.file.mime.register('text/xml; subtype=COLUMNMAPPING', os.file.mime.columnmapping.iscolumnmapping, 0, 'text/xml');
