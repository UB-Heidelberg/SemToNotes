// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A patched, standardized event object for browser events.
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** The patched event object contains the following members:
***REMOVED*** - type           {string}    Event type, e.g. 'click'
***REMOVED*** - timestamp      {Date}      A date object for when the event was fired
***REMOVED*** - target         {Object}    The element that actually triggered the event
***REMOVED*** - currentTarget  {Object}    The element the listener is attached to
***REMOVED*** - relatedTarget  {Object}    For mouseover and mouseout, the previous object
***REMOVED*** - offsetX        {number}    X-coordinate relative to target
***REMOVED*** - offsetY        {number}    Y-coordinate relative to target
***REMOVED*** - clientX        {number}    X-coordinate relative to viewport
***REMOVED*** - clientY        {number}    Y-coordinate relative to viewport
***REMOVED*** - screenX        {number}    X-coordinate relative to the edge of the screen
***REMOVED*** - screenY        {number}    Y-coordinate relative to the edge of the screen
***REMOVED*** - button         {number}    Mouse button. Use isButton() to test.
***REMOVED*** - keyCode        {number}    Key-code
***REMOVED*** - ctrlKey        {boolean}   Was ctrl key depressed
***REMOVED*** - altKey         {boolean}   Was alt key depressed
***REMOVED*** - shiftKey       {boolean}   Was shift key depressed
***REMOVED*** - metaKey        {boolean}   Was meta key depressed
***REMOVED*** - defaultPrevented {boolean} Whether the default action has been prevented
***REMOVED*** - state          {Object}    History state object
***REMOVED***
***REMOVED*** NOTE: The keyCode member contains the raw browser keyCode. For normalized
***REMOVED*** key and character code use {@link goog.events.KeyHandler}.
***REMOVED*** </pre>
***REMOVED***
***REMOVED***

goog.provide('goog.events.BrowserEvent');
goog.provide('goog.events.BrowserEvent.MouseButton');

goog.require('goog.events.BrowserFeature');
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.reflect');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Accepts a browser event object and creates a patched, cross browser event
***REMOVED*** object.
***REMOVED*** The content of this object will not be initialized if no event object is
***REMOVED*** provided. If this is the case, init() needs to be invoked separately.
***REMOVED*** @param {Event=} opt_e Browser event object.
***REMOVED*** @param {EventTarget=} opt_currentTarget Current target for event.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  if (opt_e) {
    this.init(opt_e, opt_currentTarget);
  }
***REMOVED***
goog.inherits(goog.events.BrowserEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Normalized button constants for the mouse.
***REMOVED*** @enum {number}
***REMOVED***
goog.events.BrowserEvent.MouseButton = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
***REMOVED***


***REMOVED***
***REMOVED*** Static data for mapping mouse buttons.
***REMOVED*** @type {Array.<number>}
***REMOVED***
goog.events.BrowserEvent.IEButtonMap = [
  1, // LEFT
  4, // MIDDLE
  2  // RIGHT
];


***REMOVED***
***REMOVED*** Target that fired the event.
***REMOVED*** @override
***REMOVED*** @type {Node}
***REMOVED***
goog.events.BrowserEvent.prototype.target = null;


***REMOVED***
***REMOVED*** Node that had the listener attached.
***REMOVED*** @override
***REMOVED*** @type {Node|undefined}
***REMOVED***
goog.events.BrowserEvent.prototype.currentTarget;


***REMOVED***
***REMOVED*** For mouseover and mouseout events, the related object for the event.
***REMOVED*** @type {Node}
***REMOVED***
goog.events.BrowserEvent.prototype.relatedTarget = null;


***REMOVED***
***REMOVED*** X-coordinate relative to target.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.offsetX = 0;


***REMOVED***
***REMOVED*** Y-coordinate relative to target.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.offsetY = 0;


***REMOVED***
***REMOVED*** X-coordinate relative to the window.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.clientX = 0;


***REMOVED***
***REMOVED*** Y-coordinate relative to the window.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.clientY = 0;


***REMOVED***
***REMOVED*** X-coordinate relative to the monitor.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.screenX = 0;


***REMOVED***
***REMOVED*** Y-coordinate relative to the monitor.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.screenY = 0;


***REMOVED***
***REMOVED*** Which mouse button was pressed.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.button = 0;


***REMOVED***
***REMOVED*** Keycode of key press.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.keyCode = 0;


***REMOVED***
***REMOVED*** Keycode of key press.
***REMOVED*** @type {number}
***REMOVED***
goog.events.BrowserEvent.prototype.charCode = 0;


***REMOVED***
***REMOVED*** Whether control was pressed at time of event.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.BrowserEvent.prototype.ctrlKey = false;


***REMOVED***
***REMOVED*** Whether alt was pressed at time of event.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.BrowserEvent.prototype.altKey = false;


***REMOVED***
***REMOVED*** Whether shift was pressed at time of event.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.BrowserEvent.prototype.shiftKey = false;


***REMOVED***
***REMOVED*** Whether the meta key was pressed at time of event.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.BrowserEvent.prototype.metaKey = false;


***REMOVED***
***REMOVED*** History state object, only set for PopState events where it's a copy of the
***REMOVED*** state object provided to pushState or replaceState.
***REMOVED*** @type {Object}
***REMOVED***
goog.events.BrowserEvent.prototype.state;


***REMOVED***
***REMOVED*** Whether the default platform modifier key was pressed at time of event.
***REMOVED*** (This is control for all platforms except Mac, where it's Meta.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.BrowserEvent.prototype.platformModifierKey = false;


***REMOVED***
***REMOVED*** The browser event object.
***REMOVED*** @type {Event}
***REMOVED*** @private
***REMOVED***
goog.events.BrowserEvent.prototype.event_ = null;


***REMOVED***
***REMOVED*** Accepts a browser event object and creates a patched, cross browser event
***REMOVED*** object.
***REMOVED*** @param {Event} e Browser event object.
***REMOVED*** @param {EventTarget=} opt_currentTarget Current target for event.
***REMOVED***
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  goog.events.Event.call(this, type);

  // TODO(nicksantos): Change this.target to type EventTarget.
  this.target =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target) || e.srcElement;

  // TODO(nicksantos): Change this.currentTarget to type EventTarget.
  this.currentTarget =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (opt_currentTarget);

  var relatedTarget =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.relatedTarget);
  if (relatedTarget) {
    // There's a bug in FireFox where sometimes, relatedTarget will be a
    // chrome element, and accessing any property of it will get a permission
    // denied exception. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=497780
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, 'nodeName')) {
        relatedTarget = null;
      }
    }
    // TODO(arv): Use goog.events.EventType when it has been refactored into its
    // own file.
  } else if (type == goog.events.EventType.MOUSEOVER) {
    relatedTarget = e.fromElement;
  } else if (type == goog.events.EventType.MOUSEOUT) {
    relatedTarget = e.toElement;
  }

  this.relatedTarget = relatedTarget;

  // Webkit emits a lame warning whenever layerX/layerY is accessed.
  // http://code.google.com/p/chromium/issues/detail?id=101733
  this.offsetX = (goog.userAgent.WEBKIT || e.offsetX !== undefined) ?
      e.offsetX : e.layerX;
  this.offsetY = (goog.userAgent.WEBKIT || e.offsetY !== undefined) ?
      e.offsetY : e.layerY;

  this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
  this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;

  this.button = e.button;

  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == 'keypress' ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  if (e.defaultPrevented) {
    this.preventDefault();
  }
  delete this.propagationStopped_;
***REMOVED***


***REMOVED***
***REMOVED*** Tests to see which button was pressed during the event. This is really only
***REMOVED*** useful in IE and Gecko browsers. And in IE, it's only useful for
***REMOVED*** mousedown/mouseup events, because click only fires for the left mouse button.
***REMOVED***
***REMOVED*** Safari 2 only reports the left button being clicked, and uses the value '1'
***REMOVED*** instead of 0. Opera only reports a mousedown event for the middle button, and
***REMOVED*** no mouse events for the right button. Opera has default behavior for left and
***REMOVED*** middle click that can only be overridden via a configuration setting.
***REMOVED***
***REMOVED*** There's a nice table of this mess at http://www.unixpapa.com/js/mouse.html.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent.MouseButton} button The button
***REMOVED***     to test for.
***REMOVED*** @return {boolean} True if button was pressed.
***REMOVED***
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if (!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if (this.type == 'click') {
      return button == goog.events.BrowserEvent.MouseButton.LEFT;
    } else {
      return !!(this.event_.button &
          goog.events.BrowserEvent.IEButtonMap[button]);
    }
  } else {
    return this.event_.button == button;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether this has an "action"-producing mouse button.
***REMOVED***
***REMOVED*** By definition, this includes left-click on windows/linux, and left-click
***REMOVED*** without the ctrl key on Macs.
***REMOVED***
***REMOVED*** @return {boolean} The result.
***REMOVED***
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  // Webkit does not ctrl+click to be a right-click, so we
  // normalize it to behave like Gecko and Opera.
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) &&
      !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if (this.event_.stopPropagation) {
    this.event_.stopPropagation();
  } else {
    this.event_.cancelBubble = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (!be.preventDefault) {
    be.returnValue = false;
    if (goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        // Most keys can be prevented using returnValue. Some special keys
        // require setting the keyCode to -1 as well:
        //
        // In IE7:
        // F3, F5, F10, F11, Ctrl+P, Crtl+O, Ctrl+F (these are taken from IE6)
        //
        // In IE8:
        // Ctrl+P, Crtl+O, Ctrl+F (F1-F12 cannot be stopped through the event)
        //
        // We therefore do this for all function keys as well as when Ctrl key
        // is pressed.
        var VK_F1 = 112;
        var VK_F12 = 123;
        if (be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1;
        }
      } catch (ex) {
        // IE throws an 'access denied' exception when trying to change
        // keyCode in some situations (e.g. srcElement is input[type=file],
        // or srcElement is an anchor tag rewritten by parent's innerHTML).
        // Do nothing in this case.
      }
    }
  } else {
    be.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {Event} The underlying browser event object.
***REMOVED***
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.BrowserEvent.prototype.disposeInternal = function() {
***REMOVED***
