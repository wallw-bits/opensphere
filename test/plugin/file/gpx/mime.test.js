goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('plugin.file.gpx.mime');

describe('plugin.file.gpx.mime', function() {
  it('should not detect files that are not gpx files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml',
      '/base/test/plugin/file/kml/kml_test.xml'],
        function(buffer) {
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          expect(plugin.file.gpx.mime.isGPX(buffer, undefined, context)).toBeFalsy();
        });
  });

  it('should detect files that are gpx files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/gpx/sample.gpx'],
        function(buffer, filename) {
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          var result = plugin.file.gpx.mime.isGPX(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('application/gpx+xml');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, application/gpx+xml');
  });
});
