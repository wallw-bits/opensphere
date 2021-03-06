/**
 * smallest native js domready ever
 */
function ready() {
  if (/in/.test(document.readyState)) {
    setTimeout(ready, 9);
  } else {
    populateCheckInfo();
    setContactInfo();
  }
}


/**
 * Appends test results to DOM
 * @param {element} el
 * @param {string} msg
 * @param {boolean} test
 * @return {boolean}
 */
function append(el, msg, test) {
  var li = document.createElement('li');
  if (typeof (platform) != 'undefined' && platform.name == 'IE' && parseFloat(platform.version) < 8) {
    li.innerHTML = (test ? '/' : 'X') + ' ' + msg;
  } else {
    li.innerHTML = msg;
    li.className = test ? 'found' : 'missing';
  }
  el.appendChild(li);
  return test;
}


/**
 * runs the browser check
 */
function runBrowserCheck() {
  var baseUrl = 'old.html';
  var currentLocation = window.location.toString();
  if (!checkCompat()) {
    if (currentLocation.indexOf('/' + baseUrl) == -1) {
      // old.html is in the version directory, so prepend if we have a version string
      // version string will be replaced by the build. if not, clear it out so it doesn't affect the target url.
      var version = '@version@'.replace(/@\w+@/, '');
      window.location = version && currentLocation.indexOf(version) == -1 ? (version + baseUrl) : baseUrl;
    } else {
      ready();
    }
  } else if (currentLocation.indexOf('/' + baseUrl) != -1) {
    ready();
  }
}


/**
 * removes test results and reruns browser check
 * @param {boolean} doSpin
 */
function populateCheckInfo(doSpin) {
  showBrowserWaitSpin(false);
  var el = document.getElementById('fullList');
  var html = document.getElementsByTagName('html')[0];
  if (el && html) {
    var result = getModernizrValues();
    el.innerHTML = result != '' ? result : 'no capabilities found';
    toggleFullList(true);
  }
  var ul = document.getElementById('checks');
  if (ul) { // do each check and add the result
    append(ul, 'Canvas render - draws graphics like the map', typeof (Modernizr) != 'undefined' && Modernizr.canvas);
    append(ul, 'Local storage - stores settings & caches images',
        typeof (Modernizr) != 'undefined' && Modernizr.localstorage);
    append(ul, 'svg render - draws 2D vectors like the legend and timeline',
        typeof (Modernizr) != 'undefined' && Modernizr.svg);
    append(ul, 'webworkers - allows tasks to run in the background',
        typeof (Modernizr) != 'undefined' && Modernizr.webworkers);
    append(ul, 'indexedDB - allows data to be stored in local browser database',
        typeof (Modernizr) != 'undefined' && Modernizr.indexeddb);
    append(ul, 'flexbox - used for layout and making things pretty',
        typeof (Modernizr) != 'undefined' && Modernizr.flexbox);
  }
  var result = document.getElementById('report');
  if (result) {
    var report = 'Unsupported Browser!';
    if (checkCompat()) {
      if (checkVersion()) {
        report = 'Supported Browser!';
      } else {
        report = 'Compatible Browser!';
      }
    }
    result.innerHTML = report;
  }
}


/**
 * checks compatibility
 * @return {boolean}
 */
function checkCompat() {
  return typeof (Modernizr) != 'undefined' && Modernizr.canvas && Modernizr.localstorage && Modernizr.svg &&
      Modernizr.webworkers && Modernizr.flexbox;
}


/**
 * checks minimum version
 * @return {boolean}
 */
function checkVersion() {
  return typeof (platform) != 'undefined' && ((platform.name == 'Chrome' && parseFloat(platform.version) >= 29) ||
      (platform.name == 'Firefox' && parseFloat(platform.version) >= 28));
}


/**
 * removes test results and reruns browser check
 * @return {string}
 */
function getModernizrValues() {
  var result = '';
  for (var key in Modernizr) {
    if (key.indexOf('_') === 0 ||
        typeof Modernizr[key] === 'function' ||
        typeof Modernizr[key] === 'object') {
      continue;
    }
    result += key + ':' + Modernizr[key] + '\n';
  }
  return result;
}

/**
 * extracts all info from config
 * @return {string}
 */
function getConfig() {
  var request = new XMLHttpRequest();
  var parsed;

  request.open('GET', 'config/settings.json', false);
  request.onload = function() {
    if (request.readyState === 4 && request.status === 200) {
      parsed = JSON.parse(request.responseText);
    }
  };
  request.send(null);
  return parsed;
}

/**
 * extracts contact info from config and put it in the DOM
 */
function setContactInfo() {
  var parsed = getConfig();
  if (parsed) {
    var contactEl = document.getElementById('contactInfo');
    if (parsed && parsed['admin'] && contactEl) {
      var secphone = parsed['admin']['supportPhone'];
      var email = parsed['admin']['supportContact'];
      if (secphone || email) {
        var strong = document.createElement('strong');
        strong.innerHTML = 'Support';
        contactEl.appendChild(strong);
        contactEl.appendChild(document.createElement('br'));
      }
      if (secphone) {
        var i = document.createElement('i');
        i.className = 'fa fa-phone';
        var span = document.createElement('span');
        span.innerHTML = ' ' + secphone;
        i.appendChild(span);
        contactEl.appendChild(i);
        contactEl.appendChild(document.createElement('br'));
      }
      if (email) {
        var i = document.createElement('i');
        i.className = 'fa fa-envelope-o';
        contactEl.appendChild(i);
        var a = document.createElement('a');
        a.setAttribute('href', 'mailto:' + email);
        a.innerHTML = ' ' + email;
        contactEl.appendChild(a);
        contactEl.appendChild(document.createElement('br'));
      }
    }

    var browserPage = parsed['admin']['browserPage'];
  }

  var minSupportInfo = '<strong>Minimum supported browsers:</strong>' +
          '<ul>' +
          '<li>Google Chrome version 29</li>' +
          '<li>Mozilla Firefox version 28</li>' +
          '</ul>' +
          '<p>If you do not have one of these browsers installed, contact your local IT department for help.</p>' +
          '<a href="' + browserPage + '" class="btn btn-danger">Browser Download</a> <br> <br>';

  if (!checkCompat()) {
    if (checkVersion()) {
      setWarn('Your browser has been configured to disable features required by this application.',
          'Please enable those features or contact your IT department for support.');
    } else {
      setWarn(minSupportInfo);
    }
  } else {
    if (checkVersion()) {
      setWarn('');
    } else {
      setWarn(minSupportInfo);
    }
  }
  var browserInfo = document.getElementById('browserInfo');
  if (browserInfo && typeof (platform) != 'undefined') {
    browserInfo.innerHTML = platform.name + ' Version ' + platform.version + ' detected';
  }
}


/**
 * updates the warning message
 * @param {string} msg1
 * @param {string=} opt_msg2
 */
function setWarn(msg1, opt_msg2) {
  var minBrowserEl = document.getElementById('minBrowserMsg');
  if (minBrowserEl) {
    while (minBrowserEl.hasChildNodes()) {
      minBrowserEl.removeChild(minBrowserEl.firstChild);
    }
    if (opt_msg2) {
      var p = document.createElement('p');
      p.innerHTML = msg1;
      var p2 = document.createElement('p');
      p2.innerHTML = opt_msg2;
      minBrowserEl.appendChild(p);
      minBrowserEl.appendChild(p2);
    } else {
      minBrowserEl.innerHTML = msg1;
    }
  }
}


/**
 * removes test results and reruns browser check
 * @param {boolean} doSpin
 */
function showBrowserWaitSpin(doSpin) {
  var spin = document.getElementById('browerCheckWait');
  if (spin) {
    spin.style.display = doSpin ? '' : 'none';
  }
}


/**
 * redirects to previous page
 */
function refresh() {
  window.history.back();
}


/**
 * removes test results and reruns browser check
 */
function retryBrowserCheck() {
  var ul = document.getElementById('checks');
  if (ul) {
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
    }
  }
  showBrowserWaitSpin(true);
  var result = document.getElementById('report');
  if (result) {
    result.innerHTML = '';
  }
  window.setTimeout(populateCheckInfo, 500);
}


/**
 * toggles full list of detected capabilities
 * @param {boolean=} opt_hide
 */
function toggleFullList(opt_hide) {
  var el = document.getElementById('fullList');
  if (el) {
    el.style.display = opt_hide ? 'none' : el.style.display == 'none' ? '' : 'none';
  }
}

runBrowserCheck();
