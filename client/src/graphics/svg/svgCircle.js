/**
 * @fileoverview
 */

goog.provide('xrx.svg.Circle');



goog.require('xrx.svg.Element');



xrx.svg.Circle = function() {};



xrx.svg.Circle.tagName = 'circle';



xrx.svg.Circle.onMouseOver = function(element, e) {};



xrx.svg.Circle.create = function(opt_properties) {
  return xrx.svg.Element.create(xrx.svg.Circle, opt_properties);
};

