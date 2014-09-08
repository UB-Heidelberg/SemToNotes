// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.ui.equation.PaletteManager');

goog.require('goog.Timer');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.ui.equation.ArrowPalette');
goog.require('goog.ui.equation.ComparisonPalette');
goog.require('goog.ui.equation.GreekPalette');
goog.require('goog.ui.equation.MathPalette');
goog.require('goog.ui.equation.MenuPalette');
goog.require('goog.ui.equation.Palette');
goog.require('goog.ui.equation.SymbolPalette');



***REMOVED***
***REMOVED*** Constructs the palette manager that manages all the palettes in Equation
***REMOVED*** Editor.
***REMOVED*** @param {!goog.dom.DomHelper} domHelper The DOM helper to be used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.ui.equation.PaletteManager = function(domHelper) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED*** @private {!goog.dom.DomHelper}***REMOVED***
  this.domHelper_ = domHelper;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map of palette type and instance pair.
  ***REMOVED*** @type {Object.<string, goog.ui.equation.Palette>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.paletteMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current active palette.
  ***REMOVED*** @type {goog.ui.equation.Palette}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activePalette_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event handler for managing events.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.equation.PaletteManager>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The timer used to add grace period when deactivate palettes.
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deactivationTimer_ = new goog.Timer(300);

  this.eventHandler_.listen(this.deactivationTimer_, goog.Timer.TICK,
      this.handleDeactivation_);

***REMOVED***
goog.inherits(goog.ui.equation.PaletteManager,
    goog.events.EventTarget);


***REMOVED***
***REMOVED*** Clears the deactivation timer.  This is used to prevent palette manager
***REMOVED*** deactivation when mouse pointer is moved outside palettes and moved back
***REMOVED*** quickly inside a grace period.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.stopDeactivation = function() {
  this.deactivationTimer_.stop();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the palette instance of given type.
***REMOVED*** @param {goog.ui.equation.Palette.Type} type The type of palette
***REMOVED***     to get.
***REMOVED*** @return {!goog.ui.equation.Palette} The palette instance of given
***REMOVED***     type. A new instance will be created.  If the instance doesn't exist.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.getPalette =
    function(type) {
  var paletteMap = this.paletteMap_;
  var palette = paletteMap[type];
  if (!palette) {
    switch (type) {
      case goog.ui.equation.Palette.Type.MENU:
        palette = new goog.ui.equation.MenuPalette(this);
        break;
      case goog.ui.equation.Palette.Type.GREEK:
        palette = new goog.ui.equation.GreekPalette(this);
        break;
      case goog.ui.equation.Palette.Type.SYMBOL:
        palette = new goog.ui.equation.SymbolPalette(this);
        break;
      case goog.ui.equation.Palette.Type.COMPARISON:
        palette = new goog.ui.equation.ComparisonPalette(this);
        break;
      case goog.ui.equation.Palette.Type.MATH:
        palette = new goog.ui.equation.MathPalette(this);
        break;
      case goog.ui.equation.Palette.Type.ARROW:
        palette = new goog.ui.equation.ArrowPalette(this);
        break;
      default:
        throw new Error('Invalid palette type!');
    }
    paletteMap[type] = palette;
  }
  return palette;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the palette instance of given type to be the active one.
***REMOVED*** @param {goog.ui.equation.Palette.Type} type The type of the
***REMOVED***     palette to set active.
***REMOVED*** @return {!goog.ui.equation.Palette} The palette instance of given
***REMOVED***     type. A new instance will be created, if the instance doesn't exist.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.setActive =
    function(type) {
  var palette = this.activePalette_;
  if (palette) {
    palette.setVisible(false);
  }

  palette = this.getPalette(type);
  this.activePalette_ = palette;
  palette.setVisible(true);

  return palette;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the active palette.
***REMOVED*** @return {goog.ui.equation.Palette} The active palette.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.getActive = function() {
  return this.activePalette_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the deactivation of open palette.
***REMOVED*** This method has a slight delay before doing the real deactivation.  This
***REMOVED*** helps prevent sudden disappearing of palettes when user moves mouse outside
***REMOVED*** them just briefly (and maybe accidentally).  If you really want to deactivate
***REMOVED*** the active palette, use {@link #deactivateNow()} instead.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.deactivate = function() {
  this.deactivationTimer_.start();
***REMOVED***


***REMOVED***
***REMOVED*** Deactivate the open palette immediately.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.deactivateNow = function() {
  this.handleDeactivation_();
***REMOVED***


***REMOVED***
***REMOVED*** Internal process of deactivation of the manager.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.PaletteManager.prototype.handleDeactivation_ = function() {
  this.setActive(goog.ui.equation.Palette.Type.MENU);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.dom.DomHelper} This object's DOM helper.
***REMOVED***
goog.ui.equation.PaletteManager.prototype.getDomHelper = function() {
  return this.domHelper_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.equation.PaletteManager.prototype.disposeInternal = function() {
  goog.ui.equation.PaletteManager.base(this, 'disposeInternal');
  this.activePalette_ = null;
  this.paletteMap_ = null;
***REMOVED***
