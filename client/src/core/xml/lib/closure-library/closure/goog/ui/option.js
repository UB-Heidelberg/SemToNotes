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
***REMOVED*** @fileoverview A menu item class that supports selection state.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.Option');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a menu option.  This is just a convenience class that
***REMOVED*** extends {@link goog.ui.MenuItem} by making it selectable.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the content of the item (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {*=} opt_model Data/model associated with the menu item.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
***REMOVED***     document interactions.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItem}
***REMOVED***
goog.ui.Option = function(content, opt_model, opt_domHelper) {
  goog.ui.MenuItem.call(this, content, opt_model, opt_domHelper);
  this.setSelectable(true);
***REMOVED***
goog.inherits(goog.ui.Option, goog.ui.MenuItem);


***REMOVED***
***REMOVED*** Performs the appropriate action when the option is activated by the user.
***REMOVED*** Overrides the superclass implementation by not changing the selection state
***REMOVED*** of the option and not dispatching any SELECTED events, for backwards
***REMOVED*** compatibility with existing uses of this class.
***REMOVED*** @param {goog.events.Event} e Mouse or key event that triggered the action.
***REMOVED*** @return {boolean} True if the action was allowed to proceed, false otherwise.
***REMOVED*** @override
***REMOVED***
goog.ui.Option.prototype.performActionInternal = function(e) {
  return this.dispatchEvent(goog.ui.Component.EventType.ACTION);
***REMOVED***


// Register a decorator factory function for goog.ui.Options.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-option'), function() {
  // Option defaults to using MenuItemRenderer.
  return new goog.ui.Option(null);
});
