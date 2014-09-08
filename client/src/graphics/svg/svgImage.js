/**
 * @fileoverview
 */

goog.provide('xrx.svg.Image');



goog.require('xrx.svg.Element');



xrx.svg.Image = function() {};



xrx.svg.Image.tagName = 'image';



xrx.svg.Image.onMouseOver = function(element, e) {};



xrx.svg.Image.create = function(opt_properties) {
  return xrx.svg.Element.create(xrx.svg.Image, opt_properties);
};


