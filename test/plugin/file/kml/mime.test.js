goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('plugin.file.kml.mime');

describe('plugin.file.kml.mime', function() {
  it('should not detect files that are not kml files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml'],
        function(buffer) {
          var result = os.file.mime.detect(buffer);
          expect(result).not.toBe('application/vnd.google-earth.kml+xml');
        });
  });

  it('should detect files that are kml files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/kml/kml_test.xml'],
        function(buffer, filename) {
          var result = os.file.mime.detect(buffer);
          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBe('application/vnd.google-earth.kml+xml');
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('application/vnd.google-earth.kml+xml');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, application/vnd.google-earth.kml+xml');
  });
});
