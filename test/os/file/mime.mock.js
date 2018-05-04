goog.provide('os.file.mime.mock');

goog.require('goog.net.XhrIo');
goog.require('os.net.Request');

os.file.mime.mock.testFiles = function(files, testFunc) {
  files.forEach(function(file) {
    var req = new os.net.Request(file);
    req.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
    var buffer = null;

    runs(function() {
      req.getPromise().then(function(resp) {
        buffer = resp;
      });
    });

    waitsFor(function() {
      return !!buffer;
    }, 'file to load');

    runs(function() {
      // take first chunk
      buffer = buffer.slice(0, Math.min(buffer.byteLength, 1024));
      testFunc(buffer, file);
    });
  });
};


os.file.mime.mock.getTypeChain = function(type, opt_node, opt_chain) {
  opt_node = opt_node || os.file.mime.root_;
  opt_chain = opt_chain || [];

  opt_chain.push(opt_node.type);

  if (type === opt_node.type) {
    return opt_chain.join(', ');
  } else if (opt_node.children) {
    for (var i = 0, n = opt_node.children.length; i < n; i++) {
      var retVal = os.file.mime.mock.getTypeChain(type, opt_node.children[i], opt_chain);
      if (retVal) {
        return retVal;
      }
    }
  }

  opt_chain.pop();
};
