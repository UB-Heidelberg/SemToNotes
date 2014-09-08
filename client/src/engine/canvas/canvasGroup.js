/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Group');



goog.require('xrx.canvas.Element');



xrx.canvas.Group = function(canvas) {

  goog.base(this, undefined, canvas);

  this.childs_ = [];
};
goog.inherits(xrx.canvas.Group, xrx.canvas.Element);



xrx.canvas.Group.prototype.getChildren = function() {
  return this.childs_;
};



xrx.canvas.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
  }
};



xrx.canvas.Group.prototype.removeChildren = function() {
  this.childs_ = [];
};



xrx.canvas.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
};



xrx.canvas.Group.prototype.draw = function() {
  for(var i = 0, len = this.childs_.length; i < len; i++) {
    this.childs_[i].draw();
  }
};



xrx.canvas.Group.create = function(canvas) {
  return new xrx.canvas.Group(canvas);
};
