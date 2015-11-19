/**
 * @fileoverview A class representing a group of shapes sharing
 * style definitions and behaviour.
 */

goog.provide('xrx.shape.ShapeGroup');
goog.provide('xrx.shape.ShapeGroupCreatable');
goog.provide('xrx.shape.ShapeGroupHoverable');
goog.provide('xrx.shape.ShapeGroupModifiable');
goog.provide('xrx.shape.ShapeGroupSelectable');



goog.require('xrx.shape.Group');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Hoverable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.Selectable');



xrx.shape.ShapeGroup = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.shape.ShapeGroup, xrx.shape.Group);



xrx.shape.ShapeGroup.prototype.addChildren = function(children) {
  goog.base(this, 'addChildren', children);
  for (var i = 0, len = this.childs_.length; i < len; i++) {
    this.childs_[i].setShapeGroup(this);
    this.geometry_.addChild(this.childs_[i].getGeometry());
  }
};



xrx.shape.ShapeGroup.prototype.getHoverable = function() {
  if (this.hoverable_ === undefined) this.hoverable_ =
      new xrx.shape.ShapeGroupHoverable(this);
  return this.hoverable_;
};



xrx.shape.ShapeGroup.prototype.getSelectable = function() {
  if (this.selectable_ === undefined) this.selectable_ =
      new xrx.shape.ShapeGroupSelectable(this);
  return this.selectable_;
};



xrx.shape.ShapeGroup.prototype.getModifiable = function() {
  if (this.modifiable_ === undefined) this.modifiable_ =
      new xrx.shape.ShapeGroupModifiable(this);
  return this.modifiable_;
};



xrx.shape.ShapeGroup.prototype.getCreatable = function() {
  if (this.creatable_ === undefined) this.creatable_ =
      new xrx.shape.ShapeGroupCreatable(this);
  return this.creatable_;
};



xrx.shape.ShapeGroupHoverable = function(shapeGroup) {

  goog.base(this, shapeGroup);
};
goog.inherits(xrx.shape.ShapeGroupHoverable, xrx.shape.Hoverable);



xrx.shape.ShapeGroupSelectable = function(shapeGroup) {

  goog.base(this, shapeGroup);
};
goog.inherits(xrx.shape.ShapeGroupSelectable, xrx.shape.Selectable);



xrx.shape.ShapeGroupModifiable = function(shapeGroup) {

  goog.base(this, shapeGroup);
};
goog.inherits(xrx.shape.ShapeGroupModifiable, xrx.shape.Modifiable);



xrx.shape.ShapeGroupCreatable = function(shapeGroup) {

  goog.base(this, shapeGroup);
};
goog.inherits(xrx.shape.ShapeGroupCreatable, xrx.shape.Creatable);
