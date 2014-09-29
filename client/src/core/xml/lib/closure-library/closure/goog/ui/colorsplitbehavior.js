// Copyright 2010 The Closure Library Authors. All Rights Reserved
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
***REMOVED*** @fileoverview Behavior for combining a color button and a menu.
***REMOVED***
***REMOVED*** @see ../demos/split.html
***REMOVED***

goog.provide('goog.ui.ColorSplitBehavior');

goog.require('goog.ui.ColorButton');
goog.require('goog.ui.ColorMenuButton');
goog.require('goog.ui.SplitBehavior');



***REMOVED***
***REMOVED*** Constructs a ColorSplitBehavior for combining a color button and a menu.
***REMOVED*** To use this, provide a goog.ui.ColorButton which will be attached with
***REMOVED*** a goog.ui.ColorMenuButton (with no caption).
***REMOVED*** Whenever a color is selected from the ColorMenuButton, it will be placed in
***REMOVED*** the ColorButton and the user can apply it over and over (by clicking the
***REMOVED*** ColorButton).
***REMOVED*** Primary use case - setting the color of text/background in a text editor.
***REMOVED***
***REMOVED*** @param {!goog.ui.Button} colorButton A button to interact with a color menu
***REMOVED***     button (preferably a goog.ui.ColorButton).
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @extends {goog.ui.SplitBehavior}
***REMOVED***
***REMOVED***
goog.ui.ColorSplitBehavior = function(colorButton, opt_domHelper) {
  goog.base(this, colorButton,
      new goog.ui.ColorMenuButton(goog.ui.ColorSplitBehavior.ZERO_WIDTH_SPACE_),
      goog.ui.SplitBehavior.DefaultHandlers.VALUE,
      undefined,
      opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.ColorSplitBehavior, goog.ui.SplitBehavior);


***REMOVED***
***REMOVED*** A zero width space character.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ColorSplitBehavior.ZERO_WIDTH_SPACE_ = '\uFEFF';

