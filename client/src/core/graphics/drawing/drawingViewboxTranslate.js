/**
 * @fileoverview A class implementing translation related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxTranslate');



goog.require('xrx.drawing.EventType');
goog.require('xrx.drawing.ViewboxZoom');



xrx.drawing.ViewboxTranslate = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxTranslate, xrx.drawing.ViewboxZoom);



xrx.drawing.ViewboxTranslate.prototype.translate = function(x, y) {
  var identity = this.ctm_.getIdentity();
  var point = identity.transformPoint([x, y]);
  this.ctm_ = identity.translate(point[0], point[1]).concatenate(this.ctm_);
  this.dispatchEvent(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_); 
};
