/**
 * @fileoverview
 */

goog.provide('xrx.svg');



goog.require('goog.dom');
goog.require('goog.math.AffineTransform');
goog.require('xrx');



/**
 * @constructor
 */
xrx.svg = function() {};



xrx.svg.Namespace = {
  'svg': 'http://www.w3.org/2000/svg',
  'xlink': 'http://www.w3.org/1999/xlink'
};



xrx.svg.setCoords = function(element, points) {
  var s = '';
  for(var i = 0, len = points.length; i < len; i++) {
    s += points[i][0].toString() + ',' + points[i][1].toString() + ' ';
  }
  element.setAttribute('points', s);
};



xrx.svg.render = function(viewbox, affineTransform, elements) {
  var s = 'matrix(' + affineTransform.m00_ + ',' + affineTransform.m10_ +
      ',' + affineTransform.m01_ + ',' + affineTransform.m11_ +
      ',' + affineTransform.m02_ + ',' + affineTransform.m12_ + ')';
  viewbox.setAttribute('transform', s);  
};



goog.exportProperty(xrx, 'svg', xrx.svg);
