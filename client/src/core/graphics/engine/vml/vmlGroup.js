/**
 * @fileoverview VML class representing a group.
 */

goog.provide('xrx.vml.Group');



goog.require('xrx.vml.Container');



/**
 * VML class representing a group.
 * @param {Raphael.set} raphael The Raphael set object.
 * @constructor
 * @extends xrx.vml.Element
 */
xrx.vml.Group = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Group, xrx.vml.Container);



/**
 * Creates a new group.
 * @param {xrx.vml.Canvas} canvas The parent canvas of the group.
 */
xrx.vml.Group.create = function(canvas) {
  var raphael = canvas.getRaphael().set();
  return new xrx.vml.Group(raphael);
};
