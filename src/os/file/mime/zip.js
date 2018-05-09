goog.provide('os.file.mime.zip');

goog.require('goog.Promise');
goog.require('os.file.mime');


/**
 * @const
 * @type {string}
 */
os.file.mime.zip.TYPE = 'application/zip';

/**
 * @const
 * @type {number}
 */
os.file.mime.zip.MAGIC_BYTES_BIG_ENDIAN = 0x504B0304;

/**
 * Tests if an ArrayBuffer holds zip content by looking for the magic number.
 * @param {ArrayBuffer} buffer
 * @return {boolean}
 */
os.file.mime.zip.isZip = function(buffer) {
  if (buffer && buffer.byteLength > 3) {
    var dv = new DataView(buffer.slice(0, 4));
    return os.file.mime.zip.MAGIC_BYTES_BIG_ENDIAN == dv.getUint32(0);
  }
  return false;
};


/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @return {!goog.Promise<Array<zip.Entry>|boolean|undefined>}
 */
os.file.mime.zip.detectZip = function(buffer, opt_file) {
  if (os.file.mime.zip.isZip(buffer)) {
    // this is a zip file, get the entries
    if (window.zip) {
      return new goog.Promise(function(resolve, reject) {
        // if we have a file reference, use that
        var reader = opt_file && opt_file.getFile() ?
            new zip.BlobReader(opt_file.getFile()) :
            new zip.ArrayBufferReader(buffer);

        zip.createReader(reader, function(reader) {
          reader.getEntries(resolve);
        }, function() {
          resolve(true);
        });
      });
    } else {
      return goog.Promise.resolve(true);
    }
  }

  return goog.Promise.resolve();
};

os.file.mime.register(os.file.mime.zip.TYPE, os.file.mime.zip.detectZip);
