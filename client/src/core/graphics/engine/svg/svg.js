/**
 * @fileoverview SVG base class providing enumerations and static functions
 *     for the SVG sub-classes.
 */

goog.provide('xrx.svg');



/**
 * SVG base class providing enumerations and static functions
 * for the SVG sub-classes.
 * @constructor
 */
xrx.svg = function() {};



/**
 * Enumeration of SVG related namespaces.
 * @enum {string}
 */
xrx.svg.Namespace = {

  /**
   * The SVG namespace.
   */
  'svg': 'http://www.w3.org/2000/svg',

  /**
   * The XLINK namespace.
   */
  'xlink': 'http://www.w3.org/1999/xlink'
};



/**
 * Returns whether SVG rendering is supported by the current user agent.
 * @return {boolean} Whether SVG rendering is supported.
 */
xrx.svg.isSupported = function() {
  return !!document.createElementNS &&
      !!document.createElementNS(xrx.svg.Namespace['svg'], 'svg').createSVGRect;
};



/**
 * Sets the coordinates for various SVG elements such as polygons.
 * @param {Element} element The SVG element.
 * @param {Array.<Array.<number>>} points Array of coordinates.
 */
xrx.svg.setCoords = function(element, coordinates) {
  var s = '';
  for(var i = 0, len = coordinates.length; i < len; i++) {
    s += coordinates[i][0] + ',' + coordinates[i][1] + ' ';
  }
  element.setAttribute('points', s);
};



/**
 * Re-renders a SVG element according to a transformation matrix.
 * @param {Element} element The HTML element to be transformed and rendered.
 * @param {goog.math.AffineTransform} affineTransform Transformation matrix to
 *     be applied.
 */
xrx.svg.render = function(element, affineTransform) {
  var s = 'matrix(' + affineTransform.m00_ + ',' + affineTransform.m10_ +
      ',' + affineTransform.m01_ + ',' + affineTransform.m11_ +
      ',' + affineTransform.m02_ + ',' + affineTransform.m12_ + ')';
  element.setAttribute('transform', s);  
};



goog.exportSymbol('xrx.svg', xrx.svg);
