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
***REMOVED*** @fileoverview A control for representing a palette of colors, that the user
***REMOVED*** can highlight or select via the keyboard or the mouse.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ColorPalette');

goog.require('goog.array');
goog.require('goog.color');
goog.require('goog.style');
goog.require('goog.ui.Palette');
goog.require('goog.ui.PaletteRenderer');



***REMOVED***
***REMOVED*** A color palette is a grid of color swatches that the user can highlight or
***REMOVED*** select via the keyboard or the mouse.  The selection state of the palette is
***REMOVED*** controlled by a selection model.  When the user makes a selection, the
***REMOVED*** component fires an ACTION event.  Event listeners may retrieve the selected
***REMOVED*** color using the {@link #getSelectedColor} method.
***REMOVED***
***REMOVED*** @param {Array.<string>=} opt_colors Array of colors in any valid CSS color
***REMOVED***     format.
***REMOVED*** @param {goog.ui.PaletteRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the palette; defaults to {@link goog.ui.PaletteRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Palette}
***REMOVED***
goog.ui.ColorPalette = function(opt_colors, opt_renderer, opt_domHelper) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of colors to show in the palette.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.colors_ = opt_colors || [];

  goog.ui.Palette.call(this, null,
      opt_renderer || goog.ui.PaletteRenderer.getInstance(), opt_domHelper);

  // Set the colors separately from the super call since we need the correct
  // DomHelper to be initialized for this class.
  this.setColors(this.colors_);
***REMOVED***
goog.inherits(goog.ui.ColorPalette, goog.ui.Palette);


***REMOVED***
***REMOVED*** Array of normalized colors. Initialized lazily as often never needed.
***REMOVED*** @type {?Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPalette.prototype.normalizedColors_ = null;


***REMOVED***
***REMOVED*** Array of labels for the colors. Will be used for the tooltips and
***REMOVED*** accessibility.
***REMOVED*** @type {?Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPalette.prototype.labels_ = null;


***REMOVED***
***REMOVED*** Returns the array of colors represented in the color palette.
***REMOVED*** @return {Array.<string>} Array of colors.
***REMOVED***
goog.ui.ColorPalette.prototype.getColors = function() {
  return this.colors_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the colors that are contained in the palette.
***REMOVED*** @param {Array.<string>} colors Array of colors in any valid CSS color format.
***REMOVED*** @param {Array.<string>=} opt_labels The array of labels to be used as
***REMOVED***        tooltips. When not provided, the color value will be used.
***REMOVED***
goog.ui.ColorPalette.prototype.setColors = function(colors, opt_labels) {
  this.colors_ = colors;
  this.labels_ = opt_labels || null;
  this.normalizedColors_ = null;
  this.setContent(this.createColorNodes());
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The current selected color in hex, or null.
***REMOVED***
goog.ui.ColorPalette.prototype.getSelectedColor = function() {
  var selectedItem =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getSelectedItem());
  if (selectedItem) {
    var color = goog.style.getStyle(selectedItem, 'background-color');
    return goog.ui.ColorPalette.parseColor_(color);
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected color.  Clears the selection if the argument is null or
***REMOVED*** can't be parsed as a color.
***REMOVED*** @param {?string} color The color to set as selected; null clears the
***REMOVED***     selection.
***REMOVED***
goog.ui.ColorPalette.prototype.setSelectedColor = function(color) {
  var hexColor = goog.ui.ColorPalette.parseColor_(color);
  if (!this.normalizedColors_) {
    this.normalizedColors_ = goog.array.map(this.colors_, function(color) {
      return goog.ui.ColorPalette.parseColor_(color);
    });
  }
  this.setSelectedIndex(hexColor ?
      goog.array.indexOf(this.normalizedColors_, hexColor) : -1);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<!Node>} An array of DOM nodes for each color.
***REMOVED*** @protected
***REMOVED***
goog.ui.ColorPalette.prototype.createColorNodes = function() {
  return goog.array.map(this.colors_, function(color, index) {
    var swatch = this.getDomHelper().createDom('div', {
      'class': goog.getCssName(this.getRenderer().getCssClass(),
          'colorswatch'),
      'style': 'background-color:' + color
    });
    if (this.labels_ && this.labels_[index]) {
      swatch.title = this.labels_[index];
    } else {
      swatch.title = color.charAt(0) == '#' ?
          'RGB (' + goog.color.hexToRgb(color).join(', ') + ')' : color;
    }
    return swatch;
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a string, attempts to parse it as a color spec, and returns a
***REMOVED*** normalized hex color spec if successful (null otherwise).
***REMOVED*** @param {?string} color String possibly containing a color spec; may be null.
***REMOVED*** @return {?string} Normalized hex color spec, or null if the argument can't
***REMOVED***     be parsed as a color.
***REMOVED*** @private
***REMOVED***
goog.ui.ColorPalette.parseColor_ = function(color) {
  if (color) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      return goog.color.parse(color).hex;
    } catch (ex) {
      // Fall through.
    }
  }
  return null;
***REMOVED***
