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
***REMOVED*** @fileoverview Single-selection model implemenation.
***REMOVED***
***REMOVED*** TODO(attila): Add keyboard & mouse event hooks?
***REMOVED*** TODO(attila): Add multiple selection?
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***


goog.provide('goog.ui.SelectionModel');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
***REMOVED***



***REMOVED***
***REMOVED*** Single-selection model.  Dispatches a {@link goog.events.EventType.SELECT}
***REMOVED*** event when a selection is made.
***REMOVED*** @param {Array.<Object>=} opt_items Array of items; defaults to empty.
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED***
goog.ui.SelectionModel = function(opt_items) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of items controlled by the selection model.  If the items support
  ***REMOVED*** the {@code setSelected(Boolean)} interface, they will be (de)selected
  ***REMOVED*** as needed.
  ***REMOVED*** @type {!Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.items_ = [];
  this.addItems(opt_items);
***REMOVED***
goog.inherits(goog.ui.SelectionModel, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The currently selected item (null if none).
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionModel.prototype.selectedItem_ = null;


***REMOVED***
***REMOVED*** Selection handler function.  Called with two arguments (the item to be
***REMOVED*** selected or deselected, and a Boolean indicating whether the item is to
***REMOVED*** be selected or deselected).
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionModel.prototype.selectionHandler_ = null;


***REMOVED***
***REMOVED*** Returns the selection handler function used by the selection model to change
***REMOVED*** the internal selection state of items under its control.
***REMOVED*** @return {Function} Selection handler function (null if none).
***REMOVED***
goog.ui.SelectionModel.prototype.getSelectionHandler = function() {
  return this.selectionHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selection handler function to be used by the selection model to
***REMOVED*** change the internal selection state of items under its control.  The
***REMOVED*** function must take two arguments:  an item and a Boolean to indicate whether
***REMOVED*** the item is to be selected or deselected.  Selection handler functions are
***REMOVED*** only needed if the items in the selection model don't natively support the
***REMOVED*** {@code setSelected(Boolean)} interface.
***REMOVED*** @param {Function} handler Selection handler function.
***REMOVED***
goog.ui.SelectionModel.prototype.setSelectionHandler = function(handler) {
  this.selectionHandler_ = handler;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of items controlled by the selection model.
***REMOVED*** @return {number} Number of items.
***REMOVED***
goog.ui.SelectionModel.prototype.getItemCount = function() {
  return this.items_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 0-based index of the given item within the selection model, or
***REMOVED*** -1 if no such item is found.
***REMOVED*** @param {Object|undefined} item Item to look for.
***REMOVED*** @return {number} Index of the given item (-1 if none).
***REMOVED***
goog.ui.SelectionModel.prototype.indexOfItem = function(item) {
  return item ? goog.array.indexOf(this.items_, item) : -1;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object|undefined} The first item, or undefined if there are no items
***REMOVED***     in the model.
***REMOVED***
goog.ui.SelectionModel.prototype.getFirst = function() {
  return this.items_[0];
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object|undefined} The last item, or undefined if there are no items
***REMOVED***     in the model.
***REMOVED***
goog.ui.SelectionModel.prototype.getLast = function() {
  return this.items_[this.items_.length - 1];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the item at the given 0-based index.
***REMOVED*** @param {number} index Index of the item to return.
***REMOVED*** @return {Object} Item at the given index (null if none).
***REMOVED***
goog.ui.SelectionModel.prototype.getItemAt = function(index) {
  return this.items_[index] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Bulk-adds items to the selection model.  This is more efficient than calling
***REMOVED*** {@link #addItem} for each new item.
***REMOVED*** @param {Array.<Object>|undefined} items New items to add.
***REMOVED***
goog.ui.SelectionModel.prototype.addItems = function(items) {
  if (items) {
    // New items shouldn't be selected.
    goog.array.forEach(items, function(item) {
      this.selectItem_(item, false);
    }, this);
    goog.array.extend(this.items_, items);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds an item at the end of the list.
***REMOVED*** @param {Object} item Item to add.
***REMOVED***
goog.ui.SelectionModel.prototype.addItem = function(item) {
  this.addItemAt(item, this.getItemCount());
***REMOVED***


***REMOVED***
***REMOVED*** Adds an item at the given index.
***REMOVED*** @param {Object} item Item to add.
***REMOVED*** @param {number} index Index at which to add the new item.
***REMOVED***
goog.ui.SelectionModel.prototype.addItemAt = function(item, index) {
  if (item) {
    // New items must not be selected.
    this.selectItem_(item, false);
    goog.array.insertAt(this.items_, item, index);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given item (if it exists).  Dispatches a {@code SELECT} event if
***REMOVED*** the removed item was the currently selected item.
***REMOVED*** @param {Object} item Item to remove.
***REMOVED***
goog.ui.SelectionModel.prototype.removeItem = function(item) {
  if (item && goog.array.remove(this.items_, item)) {
    if (item == this.selectedItem_) {
      this.selectedItem_ = null;
      this.dispatchEvent(goog.events.EventType.SELECT);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the item at the given index.
***REMOVED*** @param {number} index Index of the item to remove.
***REMOVED***
goog.ui.SelectionModel.prototype.removeItemAt = function(index) {
  this.removeItem(this.getItemAt(index));
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object} The currently selected item, or null if none.
***REMOVED***
goog.ui.SelectionModel.prototype.getSelectedItem = function() {
  return this.selectedItem_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<Object>} All items in the selection model.
***REMOVED***
goog.ui.SelectionModel.prototype.getItems = function() {
  return goog.array.clone(this.items_);
***REMOVED***


***REMOVED***
***REMOVED*** Selects the given item, deselecting any previously selected item, and
***REMOVED*** dispatches a {@code SELECT} event.
***REMOVED*** @param {Object} item Item to select (null to clear the selection).
***REMOVED***
goog.ui.SelectionModel.prototype.setSelectedItem = function(item) {
  if (item != this.selectedItem_) {
    this.selectItem_(this.selectedItem_, false);
    this.selectedItem_ = item;
    this.selectItem_(item, true);
  }

  // Always dispatch a SELECT event; let listeners decide what to do if the
  // selected item hasn't changed.
  this.dispatchEvent(goog.events.EventType.SELECT);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The 0-based index of the currently selected item, or -1
***REMOVED***     if none.
***REMOVED***
goog.ui.SelectionModel.prototype.getSelectedIndex = function() {
  return this.indexOfItem(this.selectedItem_);
***REMOVED***


***REMOVED***
***REMOVED*** Selects the item at the given index, deselecting any previously selected
***REMOVED*** item, and dispatches a {@code SELECT} event.
***REMOVED*** @param {number} index Index to select (-1 to clear the selection).
***REMOVED***
goog.ui.SelectionModel.prototype.setSelectedIndex = function(index) {
  this.setSelectedItem(this.getItemAt(index));
***REMOVED***


***REMOVED***
***REMOVED*** Clears the selection model by removing all items from the selection.
***REMOVED***
goog.ui.SelectionModel.prototype.clear = function() {
  goog.array.clear(this.items_);
  this.selectedItem_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SelectionModel.prototype.disposeInternal = function() {
  goog.ui.SelectionModel.superClass_.disposeInternal.call(this);
  delete this.items_;
  this.selectedItem_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Private helper; selects or deselects the given item based on the value of
***REMOVED*** the {@code select} argument.  If a selection handler has been registered
***REMOVED*** (via {@link #setSelectionHandler}, calls it to update the internal selection
***REMOVED*** state of the item.  Otherwise, attempts to call {@code setSelected(Boolean)}
***REMOVED*** on the item itself, provided the object supports that interface.
***REMOVED*** @param {Object} item Item to select or deselect.
***REMOVED*** @param {boolean} select If true, the object will be selected; if false, it
***REMOVED***     will be deselected.
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionModel.prototype.selectItem_ = function(item, select) {
  if (item) {
    if (typeof this.selectionHandler_ == 'function') {
      // Use the registered selection handler function.
      this.selectionHandler_(item, select);
    } else if (typeof item.setSelected == 'function') {
      // Call setSelected() on the item, if it supports it.
      item.setSelected(select);
    }
  }
***REMOVED***
