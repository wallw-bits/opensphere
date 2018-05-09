goog.require('os.file.File');
goog.require('os.file.mime.mock');
goog.require('os.file.mime.pdf');

describe('os.file.mime.pdf', function() {
  it('should not detect files that are not pdf files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/zip/test.zip',
      '/base/test/resources/zip/test.kmz'],
        function(buffer) {
          expect(os.file.mime.pdf.isPDF(buffer)).toBeFalsy();
        });
  });

  it('should detect files that are pdf files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/resources/pdf/test.pdf'],
        function(buffer) {
          expect(os.file.mime.pdf.isPDF(buffer)).toBeTruthy();
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain(os.file.mime.pdf.TYPE);
    expect(chain).toBe('application/octet-stream, ' + os.file.mime.pdf.TYPE);
  });
});
