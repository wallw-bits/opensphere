goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('os.file.mime.zip');

describe('os.file.mime.zip', function() {
  it('should not detect files that are not zip files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/kml/kml_test.xml',
      '/base/test/plugin/file/geojson/10k.json',
      '/base/test/resources/bin/rand.bin'],
        function(buffer) {
          expect(os.file.mime.zip.isZip(buffer)).toBeFalsy();
        });
  });

  it('should detect files that are zip files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/zip/test.zip',
      '/base/test/resources/zip/test.kmz'],
        function(buffer) {
          var result = null;
          runs(function() {
            os.file.mime.zip.detectZip(buffer).then(function(val) {
              result = val;
            });
          });

          waitsFor(function() {
            return !!result;
          }, 'promise to conclude');

          runs(function() {
            expect(result).toBeTruthy();
          });
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain(os.file.mime.zip.TYPE);
    expect(chain).toBe('application/octet-stream, application/zip');
  });
});
