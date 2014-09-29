// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Input Method Editors (IMEs) are OS-level widgets that make
***REMOVED*** it easier to type non-ascii characters on ascii keyboards (in particular,
***REMOVED*** characters that require more than one keystroke).
***REMOVED***
***REMOVED*** When the user wants to type such a character, a modal menu pops up and
***REMOVED*** suggests possible "next" characters in the IME character sequence. After
***REMOVED*** typing N characters, the user hits "enter" to commit the IME to the field.
***REMOVED*** N differs from language to language.
***REMOVED***
***REMOVED*** This class offers high-level events for how the user is interacting with the
***REMOVED*** IME in editable regions.
***REMOVED***
***REMOVED*** Known Issues:
***REMOVED***
***REMOVED*** Firefox always fires an extra pair of compositionstart/compositionend events.
***REMOVED*** We do not normalize for this.
***REMOVED***
***REMOVED*** Opera does not fire any IME events.
***REMOVED***
***REMOVED*** Spurious UPDATE events are common on all browsers.
***REMOVED***
***REMOVED*** We currently do a bad job detecting when the IME closes on IE, and
***REMOVED*** make a "best effort" guess on when we know it's closed.
***REMOVED***
***REMOVED***

goog.provide('goog.events.ImeHandler');
goog.provide('goog.events.ImeHandler.Event');
goog.provide('goog.events.ImeHandler.EventType');

goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');



***REMOVED***
***REMOVED*** Dispatches high-level events for IMEs.
***REMOVED*** @param {Element} el The element to listen on.
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED***
goog.events.ImeHandler = function(el) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element to listen on.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.el_ = el;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tracks the keyup event only, because it has a different life-cycle from
  ***REMOVED*** other events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keyUpHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tracks all the browser events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);

  if (goog.events.ImeHandler.USES_COMPOSITION_EVENTS) {
    this.handler_.
        listen(el, 'compositionstart', this.handleCompositionStart_).
        listen(el, 'compositionend', this.handleCompositionEnd_).
        listen(el, 'compositionupdate', this.handleTextModifyingInput_);
  }

  this.handler_.
      listen(el, 'textInput', this.handleTextInput_).
      listen(el, 'text', this.handleTextModifyingInput_).
      listen(el, goog.events.EventType.KEYDOWN, this.handleKeyDown_);
***REMOVED***
goog.inherits(goog.events.ImeHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event types fired by ImeHandler. These events do not make any guarantees
***REMOVED*** about whether they were fired before or after the event in question.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.ImeHandler.EventType = {
  // After the IME opens.
  START: 'startIme',

  // An update to the state of the IME. An 'update' does not necessarily mean
  // that the text contents of the field were modified in any way.
  UPDATE: 'updateIme',

  // After the IME closes.
  END: 'endIme'
***REMOVED***



***REMOVED***
***REMOVED*** An event fired by ImeHandler.
***REMOVED*** @param {goog.events.ImeHandler.EventType} type The type.
***REMOVED*** @param {goog.events.BrowserEvent} reason The trigger for this event.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.events.ImeHandler.Event = function(type, reason) {
  goog.base(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event that triggered this.
  ***REMOVED*** @type {goog.events.BrowserEvent}
 ***REMOVED*****REMOVED***
  this.reason = reason;
***REMOVED***
goog.inherits(goog.events.ImeHandler.Event, goog.events.Event);


***REMOVED***
***REMOVED*** Whether to use the composition events.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.ImeHandler.USES_COMPOSITION_EVENTS =
    goog.userAgent.GECKO ||
    (goog.userAgent.WEBKIT && goog.userAgent.isVersion(532));


***REMOVED***
***REMOVED*** Stores whether IME mode is active.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.imeMode_ = false;


***REMOVED***
***REMOVED*** The keyCode value of the last keyDown event. This value is used for
***REMOVED*** identiying whether or not a textInput event is sent by an IME.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.lastKeyCode_ = 0;


***REMOVED***
***REMOVED*** @return {boolean} Whether an IME is active.
***REMOVED***
goog.events.ImeHandler.prototype.isImeMode = function() {
  return this.imeMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the compositionstart event.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleCompositionStart_ =
    function(e) {
  this.handleImeActivate_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the compositionend event.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleCompositionEnd_ = function(e) {
  this.handleImeDeactivate_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the compositionupdate and text events.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleTextModifyingInput_ =
    function(e) {
  if (this.isImeMode()) {
    this.processImeComposition_(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles IME activation.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleImeActivate_ = function(e) {
  if (this.imeMode_) {
    return;
  }

  // Listens for keyup events to handle unexpected IME keydown events on older
  // versions of webkit.
  //
  // In those versions, we currently use textInput events deactivate IME
  // (see handleTextInput_() for the reason). However,
  // Safari fires a keydown event (as a result of pressing keys to commit IME
  // text) with keyCode == WIN_IME after textInput event. This activates IME
  // mode again unnecessarily. To prevent this problem, listens keyup events
  // which can use to determine whether IME text has been committed.
  if (goog.userAgent.WEBKIT &&
      !goog.events.ImeHandler.USES_COMPOSITION_EVENTS) {
    this.keyUpHandler_.listen(this.el_,
        goog.events.EventType.KEYUP, this.handleKeyUpSafari4_);
  }

  this.imeMode_ = true;
  this.dispatchEvent(
      new goog.events.ImeHandler.Event(
          goog.events.ImeHandler.EventType.START, e));
***REMOVED***


***REMOVED***
***REMOVED*** Handles the IME compose changes.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.processImeComposition_ = function(e) {
  this.dispatchEvent(
      new goog.events.ImeHandler.Event(
          goog.events.ImeHandler.EventType.UPDATE, e));
***REMOVED***


***REMOVED***
***REMOVED*** Handles IME deactivation.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleImeDeactivate_ = function(e) {
  this.imeMode_ = false;
  this.keyUpHandler_.removeAll();
  this.dispatchEvent(
      new goog.events.ImeHandler.Event(
          goog.events.ImeHandler.EventType.END, e));
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key down event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleKeyDown_ = function(e) {
  // Firefox and Chrome have a separate event for IME composition ('text'
  // and 'compositionupdate', respectively), other browsers do not.
  if (!goog.events.ImeHandler.USES_COMPOSITION_EVENTS) {
    var imeMode = this.isImeMode();
    // If we're in IE and we detect an IME input on keyDown then activate
    // the IME, otherwise if the imeMode was previously active, deactivate.
    if (!imeMode && e.keyCode == goog.events.KeyCodes.WIN_IME) {
      this.handleImeActivate_(e);
    } else if (imeMode && e.keyCode != goog.events.KeyCodes.WIN_IME) {
      if (goog.events.ImeHandler.isImeDeactivateKeyEvent_(e)) {
        this.handleImeDeactivate_(e);
      }
    } else if (imeMode) {
      this.processImeComposition_(e);
    }
  }

  // Safari on Mac doesn't send IME events in the right order so that we must
  // ignore some modifier key events to insert IME text correctly.
  if (goog.events.ImeHandler.isImeDeactivateKeyEvent_(e)) {
    this.lastKeyCode_ = e.keyCode;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a textInput event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleTextInput_ = function(e) {
  // Some WebKit-based browsers including Safari 4 don't send composition
  // events. So, we turn down IME mode when it's still there.
  if (!goog.events.ImeHandler.USES_COMPOSITION_EVENTS &&
      goog.userAgent.WEBKIT &&
      this.lastKeyCode_ == goog.events.KeyCodes.WIN_IME &&
      this.isImeMode()) {
    this.handleImeDeactivate_(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the key up event for any IME activity. This handler is just used to
***REMOVED*** prevent activating IME unnecessary in Safari at this time.
***REMOVED*** @param {!goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.prototype.handleKeyUpSafari4_ = function(e) {
  if (this.isImeMode()) {
    switch (e.keyCode) {
      // These keyup events indicates that IME text has been committed or
      // cancelled. We should turn off IME mode when these keyup events
      // received.
      case goog.events.KeyCodes.ENTER:
      case goog.events.KeyCodes.TAB:
      case goog.events.KeyCodes.ESC:
        this.handleImeDeactivate_(e);
        break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given event should be treated as an IME
***REMOVED*** deactivation trigger.
***REMOVED*** @param {!goog.events.Event} e The event.
***REMOVED*** @return {boolean} Whether the given event is an IME deactivate trigger.
***REMOVED*** @private
***REMOVED***
goog.events.ImeHandler.isImeDeactivateKeyEvent_ = function(e) {
  // Which key events involve IME deactivation depends on the user's
  // environment (i.e. browsers, platforms, and IMEs). Usually Shift key
  // and Ctrl key does not involve IME deactivation, so we currently assume
  // that these keys are not IME deactivation trigger.
  switch (e.keyCode) {
    case goog.events.KeyCodes.SHIFT:
    case goog.events.KeyCodes.CTRL:
      return false;
    default:
      return true;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.ImeHandler.prototype.disposeInternal = function() {
  this.handler_.dispose();
  this.keyUpHandler_.dispose();
  this.el_ = null;
  goog.base(this, 'disposeInternal');
***REMOVED***
