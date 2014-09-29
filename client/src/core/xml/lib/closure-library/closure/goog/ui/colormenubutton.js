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
***REMOVED*** @fileoverview A color menu button.  Extends {@link goog.ui.MenuButton} by
***REMOVED*** showing the currently selected color in the button caption.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ColorMenuButton');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.ui.ColorMenuButtonRenderer');
goog.require('goog.ui.ColorPalette');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A color menu button control.  Extends {@link goog.ui.MenuButton} by adding
***REMOVED*** an API for getting and setting the currently selected color from a menu of
***REMOVED*** color palettes.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or existing DOM
***REMOVED***     structure to display as the button's caption.
***REMOVED*** @param {goog.ui.Menu=} opt_menu Menu to render under the button when clicked;
***REMOVED***     should contain at least one {@link goog.ui.ColorPalette} if present.
***REMOVED*** @param {goog.ui.MenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to {@link goog.ui.ColorMenuButtonRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButton}
***REMOVED***
goog.ui.ColorMenuButton = function(content, opt_menu, opt_renderer,
    opt_domHelper) {
  goog.ui.MenuButton.call(this, content, opt_menu, opt_renderer ||
      goog.ui.ColorMenuButtonRenderer.getInstance(), opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.ColorMenuButton, goog.ui.MenuButton);


***REMOVED***
***REMOVED*** Default color palettes.
***REMOVED*** @type {!Object}
***REMOVED***
goog.ui.ColorMenuButton.PALETTES = {
 ***REMOVED*****REMOVED*** Default grayscale colors.***REMOVED***
  GRAYSCALE: [
    '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff'
  ],

 ***REMOVED*****REMOVED*** Default solid colors.***REMOVED***
  SOLID: [
    '#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f'
  ],

 ***REMOVED*****REMOVED*** Default pastel colors.***REMOVED***
  PASTEL: [
    '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9',
      '#ead1dc',
    '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6',
      '#d5a6bd',
    '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3',
      '#c27ba0',
    '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7',
      '#a64d79',
    '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75',
      '#741b47',
    '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d',
      '#4c1130'
  ]
***REMOVED***


***REMOVED***
***REMOVED*** Value for the "no color" menu item object in the color menu (if present).
***REMOVED*** The {@link goog.ui.ColorMenuButton#handleMenuAction} method interprets
***REMOVED*** ACTION events dispatched by an item with this value as meaning "clear the
***REMOVED*** selected color."
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ColorMenuButton.NO_COLOR = 'none';


***REMOVED***
***REMOVED*** Factory method that creates and returns a new {@link goog.ui.Menu} instance
***REMOVED*** containing default color palettes.
***REMOVED*** @param {Array.<goog.ui.Control>=} opt_extraItems Optional extra menu items to
***REMOVED***     add before the color palettes.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED*** @return {goog.ui.Menu} Color menu.
***REMOVED***
goog.ui.ColorMenuButton.newColorMenu = function(opt_extraItems, opt_domHelper) {
  var menu = new goog.ui.Menu(opt_domHelper);

  if (opt_extraItems) {
    goog.array.forEach(opt_extraItems, function(item) {
      menu.addChild(item, true);
    });
  }

  goog.object.forEach(goog.ui.ColorMenuButton.PALETTES, function(colors) {
    var palette = new goog.ui.ColorPalette(colors, null, opt_domHelper);
    palette.setSize(8);
    menu.addChild(palette, true);
  });

  return menu;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently selected color (null if none).
***REMOVED*** @return {?string} The selected color.
***REMOVED***
goog.ui.ColorMenuButton.prototype.getSelectedColor = function() {
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getValue());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected color, or clears the selected color if the argument is
***REMOVED*** null or not any of the available color choices.
***REMOVED*** @param {?string} color New color.
***REMOVED***
goog.ui.ColorMenuButton.prototype.setSelectedColor = function(color) {
  this.setValue(color);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value associated with the color menu button.  Overrides
***REMOVED*** {@link goog.ui.Button#setValue} by interpreting the value as a color
***REMOVED*** spec string.
***REMOVED*** @param {*} value New button value; should be a color spec string.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButton.prototype.setValue = function(value) {
  var color =***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (value);
  for (var i = 0, item; item = this.getItemAt(i); i++) {
    if (typeof item.setSelectedColor == 'function') {
      // This menu item looks like a color palette.
      item.setSelectedColor(color);
    }
  }
  goog.ui.ColorMenuButton.superClass_.setValue.call(this, color);
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@link goog.ui.Component.EventType.ACTION} events dispatched by
***REMOVED*** the menu item clicked by the user.  Updates the button, calls the superclass
***REMOVED*** implementation to hide the menu, stops the propagation of the event, and
***REMOVED*** dispatches an ACTION event on behalf of the button itself.  Overrides
***REMOVED*** {@link goog.ui.MenuButton#handleMenuAction}.
***REMOVED*** @param {goog.events.Event} e Action event to handle.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButton.prototype.handleMenuAction = function(e) {
  if (typeof e.target.getSelectedColor == 'function') {
    // User clicked something that looks like a color palette.
    this.setValue(e.target.getSelectedColor());
  } else if (e.target.getValue() == goog.ui.ColorMenuButton.NO_COLOR) {
    // User clicked the special "no color" menu item.
    this.setValue(null);
  }
  goog.ui.ColorMenuButton.superClass_.handleMenuAction.call(this, e);
  e.stopPropagation();
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
***REMOVED***


***REMOVED***
***REMOVED*** Opens or closes the menu.  Overrides {@link goog.ui.MenuButton#setOpen} by
***REMOVED*** generating a default color menu on the fly if needed.
***REMOVED*** @param {boolean} open Whether to open or close the menu.
***REMOVED*** @param {goog.events.Event=} opt_e Mousedown event that caused the menu to
***REMOVED***     be opened.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButton.prototype.setOpen = function(open, opt_e) {
  if (open && this.getItemCount() == 0) {
    this.setMenu(
        goog.ui.ColorMenuButton.newColorMenu(null, this.getDomHelper()));
    this.setValue(***REMOVED*** @type {?string}***REMOVED*** (this.getValue()));
  }
  goog.ui.ColorMenuButton.superClass_.setOpen.call(this, open, opt_e);
***REMOVED***


// Register a decorator factory function for goog.ui.ColorMenuButtons.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.ColorMenuButtonRenderer.CSS_CLASS,
    function() {
      return new goog.ui.ColorMenuButton(null);
    });
