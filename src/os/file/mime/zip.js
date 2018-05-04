goog.provide('os.file.mime.zip');

goog.require('os.file.mime');


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


os.file.mime.register('application/zip', os.file.mime.zip.isZip);
