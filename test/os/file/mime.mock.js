goog.provide('os.file.mime.mock');

goog.require('goog.net.XhrIo');
goog.require('os.net.Request');

os.file.mime.mock.testFiles = function(files, testFunc, len) {
  files.forEach(function(file) {
    var req = new os.net.Request(file);
    req.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
    var buffer = null;

    runs(function() {
      req.getPromise().then(function(resp) {
        buffer = resp;
      });
    });

    waitsFor(function() {
      return !!buffer;
    }, file + ' to load');

    runs(function() {
      // take first chunk
      buffer = buffer.slice(0, Math.min(buffer.byteLength, len || 1024));
      testFunc(buffer, file);
    });
  });
};


os.file.mime.mock.testNo = function(type) {
  return function(buffer) {
    var result = Number.POSITIVE_INFINITY;
    runs(function() {
      os.file.mime.detect(buffer).then(function(val) {
        result = val;
      });
    });

    waitsFor(function() {
      return result !== Number.POSITIVE_INFINITY;
    }, 'promise to conclude');

    runs(function() {
      expect(result).not.toBe(type);
    });
  };
};


os.file.mime.mock.testYes = function(type) {
  return function(buffer, filename) {
    var result = null;
    runs(function() {
      os.file.mime.detect(buffer).then(function(val) {
        result = val;
      });
    });

    waitsFor(function() {
      return !!result;
    }, 'promise to conclude');

    runs(function() {
      expect(result).toBe(type);
    });
  };
};
