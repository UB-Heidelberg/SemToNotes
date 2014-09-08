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
***REMOVED*** @fileoverview A palette control.  A palette is a grid that the user can
***REMOVED*** highlight or select via the keyboard or the mouse.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/palette.html
***REMOVED***

goog.provide('goog.ui.Palette');

goog.require('goog.array');
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.math.Size');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.PaletteRenderer');
goog.require('goog.ui.SelectionModel');



***REMOVED***
***REMOVED*** A palette is a grid of DOM nodes that the user can highlight or select via
***REMOVED*** the keyboard or the mouse.  The selection state of the palette is controlled
***REMOVED*** an ACTION event.  Event listeners may retrieve the selected item using the
***REMOVED*** {@link #getSelectedItem} or {@link #getSelectedIndex} method.
***REMOVED***
***REMOVED*** Use this class as the base for components like color palettes or emoticon
***REMOVED*** pickers.  Use {@link #setContent} to set/change the items in the palette
***REMOVED*** after construction.  See palette.html demo for example usage.
***REMOVED***
***REMOVED*** @param {Array.<Node>} items Array of DOM nodes to be displayed as items
***REMOVED***     in the palette grid (limited to one per cell).
***REMOVED*** @param {goog.ui.PaletteRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the palette; defaults to {@link goog.ui.PaletteRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.Palette = function(items, opt_renderer, opt_domHelper) {
  goog.ui.Palette.base(this, 'constructor', items,
      opt_renderer || goog.ui.PaletteRenderer.getInstance(), opt_domHelper);
  this.setAutoStates(goog.ui.Component.State.CHECKED |
      goog.ui.Component.State.SELECTED | goog.ui.Component.State.OPENED, false);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A fake component for dispatching events on palette cell changes.
  ***REMOVED*** @type {!goog.ui.Palette.CurrentCell_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.currentCellControl_ = new goog.ui.Palette.CurrentCell_();
  this.currentCellControl_.setParentEventTarget(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {number} The last highlighted index, or -1 if it never had one.
 ***REMOVED*****REMOVED***
  this.lastHighlightedIndex_ = -1;
***REMOVED***
goog.inherits(goog.ui.Palette, goog.ui.Control);


***REMOVED***
***REMOVED*** Events fired by the palette object
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Palette.EventType = {
  AFTER_HIGHLIGHT: goog.events.getUniqueId('afterhighlight')
***REMOVED***


***REMOVED***
***REMOVED*** Palette dimensions (columns x rows).  If the number of rows is undefined,
***REMOVED*** it is calculated on first use.
***REMOVED*** @type {goog.math.Size}
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.size_ = null;


***REMOVED***
***REMOVED*** Index of the currently highlighted item (-1 if none).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.highlightedIndex_ = -1;


***REMOVED***
***REMOVED*** Selection model controlling the palette's selection state.
***REMOVED*** @type {goog.ui.SelectionModel}
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.selectionModel_ = null;


// goog.ui.Component / goog.ui.Control implementation.


***REMOVED*** @override***REMOVED***
goog.ui.Palette.prototype.disposeInternal = function() {
  goog.ui.Palette.superClass_.disposeInternal.call(this);

  if (this.selectionModel_) {
    this.selectionModel_.dispose();
    this.selectionModel_ = null;
  }

  this.size_ = null;

  this.currentCellControl_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.Control#setContentInternal} by also updating the
***REMOVED*** grid size and the selection model.  Considered protected.
***REMOVED*** @param {goog.ui.ControlContent} content Array of DOM nodes to be displayed
***REMOVED***     as items in the palette grid (one item per cell).
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.setContentInternal = function(content) {
  var items =***REMOVED*****REMOVED*** @type {Array.<Node>}***REMOVED*** (content);
  goog.ui.Palette.superClass_.setContentInternal.call(this, items);

  // Adjust the palette size.
  this.adjustSize_();

  // Add the items to the selection model, replacing previous items (if any).
  if (this.selectionModel_) {
    // We already have a selection model; just replace the items.
    this.selectionModel_.clear();
    this.selectionModel_.addItems(items);
  } else {
    // Create a selection model, initialize the items, and hook up handlers.
    this.selectionModel_ = new goog.ui.SelectionModel(items);
    this.selectionModel_.setSelectionHandler(goog.bind(this.selectItem_,
        this));
    this.getHandler().listen(this.selectionModel_,
        goog.events.EventType.SELECT, this.handleSelectionChange);
  }

  // In all cases, clear the highlight.
  this.highlightedIndex_ = -1;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.Control#getCaption} to return the empty string,
***REMOVED*** since palettes don't have text captions.
***REMOVED*** @return {string} The empty string.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.getCaption = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.Control#setCaption} to be a no-op, since palettes
***REMOVED*** don't have text captions.
***REMOVED*** @param {string} caption Ignored.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.setCaption = function(caption) {
  // Do nothing.
***REMOVED***


// Palette event handling.


***REMOVED***
***REMOVED*** Handles mouseover events.  Overrides {@link goog.ui.Control#handleMouseOver}
***REMOVED*** by determining which palette item (if any) was moused over, highlighting it,
***REMOVED*** and un-highlighting any previously-highlighted item.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.handleMouseOver = function(e) {
  goog.ui.Palette.superClass_.handleMouseOver.call(this, e);

  var item = this.getRenderer().getContainingItem(this, e.target);
  if (item && e.relatedTarget && goog.dom.contains(item, e.relatedTarget)) {
    // Ignore internal mouse moves.
    return;
  }

  if (item != this.getHighlightedItem()) {
    this.setHighlightedItem(item);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events.  Overrides {@link goog.ui.Control#handleMouseDown}
***REMOVED*** by ensuring that the item on which the user moused down is highlighted.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.handleMouseDown = function(e) {
  goog.ui.Palette.superClass_.handleMouseDown.call(this, e);

  if (this.isActive()) {
    // Make sure we move the highlight to the cell on which the user moused
    // down.
    var item = this.getRenderer().getContainingItem(this, e.target);
    if (item != this.getHighlightedItem()) {
      this.setHighlightedItem(item);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Selects the currently highlighted palette item (triggered by mouseup or by
***REMOVED*** keyboard action).  Overrides {@link goog.ui.Control#performActionInternal}
***REMOVED*** by selecting the highlighted item and dispatching an ACTION event.
***REMOVED*** @param {goog.events.Event} e Mouse or key event that triggered the action.
***REMOVED*** @return {boolean} True if the action was allowed to proceed, false otherwise.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.performActionInternal = function(e) {
  var item = this.getHighlightedItem();
  if (item) {
    this.setSelectedItem(item);
    return goog.ui.Palette.base(this, 'performActionInternal', e);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles keyboard events dispatched while the palette has focus.  Moves the
***REMOVED*** highlight on arrow keys, and selects the highlighted item on Enter or Space.
***REMOVED*** Returns true if the event was handled, false otherwise.  In particular, if
***REMOVED*** the user attempts to navigate out of the grid, the highlight isn't changed,
***REMOVED*** and this method returns false; it is then up to the parent component to
***REMOVED*** handle the event (e.g. by wrapping the highlight around).  Overrides {@link
***REMOVED*** goog.ui.Control#handleKeyEvent}.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} True iff the key event was handled by the component.
***REMOVED*** @override
***REMOVED***
goog.ui.Palette.prototype.handleKeyEvent = function(e) {
  var items = this.getContent();
  var numItems = items ? items.length : 0;
  var numColumns = this.size_.width;

  // If the component is disabled or the palette is empty, bail.
  if (numItems == 0 || !this.isEnabled()) {
    return false;
  }

  // User hit ENTER or SPACE; trigger action.
  if (e.keyCode == goog.events.KeyCodes.ENTER ||
      e.keyCode == goog.events.KeyCodes.SPACE) {
    return this.performActionInternal(e);
  }

  // User hit HOME or END; move highlight.
  if (e.keyCode == goog.events.KeyCodes.HOME) {
    this.setHighlightedIndex(0);
    return true;
  } else if (e.keyCode == goog.events.KeyCodes.END) {
    this.setHighlightedIndex(numItems - 1);
    return true;
  }

  // If nothing is highlighted, start from the selected index.  If nothing is
  // selected either, highlightedIndex is -1.
  var highlightedIndex = this.highlightedIndex_ < 0 ? this.getSelectedIndex() :
      this.highlightedIndex_;

  switch (e.keyCode) {
    case goog.events.KeyCodes.LEFT:
      // If the highlighted index is uninitialized, or is at the beginning, move
      // it to the end.
      if (highlightedIndex == -1 ||
          highlightedIndex == 0) {
        highlightedIndex = numItems;
      }
      this.setHighlightedIndex(highlightedIndex - 1);
      e.preventDefault();
      return true;
      break;

    case goog.events.KeyCodes.RIGHT:
      // If the highlighted index at the end, move it to the beginning.
      if (highlightedIndex == numItems - 1) {
        highlightedIndex = -1;
      }
      this.setHighlightedIndex(highlightedIndex + 1);
      e.preventDefault();
      return true;
      break;

    case goog.events.KeyCodes.UP:
      if (highlightedIndex == -1) {
        highlightedIndex = numItems + numColumns - 1;
      }
      if (highlightedIndex >= numColumns) {
        this.setHighlightedIndex(highlightedIndex - numColumns);
        e.preventDefault();
        return true;
      }
      break;

    case goog.events.KeyCodes.DOWN:
      if (highlightedIndex == -1) {
        highlightedIndex = -numColumns;
      }
      if (highlightedIndex < numItems - numColumns) {
        this.setHighlightedIndex(highlightedIndex + numColumns);
        e.preventDefault();
        return true;
      }
      break;
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles selection change events dispatched by the selection model.
***REMOVED*** @param {goog.events.Event} e Selection event to handle.
***REMOVED***
goog.ui.Palette.prototype.handleSelectionChange = function(e) {
  // No-op in the base class.
***REMOVED***


// Palette management.


***REMOVED***
***REMOVED*** Returns the size of the palette grid.
***REMOVED*** @return {goog.math.Size} Palette size (columns x rows).
***REMOVED***
goog.ui.Palette.prototype.getSize = function() {
  return this.size_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the size of the palette grid to the given size.  Callers can either
***REMOVED*** pass a single {@link goog.math.Size} or a pair of numbers (first the number
***REMOVED*** of columns, then the number of rows) to this method.  In both cases, the
***REMOVED*** number of rows is optional and will be calculated automatically if needed.
***REMOVED*** It is an error to attempt to change the size of the palette after it has
***REMOVED*** been rendered.
***REMOVED*** @param {goog.math.Size|number} size Either a size object or the number of
***REMOVED***     columns.
***REMOVED*** @param {number=} opt_rows The number of rows (optional).
***REMOVED***
goog.ui.Palette.prototype.setSize = function(size, opt_rows) {
  if (this.getElement()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.size_ = goog.isNumber(size) ?
      new goog.math.Size(size,***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_rows)) : size;

  // Adjust size, if needed.
  this.adjustSize_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 0-based index of the currently highlighted palette item, or -1
***REMOVED*** if no item is highlighted.
***REMOVED*** @return {number} Index of the highlighted item (-1 if none).
***REMOVED***
goog.ui.Palette.prototype.getHighlightedIndex = function() {
  return this.highlightedIndex_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently highlighted palette item, or null if no item is
***REMOVED*** highlighted.
***REMOVED*** @return {Node} The highlighted item (undefined if none).
***REMOVED***
goog.ui.Palette.prototype.getHighlightedItem = function() {
  var items = this.getContent();
  return items && items[this.highlightedIndex_];
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The highlighted cell.
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.getHighlightedCellElement_ = function() {
  return this.getRenderer().getCellForItem(this.getHighlightedItem());
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the item at the given 0-based index, or removes the highlight
***REMOVED*** if the argument is -1 or out of range.  Any previously-highlighted item
***REMOVED*** will be un-highlighted.
***REMOVED*** @param {number} index 0-based index of the item to highlight.
***REMOVED***
goog.ui.Palette.prototype.setHighlightedIndex = function(index) {
  if (index != this.highlightedIndex_) {
    this.highlightIndex_(this.highlightedIndex_, false);
    this.lastHighlightedIndex_ = this.highlightedIndex_;
    this.highlightedIndex_ = index;
    this.highlightIndex_(index, true);
    this.dispatchEvent(goog.ui.Palette.EventType.AFTER_HIGHLIGHT);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the given item, or removes the highlight if the argument is null
***REMOVED*** or invalid.  Any previously-highlighted item will be un-highlighted.
***REMOVED*** @param {Node|undefined} item Item to highlight.
***REMOVED***
goog.ui.Palette.prototype.setHighlightedItem = function(item) {
  var items =***REMOVED*****REMOVED*** @type {Array.<Node>}***REMOVED*** (this.getContent());
  this.setHighlightedIndex(items ? goog.array.indexOf(items, item) : -1);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 0-based index of the currently selected palette item, or -1
***REMOVED*** if no item is selected.
***REMOVED*** @return {number} Index of the selected item (-1 if none).
***REMOVED***
goog.ui.Palette.prototype.getSelectedIndex = function() {
  return this.selectionModel_ ? this.selectionModel_.getSelectedIndex() : -1;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently selected palette item, or null if no item is selected.
***REMOVED*** @return {Node} The selected item (null if none).
***REMOVED***
goog.ui.Palette.prototype.getSelectedItem = function() {
  return this.selectionModel_ ?
     ***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (this.selectionModel_.getSelectedItem()) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Selects the item at the given 0-based index, or clears the selection
***REMOVED*** if the argument is -1 or out of range.  Any previously-selected item
***REMOVED*** will be deselected.
***REMOVED*** @param {number} index 0-based index of the item to select.
***REMOVED***
goog.ui.Palette.prototype.setSelectedIndex = function(index) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedIndex(index);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Selects the given item, or clears the selection if the argument is null or
***REMOVED*** invalid.  Any previously-selected item will be deselected.
***REMOVED*** @param {Node} item Item to select.
***REMOVED***
goog.ui.Palette.prototype.setSelectedItem = function(item) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedItem(item);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Private helper; highlights or un-highlights the item at the given index
***REMOVED*** based on the value of the Boolean argument.  This implementation simply
***REMOVED*** applies highlight styling to the cell containing the item to be highighted.
***REMOVED*** Does nothing if the palette hasn't been rendered yet.
***REMOVED*** @param {number} index 0-based index of item to highlight or un-highlight.
***REMOVED*** @param {boolean} highlight If true, the item is highlighted; otherwise it
***REMOVED***     is un-highlighted.
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.highlightIndex_ = function(index, highlight) {
  if (this.getElement()) {
    var items = this.getContent();
    if (items && index >= 0 && index < items.length) {
      var cellEl = this.getHighlightedCellElement_();
      if (this.currentCellControl_.getElement() != cellEl) {
        this.currentCellControl_.setElementInternal(cellEl);
      }
      if (this.currentCellControl_.tryHighlight(highlight)) {
        this.getRenderer().highlightCell(this, items[index], highlight);
      }
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Palette.prototype.setHighlighted = function(highlight) {
  goog.ui.Palette.base(this, 'setHighlighted', highlight);
  if (highlight && this.highlightedIndex_ == -1) {
    // If there was a last highlighted index, use that. Otherwise, highlight the
    // first cell.
    this.setHighlightedIndex(
        this.lastHighlightedIndex_ > -1 ?
        this.lastHighlightedIndex_ :
        0);
  } else if (!highlight) {
    this.setHighlightedIndex(-1);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Private helper; selects or deselects the given item based on the value of
***REMOVED*** the Boolean argument.  This implementation simply applies selection styling
***REMOVED*** to the cell containing the item to be selected.  Does nothing if the palette
***REMOVED*** hasn't been rendered yet.
***REMOVED*** @param {Node} item Item to select or deselect.
***REMOVED*** @param {boolean} select If true, the item is selected; otherwise it is
***REMOVED***     deselected.
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.selectItem_ = function(item, select) {
  if (this.getElement()) {
    this.getRenderer().selectCell(this, item, select);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calculates and updates the size of the palette based on any preset values
***REMOVED*** and the number of palette items.  If there is no preset size, sets the
***REMOVED*** palette size to the smallest square big enough to contain all items.  If
***REMOVED*** there is a preset number of columns, increases the number of rows to hold
***REMOVED*** all items if needed.  (If there are too many rows, does nothing.)
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.prototype.adjustSize_ = function() {
  var items = this.getContent();
  if (items) {
    if (this.size_ && this.size_.width) {
      // There is already a size set; honor the number of columns (if >0), but
      // increase the number of rows if needed.
      var minRows = Math.ceil(items.length / this.size_.width);
      if (!goog.isNumber(this.size_.height) || this.size_.height < minRows) {
        this.size_.height = minRows;
      }
    } else {
      // No size has been set; size the grid to the smallest square big enough
      // to hold all items (hey, why not?).
      var length = Math.ceil(Math.sqrt(items.length));
      this.size_ = new goog.math.Size(length, length);
    }
  } else {
    // No items; set size to 0x0.
    this.size_ = new goog.math.Size(0, 0);
  }
***REMOVED***



***REMOVED***
***REMOVED*** A component to represent the currently highlighted cell.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED*** @private
***REMOVED***
goog.ui.Palette.CurrentCell_ = function() {
  goog.ui.Palette.CurrentCell_.base(this, 'constructor', null);
  this.setDispatchTransitionEvents(goog.ui.Component.State.HOVER, true);
***REMOVED***
goog.inherits(goog.ui.Palette.CurrentCell_, goog.ui.Control);


***REMOVED***
***REMOVED*** @param {boolean} highlight Whether to highlight or unhighlight the component.
***REMOVED*** @return {boolean} Whether it was successful.
***REMOVED***
goog.ui.Palette.CurrentCell_.prototype.tryHighlight = function(highlight) {
  this.setHighlighted(highlight);
  return this.isHighlighted() == highlight;
***REMOVED***
