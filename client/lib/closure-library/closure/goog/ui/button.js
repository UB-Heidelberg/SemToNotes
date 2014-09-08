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
***REMOVED*** @fileoverview A button control. This implementation extends {@link
***REMOVED*** goog.ui.Control}.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/button.html
***REMOVED***

goog.provide('goog.ui.Button');
goog.provide('goog.ui.Button.Side');

***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.ButtonSide');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.NativeButtonRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A button control, rendered as a native browser button by default.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent=} opt_content Text caption or existing DOM
***REMOVED***     structure to display as the button's caption (if any).
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the button; defaults to {@link goog.ui.NativeButtonRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.Button = function(opt_content, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, opt_content, opt_renderer ||
      goog.ui.NativeButtonRenderer.getInstance(), opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.Button, goog.ui.Control);


***REMOVED***
***REMOVED*** Constants for button sides, see {@link goog.ui.Button.prototype.setCollapsed}
***REMOVED*** for details. Aliased from goog.ui.ButtonSide to support legacy users without
***REMOVED*** creating a circular dependency in {@link goog.ui.ButtonRenderer}.
***REMOVED*** @enum {number}
***REMOVED*** @deprecated use {@link goog.ui.ButtonSide} instead.
***REMOVED***
goog.ui.Button.Side = goog.ui.ButtonSide;


***REMOVED***
***REMOVED*** Value associated with the button.
***REMOVED*** @type {*}
***REMOVED*** @private
***REMOVED***
goog.ui.Button.prototype.value_;


***REMOVED***
***REMOVED*** Tooltip text for the button, displayed on hover.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Button.prototype.tooltip_;


// goog.ui.Button API implementation.


***REMOVED***
***REMOVED*** Returns the value associated with the button.
***REMOVED*** @return {*} Button value (undefined if none).
***REMOVED***
goog.ui.Button.prototype.getValue = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value associated with the button, and updates its DOM.
***REMOVED*** @param {*} value New button value.
***REMOVED***
goog.ui.Button.prototype.setValue = function(value) {
  this.value_ = value;
  var renderer =***REMOVED*****REMOVED*** @type {!goog.ui.ButtonRenderer}***REMOVED*** (this.getRenderer());
  renderer.setValue(this.getElement(),***REMOVED*****REMOVED*** @type {string}***REMOVED*** (value));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value associated with the button.  Unlike {@link #setValue},
***REMOVED*** doesn't update the button's DOM.  Considered protected; to be called only
***REMOVED*** by renderer code during element decoration.
***REMOVED*** @param {*} value New button value.
***REMOVED*** @protected
***REMOVED***
goog.ui.Button.prototype.setValueInternal = function(value) {
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tooltip for the button.
***REMOVED*** @return {string|undefined} Tooltip text (undefined if none).
***REMOVED***
goog.ui.Button.prototype.getTooltip = function() {
  return this.tooltip_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tooltip for the button, and updates its DOM.
***REMOVED*** @param {string} tooltip New tooltip text.
***REMOVED***
goog.ui.Button.prototype.setTooltip = function(tooltip) {
  this.tooltip_ = tooltip;
  this.getRenderer().setTooltip(this.getElement(), tooltip);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tooltip for the button.  Unlike {@link #setTooltip}, doesn't update
***REMOVED*** the button's DOM.  Considered protected; to be called only by renderer code
***REMOVED*** during element decoration.
***REMOVED*** @param {string} tooltip New tooltip text.
***REMOVED*** @protected
***REMOVED***
goog.ui.Button.prototype.setTooltipInternal = function(tooltip) {
  this.tooltip_ = tooltip;
***REMOVED***


***REMOVED***
***REMOVED*** Collapses the border on one or both sides of the button, allowing it to be
***REMOVED*** combined with the adjancent button(s), forming a single UI componenet with
***REMOVED*** multiple targets.
***REMOVED*** @param {number} sides Bitmap of one or more {@link goog.ui.ButtonSide}s for
***REMOVED***     which borders should be collapsed.
***REMOVED***
goog.ui.Button.prototype.setCollapsed = function(sides) {
  this.getRenderer().setCollapsed(this, sides);
***REMOVED***


// goog.ui.Control & goog.ui.Component API implementation.


***REMOVED*** @override***REMOVED***
goog.ui.Button.prototype.disposeInternal = function() {
  goog.ui.Button.superClass_.disposeInternal.call(this);
  delete this.value_;
  delete this.tooltip_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Button.prototype.enterDocument = function() {
  goog.ui.Button.superClass_.enterDocument.call(this);
  if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
    var keyTarget = this.getKeyEventTarget();
    if (keyTarget) {
      this.getHandler().listen(keyTarget, goog.events.EventType.KEYUP,
          this.handleKeyEventInternal);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to handle a keyboard event; returns true if the event was handled,
***REMOVED*** false otherwise.  If the button is enabled and the Enter/Space key was
***REMOVED*** pressed, handles the event by dispatching an {@code ACTION} event,
***REMOVED*** and returns true. Overrides {@link goog.ui.Control#handleKeyEventInternal}.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the key event was handled.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.Button.prototype.handleKeyEventInternal = function(e) {
  if (e.keyCode == goog.events.KeyCodes.ENTER &&
      e.type == goog.events.KeyHandler.EventType.KEY ||
      e.keyCode == goog.events.KeyCodes.SPACE &&
      e.type == goog.events.EventType.KEYUP) {
    return this.performActionInternal(e);
  }
  // Return true for space keypress (even though the event is handled on keyup)
  // as preventDefault needs to be called up keypress to take effect in IE and
  // WebKit.
  return e.keyCode == goog.events.KeyCodes.SPACE;
***REMOVED***


// Register a decorator factory function for goog.ui.Buttons.
goog.ui.registry.setDecoratorByClassName(goog.ui.ButtonRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Button(null);
    });
