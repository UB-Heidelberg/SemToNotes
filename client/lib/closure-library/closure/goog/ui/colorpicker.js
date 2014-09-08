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
***REMOVED*** @fileoverview A color picker component.  A color picker can compose several
***REMOVED*** instances of goog.ui.ColorPalette.
***REMOVED***
***REMOVED*** NOTE: The ColorPicker is in a state of transition towards the common
***REMOVED*** component/control/container interface we are developing.  If the API changes
***REMOVED*** we will do our best to update your code.  The end result will be that a
***REMOVED*** color picker will compose multiple color palettes.  In the simple case this
***REMOVED*** will be one grid, but may consistute 3 distinct grids, a custom color picker
***REMOVED*** or even a color wheel.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ColorPicker');
goog.provide('goog.ui.ColorPicker.EventType');

goog.require('goog.ui.ColorPalette');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Create a new, empty color picker.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.ColorPalette=} opt_colorPalette Optional color palette to
***REMOVED***     use for this color picker.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.ColorPicker = function(opt_domHelper, opt_colorPalette) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The color palette used inside the color picker.
  ***REMOVED*** @type {goog.ui.ColorPalette?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.colorPalette_ = opt_colorPalette || null;

  this.getHandler().listen(
      this, goog.ui.Component.EventType.ACTION, this.onColorPaletteAction_);
***REMOVED***
goog.inherits(goog.ui.ColorPicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Default number of columns in the color palette. May be overridden by calling
***REMOVED*** setSize.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.ui.ColorPicker.DEFAULT_NUM_COLS = 5;


***REMOVED***
***REMOVED*** Constants for event names.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ColorPicker.EventType = {
  CHANGE: 'change'
***REMOVED***


***REMOVED***
***REMOVED*** Whether the component is focusable.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPicker.prototype.focusable_ = true;


***REMOVED***
***REMOVED*** Gets the array of colors displayed by the color picker.
***REMOVED*** Modifying this array will lead to unexpected behavior.
***REMOVED*** @return {Array.<string>?} The colors displayed by this widget.
***REMOVED***
goog.ui.ColorPicker.prototype.getColors = function() {
  return this.colorPalette_ ? this.colorPalette_.getColors() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the array of colors to be displayed by the color picker.
***REMOVED*** @param {Array.<string>} colors The array of colors to be added.
***REMOVED***
goog.ui.ColorPicker.prototype.setColors = function(colors) {
  // TODO(user): Don't add colors directly, we should add palettes and the
  // picker should support multiple palettes.
  if (!this.colorPalette_) {
    this.createColorPalette_(colors);
  } else {
    this.colorPalette_.setColors(colors);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the array of colors to be displayed by the color picker.
***REMOVED*** @param {Array.<string>} colors The array of colors to be added.
***REMOVED*** @deprecated Use setColors.
***REMOVED***
goog.ui.ColorPicker.prototype.addColors = function(colors) {
  this.setColors(colors);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the size of the palette.  Will throw an error after the picker has been
***REMOVED*** rendered.
***REMOVED*** @param {goog.math.Size|number} size The size of the grid.
***REMOVED***
goog.ui.ColorPicker.prototype.setSize = function(size) {
  // TODO(user): The color picker should contain multiple palettes which will
  // all be resized at this point.
  if (!this.colorPalette_) {
    this.createColorPalette_([]);
  }
  this.colorPalette_.setSize(size);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number of columns displayed.
***REMOVED*** @return {goog.math.Size?} The size of the grid.
***REMOVED***
goog.ui.ColorPicker.prototype.getSize = function() {
  return this.colorPalette_ ? this.colorPalette_.getSize() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of columns.  Will throw an error after the picker has been
***REMOVED*** rendered.
***REMOVED*** @param {number} n The number of columns.
***REMOVED*** @deprecated Use setSize.
***REMOVED***
goog.ui.ColorPicker.prototype.setColumnCount = function(n) {
  this.setSize(n);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The index of the color selected.
***REMOVED***
goog.ui.ColorPicker.prototype.getSelectedIndex = function() {
  return this.colorPalette_ ? this.colorPalette_.getSelectedIndex() : -1;
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected. A value that is out-of-range means that no
***REMOVED*** color is selected.
***REMOVED*** @param {number} ind The index in this.colors_ of the selected color.
***REMOVED***
goog.ui.ColorPicker.prototype.setSelectedIndex = function(ind) {
  if (this.colorPalette_) {
    this.colorPalette_.setSelectedIndex(ind);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the color that is currently selected in this color picker.
***REMOVED*** @return {?string} The hex string of the color selected, or null if no
***REMOVED***     color is selected.
***REMOVED***
goog.ui.ColorPicker.prototype.getSelectedColor = function() {
  return this.colorPalette_ ? this.colorPalette_.getSelectedColor() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets which color is selected.  Noop if the color palette hasn't been created
***REMOVED*** yet.
***REMOVED*** @param {string} color The selected color.
***REMOVED***
goog.ui.ColorPicker.prototype.setSelectedColor = function(color) {
  // TODO(user): This will set the color in the first available palette that
  // contains it
  if (this.colorPalette_) {
    this.colorPalette_.setSelectedColor(color);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is focusable, false otherwise.  The default
***REMOVED*** is true.  Focusable components always have a tab index and allocate a key
***REMOVED*** handler to handle keyboard events while focused.
***REMOVED*** @return {boolean} True iff the component is focusable.
***REMOVED***
goog.ui.ColorPicker.prototype.isFocusable = function() {
  return this.focusable_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the component is focusable.  The default is true.
***REMOVED*** Focusable components always have a tab index and allocate a key handler to
***REMOVED*** handle keyboard events while focused.
***REMOVED*** @param {boolean} focusable True iff the component is focusable.
***REMOVED***
goog.ui.ColorPicker.prototype.setFocusable = function(focusable) {
  this.focusable_ = focusable;
  if (this.colorPalette_) {
    this.colorPalette_.setSupportedState(goog.ui.Component.State.FOCUSED,
        focusable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** ColorPickers cannot be used to decorate pre-existing html, since the
***REMOVED*** structure they build is fairly complicated.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Returns always false.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorPicker.prototype.canDecorate = function(element) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Renders the color picker inside the provided element. This will override the
***REMOVED*** current content of the element.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorPicker.prototype.enterDocument = function() {
  goog.ui.ColorPicker.superClass_.enterDocument.call(this);
  if (this.colorPalette_) {
    this.colorPalette_.render(this.getElement());
  }
  this.getElement().unselectable = 'on';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ColorPicker.prototype.disposeInternal = function() {
  goog.ui.ColorPicker.superClass_.disposeInternal.call(this);
  if (this.colorPalette_) {
    this.colorPalette_.dispose();
    this.colorPalette_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the focus to the color picker's palette.
***REMOVED***
goog.ui.ColorPicker.prototype.focus = function() {
  if (this.colorPalette_) {
    this.colorPalette_.getElement().focus();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles actions from the color palette.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPicker.prototype.onColorPaletteAction_ = function(e) {
  e.stopPropagation();
  this.dispatchEvent(goog.ui.ColorPicker.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Create a color palette for the color picker.
***REMOVED*** @param {Array.<string>} colors Array of colors.
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPicker.prototype.createColorPalette_ = function(colors) {
  // TODO(user): The color picker should eventually just contain a number of
  // palettes and manage the interactions between them.  This will go away then.
  var cp = new goog.ui.ColorPalette(colors, null, this.getDomHelper());
  cp.setSize(goog.ui.ColorPicker.DEFAULT_NUM_COLS);
  cp.setSupportedState(goog.ui.Component.State.FOCUSED, this.focusable_);
  // TODO(user): Use addChild(cp, true) and remove calls to render.
  this.addChild(cp);
  this.colorPalette_ = cp;
  if (this.isInDocument()) {
    this.colorPalette_.render(this.getElement());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns an unrendered instance of the color picker.  The colors and layout
***REMOVED*** are a simple color grid, the same as the old Gmail color picker.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @return {!goog.ui.ColorPicker} The unrendered instance.
***REMOVED***
goog.ui.ColorPicker.createSimpleColorGrid = function(opt_domHelper) {
  var cp = new goog.ui.ColorPicker(opt_domHelper);
  cp.setSize(7);
  cp.setColors(goog.ui.ColorPicker.SIMPLE_GRID_COLORS);
  return cp;
***REMOVED***


***REMOVED***
***REMOVED*** Array of colors for a 7-cell wide simple-grid color picker.
***REMOVED*** @type {Array.<string>}
***REMOVED***
goog.ui.ColorPicker.SIMPLE_GRID_COLORS = [
  // grays
  '#ffffff', '#cccccc', '#c0c0c0', '#999999', '#666666', '#333333', '#000000',
  // reds
  '#ffcccc', '#ff6666', '#ff0000', '#cc0000', '#990000', '#660000', '#330000',
  // oranges
  '#ffcc99', '#ff9966', '#ff9900', '#ff6600', '#cc6600', '#993300', '#663300',
  // yellows
  '#ffff99', '#ffff66', '#ffcc66', '#ffcc33', '#cc9933', '#996633', '#663333',
  // olives
  '#ffffcc', '#ffff33', '#ffff00', '#ffcc00', '#999900', '#666600', '#333300',
  // greens
  '#99ff99', '#66ff99', '#33ff33', '#33cc00', '#009900', '#006600', '#003300',
  // turquoises
  '#99ffff', '#33ffff', '#66cccc', '#00cccc', '#339999', '#336666', '#003333',
  // blues
  '#ccffff', '#66ffff', '#33ccff', '#3366ff', '#3333ff', '#000099', '#000066',
  // purples
  '#ccccff', '#9999ff', '#6666cc', '#6633ff', '#6600cc', '#333399', '#330099',
  // violets
  '#ffccff', '#ff99ff', '#cc66cc', '#cc33cc', '#993399', '#663366', '#330033'
];
