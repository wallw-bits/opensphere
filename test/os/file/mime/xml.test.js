goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('os.file.mime.xml');

describe('os.file.mime.xml', function() {
  it('should not detect files that are not xml files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/geojson/10k.json',
      '/base/test/resources/bin/rand.bin',
      '/base/test/resources/xml/ERROR_text-before-root.xml'],
        function(buffer) {
          var context = os.file.mime.text.getText(buffer);
          expect(os.file.mime.xml.isXML(buffer, undefined, context)).toBeFalsy();
        });
  });

  it('should detect files that are xml files', function() {
    var expected = {
      '/base/test/resources/xml/namespaced-root-partial.xml': {
        rootTag: 'one',
        rootNS: 'http://example.com/thing'
      },
      '/base/test/resources/xml/comment-with-embedded-xml.xml': {
        rootTag: 'root',
        rootNS: ''
      },
      '/base/test/plugin/file/kml/kml_test.xml': {
        rootTag: 'kml',
        rootNS: 'http://www.opengis.net/kml/2.2'
      }
    };

    os.file.mime.mock.testFiles(Object.keys(expected),
        function(buffer, filename) {
          var eVal = expected[filename];
          var context = os.file.mime.text.getText(buffer);
          var result = os.file.mime.xml.isXML(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
          for (var key in eVal) {
            expect(result[key]).toBe(eVal[key]);
          }
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('text/xml');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml');
  });
});
