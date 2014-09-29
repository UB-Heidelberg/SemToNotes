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
***REMOVED*** @fileoverview A class for representing menu headers.
***REMOVED*** @see goog.ui.Menu
***REMOVED***
***REMOVED***

goog.provide('goog.ui.MenuHeader');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.MenuHeaderRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a menu header.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the content of the item (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
***REMOVED***     document interactions.
***REMOVED*** @param {goog.ui.MenuHeaderRenderer=} opt_renderer Optional renderer.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.MenuHeader = function(content, opt_domHelper, opt_renderer) {
  goog.ui.Control.call(this, content, opt_renderer ||
      goog.ui.MenuHeaderRenderer.getInstance(), opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, false);
  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  // Headers are always considered disabled.
  this.setStateInternal(goog.ui.Component.State.DISABLED);
***REMOVED***
goog.inherits(goog.ui.MenuHeader, goog.ui.Control);


// Register a decorator factory function for goog.ui.MenuHeaders.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.MenuHeaderRenderer.CSS_CLASS,
    function() {
      // MenuHeader defaults to using MenuHeaderRenderer.
      return new goog.ui.MenuHeader(null);
    });
