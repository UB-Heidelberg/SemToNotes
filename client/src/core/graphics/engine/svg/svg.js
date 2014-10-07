***REMOVED***
***REMOVED*** @fileoverview SVG base class providing enumerations and static functions
***REMOVED***     for the SVG sub-classes.
***REMOVED***

goog.provide('xrx.svg');



***REMOVED***
***REMOVED*** SVG base class providing enumerations and static functions
***REMOVED*** for the SVG sub-classes.
***REMOVED***
***REMOVED***
xrx.svg = function() {***REMOVED***



***REMOVED***
***REMOVED*** Enumeration of SVG related namespaces.
***REMOVED*** @enum {string}
***REMOVED***
xrx.svg.Namespace = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The SVG namespace.
 ***REMOVED*****REMOVED***
  'svg': 'http://www.w3.org/2000/svg',

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XLINK namespace.
 ***REMOVED*****REMOVED***
  'xlink': 'http://www.w3.org/1999/xlink'
***REMOVED***



***REMOVED***
***REMOVED*** Returns whether SVG rendering is supported by the current user agent.
***REMOVED*** @return {boolean} Whether SVG rendering is supported.
***REMOVED***
xrx.svg.isSupported = function() {
  return !!document.createElementNS &&
      !!document.createElementNS(xrx.svg.Namespace['svg'], 'svg').createSVGRect;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the coordinates for various SVG elements such as polygons.
***REMOVED*** @param {Element} element The SVG element.
***REMOVED*** @param {Array.<Array.<number>>} points Array of coordinates.
***REMOVED***
xrx.svg.setCoords = function(element, coordinates) {
  var s = '';
  for(var i = 0, len = coordinates.length; i < len; i++) {
    s += coordinates[i][0] + ',' + coordinates[i][1] + ' ';
  }
  element.setAttribute('points', s);
***REMOVED***



***REMOVED***
***REMOVED*** Re-renders a SVG element according to a transformation matrix.
***REMOVED*** @param {Element} element The HTML element to be transformed and rendered.
***REMOVED*** @param {goog.math.AffineTransform} affineTransform Transformation matrix to
***REMOVED***     be applied.
***REMOVED***
xrx.svg.render = function(element, affineTransform) {
  var s = 'matrix(' + affineTransform.m00_ + ',' + affineTransform.m10_ +
      ',' + affineTransform.m01_ + ',' + affineTransform.m11_ +
      ',' + affineTransform.m02_ + ',' + affineTransform.m12_ + ')';
  element.setAttribute('transform', s);  
***REMOVED***



goog.exportSymbol('xrx.svg', xrx.svg);
