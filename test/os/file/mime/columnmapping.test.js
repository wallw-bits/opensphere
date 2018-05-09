goog.require('os.file.File');
goog.require('os.file.mime.columnmapping');
goog.require('os.file.mime.mock');

describe('os.file.mime.columnmapping', function() {
  it('should not detect files that are not columnmapping files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml',
      '/base/test/os/ui/filter/parse/state.xml'],
        function(buffer) {
          var result = os.file.mime.detect(buffer);
          expect(result).not.toBe(os.file.mime.columnmapping.TYPE);
        });
  });

  it('should detect files that are columnmapping files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/os/file/mime/columnmapping.xml'],
        function(buffer, filename) {
          var result = os.file.mime.detect(buffer);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBe(os.file.mime.columnmapping.TYPE);
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain(os.file.mime.columnmapping.TYPE);
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, text/xml; subtype=COLUMNMAPPING');
  });
});
