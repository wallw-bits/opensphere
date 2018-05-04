goog.provide('os.file.mime.xml');

goog.require('os.file.mime.text');


/**
 * @enum {string}
 */
os.file.mime.xml.Types = {
  OPEN_TAG: 'open-tag',
  ATTRIBUTE_NAME: 'attribute-name',
  ATTRIBUTE_VALUE: 'attribute-value'
};


/**
 * @param {ArrayBuffer} buffer
 * @param {os.file.File=} opt_file
 * @param {*=} opt_context
 * @return {{content: string, rootNS: string, rootTag: string}|undefined}
 */
os.file.mime.xml.isXML = function(buffer, opt_file, opt_context) {
  var retVal;

  if (opt_context && goog.isString(opt_context)) {
    var lexer = xmlLexer.create();

    // I know this looks async. Technically it is, but because we synchronously send the
    // data to the lexer, the events fire in a synchronous manner.

    var expectedTypes = [os.file.mime.xml.Types.OPEN_TAG];

    var namespaceKey = '';
    var namespaceIncoming = false;

    var listener = function(data) {
      if (expectedTypes.indexOf(data.type) > -1) {
        if (data.type === os.file.mime.xml.Types.OPEN_TAG) {
          if (retVal) {
            // we're past the root tag so just stop
            lexer.off('data', listener);
          } else {
            var colon = data.value.indexOf(':');
            var tag = data.value;

            if (colon > -1) {
              namespaceKey = ':' + data.value.substring(0, colon);
              tag = data.value.substring(colon + 1);
            }

            retVal = {
              content: opt_context,
              rootTag: tag,
              rootNS: '',
              checkTag: data.value
            };
          }

          expectedTypes.push(os.file.mime.xml.Types.ATTRIBUTE_NAME);
        } else if (data.type === os.file.mime.xml.Types.ATTRIBUTE_NAME) {
          expectedTypes.pop();

          if (data.value === 'xmlns' + namespaceKey) {
            namespaceIncoming = true;
          }

          expectedTypes.push(os.file.mime.xml.Types.ATTRIBUTE_VALUE);
        } else if (data.type === os.file.mime.xml.Types.ATTRIBUTE_VALUE) {
          expectedTypes.pop();

          if (namespaceIncoming) {
            retVal.rootNS = data.value;
          }

          namespaceIncoming = false;
          expectedTypes.push(os.file.mime.xml.Types.ATTRIBUTE_NAME);
        }
      } else {
        // malformed nonsense
        retVal = undefined;
      }
    };

    lexer.on('data', listener);

    // the lexer doesn't handle comments, so don't send it any
    // the . doesn't match \n, \r, \u2028, or \u2029, so use [^] instead
    var noComments = opt_context.replace(/\s*<!--[^]*?(-->|$)\s*/g, '');
    lexer.write(noComments);

    if (retVal) {
      // The lexer is a little loose with the term "XML", so we'll validate the results.
      // Basically, if the file STARTS with XML, we'll call it XML. Anything else is just
      // something else (like markdown or txt or - god forbid - json) with XML inside it.
      var rootTagIndex = noComments.indexOf('<' + retVal.checkTag);
      if (rootTagIndex > -1) {
        var checkStr = noComments.substring(0, rootTagIndex);
        // ditch the xml header
        checkStr = checkStr.replace(/^\s*<\?xml .*?\?>\s*/g, '');
        // ditch any <!> headers such as <!DOCTYPE...>
        checkStr = checkStr.replace(/^\s*<!.*?>\s*/g, '').trim();
        if (checkStr) {
          // there was non-comment data before the root node
          retVal = undefined;
        }
      } else {
        // couldn't find resulting tag in string, this shouldn't ever actually occur
        retVal = undefined;
      }
    }
  }

  return retVal;
};

os.file.mime.register('text/xml', os.file.mime.xml.isXML, 0, 'text/plain');
