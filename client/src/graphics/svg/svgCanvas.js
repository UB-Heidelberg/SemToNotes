/**
 * @fileoverview
 */

goog.provide('xrx.svg.Canvas');



goog.require('xrx.svg.Element');



xrx.svg.Canvas = function() {};



xrx.svg.Canvas.tagName = 'svg';



xrx.svg.Canvas.create = function(opt_properties) {
  return xrx.svg.Element.create(xrx.svg.Canvas, opt_properties);
};
