***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg');



goog.require('goog.dom');
goog.require('goog.math.AffineTransform');
goog.require('xrx');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg = function() {***REMOVED***



xrx.svg.Namespace = {
  'svg': 'http://www.w3.org/2000/svg',
  'xlink': 'http://www.w3.org/1999/xlink'
***REMOVED***



xrx.svg.setCoords = function(element, points) {
  var s = '';
  for(var i = 0, len = points.length; i < len; i++) {
    s += points[i][0].toString() + ',' + points[i][1].toString() + ' ';
  }
  element.setAttribute('points', s);
***REMOVED***



xrx.svg.render = function(viewbox, affineTransform, elements) {
  var s = 'matrix(' + affineTransform.m00_ + ',' + affineTransform.m10_ +
      ',' + affineTransform.m01_ + ',' + affineTransform.m11_ +
      ',' + affineTransform.m02_ + ',' + affineTransform.m12_ + ')';
  viewbox.setAttribute('transform', s);  
***REMOVED***



goog.exportProperty(xrx, 'svg', xrx.svg);
