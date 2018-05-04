goog.require('os.file.File');
goog.require('os.file.mime.json');
goog.require('os.file.mime.mock');

describe('os.file.mime.json', function() {
  it('should not detect files that are not json files', function() {
    os.file.mime.mock.testFiles([
      '/base/test/plugin/file/kml/kml_test.xml',
      '/base/test/resources/bin/rand.bin',
      '/base/test/resources/json/ERROR_invalid_field.json',
      '/base/test/resources/json/ERROR_invalid_field2.json',
      '/base/test/resources/json/ERROR_invalid_value.json',
      '/base/test/resources/json/ERROR_invalid_value2.json',
      '/base/test/resources/json/ERROR_trailing_comma.json'],
        function(buffer) {
          var context = os.file.mime.text.getText(buffer);
          expect(os.file.mime.json.isJSON(buffer, undefined, context)).toBe(undefined);
        });
  });

  it('should detect files that are json files', function() {
    var index = -1;
    var expected = [{
      'string': 'string',
      'number': 123,
      'boolean': true,
      'null': null
    }, {
      'field': [1, 2]
    }, {
      'field': 'There once was a'
    }, {
      'field': undefined
    }, {
      'field': undefined
    }];

    os.file.mime.mock.testFiles([
      '/base/test/resources/json/partial_object.json',
      '/base/test/resources/json/partial_array.json',
      '/base/test/resources/json/partial_string.json',
      '/base/test/resources/json/partial_number.json',
      '/base/test/resources/json/partial_null.json'],
        function(buffer, filename) {
          index++;
          var context = os.file.mime.text.getText(buffer);
          var result = os.file.mime.json.isJSON(buffer, undefined, context);

          if (!result) {
            console.log(filename, 'failed!');
          }

          expect(result).toBeTruthy();
          for (var key in expected[index]) {
            expect(result[key]).toEqual(expected[index][key]);
          }
        });
  });

  it('should register itself with mime detection', function() {
    var chain = os.file.mime.mock.getTypeChain('application/json');
    expect(chain).toBe('application/octet-stream, text/plain, application/json');
  });
});
