***REMOVED***
***REMOVED*** @fileoverview VML class representing a group.
***REMOVED***

goog.provide('xrx.vml.Group');



goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED*** VML class representing a group.
***REMOVED*** @param {Raphael.set} raphael The Raphael set object.
***REMOVED***
***REMOVED*** @extends xrx.vml.Element
***REMOVED***
xrx.vml.Group = function(raphael) {

  goog.base(this, raphael);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the group.
  ***REMOVED*** @type {Array.<xrx.vml.Element>}
 ***REMOVED*****REMOVED***
  this.childs_ = [];
***REMOVED***
goog.inherits(xrx.vml.Group, xrx.vml.Element);



***REMOVED***
***REMOVED*** Returns the child elements of the group.
***REMOVED*** @return {xrx.vml.Element} The child elements.
***REMOVED***
xrx.vml.Group.prototype.getChildren = function() {
  return this.childs_;
***REMOVED***



***REMOVED***
***REMOVED*** Adds child elements to a group.
***REMOVED*** @param {xrx.vml.Element} children The child elements.
***REMOVED***
xrx.vml.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
    this.raphael_.push(child.getRaphael());
  }
***REMOVED***



***REMOVED***
***REMOVED*** Removes all child elements from the group.
***REMOVED***
xrx.vml.Group.prototype.removeChildren = function() {
  this.childs_ = [];
  this.raphael_.clear();
***REMOVED***



***REMOVED***
***REMOVED*** Removes a child element at an index.
***REMOVED*** @param {number} index The index.
***REMOVED***
xrx.vml.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
  this.raphael_.splice(index, 1);
***REMOVED***



***REMOVED***
***REMOVED*** Draws each child element of the group.
***REMOVED***
xrx.vml.Group.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new group.
***REMOVED*** @param {xrx.vml.Canvas} canvas The parent canvas of the group.
***REMOVED***
xrx.vml.Group.create = function(canvas) {
  var raphael = canvas.getRaphael().set();
  raphael.hide();
  return new xrx.vml.Group(raphael);
***REMOVED***
