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

***REMOVED***
***REMOVED*** @fileoverview A palette of icons.
***REMOVED*** The icons are generated from a single sprite image that
***REMOVED*** is used for multiple palettes.
***REMOVED*** All icons of a single palette must be on the same sprite row
***REMOVED*** (same y coordinate) and all have the same width.
***REMOVED*** Each item has an associated action command that should be taken
***REMOVED*** when certain event is dispatched.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.equation.Palette');
goog.provide('goog.ui.equation.PaletteEvent');
goog.provide('goog.ui.equation.PaletteRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.Event');
goog.require('goog.ui.Palette');
goog.require('goog.ui.PaletteRenderer');



***REMOVED***
***REMOVED*** Constructs a new palette.
***REMOVED*** @param {goog.ui.equation.PaletteManager} paletteManager The
***REMOVED***     manager of the palette.
***REMOVED*** @param {goog.ui.equation.Palette.Type} type The type of the
***REMOVED***     palette.
***REMOVED*** @param {number} spriteX Coordinate of first icon in sprite.
***REMOVED*** @param {number} spriteY Coordinate of top of all icons in sprite.
***REMOVED*** @param {number} itemWidth Pixel width of each palette icon.
***REMOVED*** @param {number} itemHeight Pixel height of each palette icon.
***REMOVED*** @param {Array.<string>=} opt_actions An optional action list for palette
***REMOVED***     elements. The number of actions determine the number of palette
***REMOVED***     elements.
***REMOVED*** @param {goog.ui.PaletteRenderer=} opt_renderer Optional customized renderer,
***REMOVED***     defaults to {@link goog.ui.PaletteRenderer}.
***REMOVED*** @extends {goog.ui.Palette}
***REMOVED***
***REMOVED***
goog.ui.equation.Palette = function(paletteManager, type, spriteX,
    spriteY, itemWidth, itemHeight, opt_actions, opt_renderer) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The type of the palette.
  ***REMOVED*** @type {goog.ui.equation.Palette.Type}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The palette actions.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.actions_ = opt_actions || [];

  var renderer =
      opt_renderer ||
      goog.ui.equation.PaletteRenderer.getInstance();

  // Create a div element for each icon.
  var elements = [];
  var x = - spriteX;
  var y = - spriteY;
  for (var i = 0; i < opt_actions.length; i++) {
    elements.push(paletteManager.getDomHelper().createDom(
        goog.dom.TagName.DIV,
        {'class': renderer.getItemCssClass(),
          'style': 'width:' + itemWidth +
              'px;height:' + itemHeight +
              'px;' +
              'background-position:' +
              x + 'px ' + y + 'px;'}));
    x -= itemWidth;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** The palette manager that manages all the palettes.
  ***REMOVED*** @type {goog.ui.equation.PaletteManager}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.paletteManager_ = paletteManager;

  goog.ui.Palette.call(this, elements, renderer, paletteManager.getDomHelper());
***REMOVED***
goog.inherits(goog.ui.equation.Palette, goog.ui.Palette);


***REMOVED***
***REMOVED*** The type of possible palettes. They are made short to minimize JS size.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.equation.Palette.Type = {
  MENU: 'mn',
  GREEK: 'g',
  SYMBOL: 's',
  COMPARISON: 'c',
  MATH: 'm',
  ARROW: 'a'
***REMOVED***


***REMOVED***
***REMOVED*** The CSS class name for the palette.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.Palette.CSS_CLASS = 'ee-palette';


***REMOVED***
***REMOVED*** Returns the type of the palette.
***REMOVED*** @return {goog.ui.equation.Palette.Type} The type of the palette.
***REMOVED***
goog.ui.equation.Palette.prototype.getType = function() {
  return this.type_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the palette manager.
***REMOVED*** @return {goog.ui.equation.PaletteManager} The palette manager
***REMOVED***     that manages all the palette.
***REMOVED***
goog.ui.equation.Palette.prototype.getPaletteManager = function() {
  return this.paletteManager_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns actions for this palette.
***REMOVED*** @return {Array.<string>} The palette actions.
***REMOVED***
goog.ui.equation.Palette.prototype.getActions = function() {
  return this.actions_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the action for a given index.
***REMOVED*** @param {number} index The index of the action to be retrieved.
***REMOVED*** @return {string?} The action for given index, or {@code null} if action is
***REMOVED***     not found.
***REMOVED***
goog.ui.equation.Palette.prototype.getAction = function(index) {
  return (index >= 0 && index < this.actions_.length) ?
      this.actions_[index] : null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseup events. Overrides {@link goog.ui.Palette#handleMouseUp}
***REMOVED*** by dispatching a {@link goog.ui.equation.PaletteEvent}.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.equation.Palette.prototype.handleMouseUp = function(e) {
  goog.ui.equation.Palette.base(this, 'handleMouseUp', e);

  this.paletteManager_.dispatchEvent(
      new goog.ui.equation.PaletteEvent(
          goog.ui.equation.PaletteEvent.Type.ACTION, this));
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse out events. Overrides {@link goog.ui.Palette#handleMouseOut}
***REMOVED*** by deactivate the palette.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.equation.Palette.prototype.handleMouseOut = function(e) {
  goog.ui.equation.Palette.base(this, 'handleMouseOut', e);

  // Ignore mouse moves between descendants.
  if (e.relatedTarget &&
      !goog.dom.contains(this.getElement(), e.relatedTarget)) {
    this.paletteManager_.deactivate();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse over events. Overrides {@link goog.ui.Palette#handleMouseOver}
***REMOVED*** by stop deactivating the palette. When mouse leaves the palettes, the
***REMOVED*** palettes will be deactivated after a centain period of time. Reentering the
***REMOVED*** palettes inside this time will stop the timer and cancel the deactivation.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.equation.Palette.prototype.handleMouseOver = function(e) {
  goog.ui.equation.Palette.base(this, 'handleMouseOver', e);

  // Ignore mouse moves between descendants.
  if (e.relatedTarget &&
      !goog.dom.contains(this.getElement(), e.relatedTarget)) {

    // Stop the timer to deactivate the palettes.
    this.paletteManager_.stopDeactivation();
  }
***REMOVED***



***REMOVED***
***REMOVED*** The event that palettes dispatches.
***REMOVED*** @param {string} type Type of the event.
***REMOVED*** @param {goog.ui.equation.Palette} palette The palette that the
***REMOVED***     event is fired on.
***REMOVED*** @param {Element=} opt_target The optional target of the event.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.ui.equation.PaletteEvent = function(type, palette, opt_target) {
  goog.events.Event.call(this, type, opt_target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The palette the event is fired from.
  ***REMOVED*** @type {goog.ui.equation.Palette}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.palette_ = palette;
***REMOVED***


***REMOVED***
***REMOVED*** The type of events that can be fired on palettes.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.equation.PaletteEvent.Type = {

  // Take the action that is associated with the palette item.
  ACTION: 'a'
***REMOVED***


***REMOVED***
***REMOVED*** Returns the palette that this event is fired from.
***REMOVED*** @return {goog.ui.equation.Palette} The palette this event is
***REMOVED***     fired from.
***REMOVED***
goog.ui.equation.PaletteEvent.prototype.getPalette = function() {
  return this.palette_;
***REMOVED***



***REMOVED***
***REMOVED*** The renderer for palette.
***REMOVED*** @extends {goog.ui.PaletteRenderer}
***REMOVED***
***REMOVED***
goog.ui.equation.PaletteRenderer = function() {
  goog.ui.PaletteRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.equation.PaletteRenderer, goog.ui.PaletteRenderer);
goog.addSingletonGetter(goog.ui.equation.PaletteRenderer);


***REMOVED*** @override***REMOVED***
goog.ui.equation.PaletteRenderer.prototype.getCssClass =
    function() {
  return goog.ui.equation.Palette.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class name for the palette item.
***REMOVED*** @return {string} The CSS class name of the palette item.
***REMOVED***
goog.ui.equation.PaletteRenderer.prototype.getItemCssClass = function() {
  return this.getCssClass() + '-item';
***REMOVED***
