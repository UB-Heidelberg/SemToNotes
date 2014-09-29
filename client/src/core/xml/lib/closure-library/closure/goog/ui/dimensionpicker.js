// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A dimension picker control.  A dimension picker allows the
***REMOVED*** user to visually select a row and column count.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author abefettig@google.com (Abe Fettig)
***REMOVED*** @see ../demos/dimensionpicker.html
***REMOVED*** @see ../demos/dimensionpicker_rtl.html
***REMOVED***

goog.provide('goog.ui.DimensionPicker');

***REMOVED***
goog.require('goog.math.Size');
goog.require('goog.ui.Control');
goog.require('goog.ui.DimensionPickerRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A dimension picker allows the user to visually select a row and column
***REMOVED*** count using their mouse and keyboard.
***REMOVED***
***REMOVED*** The currently selected dimension is controlled by an ACTION event.  Event
***REMOVED*** listeners may retrieve the selected item using the
***REMOVED*** {@link #getValue} method.
***REMOVED***
***REMOVED*** @param {goog.ui.DimensionPickerRenderer=} opt_renderer Renderer used to
***REMOVED***     render or decorate the palette; defaults to
***REMOVED***     {@link goog.ui.DimensionPickerRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.DimensionPicker = function(opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, null,
      opt_renderer || goog.ui.DimensionPickerRenderer.getInstance(),
      opt_domHelper);

  this.size_ = new goog.math.Size(this.minColumns, this.minRows);
***REMOVED***
goog.inherits(goog.ui.DimensionPicker, goog.ui.Control);


***REMOVED***
***REMOVED*** Minimum number of columns to show in the grid.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.DimensionPicker.prototype.minColumns = 5;


***REMOVED***
***REMOVED*** Minimum number of rows to show in the grid.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.DimensionPicker.prototype.minRows = 5;


***REMOVED***
***REMOVED*** Maximum number of columns to show in the grid.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.DimensionPicker.prototype.maxColumns = 20;


***REMOVED***
***REMOVED*** Maximum number of rows to show in the grid.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.DimensionPicker.prototype.maxRows = 20;


***REMOVED***
***REMOVED*** Palette dimensions (columns x rows).
***REMOVED*** @type {goog.math.Size}
***REMOVED*** @private
***REMOVED***
goog.ui.DimensionPicker.prototype.size_;


***REMOVED***
***REMOVED*** Currently highlighted row count.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.DimensionPicker.prototype.highlightedRows_ = 1;


***REMOVED***
***REMOVED*** Currently highlighted column count.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.DimensionPicker.prototype.highlightedColumns_ = 1;


***REMOVED*** @override***REMOVED***
goog.ui.DimensionPicker.prototype.enterDocument = function() {
  goog.ui.DimensionPicker.superClass_.enterDocument.call(this);

  var handler = this.getHandler();
  handler.
      listen(this.getRenderer().getMouseMoveElement(this),
          goog.events.EventType.MOUSEMOVE, this.handleMouseMove).
      listen(this.getDomHelper().getWindow(), goog.events.EventType.RESIZE,
          this.handleWindowResize);

  var parent = this.getParent();
  if (parent) {
    handler.listen(parent, goog.ui.Component.EventType.SHOW, this.handleShow_);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DimensionPicker.prototype.exitDocument = function() {
  goog.ui.DimensionPicker.superClass_.exitDocument.call(this);

  var handler = this.getHandler();
  handler.
      unlisten(this.getRenderer().getMouseMoveElement(this),
          goog.events.EventType.MOUSEMOVE, this.handleMouseMove).
      unlisten(this.getDomHelper().getWindow(), goog.events.EventType.RESIZE,
          this.handleWindowResize);

  var parent = this.getParent();
  if (parent) {
    handler.unlisten(parent, goog.ui.Component.EventType.SHOW,
        this.handleShow_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Resets the highlighted size when the picker is shown.
***REMOVED*** @private
***REMOVED***
goog.ui.DimensionPicker.prototype.handleShow_ = function() {
  if (this.isVisible()) {
    this.setValue(1, 1);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DimensionPicker.prototype.disposeInternal = function() {
  goog.ui.DimensionPicker.superClass_.disposeInternal.call(this);
  delete this.size_;
***REMOVED***


// Palette event handling.


***REMOVED***
***REMOVED*** Handles mousemove events.  Determines which palette size was moused over and
***REMOVED*** highlights it.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.DimensionPicker.prototype.handleMouseMove = function(e) {
  var highlightedSizeX = this.getRenderer().getGridOffsetX(this,
      this.isRightToLeft() ? e.target.offsetWidth - e.offsetX : e.offsetX);
  var highlightedSizeY = this.getRenderer().getGridOffsetY(this, e.offsetY);

  this.setValue(highlightedSizeX, highlightedSizeY);
***REMOVED***


***REMOVED***
***REMOVED*** Handles window resize events.  Ensures no scrollbars are introduced by the
***REMOVED*** renderer's mouse catcher.
***REMOVED*** @param {goog.events.Event} e Resize event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.DimensionPicker.prototype.handleWindowResize = function(e) {
  this.getRenderer().positionMouseCatcher(this);
***REMOVED***


***REMOVED***
***REMOVED*** Handle key events if supported, so the user can use the keyboard to
***REMOVED*** manipulate the highlighted rows and columns.
***REMOVED*** @param {goog.events.KeyEvent} e The key event object.
***REMOVED*** @return {boolean} Whether the key event was handled.
***REMOVED*** @override
***REMOVED***
goog.ui.DimensionPicker.prototype.handleKeyEvent = function(e) {
  var rows = this.highlightedRows_;
  var columns = this.highlightedColumns_;
  switch (e.keyCode) {
    case goog.events.KeyCodes.DOWN:
      rows++;
      break;
    case goog.events.KeyCodes.UP:
      rows--;
      break;
    case goog.events.KeyCodes.LEFT:
      if (columns == 1) {
        // Delegate to parent.
        return false;
      } else {
        columns--;
      }
      break;
    case goog.events.KeyCodes.RIGHT:
      columns++;
      break;
    default:
      return goog.ui.DimensionPicker.superClass_.handleKeyEvent.call(this, e);
  }
  this.setValue(columns, rows);
  return true;
***REMOVED***


// Palette management.


***REMOVED***
***REMOVED*** @return {goog.math.Size} Current table size shown (columns x rows).
***REMOVED***
goog.ui.DimensionPicker.prototype.getSize = function() {
  return this.size_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Size} size The currently highlighted dimensions.
***REMOVED***
goog.ui.DimensionPicker.prototype.getValue = function() {
  return new goog.math.Size(this.highlightedColumns_, this.highlightedRows_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the currently highlighted dimensions. If the dimensions are not valid
***REMOVED*** (not between 1 and the maximum number of columns/rows to show), they will
***REMOVED*** be changed to the closest valid value.
***REMOVED*** @param {(number|!goog.math.Size)} columns The number of columns to highlight,
***REMOVED***     or a goog.math.Size object containing both.
***REMOVED*** @param {number=} opt_rows The number of rows to highlight.  Can be
***REMOVED***     omitted when columns is a good.math.Size object.
***REMOVED***
goog.ui.DimensionPicker.prototype.setValue = function(columns,
    opt_rows) {
  if (!goog.isDef(opt_rows)) {
    columns =***REMOVED*****REMOVED*** @type {!goog.math.Size}***REMOVED*** (columns);
    opt_rows = columns.height;
    columns = columns.width;
  } else {
    columns =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (columns);
  }

  // Ensure that the row and column values are within the minimum value (1) and
  // maxmimum values.
  columns = Math.max(1, columns);
  opt_rows = Math.max(1, opt_rows);
  columns = Math.min(this.maxColumns, columns);
  opt_rows = Math.min(this.maxRows, opt_rows);

  if (this.highlightedColumns_ != columns ||
      this.highlightedRows_ != opt_rows) {
    var renderer = this.getRenderer();
    // Show one more row/column than highlighted so the user understands the
    // palette can grow.
    this.size_.width = Math.max(
        Math.min(columns + 1, this.maxColumns), this.minColumns);
    this.size_.height = Math.max(
        Math.min(opt_rows + 1, this.maxRows), this.minRows);
    renderer.updateSize(this, this.getElement());

    this.highlightedColumns_ = columns;
    this.highlightedRows_ = opt_rows;
    renderer.setHighlightedSize(this, columns, opt_rows);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Register this control so it can be created from markup
***REMOVED***
goog.ui.registry.setDecoratorByClassName(
    goog.ui.DimensionPickerRenderer.CSS_CLASS,
    function() {
      return new goog.ui.DimensionPicker();
    });
