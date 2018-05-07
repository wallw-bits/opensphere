goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('plugin.file.kml.mime');

describe('plugin.file.kml.mime', function() {
  it('should not detect files that are not kml files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml'],
        function(buffer) {
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          expect(plugin.file.kml.mime.isKML(buffer, undefined, context)).toBeFalsy();
        });
  });

  it('should detect files that are kml files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/kml/kml_test.xml'],
        function(buffer, filename) {
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          var result = plugin.file.kml.mime.isKML(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('application/vnd.google-earth.kml+xml');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, application/vnd.google-earth.kml+xml');
  });
});
