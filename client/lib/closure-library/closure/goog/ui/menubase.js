// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of the MenuBase class.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.MenuBase');

goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Popup');



***REMOVED***
***REMOVED*** The MenuBase class provides an abstract base class for different
***REMOVED*** implementations of menu controls.
***REMOVED***
***REMOVED*** @param {Element=} opt_element A DOM element for the popup.
***REMOVED*** @deprecated Use goog.ui.Menu.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup}
***REMOVED***
goog.ui.MenuBase = function(opt_element) {
  goog.ui.Popup.call(this, opt_element);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for simplifiying adding/removing listeners.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.MenuBase>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** KeyHandler to cope with the vagaries of cross-browser key events.
  ***REMOVED*** @type {goog.events.KeyHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keyHandler_ = new goog.events.KeyHandler(this.getElement());
***REMOVED***
goog.inherits(goog.ui.MenuBase, goog.ui.Popup);


***REMOVED***
***REMOVED*** Events fired by the Menu
***REMOVED***
goog.ui.MenuBase.Events = {***REMOVED***


***REMOVED***
***REMOVED*** Event fired by the Menu when an item is "clicked".
***REMOVED***
goog.ui.MenuBase.Events.ITEM_ACTION = 'itemaction';


***REMOVED*** @override***REMOVED***
goog.ui.MenuBase.prototype.disposeInternal = function() {
  goog.ui.MenuBase.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.keyHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Called after the menu is shown. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED***
***REMOVED*** @protected
***REMOVED*** @suppress {underscore|visibility}
***REMOVED*** @override
***REMOVED***
goog.ui.MenuBase.prototype.onShow_ = function() {
  goog.ui.MenuBase.superClass_.onShow_.call(this);

  // register common event handlers for derived classes
  var el = this.getElement();
  this.eventHandler_.listen(
      el, goog.events.EventType.MOUSEOVER, this.onMouseOver);
  this.eventHandler_.listen(
      el, goog.events.EventType.MOUSEOUT, this.onMouseOut);
  this.eventHandler_.listen(
      el, goog.events.EventType.MOUSEDOWN, this.onMouseDown);
  this.eventHandler_.listen(
      el, goog.events.EventType.MOUSEUP, this.onMouseUp);

  this.eventHandler_.listen(
      this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY,
      this.onKeyDown);
***REMOVED***


***REMOVED***
***REMOVED*** Called after the menu is hidden. Derived classes can override to hook this
***REMOVED*** event but should make sure to call the parent class method.
***REMOVED*** @param {Object=} opt_target Target of the event causing the hide.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore|visibility}
***REMOVED*** @override
***REMOVED***
goog.ui.MenuBase.prototype.onHide_ = function(opt_target) {
  goog.ui.MenuBase.superClass_.onHide_.call(this, opt_target);

  // remove listeners when hidden
  this.eventHandler_.removeAll();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the selected item
***REMOVED***
***REMOVED*** @return {Object} The item selected or null if no item is selected.
***REMOVED***
goog.ui.MenuBase.prototype.getSelectedItem = function() {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected item
***REMOVED***
***REMOVED*** @param {Object} item The item to select. The type of this item is specific
***REMOVED***     to the menu class.
***REMOVED***
goog.ui.MenuBase.prototype.setSelectedItem = function(item) {
***REMOVED***


***REMOVED***
***REMOVED*** Mouse over handler for the menu. Derived classes should override.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuBase.prototype.onMouseOver = function(e) {
***REMOVED***


***REMOVED***
***REMOVED*** Mouse out handler for the menu. Derived classes should override.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuBase.prototype.onMouseOut = function(e) {
***REMOVED***


***REMOVED***
***REMOVED*** Mouse down handler for the menu. Derived classes should override.
***REMOVED***
***REMOVED*** @param {!goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuBase.prototype.onMouseDown = function(e) {
***REMOVED***


***REMOVED***
***REMOVED*** Mouse up handler for the menu. Derived classes should override.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuBase.prototype.onMouseUp = function(e) {
***REMOVED***


***REMOVED***
***REMOVED*** Key down handler for the menu. Derived classes should override.
***REMOVED***
***REMOVED*** @param {goog.events.KeyEvent} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuBase.prototype.onKeyDown = function(e) {
***REMOVED***
