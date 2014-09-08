// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


***REMOVED***
***REMOVED*** @fileoverview A thicker wrapper around graphics groups.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.graphics.ext.Group');

goog.require('goog.array');
goog.require('goog.graphics.ext.Element');



***REMOVED***
***REMOVED*** Wrapper for a graphics group.
***REMOVED*** @param {goog.graphics.ext.Group} group Parent for this element. Can
***REMOVED***     be null if this is a Graphics instance.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_wrapper The thin wrapper
***REMOVED***     to wrap. If omitted, a new group will be created. Must be included
***REMOVED***     when group is null.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ext.Element}
***REMOVED***
goog.graphics.ext.Group = function(group, opt_wrapper) {
  opt_wrapper = opt_wrapper || group.getGraphicsImplementation().createGroup(
      group.getWrapper());
  goog.graphics.ext.Element.call(this, group, opt_wrapper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of child elements this group contains.
  ***REMOVED*** @type {Array.<goog.graphics.ext.Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.children_ = [];
***REMOVED***
goog.inherits(goog.graphics.ext.Group, goog.graphics.ext.Element);


***REMOVED***
***REMOVED*** Add an element to the group.  This should be treated as package local, as
***REMOVED*** it is called by the draw* methods.
***REMOVED*** @param {!goog.graphics.ext.Element} element The element to add.
***REMOVED*** @param {boolean=} opt_chain Whether this addition is part of a longer set
***REMOVED***     of element additions.
***REMOVED***
goog.graphics.ext.Group.prototype.addChild = function(element, opt_chain) {
  if (!goog.array.contains(this.children_, element)) {
    this.children_.push(element);
  }

  var transformed = this.growToFit_(element);

  if (element.isParentDependent()) {
    element.parentTransform();
  }

  if (!opt_chain && element.isPendingTransform()) {
    element.reset();
  }

  if (transformed) {
    this.reset();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove an element from the group.
***REMOVED*** @param {goog.graphics.ext.Element} element The element to remove.
***REMOVED***
goog.graphics.ext.Group.prototype.removeChild = function(element) {
  goog.array.remove(this.children_, element);

  // TODO(robbyw): shape.fireEvent('delete')

  this.getGraphicsImplementation().removeElement(element.getWrapper());
***REMOVED***


***REMOVED***
***REMOVED*** Calls the given function on each of this component's children in order.  If
***REMOVED*** {@code opt_obj} is provided, it will be used as the 'this' object in the
***REMOVED*** function when called.  The function should take two arguments:  the child
***REMOVED*** component and its 0-based index.  The return value is ignored.
***REMOVED*** @param {Function} f The function to call for every child component; should
***REMOVED***    take 2 arguments (the child and its index).
***REMOVED*** @param {Object=} opt_obj Used as the 'this' object in f when called.
***REMOVED***
goog.graphics.ext.Group.prototype.forEachChild = function(f, opt_obj) {
  if (this.children_) {
    goog.array.forEach(this.children_, f, opt_obj);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.GroupElement} The underlying thin wrapper.
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Group.prototype.getWrapper;


***REMOVED***
***REMOVED*** Reset the element.
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Group.prototype.reset = function() {
  goog.graphics.ext.Group.superClass_.reset.call(this);

  this.updateChildren();
***REMOVED***


***REMOVED***
***REMOVED*** Called from the parent class, this method resets any pre-computed positions
***REMOVED*** and sizes.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Group.prototype.redraw = function() {
  this.getWrapper().setSize(this.getWidth(), this.getHeight());
  this.transformChildren();
***REMOVED***


***REMOVED***
***REMOVED*** Transform the children that need to be transformed.
***REMOVED*** @protected
***REMOVED***
goog.graphics.ext.Group.prototype.transformChildren = function() {
  this.forEachChild(function(child) {
    if (child.isParentDependent()) {
      child.parentTransform();
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** As part of the reset process, update child elements.
***REMOVED***
goog.graphics.ext.Group.prototype.updateChildren = function() {
  this.forEachChild(function(child) {
    if (child.isParentDependent() || child.isPendingTransform()) {
      child.reset();
    } else if (child.updateChildren) {
      child.updateChildren();
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** When adding an element, grow this group's bounds to fit it.
***REMOVED*** @param {!goog.graphics.ext.Element} element The added element.
***REMOVED*** @return {boolean} Whether the size of this group changed.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Group.prototype.growToFit_ = function(element) {
  var transformed = false;

  var x = element.getMaxX();
  if (x > this.getWidth()) {
    this.setMinWidth(x);
    transformed = true;
  }

  var y = element.getMaxY();
  if (y > this.getHeight()) {
    this.setMinHeight(y);
    transformed = true;
  }

  return transformed;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The width of the element's coordinate space.
***REMOVED***
goog.graphics.ext.Group.prototype.getCoordinateWidth = function() {
  return this.getWidth();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The height of the element's coordinate space.
***REMOVED***
goog.graphics.ext.Group.prototype.getCoordinateHeight = function() {
  return this.getHeight();
***REMOVED***


***REMOVED***
***REMOVED*** Remove all drawing elements from the group.
***REMOVED***
goog.graphics.ext.Group.prototype.clear = function() {
  while (this.children_.length) {
    this.removeChild(this.children_[0]);
  }
***REMOVED***
