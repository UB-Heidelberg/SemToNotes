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
***REMOVED*** @fileoverview This file contains a class for working with keyboard events
***REMOVED*** that repeat consistently across browsers and platforms. It also unifies the
***REMOVED*** key code so that it is the same in all browsers and platforms.
***REMOVED***
***REMOVED*** Different web browsers have very different keyboard event handling. Most
***REMOVED*** importantly is that only certain browsers repeat keydown events:
***REMOVED*** IE, Opera, FF/Win32, and Safari 3 repeat keydown events.
***REMOVED*** FF/Mac and Safari 2 do not.
***REMOVED***
***REMOVED*** For the purposes of this code, "Safari 3" means WebKit 525+, when WebKit
***REMOVED*** decided that they should try to match IE's key handling behavior.
***REMOVED*** Safari 3.0.4, which shipped with Leopard (WebKit 523), has the
***REMOVED*** Safari 2 behavior.
***REMOVED***
***REMOVED*** Firefox, Safari, Opera prevent on keypress
***REMOVED***
***REMOVED*** IE prevents on keydown
***REMOVED***
***REMOVED*** Firefox does not fire keypress for shift, ctrl, alt
***REMOVED*** Firefox does fire keydown for shift, ctrl, alt, meta
***REMOVED*** Firefox does not repeat keydown for shift, ctrl, alt, meta
***REMOVED***
***REMOVED*** Firefox does not fire keypress for up and down in an input
***REMOVED***
***REMOVED*** Opera fires keypress for shift, ctrl, alt, meta
***REMOVED*** Opera does not repeat keypress for shift, ctrl, alt, meta
***REMOVED***
***REMOVED*** Safari 2 and 3 do not fire keypress for shift, ctrl, alt
***REMOVED*** Safari 2 does not fire keydown for shift, ctrl, alt
***REMOVED*** Safari 3***REMOVED***does* fire keydown for shift, ctrl, alt
***REMOVED***
***REMOVED*** IE provides the keycode for keyup/down events and the charcode (in the
***REMOVED*** keycode field) for keypress.
***REMOVED***
***REMOVED*** Mozilla provides the keycode for keyup/down and the charcode for keypress
***REMOVED*** unless it's a non text modifying key in which case the keycode is provided.
***REMOVED***
***REMOVED*** Safari 3 provides the keycode and charcode for all events.
***REMOVED***
***REMOVED*** Opera provides the keycode for keyup/down event and either the charcode or
***REMOVED*** the keycode (in the keycode field) for keypress events.
***REMOVED***
***REMOVED*** Firefox x11 doesn't fire keydown events if a another key is already held down
***REMOVED*** until the first key is released. This can cause a key event to be fired with
***REMOVED*** a keyCode for the first key and a charCode for the second key.
***REMOVED***
***REMOVED*** Safari in keypress
***REMOVED***
***REMOVED***        charCode keyCode which
***REMOVED*** ENTER:       13      13    13
***REMOVED*** F1:       63236   63236 63236
***REMOVED*** F8:       63243   63243 63243
***REMOVED*** ...
***REMOVED*** p:          112     112   112
***REMOVED*** P:           80      80    80
***REMOVED***
***REMOVED*** Firefox, keypress:
***REMOVED***
***REMOVED***        charCode keyCode which
***REMOVED*** ENTER:        0      13    13
***REMOVED*** F1:           0     112     0
***REMOVED*** F8:           0     119     0
***REMOVED*** ...
***REMOVED*** p:          112       0   112
***REMOVED*** P:           80       0    80
***REMOVED***
***REMOVED*** Opera, Mac+Win32, keypress:
***REMOVED***
***REMOVED***         charCode keyCode which
***REMOVED*** ENTER: undefined      13    13
***REMOVED*** F1:    undefined     112     0
***REMOVED*** F8:    undefined     119     0
***REMOVED*** ...
***REMOVED*** p:     undefined     112   112
***REMOVED*** P:     undefined      80    80
***REMOVED***
***REMOVED*** IE7, keydown
***REMOVED***
***REMOVED***         charCode keyCode     which
***REMOVED*** ENTER: undefined      13 undefined
***REMOVED*** F1:    undefined     112 undefined
***REMOVED*** F8:    undefined     119 undefined
***REMOVED*** ...
***REMOVED*** p:     undefined      80 undefined
***REMOVED*** P:     undefined      80 undefined
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/keyhandler.html
***REMOVED***

goog.provide('goog.events.KeyEvent');
goog.provide('goog.events.KeyHandler');
goog.provide('goog.events.KeyHandler.EventType');

***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A wrapper around an element that you want to listen to keyboard events on.
***REMOVED*** @param {Element|Document=} opt_element The element or document to listen on.
***REMOVED*** @param {boolean=} opt_capture Whether to listen for browser events in
***REMOVED***     capture phase (defaults to false).
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.KeyHandler = function(opt_element, opt_capture) {
  goog.events.EventTarget.call(this);

  if (opt_element) {
    this.attach(opt_element, opt_capture);
  }
***REMOVED***
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** This is the element that we will listen to the real keyboard events on.
***REMOVED*** @type {Element|Document|null}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.element_ = null;


***REMOVED***
***REMOVED*** The key for the key press listener.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.keyPressKey_ = null;


***REMOVED***
***REMOVED*** The key for the key down listener.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.keyDownKey_ = null;


***REMOVED***
***REMOVED*** The key for the key up listener.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.keyUpKey_ = null;


***REMOVED***
***REMOVED*** Used to detect keyboard repeat events.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.events.KeyHandler.prototype.lastKey_ = -1;


***REMOVED***
***REMOVED*** Keycode recorded for key down events. As most browsers don't report the
***REMOVED*** keycode in the key press event we need to record it in the key down phase.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.events.KeyHandler.prototype.keyCode_ = -1;


***REMOVED***
***REMOVED*** Alt key recorded for key down events. FF on Mac does not report the alt key
***REMOVED*** flag in the key press event, we need to record it in the key down phase.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.altKey_ = false;


***REMOVED***
***REMOVED*** Enum type for the events fired by the key handler
***REMOVED*** @enum {string}
***REMOVED***
goog.events.KeyHandler.EventType = {
  KEY: 'key'
***REMOVED***


***REMOVED***
***REMOVED*** An enumeration of key codes that Safari 2 does incorrectly
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.safariKey_ = {
  '3': goog.events.KeyCodes.ENTER, // 13
  '12': goog.events.KeyCodes.NUMLOCK, // 144
  '63232': goog.events.KeyCodes.UP, // 38
  '63233': goog.events.KeyCodes.DOWN, // 40
  '63234': goog.events.KeyCodes.LEFT, // 37
  '63235': goog.events.KeyCodes.RIGHT, // 39
  '63236': goog.events.KeyCodes.F1, // 112
  '63237': goog.events.KeyCodes.F2, // 113
  '63238': goog.events.KeyCodes.F3, // 114
  '63239': goog.events.KeyCodes.F4, // 115
  '63240': goog.events.KeyCodes.F5, // 116
  '63241': goog.events.KeyCodes.F6, // 117
  '63242': goog.events.KeyCodes.F7, // 118
  '63243': goog.events.KeyCodes.F8, // 119
  '63244': goog.events.KeyCodes.F9, // 120
  '63245': goog.events.KeyCodes.F10, // 121
  '63246': goog.events.KeyCodes.F11, // 122
  '63247': goog.events.KeyCodes.F12, // 123
  '63248': goog.events.KeyCodes.PRINT_SCREEN, // 44
  '63272': goog.events.KeyCodes.DELETE, // 46
  '63273': goog.events.KeyCodes.HOME, // 36
  '63275': goog.events.KeyCodes.END, // 35
  '63276': goog.events.KeyCodes.PAGE_UP, // 33
  '63277': goog.events.KeyCodes.PAGE_DOWN, // 34
  '63289': goog.events.KeyCodes.NUMLOCK, // 144
  '63302': goog.events.KeyCodes.INSERT // 45
***REMOVED***


***REMOVED***
***REMOVED*** An enumeration of key identifiers currently part of the W3C draft for DOM3
***REMOVED*** and their mappings to keyCodes.
***REMOVED*** http://www.w3.org/TR/DOM-Level-3-Events/keyset.html#KeySet-Set
***REMOVED*** This is currently supported in Safari and should be platform independent.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.keyIdentifier_ = {
  'Up': goog.events.KeyCodes.UP, // 38
  'Down': goog.events.KeyCodes.DOWN, // 40
  'Left': goog.events.KeyCodes.LEFT, // 37
  'Right': goog.events.KeyCodes.RIGHT, // 39
  'Enter': goog.events.KeyCodes.ENTER, // 13
  'F1': goog.events.KeyCodes.F1, // 112
  'F2': goog.events.KeyCodes.F2, // 113
  'F3': goog.events.KeyCodes.F3, // 114
  'F4': goog.events.KeyCodes.F4, // 115
  'F5': goog.events.KeyCodes.F5, // 116
  'F6': goog.events.KeyCodes.F6, // 117
  'F7': goog.events.KeyCodes.F7, // 118
  'F8': goog.events.KeyCodes.F8, // 119
  'F9': goog.events.KeyCodes.F9, // 120
  'F10': goog.events.KeyCodes.F10, // 121
  'F11': goog.events.KeyCodes.F11, // 122
  'F12': goog.events.KeyCodes.F12, // 123
  'U+007F': goog.events.KeyCodes.DELETE, // 46
  'Home': goog.events.KeyCodes.HOME, // 36
  'End': goog.events.KeyCodes.END, // 35
  'PageUp': goog.events.KeyCodes.PAGE_UP, // 33
  'PageDown': goog.events.KeyCodes.PAGE_DOWN, // 34
  'Insert': goog.events.KeyCodes.INSERT // 45
***REMOVED***


***REMOVED***
***REMOVED*** If true, the KeyEvent fires on keydown. Otherwise, it fires on keypress.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE ||
    goog.userAgent.WEBKIT && goog.userAgent.isVersion('525');


***REMOVED***
***REMOVED*** If true, the alt key flag is saved during the key down and reused when
***REMOVED*** handling the key press. FF on Mac does not set the alt flag in the key press
***REMOVED*** event.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC &&
    goog.userAgent.GECKO;


***REMOVED***
***REMOVED*** Records the keycode for browsers that only returns the keycode for key up/
***REMOVED*** down events. For browser/key combinations that doesn't trigger a key pressed
***REMOVED*** event it also fires the patched key event.
***REMOVED*** @param {goog.events.BrowserEvent} e The key down event.
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.handleKeyDown_ = function(e) {
  // Ctrl-Tab and Alt-Tab can cause the focus to be moved to another window
  // before we've caught a key-up event.  If the last-key was one of these we
  // reset the state.

  if (goog.userAgent.WEBKIT) {
    if (this.lastKey_ == goog.events.KeyCodes.CTRL && !e.ctrlKey ||
        this.lastKey_ == goog.events.KeyCodes.ALT && !e.altKey ||
        goog.userAgent.MAC &&
        this.lastKey_ == goog.events.KeyCodes.META && !e.metaKey) {
      this.lastKey_ = -1;
      this.keyCode_ = -1;
    }
  }

  if (this.lastKey_ == -1) {
    if (e.ctrlKey && e.keyCode != goog.events.KeyCodes.CTRL) {
      this.lastKey_ = goog.events.KeyCodes.CTRL;
    } else if (e.altKey && e.keyCode != goog.events.KeyCodes.ALT) {
      this.lastKey_ = goog.events.KeyCodes.ALT;
    } else if (e.metaKey && e.keyCode != goog.events.KeyCodes.META) {
      this.lastKey_ = goog.events.KeyCodes.META;
    }
  }

  if (goog.events.KeyHandler.USES_KEYDOWN_ &&
      !goog.events.KeyCodes.firesKeyPressEvent(e.keyCode,
          this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey)) {
    this.handleEvent(e);
  } else {
    this.keyCode_ = goog.userAgent.GECKO ?
        goog.events.KeyCodes.normalizeGeckoKeyCode(e.keyCode) :
        e.keyCode;
    if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      this.altKey_ = e.altKey;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Resets the stored previous values. Needed to be called for webkit which will
***REMOVED*** not generate a key up for meta key operations. This should only be called
***REMOVED*** when having finished with repeat key possiblities.
***REMOVED***
goog.events.KeyHandler.prototype.resetState = function() {
  this.lastKey_ = -1;
  this.keyCode_ = -1;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the stored previous key value, resetting the key repeat status. Uses
***REMOVED*** -1 because the Safari 3 Windows beta reports 0 for certain keys (like Home
***REMOVED*** and End.)
***REMOVED*** @param {goog.events.BrowserEvent} e The keyup event.
***REMOVED*** @private
***REMOVED***
goog.events.KeyHandler.prototype.handleKeyup_ = function(e) {
  this.resetState();
  this.altKey_ = e.altKey;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the events on the element.
***REMOVED*** @param {goog.events.BrowserEvent} e  The keyboard event sent from the
***REMOVED***     browser.
***REMOVED***
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  var altKey = be.altKey;

  // IE reports the character code in the keyCode field for keypress events.
  // There are two exceptions however, Enter and Escape.
  if (goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER &&
        keyCode != goog.events.KeyCodes.ESC ?
            be.keyCode : 0;

  // Safari reports the character code in the keyCode field for keypress
  // events but also has a charCode field.
  } else if (goog.userAgent.WEBKIT &&
      e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = be.charCode >= 0 && be.charCode < 63232 &&
        goog.events.KeyCodes.isCharacterKey(keyCode) ?
            be.charCode : 0;

  // Opera reports the keycode or the character code in the keyCode field.
  } else if (goog.userAgent.OPERA) {
    keyCode = this.keyCode_;
    charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ?
        be.keyCode : 0;

  // Mozilla reports the character code in the charCode field.
  } else {
    keyCode = be.keyCode || this.keyCode_;
    charCode = be.charCode || 0;
    if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      altKey = this.altKey_;
    }
    // On the Mac, shift-/ triggers a question mark char code and no key code
    // (normalized to WIN_KEY), so we synthesize the latter.
    if (goog.userAgent.MAC &&
        charCode == goog.events.KeyCodes.QUESTION_MARK &&
        keyCode == goog.events.KeyCodes.WIN_KEY) {
      keyCode = goog.events.KeyCodes.SLASH;
    }
  }

  var key = keyCode;
  var keyIdentifier = be.keyIdentifier;

  // Correct the key value for certain browser-specific quirks.
  if (keyCode) {
    if (keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      // NOTE(nicksantos): Safari 3 has fixed this problem,
      // this is only needed for Safari 2.
      key = goog.events.KeyHandler.safariKey_[keyCode];
    } else {

      // Safari returns 25 for Shift+Tab instead of 9.
      if (keyCode == 25 && e.shiftKey) {
        key = 9;
      }
    }
  } else if (keyIdentifier &&
             keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
    // This is needed for Safari Windows because it currently doesn't give a
    // keyCode/which for non printable keys.
    key = goog.events.KeyHandler.keyIdentifier_[keyIdentifier];
  }

  // If we get the same keycode as a keydown/keypress without having seen a
  // keyup event, then this event was caused by key repeat.
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;

  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  event.altKey = altKey;
  this.dispatchEvent(event);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the element listened on for the real keyboard events.
***REMOVED*** @return {Element|Document|null} The element listened on for the real
***REMOVED***     keyboard events.
***REMOVED***
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the proper key event listeners to the element.
***REMOVED*** @param {Element|Document} element The element to listen on.
***REMOVED*** @param {boolean=} opt_capture Whether to listen for browser events in
***REMOVED***     capture phase (defaults to false).
***REMOVED***
goog.events.KeyHandler.prototype.attach = function(element, opt_capture) {
  if (this.keyUpKey_) {
    this.detach();
  }

  this.element_ = element;

  this.keyPressKey_ = goog.events.listen(this.element_,
                                         goog.events.EventType.KEYPRESS,
                                         this,
                                         opt_capture);

  // Most browsers (Safari 2 being the notable exception) doesn't include the
  // keyCode in keypress events (IE has the char code in the keyCode field and
  // Mozilla only included the keyCode if there's no charCode). Thus we have to
  // listen for keydown to capture the keycode.
  this.keyDownKey_ = goog.events.listen(this.element_,
                                        goog.events.EventType.KEYDOWN,
                                        this.handleKeyDown_,
                                        opt_capture,
                                        this);


  this.keyUpKey_ = goog.events.listen(this.element_,
                                      goog.events.EventType.KEYUP,
                                      this.handleKeyup_,
                                      opt_capture,
                                      this);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the listeners that may exist.
***REMOVED***
goog.events.KeyHandler.prototype.detach = function() {
  if (this.keyPressKey_) {
    goog.events.unlistenByKey(this.keyPressKey_);
    goog.events.unlistenByKey(this.keyDownKey_);
    goog.events.unlistenByKey(this.keyUpKey_);
    this.keyPressKey_ = null;
    this.keyDownKey_ = null;
    this.keyUpKey_ = null;
  }
  this.element_ = null;
  this.lastKey_ = -1;
  this.keyCode_ = -1;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach();
***REMOVED***



***REMOVED***
***REMOVED*** This class is used for the goog.events.KeyHandler.EventType.KEY event and
***REMOVED*** it overrides the key code with the fixed key code.
***REMOVED*** @param {number} keyCode The adjusted key code.
***REMOVED*** @param {number} charCode The unicode character code.
***REMOVED*** @param {boolean} repeat Whether this event was generated by keyboard repeat.
***REMOVED*** @param {Event} browserEvent Browser event object.
***REMOVED***
***REMOVED*** @extends {goog.events.BrowserEvent}
***REMOVED***
goog.events.KeyEvent = function(keyCode, charCode, repeat, browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.KeyHandler.EventType.KEY;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keycode of key press.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.keyCode = keyCode;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Unicode character code.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.charCode = charCode;

 ***REMOVED*****REMOVED***
  ***REMOVED*** True if this event was generated by keyboard auto-repeat (i.e., the user is
  ***REMOVED*** holding the key down.)
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.repeat = repeat;
***REMOVED***
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
