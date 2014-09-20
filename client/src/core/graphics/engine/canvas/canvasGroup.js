***REMOVED***
***REMOVED*** @fileoverview Canvas class representing a group.
***REMOVED***

goog.provide('xrx.canvas.Group');



goog.require('xrx.canvas.Element');



***REMOVED***
***REMOVED*** Canvas class representing a group.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Element
***REMOVED***
xrx.canvas.Group = function(canvas) {

  goog.base(this, canvas);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the group.
  ***REMOVED*** @type {Array.<xrx.canvas.Element>}
 ***REMOVED*****REMOVED***
  this.childs_ = [];
***REMOVED***
goog.inherits(xrx.canvas.Group, xrx.canvas.Element);



***REMOVED***
***REMOVED*** Returns the child elements of the group.
***REMOVED*** @return {xrx.canvas.Element} The child elements.
***REMOVED***
xrx.canvas.Group.prototype.getChildren = function() {
  return this.childs_;
***REMOVED***



***REMOVED***
***REMOVED*** Adds child elements to a group.
***REMOVED*** @param {xrx.canvas.Element} children The child elements.
***REMOVED***
xrx.canvas.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Removes all child elements from the group.
***REMOVED***
xrx.canvas.Group.prototype.removeChildren = function() {
  this.childs_ = [];
***REMOVED***



***REMOVED***
***REMOVED*** Removes a child element at an index.
***REMOVED*** @param {number} index The index.
***REMOVED***
xrx.canvas.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
***REMOVED***



***REMOVED***
***REMOVED*** Draws each child element of the group.
***REMOVED***
xrx.canvas.Group.prototype.draw = function() {
  for(var i = 0, len = this.childs_.length; i < len; i++) {
    this.childs_[i].draw();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new group.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object of the group.
***REMOVED***
xrx.canvas.Group.create = function(canvas) {
  return new xrx.canvas.Group(canvas);
***REMOVED***
