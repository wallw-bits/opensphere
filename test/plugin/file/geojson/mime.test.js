goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('plugin.file.geojson.mime');

describe('os.file.mime.json', function() {
  it('should not detect files that are not json files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/kml/kml_test.xml',
      '/base/test/resources/bin/rand.bin',
      '/base/test/resources/json/partial_object.json'],
        function(buffer) {
          expect(os.file.mime.detect(buffer)).not.toBe(plugin.file.geojson.mime.TYPE);
        });
  });

  it('should detect files that are json files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/geojson/10k.json'],
        function(buffer, filename) {
          expect(os.file.mime.detect(buffer)).toBe(plugin.file.geojson.mime.TYPE);
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain(plugin.file.geojson.mime.TYPE);
    expect(chain).toBe('application/octet-stream, text/plain, application/json, application/vnd.geo+json');
  });
});
