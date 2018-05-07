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
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          expect(os.file.mime.columnmapping.isColumnMapping(buffer, undefined, context)).toBeFalsy();
        });
  });

  it('should detect files that are columnmapping files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/os/file/mime/columnmapping.xml'],
        function(buffer, filename) {
          var context = os.file.mime.text.getText(buffer);
          context = os.file.mime.xml.isXML(buffer, undefined, context);
          var result = os.file.mime.columnmapping.isColumnMapping(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('text/xml; subtype=COLUMNMAPPING');
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, text/xml; subtype=COLUMNMAPPING');
  });
});
