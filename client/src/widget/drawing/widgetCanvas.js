/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Canvas');



goog.require('xrx');
goog.require('xrx.view');
goog.require('xrx.drawing.Drawing');



/**
 * @constructor
 */
xrx.widget.Canvas = function(element) {

  goog.base(this, element);

  this.drawing_;
};
goog.inherits(xrx.widget.Canvas, xrx.view);



xrx.widget.Canvas.prototype.refresh = function() {
};



xrx.widget.Canvas.prototype.createDom = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_);
};
