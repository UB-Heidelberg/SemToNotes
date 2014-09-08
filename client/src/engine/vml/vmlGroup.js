/**
 * @fileoverview
 */

goog.provide('xrx.vml.Group');



goog.require('xrx.vml.Element');



/**
 * @constructor
 */
xrx.vml.Group = function(raphael) {

  goog.base(this, raphael);

  this.childs_ = [];
};
goog.inherits(xrx.vml.Group, xrx.vml.Element);



xrx.vml.Group.prototype.getChildren = function() {
  return this.childs_;
};



xrx.vml.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
    this.raphael_.push(child.getRaphael());
  }
};



xrx.vml.Group.prototype.removeChildren = function() {
  this.childs_ = [];
  this.raphael_.clear();
};



xrx.vml.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
  this.raphael_.splice(index, 1);
};



xrx.vml.Group.prototype.draw = function() {
  this.raphael_.show();
};



xrx.vml.Group.create = function(canvas) {
  var raphael = canvas.getRaphael().set();
  raphael.hide();
  return new xrx.vml.Group(raphael);
};
