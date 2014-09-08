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
***REMOVED*** @fileoverview Menu item observing the filter text in a
***REMOVED*** {@link goog.ui.FilteredMenu}. The observer method is called when the filter
***REMOVED*** text changes and allows the menu item to update its content and state based
***REMOVED*** on the filter.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.ui.FilterObservingMenuItem');

goog.require('goog.ui.FilterObservingMenuItemRenderer');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a filter observing menu item.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the content of the item (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {*=} opt_model Data/model associated with the menu item.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
***REMOVED***     document interactions.
***REMOVED*** @param {goog.ui.MenuItemRenderer=} opt_renderer Optional renderer.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItem}
***REMOVED***
goog.ui.FilterObservingMenuItem = function(content, opt_model, opt_domHelper,
                                           opt_renderer) {
  goog.ui.MenuItem.call(this, content, opt_model, opt_domHelper,
      opt_renderer || new goog.ui.FilterObservingMenuItemRenderer());
***REMOVED***
goog.inherits(goog.ui.FilterObservingMenuItem, goog.ui.MenuItem);


***REMOVED***
***REMOVED*** Function called when the filter text changes.
***REMOVED*** @type {Function} function(goog.ui.FilterObservingMenuItem, string)
***REMOVED*** @private
***REMOVED***
goog.ui.FilterObservingMenuItem.prototype.observer_ = null;


***REMOVED*** @override***REMOVED***
goog.ui.FilterObservingMenuItem.prototype.enterDocument = function() {
  goog.ui.FilterObservingMenuItem.superClass_.enterDocument.call(this);
  this.callObserver();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the observer functions.
***REMOVED*** @param {Function} f function(goog.ui.FilterObservingMenuItem, string).
***REMOVED***
goog.ui.FilterObservingMenuItem.prototype.setObserver = function(f) {
  this.observer_ = f;
  this.callObserver();
***REMOVED***


***REMOVED***
***REMOVED*** Calls the observer function if one has been specified.
***REMOVED*** @param {?string=} opt_str Filter string.
***REMOVED***
goog.ui.FilterObservingMenuItem.prototype.callObserver = function(opt_str) {
  if (this.observer_) {
    this.observer_(this, opt_str || '');
  }
***REMOVED***


// Register a decorator factory function for
// goog.ui.FilterObservingMenuItemRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.FilterObservingMenuItemRenderer.CSS_CLASS,
    function() {
      // FilterObservingMenuItem defaults to using
      // FilterObservingMenuItemRenderer.
      return new goog.ui.FilterObservingMenuItem(null);
    });
