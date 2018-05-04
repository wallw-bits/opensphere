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
    var index = -1;
    var expected = [{
      rootTag: 'one',
      rootNS: 'http://example.com/thing'
    }, {
      rootTag: 'root',
      rootNS: ''
    }, {
      rootTag: 'kml',
      rootNS: 'http://www.opengis.net/kml/2.2'
    }];

    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml',
      '/base/test/plugin/file/kml/kml_test.xml'],
        function(buffer, filename) {
          index++;
          var context = os.file.mime.text.getText(buffer);
          var result = os.file.mime.xml.isXML(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
          for (var key in expected[index]) {
            expect(result[key]).toBe(expected[index][key]);
          }
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('text/xml');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml');
  });
});
