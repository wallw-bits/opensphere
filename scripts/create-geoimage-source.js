#!/usr/bin/env node
const fs = require('fs');
const resolver = require('opensphere-build-resolver/utils');

let file = fs.readFileSync(resolver.resolveModulePath('openlayers-ext/lib/source/GeoImage.js', __dirname), 'utf8');

// remove imports
file = file.replace(/\s*import/g, '');

// remove export
file = file.replace(/\*export/g, '');

// fix var constructor definition
file = file.replace(/\var ol_source_GeoImage =/g, 'ol_source_GeoImage =');

// replace import names
file = file.replace(/\ol_source_GeoImage/g, 'olext.source.GeoImage');
file = file.replace(/\ol_source_ImageCanvas/g, 'ol.source.ImageCanvas');
file = file.replace(/\ol_extent/g, 'ol.extent');

// prepend provide/requires
file = `
goog.provide('olext.source.GeoImage');
goog.require('ol.extent');
goog.require('ol.source.ImageCanvas');
` + file;

// add typedef for options
file += '\n\n' +
  '/**\n

fs.writeFileSync('./.build/geoimage.js', file, 'utf8');
