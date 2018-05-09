goog.require('os.file.File');
goog.require('os.file.mime.filter');
goog.require('os.file.mime.mock');

describe('os.file.mime.filter', function() {
  it('should not detect files that are not filter files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/xml/namespaced-root-partial.xml',
      '/base/test/resources/xml/comment-with-embedded-xml.xml',
      '/base/test/os/ui/filter/parse/state.xml'],
        function(buffer) {
          var result = os.file.mime.detect(buffer);
          expect(result).not.toBe(os.file.mime.filter.TYPE);
        });
  });

  it('should detect files that are filter files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/os/ui/filter/parse/filters.xml'],
        function(buffer, filename) {
          var result = os.file.mime.detect(buffer);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBe(os.file.mime.filter.TYPE);
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain(os.file.mime.filter.TYPE);
    expect(chain).toBe('application/octet-stream, text/plain, text/xml, text/xml; subtype=FILTER');
  });
});
