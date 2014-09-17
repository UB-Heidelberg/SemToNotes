***REMOVED***
***REMOVED*** @fileoverview SVG class representing a group.
***REMOVED***

goog.provide('xrx.svg.Group');



***REMOVED***
goog.require('xrx.svg');
goog.require('xrx.svg.Element');



***REMOVED***
***REMOVED*** SVG class representing a group.
***REMOVED*** @param {SVGGroupElement} element The SVG group element.
***REMOVED***
***REMOVED*** @extends xrx.svg.Element
***REMOVED***
xrx.svg.Group = function(element) {

***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The child elements of the group.
  ***REMOVED*** @type {Array.<xrx.svg.Element>}
 ***REMOVED*****REMOVED***
  this.childs_ = [];
***REMOVED***
goog.inherits(xrx.svg.Group, xrx.svg.Element);



***REMOVED***
***REMOVED*** Returns the child elements of the group.
***REMOVED*** @return {xrx.svg.Element} The child elements.
***REMOVED***
xrx.svg.Group.prototype.getChildren = function() {
  return this.childs_;
***REMOVED***



***REMOVED***
***REMOVED*** Adds child elements to a group.
***REMOVED*** @param {xrx.svg.Element} children The child elements.
***REMOVED***
xrx.svg.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
    goog.dom.append(this.element_, child.getElement());
  }
***REMOVED***



***REMOVED***
***REMOVED*** Removes all child elements from the group.
***REMOVED***
xrx.svg.Group.prototype.removeChildren = function() {
  goog.dom.removeChildren(this.element_);
  this.childs_ = [];
***REMOVED***



***REMOVED***
***REMOVED*** Removes a child element at an index.
***REMOVED*** @param {number} index The index.
***REMOVED***
xrx.svg.Group.prototype.removeChildAt = function(index) {
  var child = this.childs_[index];
  goog.dom.removeNode(child.getElement());
  this.childs_.splice(index, 1);
***REMOVED***



***REMOVED***
***REMOVED*** Draws each child element of the group.
***REMOVED***
xrx.svg.Group.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new group.
***REMOVED***
xrx.svg.Group.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'g');
  return new xrx.svg.Group(element);
***REMOVED***
