/**
 * @fileoverview
 */

goog.provide('xrx.svg.Group');



goog.require('xrx.svg.Element');



xrx.svg.Group = function() {};



xrx.svg.Group.tagName = 'g';



xrx.svg.Group.create = function(opt_properties) {
  return xrx.svg.Element.create(xrx.svg.Group, opt_properties);
};

