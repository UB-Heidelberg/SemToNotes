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

goog.provide('goog.ui.equation.MenuPalette');
goog.provide('goog.ui.equation.MenuPaletteRenderer');

goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.equation.Palette');
goog.require('goog.ui.equation.PaletteRenderer');



***REMOVED***
***REMOVED*** Constructs a new menu palette.
***REMOVED*** @param {goog.ui.equation.PaletteManager} paletteManager The
***REMOVED***     manager of the palette.
***REMOVED*** @extends {goog.ui.equation.Palette}
***REMOVED***
***REMOVED***
goog.ui.equation.MenuPalette = function(paletteManager) {
  goog.ui.equation.Palette.call(this, paletteManager,
      goog.ui.equation.Palette.Type.MENU,
      0, 0, 46, 18,
      [goog.ui.equation.Palette.Type.GREEK,
       goog.ui.equation.Palette.Type.SYMBOL,
       goog.ui.equation.Palette.Type.COMPARISON,
       goog.ui.equation.Palette.Type.MATH,
       goog.ui.equation.Palette.Type.ARROW],
      goog.ui.equation.MenuPaletteRenderer.getInstance());
  this.setSize(new goog.math.Size(5, 1));
***REMOVED***
goog.inherits(goog.ui.equation.MenuPalette, goog.ui.equation.Palette);


***REMOVED***
***REMOVED*** The CSS class name for the palette.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.MenuPalette.CSS_CLASS = 'ee-menu-palette';


***REMOVED***
***REMOVED*** Overrides the setVisible method to make menu palette always visible.
***REMOVED*** @param {boolean} visible Whether to show or hide the component.
***REMOVED*** @param {boolean=} opt_force If true, doesn't check whether the component
***REMOVED***     already has the requested visibility, and doesn't dispatch any events.
***REMOVED*** @return {boolean} Whether the visibility was changed.
***REMOVED*** @override
***REMOVED***
goog.ui.equation.MenuPalette.prototype.setVisible = function(
    visible, opt_force) {
  return goog.base(this, 'setVisible', true, opt_force);
***REMOVED***



***REMOVED***
***REMOVED*** The renderer for menu palette.
***REMOVED*** @extends {goog.ui.equation.PaletteRenderer}
***REMOVED***
***REMOVED***
goog.ui.equation.MenuPaletteRenderer = function() {
  goog.ui.PaletteRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.equation.MenuPaletteRenderer,
    goog.ui.equation.PaletteRenderer);
goog.addSingletonGetter(goog.ui.equation.MenuPaletteRenderer);


***REMOVED*** @override***REMOVED***
goog.ui.equation.MenuPaletteRenderer.prototype.getCssClass =
    function() {
  return goog.ui.equation.MenuPalette.CSS_CLASS;
***REMOVED***
