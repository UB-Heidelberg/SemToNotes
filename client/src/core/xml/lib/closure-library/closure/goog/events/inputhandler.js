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
***REMOVED*** @fileoverview An object that encapsulates text changed events for textareas
***REMOVED*** and input element of type text and password. The event occurs after the value
***REMOVED*** has been changed. The event does not occur if value was changed
***REMOVED*** programmatically.<br>
***REMOVED*** <br>
***REMOVED*** Note: this does not guarantee the correctness of {@code keyCode} or
***REMOVED*** {@code charCode}, or attempt to unify them across browsers. See
***REMOVED*** {@code goog.events.KeyHandler} for that functionality.<br>
***REMOVED*** <br>
***REMOVED*** Known issues:
***REMOVED*** <ul>
***REMOVED*** <li>Does not trigger for drop events on Opera due to browser bug.
***REMOVED*** <li>IE doesn't have native support for input event. WebKit before version 531
***REMOVED***     doesn't have support for textareas. For those browsers an emulation mode
***REMOVED***     based on key, clipboard and drop events is used. Thus this event won't
***REMOVED***     trigger in emulation mode if text was modified by context menu commands
***REMOVED***     such as 'Undo' and 'Delete'.
***REMOVED*** </ul>
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/inputhandler.html
***REMOVED***

goog.provide('goog.events.InputHandler');
goog.provide('goog.events.InputHandler.EventType');

goog.require('goog.Timer');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyCodes');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This event handler will dispatch events when the user types into a text
***REMOVED*** input, password input or a textarea
***REMOVED*** @param {Element} element  The element that you want to listen for input
***REMOVED***     events on.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.InputHandler = function(element) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element that you want to listen for input events on.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

  // Determine whether input event should be emulated.
  // IE8 doesn't support input events. We could use property change events but
  // they are broken in many ways:
  // - Fire even if value was changed programmatically.
  // - Aren't always delivered. For example, if you change value or even width
  //   of input programmatically, next value change made by user won't fire an
  //   event.
  // IE9 supports input events when characters are inserted, but not deleted.
  // WebKit before version 531 did not support input events for textareas.
  var emulateInputEvents = goog.userAgent.IE ||
      (goog.userAgent.WEBKIT && !goog.userAgent.isVersion('531') &&
          element.tagName == 'TEXTAREA');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  // Even if input event emulation is enabled, still listen for input events
  // since they may be partially supported by the browser (such as IE9).
  // If the input event does fire, we will be able to dispatch synchronously.
  // (InputHandler events being asynchronous for IE is a common issue for
  // cases like auto-grow textareas where they result in a quick flash of
  // scrollbars between the textarea content growing and it being resized to
  // fit.)
  this.eventHandler_.listen(
      this.element_,
      emulateInputEvents ?
          ['keydown', 'paste', 'cut', 'drop', 'input'] :
          'input',
      this);
***REMOVED***
goog.inherits(goog.events.InputHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum type for the events fired by the input handler
***REMOVED*** @enum {string}
***REMOVED***
goog.events.InputHandler.EventType = {
  INPUT: 'input'
***REMOVED***


***REMOVED***
***REMOVED*** Id of a timer used to postpone firing input event in emulation mode.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.events.InputHandler.prototype.timer_ = null;


***REMOVED***
***REMOVED*** This handles the underlying events and dispatches a new event as needed.
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED***
goog.events.InputHandler.prototype.handleEvent = function(e) {
  if (e.type == 'input') {
    // This event happens after all the other events we listen to, so cancel
    // an asynchronous event dispatch if we have it queued up.  Otherwise, we
    // will end up firing an extra event.
    this.cancelTimerIfSet_();

    // Unlike other browsers, Opera fires an extra input event when an element
    // is blurred after the user has input into it. Since Opera doesn't fire
    // input event on drop, it's enough to check whether element still has focus
    // to suppress bogus notification.
    if (!goog.userAgent.OPERA || this.element_ ==
        goog.dom.getOwnerDocument(this.element_).activeElement) {
      this.dispatchEvent(this.createInputEvent_(e));
    }
  } else {
    // Filter out key events that don't modify text.
    if (e.type == 'keydown' &&
        !goog.events.KeyCodes.isTextModifyingKeyEvent(e)) {
      return;
    }

    // It is still possible that pressed key won't modify the value of an
    // element. Storing old value will help us to detect modification but is
    // also a little bit dangerous. If value is changed programmatically in
    // another key down handler, we will detect it as user-initiated change.
    var valueBeforeKey = e.type == 'keydown' ? this.element_.value : null;

    // In IE on XP, IME the element's value has already changed when we get
    // keydown events when the user is using an IME. In this case, we can't
    // check the current value normally, so we assume that it's a modifying key
    // event. This means that ENTER when used to commit will fire a spurious
    // input event, but it's better to have a false positive than let some input
    // slip through the cracks.
    if (goog.userAgent.IE && e.keyCode == goog.events.KeyCodes.WIN_IME) {
      valueBeforeKey = null;
    }

    // Create an input event now, because when we fire it on timer, the
    // underlying event will already be disposed.
    var inputEvent = this.createInputEvent_(e);

    // Since key down, paste, cut and drop events are fired before actual value
    // of the element has changed, we need to postpone dispatching input event
    // until value is updated.
    this.cancelTimerIfSet_();
    this.timer_ = goog.Timer.callOnce(function() {
      this.timer_ = null;
      if (this.element_.value != valueBeforeKey) {
        this.dispatchEvent(inputEvent);
      }
    }, 0, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels timer if it is set, does nothing otherwise.
***REMOVED*** @private
***REMOVED***
goog.events.InputHandler.prototype.cancelTimerIfSet_ = function() {
  if (this.timer_ != null) {
    goog.Timer.clear(this.timer_);
    this.timer_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates an input event from the browser event.
***REMOVED*** @param {goog.events.BrowserEvent} be A browser event.
***REMOVED*** @return {goog.events.BrowserEvent} An input event.
***REMOVED*** @private
***REMOVED***
goog.events.InputHandler.prototype.createInputEvent_ = function(be) {
  var e = new goog.events.BrowserEvent(be.getBrowserEvent());
  e.type = goog.events.InputHandler.EventType.INPUT;
  return e;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.InputHandler.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.eventHandler_.dispose();
  this.cancelTimerIfSet_();
  delete this.element_;
***REMOVED***
