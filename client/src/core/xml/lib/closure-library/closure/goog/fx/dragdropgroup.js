// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Multiple Element Drag and Drop.
***REMOVED***
***REMOVED*** Drag and drop implementation for sources/targets consisting of multiple
***REMOVED*** elements.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/dragdrop.html
***REMOVED***

goog.provide('goog.fx.DragDropGroup');

goog.require('goog.dom');
goog.require('goog.fx.AbstractDragDrop');
goog.require('goog.fx.DragDropItem');



***REMOVED***
***REMOVED*** Drag/drop implementation for creating drag sources/drop targets consisting of
***REMOVED*** multiple HTML Elements (items). All items share the same drop target(s) but
***REMOVED*** can be dragged individually.
***REMOVED***
***REMOVED*** @extends {goog.fx.AbstractDragDrop}
***REMOVED***
***REMOVED***
goog.fx.DragDropGroup = function() {
  goog.fx.AbstractDragDrop.call(this);
***REMOVED***
goog.inherits(goog.fx.DragDropGroup, goog.fx.AbstractDragDrop);


***REMOVED***
***REMOVED*** Add item to drag object.
***REMOVED***
***REMOVED*** @param {Element|string} element Dom Node, or string representation of node
***REMOVED***     id, to be used as drag source/drop target.
***REMOVED*** @param {Object=} opt_data Data associated with the source/target.
***REMOVED*** @throws Error If no element argument is provided or if the type is
***REMOVED***     invalid
***REMOVED*** @override
***REMOVED***
goog.fx.DragDropGroup.prototype.addItem = function(element, opt_data) {
  var item = new goog.fx.DragDropItem(element, opt_data);
  this.addDragDropItem(item);
***REMOVED***


***REMOVED***
***REMOVED*** Add DragDropItem to drag object.
***REMOVED***
***REMOVED*** @param {goog.fx.DragDropItem} item DragDropItem being added to the
***REMOVED***     drag object.
***REMOVED*** @throws Error If no element argument is provided or if the type is
***REMOVED***     invalid
***REMOVED***
goog.fx.DragDropGroup.prototype.addDragDropItem = function(item) {
  item.setParent(this);
  this.items_.push(item);
  if (this.isInitialized()) {
    this.initItem(item);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove item from drag object.
***REMOVED***
***REMOVED*** @param {Element|string} element Dom Node, or string representation of node
***REMOVED***     id, that was previously added with addItem().
***REMOVED***
goog.fx.DragDropGroup.prototype.removeItem = function(element) {
  element = goog.dom.getElement(element);
  for (var item, i = 0; item = this.items_[i]; i++) {
    if (item.element == element) {
      this.items_.splice(i, 1);
      this.disposeItem(item);
      break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Marks the supplied list of items as selected. A drag operation for any of the
***REMOVED*** selected items will affect all of them.
***REMOVED***
***REMOVED*** @param {Array.<goog.fx.DragDropItem>} list List of items to select or null to
***REMOVED***     clear selection.
***REMOVED***
***REMOVED*** TODO(eae): Not yet implemented.
***REMOVED***
goog.fx.DragDropGroup.prototype.setSelection = function(list) {

***REMOVED***
