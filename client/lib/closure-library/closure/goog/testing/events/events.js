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
***REMOVED*** @fileoverview Event Simulation.
***REMOVED***
***REMOVED*** Utility functions for simulating events at the Closure level. All functions
***REMOVED*** in this package generate events by calling goog.events.fireListeners,
***REMOVED*** rather than interfacing with the browser directly. This is intended for
***REMOVED*** testing purposes, and should not be used in production code.
***REMOVED***
***REMOVED*** The decision to use Closure events and dispatchers instead of the browser's
***REMOVED*** native events and dispatchers was conscious and deliberate. Native event
***REMOVED*** dispatchers have their own set of quirks and edge cases. Pure JS dispatchers
***REMOVED*** are more robust and transparent.
***REMOVED***
***REMOVED*** If you think you need a testing mechanism that uses native Event objects,
***REMOVED*** please, please email closure-tech first to explain your use case before you
***REMOVED*** sink time into this.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.testing.events');
goog.provide('goog.testing.events.Event');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.dom.NodeType');
***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.BrowserFeature');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** goog.events.BrowserEvent expects an Event so we provide one for JSCompiler.
***REMOVED***
***REMOVED*** This clones a lot of the functionality of goog.events.Event. This used to
***REMOVED*** use a mixin, but the mixin results in confusing the two types when compiled.
***REMOVED***
***REMOVED*** @param {string} type Event Type.
***REMOVED*** @param {Object=} opt_target Reference to the object that is the target of
***REMOVED***     this event.
***REMOVED***
***REMOVED*** @extends {Event}
***REMOVED***
goog.testing.events.Event = function(type, opt_target) {
  this.type = type;

  this.target =***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (opt_target || null);

  this.currentTarget = this.target;
***REMOVED***


***REMOVED***
***REMOVED*** Whether to cancel the event in internal capture/bubble processing for IE.
***REMOVED*** @type {boolean}
***REMOVED*** @public
***REMOVED*** @suppress {underscore|visibility} Technically public, but referencing this
***REMOVED***     outside this package is strongly discouraged.
***REMOVED***
goog.testing.events.Event.prototype.propagationStopped_ = false;


***REMOVED*** @override***REMOVED***
goog.testing.events.Event.prototype.defaultPrevented = false;


***REMOVED***
***REMOVED*** Return value for in internal capture/bubble processing for IE.
***REMOVED*** @type {boolean}
***REMOVED*** @public
***REMOVED*** @suppress {underscore|visibility} Technically public, but referencing this
***REMOVED***     outside this package is strongly discouraged.
***REMOVED***
goog.testing.events.Event.prototype.returnValue_ = true;


***REMOVED*** @override***REMOVED***
goog.testing.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Asserts an event target exists.  This will fail if target is not defined.
***REMOVED***
***REMOVED*** TODO(nnaze): Gradually add this to the methods in this file, and eventually
***REMOVED***     update the method signatures to not take nullables.  See http://b/8961907
***REMOVED***
***REMOVED*** @param {EventTarget} target A target to assert.
***REMOVED*** @return {!EventTarget} The target, guaranteed to exist.
***REMOVED*** @private
***REMOVED***
goog.testing.events.assertEventTarget_ = function(target) {
  return goog.asserts.assert(target, 'EventTarget should be defined.');
***REMOVED***


***REMOVED***
***REMOVED*** A static helper function that sets the mouse position to the event.
***REMOVED*** @param {Event} event A simulated native event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @private
***REMOVED***
goog.testing.events.setEventClientXY_ = function(event, opt_coords) {
  if (!opt_coords && event.target &&
      event.target.nodeType == goog.dom.NodeType.ELEMENT) {
    try {
      opt_coords =
          goog.style.getClientPosition(***REMOVED*** @type {Element}***REMOVED****/ (event.target));
    } catch (ex) {
      // IE sometimes throws if it can't get the position.
    }
  }
  event.clientX = opt_coords ? opt_coords.x : 0;
  event.clientY = opt_coords ? opt_coords.y : 0;

  // Pretend the browser window is at (0, 0).
  event.screenX = event.clientX;
  event.screenY = event.clientY;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mousedown, mouseup, and then click on the given event target,
***REMOVED*** with the left mouse button.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.events.BrowserEvent.MouseButton=} opt_button Mouse button;
***REMOVED***     defaults to {@code goog.events.BrowserEvent.MouseButton.LEFT}.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireClickSequence =
    function(target, opt_button, opt_coords, opt_eventProperties) {
  // Fire mousedown, mouseup, and click. Then return the bitwise AND of the 3.
  return !!(goog.testing.events.fireMouseDownEvent(
      target, opt_button, opt_coords, opt_eventProperties) &
            goog.testing.events.fireMouseUpEvent(
                target, opt_button, opt_coords, opt_eventProperties) &
            goog.testing.events.fireClickEvent(
                target, opt_button, opt_coords, opt_eventProperties));
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the sequence of events fired by the browser when the user double-
***REMOVED*** clicks the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireDoubleClickSequence = function(
    target, opt_coords, opt_eventProperties) {
  // Fire mousedown, mouseup, click, mousedown, mouseup, click, dblclick.
  // Then return the bitwise AND of the 7.
  var btn = goog.events.BrowserEvent.MouseButton.LEFT;
  return !!(goog.testing.events.fireMouseDownEvent(
      target, btn, opt_coords, opt_eventProperties) &
            goog.testing.events.fireMouseUpEvent(
                target, btn, opt_coords, opt_eventProperties) &
            goog.testing.events.fireClickEvent(
                target, btn, opt_coords, opt_eventProperties) &
            // IE fires a selectstart instead of the second mousedown in a
            // dblclick, but we don't care about selectstart.
            (goog.userAgent.IE ||
            goog.testing.events.fireMouseDownEvent(
                target, btn, opt_coords, opt_eventProperties)) &
            goog.testing.events.fireMouseUpEvent(
                target, btn, opt_coords, opt_eventProperties) &
            // IE doesn't fire the second click in a dblclick.
            (goog.userAgent.IE ||
            goog.testing.events.fireClickEvent(
                target, btn, opt_coords, opt_eventProperties)) &
            goog.testing.events.fireDoubleClickEvent(
                target, opt_coords, opt_eventProperties));
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a complete keystroke (keydown, keypress, and keyup). Note that
***REMOVED*** if preventDefault is called on the keydown, the keypress will not fire.
***REMOVED***
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {number} keyCode The keycode of the key pressed.
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireKeySequence = function(
    target, keyCode, opt_eventProperties) {
  return goog.testing.events.fireNonAsciiKeySequence(target, keyCode, keyCode,
                                                     opt_eventProperties);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a complete keystroke (keydown, keypress, and keyup) when typing
***REMOVED*** a non-ASCII character. Same as fireKeySequence, the keypress will not fire
***REMOVED*** if preventDefault is called on the keydown.
***REMOVED***
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {number} keyCode The keycode of the keydown and keyup events.
***REMOVED*** @param {number} keyPressKeyCode The keycode of the keypress event.
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireNonAsciiKeySequence = function(
    target, keyCode, keyPressKeyCode, opt_eventProperties) {
  var keydown =
      new goog.testing.events.Event(goog.events.EventType.KEYDOWN, target);
  var keyup =
      new goog.testing.events.Event(goog.events.EventType.KEYUP, target);
  var keypress =
      new goog.testing.events.Event(goog.events.EventType.KEYPRESS, target);
  keydown.keyCode = keyup.keyCode = keyCode;
  keypress.keyCode = keyPressKeyCode;

  if (opt_eventProperties) {
    goog.object.extend(keydown, opt_eventProperties);
    goog.object.extend(keyup, opt_eventProperties);
    goog.object.extend(keypress, opt_eventProperties);
  }

  // Fire keydown, keypress, and keyup. Note that if the keydown is
  // prevent-defaulted, then the keypress will not fire on IE.
  var result = true;
  if (!goog.testing.events.isBrokenGeckoMacActionKey_(keydown)) {
    result = goog.testing.events.fireBrowserEvent(keydown);
  }
  if (goog.events.KeyCodes.firesKeyPressEvent(
      keyCode, undefined, keydown.shiftKey, keydown.ctrlKey,
      keydown.altKey) &&
      !(goog.userAgent.IE && !result)) {
    result &= goog.testing.events.fireBrowserEvent(keypress);
  }
  return !!(result & goog.testing.events.fireBrowserEvent(keyup));
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.testing.events.Event} e The event.
***REMOVED*** @return {boolean} Whether this is the Gecko/Mac's Meta-C/V/X, which
***REMOVED***     is broken and requires special handling.
***REMOVED*** @private
***REMOVED***
goog.testing.events.isBrokenGeckoMacActionKey_ = function(e) {
  return goog.userAgent.MAC && goog.userAgent.GECKO &&
      (e.keyCode == goog.events.KeyCodes.C ||
       e.keyCode == goog.events.KeyCodes.X ||
       e.keyCode == goog.events.KeyCodes.V) && e.metaKey;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mouseover event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {EventTarget} relatedTarget The related target for the event (e.g.,
***REMOVED***     the node that the mouse is being moved out of).
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireMouseOverEvent = function(target, relatedTarget,
    opt_coords) {
  var mouseover =
      new goog.testing.events.Event(goog.events.EventType.MOUSEOVER, target);
  mouseover.relatedTarget = relatedTarget;
  goog.testing.events.setEventClientXY_(mouseover, opt_coords);
  return goog.testing.events.fireBrowserEvent(mouseover);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mousemove event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireMouseMoveEvent = function(target, opt_coords) {
  var mousemove =
      new goog.testing.events.Event(goog.events.EventType.MOUSEMOVE, target);

  goog.testing.events.setEventClientXY_(mousemove, opt_coords);
  return goog.testing.events.fireBrowserEvent(mousemove);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mouseout event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {EventTarget} relatedTarget The related target for the event (e.g.,
***REMOVED***     the node that the mouse is being moved into).
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireMouseOutEvent = function(target, relatedTarget,
    opt_coords) {
  var mouseout =
      new goog.testing.events.Event(goog.events.EventType.MOUSEOUT, target);
  mouseout.relatedTarget = relatedTarget;
  goog.testing.events.setEventClientXY_(mouseout, opt_coords);
  return goog.testing.events.fireBrowserEvent(mouseout);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mousedown event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.events.BrowserEvent.MouseButton=} opt_button Mouse button;
***REMOVED***     defaults to {@code goog.events.BrowserEvent.MouseButton.LEFT}.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireMouseDownEvent =
    function(target, opt_button, opt_coords, opt_eventProperties) {

  var button = opt_button || goog.events.BrowserEvent.MouseButton.LEFT;
  button = !goog.events.BrowserFeature.HAS_W3C_BUTTON ?
      goog.events.BrowserEvent.IEButtonMap[button] : button;
  return goog.testing.events.fireMouseButtonEvent_(
      goog.events.EventType.MOUSEDOWN, target, button, opt_coords,
      opt_eventProperties);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mouseup event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.events.BrowserEvent.MouseButton=} opt_button Mouse button;
***REMOVED***     defaults to {@code goog.events.BrowserEvent.MouseButton.LEFT}.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireMouseUpEvent =
    function(target, opt_button, opt_coords, opt_eventProperties) {
  var button = opt_button || goog.events.BrowserEvent.MouseButton.LEFT;
  button = !goog.events.BrowserFeature.HAS_W3C_BUTTON ?
      goog.events.BrowserEvent.IEButtonMap[button] : button;
  return goog.testing.events.fireMouseButtonEvent_(
      goog.events.EventType.MOUSEUP, target, button, opt_coords,
      opt_eventProperties);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a click event on the given target. IE only supports click with
***REMOVED*** the left mouse button.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.events.BrowserEvent.MouseButton=} opt_button Mouse button;
***REMOVED***     defaults to {@code goog.events.BrowserEvent.MouseButton.LEFT}.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireClickEvent =
    function(target, opt_button, opt_coords, opt_eventProperties) {
  return goog.testing.events.fireMouseButtonEvent_(goog.events.EventType.CLICK,
      target, opt_button, opt_coords, opt_eventProperties);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a double-click event on the given target. Always double-clicks
***REMOVED*** with the left mouse button since no browser supports double-clicking with
***REMOVED*** any other buttons.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireDoubleClickEvent =
    function(target, opt_coords, opt_eventProperties) {
  return goog.testing.events.fireMouseButtonEvent_(
      goog.events.EventType.DBLCLICK, target,
      goog.events.BrowserEvent.MouseButton.LEFT, opt_coords,
      opt_eventProperties);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to fire a mouse event.
***REMOVED*** with the left mouse button since no browser supports double-clicking with
***REMOVED*** any other buttons.
***REMOVED*** @param {string} type The event type.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {number=} opt_button Mouse button; defaults to
***REMOVED***     {@code goog.events.BrowserEvent.MouseButton.LEFT}.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED*** @private
***REMOVED***
goog.testing.events.fireMouseButtonEvent_ =
    function(type, target, opt_button, opt_coords, opt_eventProperties) {
  var e =
      new goog.testing.events.Event(type, target);
  e.button = opt_button || goog.events.BrowserEvent.MouseButton.LEFT;
  goog.testing.events.setEventClientXY_(e, opt_coords);
  if (opt_eventProperties) {
    goog.object.extend(e, opt_eventProperties);
  }
  return goog.testing.events.fireBrowserEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a contextmenu event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireContextMenuEvent = function(target, opt_coords) {
  var button = (goog.userAgent.MAC && goog.userAgent.WEBKIT) ?
      goog.events.BrowserEvent.MouseButton.LEFT :
      goog.events.BrowserEvent.MouseButton.RIGHT;
  var contextmenu =
      new goog.testing.events.Event(goog.events.EventType.CONTEXTMENU, target);
  contextmenu.button = !goog.events.BrowserFeature.HAS_W3C_BUTTON ?
      goog.events.BrowserEvent.IEButtonMap[button] : button;
  contextmenu.ctrlKey = goog.userAgent.MAC;
  goog.testing.events.setEventClientXY_(contextmenu, opt_coords);
  return goog.testing.events.fireBrowserEvent(contextmenu);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a mousedown, contextmenu, and the mouseup on the given event
***REMOVED*** target, with the right mouse button.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Mouse position. Defaults to event's
***REMOVED*** target's position (if available), otherwise (0, 0).
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireContextMenuSequence = function(target, opt_coords) {
  var props = goog.userAgent.MAC ? {ctrlKey: true} : {***REMOVED***
  var button = (goog.userAgent.MAC && goog.userAgent.WEBKIT) ?
      goog.events.BrowserEvent.MouseButton.LEFT :
      goog.events.BrowserEvent.MouseButton.RIGHT;

  var result = goog.testing.events.fireMouseDownEvent(target,
      button, opt_coords, props);
  if (goog.userAgent.WINDOWS) {
    // All browsers are consistent on Windows.
    result &= goog.testing.events.fireMouseUpEvent(target,
        button, opt_coords) &
              goog.testing.events.fireContextMenuEvent(target, opt_coords);
  } else {
    result &= goog.testing.events.fireContextMenuEvent(target, opt_coords);

    // GECKO on Mac and Linux always fires the mouseup after the contextmenu.

    // WEBKIT is really weird.
    //
    // On Linux, it sometimes fires mouseup, but most of the time doesn't.
    // It's really hard to reproduce consistently. I think there's some
    // internal race condition. If contextmenu is preventDefaulted, then
    // mouseup always fires.
    //
    // On Mac, it always fires mouseup and then fires a click.
    result &= goog.testing.events.fireMouseUpEvent(target,
        button, opt_coords, props);

    if (goog.userAgent.WEBKIT && goog.userAgent.MAC) {
      result &= goog.testing.events.fireClickEvent(
          target, button, opt_coords, props);
    }
  }
  return !!result;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a popstate event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {Object} state History state object.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.firePopStateEvent = function(target, state) {
  var e = new goog.testing.events.Event(goog.events.EventType.POPSTATE, target);
  e.state = state;
  return goog.testing.events.fireBrowserEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Simulate a blur event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @return {boolean} The value returned by firing the blur browser event,
***REMOVED***      which returns false iff 'preventDefault' was invoked.
***REMOVED***
goog.testing.events.fireBlurEvent = function(target) {
  var e = new goog.testing.events.Event(
      goog.events.EventType.BLUR, target);
  return goog.testing.events.fireBrowserEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Simulate a focus event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @return {boolean} The value returned by firing the focus browser event,
***REMOVED***     which returns false iff 'preventDefault' was invoked.
***REMOVED***
goog.testing.events.fireFocusEvent = function(target) {
  var e = new goog.testing.events.Event(
      goog.events.EventType.FOCUS, target);
  return goog.testing.events.fireBrowserEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates an event's capturing and bubbling phases.
***REMOVED*** @param {Event} event A simulated native event. It will be wrapped in a
***REMOVED***     normalized BrowserEvent and dispatched to Closure listeners on all
***REMOVED***     ancestors of its target (inclusive).
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireBrowserEvent = function(event) {
  event.returnValue_ = true;

  // generate a list of ancestors
  var ancestors = [];
  for (var current = event.target; current; current = current.parentNode) {
    ancestors.push(current);
  }

  // dispatch capturing listeners
  for (var j = ancestors.length - 1;
       j >= 0 && !event.propagationStopped_;
       j--) {
    goog.events.fireListeners(ancestors[j], event.type, true,
        new goog.events.BrowserEvent(event, ancestors[j]));
  }

  // dispatch bubbling listeners
  for (var j = 0;
       j < ancestors.length && !event.propagationStopped_;
       j++) {
    goog.events.fireListeners(ancestors[j], event.type, false,
        new goog.events.BrowserEvent(event, ancestors[j]));
  }

  return event.returnValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a touchstart event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Touch position. Defaults to event's
***REMOVED***     target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireTouchStartEvent = function(
    target, opt_coords, opt_eventProperties) {
  // TODO: Support multi-touch events with array of coordinates.
  var touchstart =
      new goog.testing.events.Event(goog.events.EventType.TOUCHSTART, target);
  goog.testing.events.setEventClientXY_(touchstart, opt_coords);
  if (opt_eventProperties) {
    goog.object.extend(touchstart, opt_eventProperties);
  }
  return goog.testing.events.fireBrowserEvent(touchstart);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a touchmove event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Touch position. Defaults to event's
***REMOVED***     target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireTouchMoveEvent = function(
    target, opt_coords, opt_eventProperties) {
  // TODO: Support multi-touch events with array of coordinates.
  var touchmove =
      new goog.testing.events.Event(goog.events.EventType.TOUCHMOVE, target);
  goog.testing.events.setEventClientXY_(touchmove, opt_coords);
  if (opt_eventProperties) {
    goog.object.extend(touchmove, opt_eventProperties);
  }
  return goog.testing.events.fireBrowserEvent(touchmove);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a touchend event on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Touch position. Defaults to event's
***REMOVED***     target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the event: false if preventDefault() was
***REMOVED***     called on it, true otherwise.
***REMOVED***
goog.testing.events.fireTouchEndEvent = function(
    target, opt_coords, opt_eventProperties) {
  // TODO: Support multi-touch events with array of coordinates.
  var touchend =
      new goog.testing.events.Event(goog.events.EventType.TOUCHEND, target);
  goog.testing.events.setEventClientXY_(touchend, opt_coords);
  if (opt_eventProperties) {
    goog.object.extend(touchend, opt_eventProperties);
  }
  return goog.testing.events.fireBrowserEvent(touchend);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates a simple touch sequence on the given target.
***REMOVED*** @param {EventTarget} target The target for the event.
***REMOVED*** @param {goog.math.Coordinate=} opt_coords Touch position. Defaults to event
***REMOVED***     target's position (if available), otherwise (0, 0).
***REMOVED*** @param {Object=} opt_eventProperties Event properties to be mixed into the
***REMOVED***     BrowserEvent.
***REMOVED*** @return {boolean} The returnValue of the sequence: false if preventDefault()
***REMOVED***     was called on any of the events, true otherwise.
***REMOVED***
goog.testing.events.fireTouchSequence = function(
    target, opt_coords, opt_eventProperties) {
  // TODO: Support multi-touch events with array of coordinates.
  // Fire touchstart, touchmove, touchend then return the bitwise AND of the 3.
  return !!(goog.testing.events.fireTouchStartEvent(
      target, opt_coords, opt_eventProperties) &
            goog.testing.events.fireTouchEndEvent(
                target, opt_coords, opt_eventProperties));
***REMOVED***


***REMOVED***
***REMOVED*** Mixins a listenable into the given object. This turns the object
***REMOVED*** into a goog.events.Listenable. This is useful, for example, when
***REMOVED*** you need to mock a implementation of listenable and still want it
***REMOVED*** to work with goog.events.
***REMOVED*** @param {!Object} obj The object to mixin into.
***REMOVED***
goog.testing.events.mixinListenable = function(obj) {
  var listenable = new goog.events.EventTarget();

  listenable.setTargetForTesting(obj);

  var listenablePrototype = goog.events.EventTarget.prototype;
  var disposablePrototype = goog.Disposable.prototype;
  for (var key in listenablePrototype) {
    if (listenablePrototype.hasOwnProperty(key) ||
        disposablePrototype.hasOwnProperty(key)) {
      var member = listenablePrototype[key];
      if (goog.isFunction(member)) {
        obj[key] = goog.bind(member, listenable);
      } else {
        obj[key] = member;
      }
    }
  }
***REMOVED***
