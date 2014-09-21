***REMOVED***
***REMOVED*** @fileoverview VML base class providing enumerations and static functions
***REMOVED***     for the VML sub-classes.
***REMOVED***

goog.provide('xrx.vml');



goog.require('xrx');
goog.require('xrx.svg');



***REMOVED***
***REMOVED*** VML base class providing enumerations and static functions
***REMOVED*** for the VML sub-classes.
***REMOVED***
***REMOVED***
xrx.vml = function() {***REMOVED***



***REMOVED***
***REMOVED*** Returns whether VML rendering is supported by the current user agent.
***REMOVED*** Since VML rendering uses the Raphael library, browsers with a SVG
***REMOVED*** rendering engine are supported as well.
***REMOVED*** @return {boolean} Whether VML rendering is supported.
***REMOVED***
xrx.vml.isSupported = function() {
  return !!document.namespaces || xrx.svg.isSupported();
***REMOVED***



***REMOVED***
***REMOVED*** Sets the coordinates for various VML elements such as polygons using
***REMOVED*** the Raphael library.
***REMOVED*** @param {Object} raphael The Raphael object.
***REMOVED*** @param {Array.<Array.<number>>} points Array of coordinates.
***REMOVED***
xrx.vml.setCoords = function(raphael, coordinates, closePath) {
  var s = 'M' + coordinates[0][0].toString() + ' ' + coordinates[0][1].toString();
  for(var i = 1, len = coordinates.length; i < len; i++) {
    s += 'L' + coordinates[i][0].toString() + ' ' + coordinates[i][1].toString();
  }
  if (closePath) s += 'Z';
  raphael.attr({'path': s});
***REMOVED***



***REMOVED***
***REMOVED*** Re-renders a VML canvas according to a transformation matrix using the Raphael
***REMOVED*** library.
***REMOVED*** @param {Raphael} raphael The Raphael canvas to be transformed and rendered.
***REMOVED*** @param {goog.math.AffineTransform} affineTransform Transformation matrix to
***REMOVED***     be applied.
***REMOVED***
xrx.vml.render = function(raphael, affineTransform) {
  raphael.forEach(function(el) {
    el.transform(['m', affineTransform.m00_, affineTransform.m10_, affineTransform.m01_,
        affineTransform.m11_, affineTransform.m02_, affineTransform.m12_]);
  });
***REMOVED***



goog.exportSymbol('xrx.vml', xrx.vml);
