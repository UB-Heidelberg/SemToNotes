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
***REMOVED*** @fileoverview Generic keyboard shortcut handler.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/keyboardshortcuts.html
***REMOVED***

goog.provide('goog.ui.KeyboardShortcutEvent');
goog.provide('goog.ui.KeyboardShortcutHandler');
goog.provide('goog.ui.KeyboardShortcutHandler.EventType');

goog.require('goog.Timer');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyNames');
goog.require('goog.object');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Component for handling keyboard shortcuts. A shortcut is registered and bound
***REMOVED*** to a specific identifier. Once the shortcut is triggered an event is fired
***REMOVED*** with the identifier for the shortcut. This allows keyboard shortcuts to be
***REMOVED*** customized without modifying the code that listens for them.
***REMOVED***
***REMOVED*** Supports keyboard shortcuts triggered by a single key, a stroke stroke (key
***REMOVED*** plus at least one modifier) and a sequence of keys or strokes.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget|EventTarget} keyTarget Event target that the
***REMOVED***     key event listener is attached to, typically the applications root
***REMOVED***     container.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.KeyboardShortcutHandler = function(keyTarget) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Registered keyboard shortcuts tree. Stored as a map with the keyCode and
  ***REMOVED*** modifier(s) as the key and either a list of further strokes or the shortcut
  ***REMOVED*** task identifier as the value.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @see #makeKey_
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.shortcuts_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of the last sequence of strokes. Object contains time last key was
  ***REMOVED*** pressed and an array of strokes, represented by numeric value.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastKeys_ = {
    strokes: [],
    time: 0
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of numeric key codes for keys that are safe to always regarded as
  ***REMOVED*** shortcuts, even if entered in a textarea or input field.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.globalKeys_ = goog.object.createSet(
      goog.ui.KeyboardShortcutHandler.DEFAULT_GLOBAL_KEYS_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of input types that should only accept ENTER as a shortcut.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.textInputs_ = goog.object.createSet(
      goog.ui.KeyboardShortcutHandler.DEFAULT_TEXT_INPUTS_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to always prevent the default action if a shortcut event is fired.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.alwaysPreventDefault_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to always stop propagation if a shortcut event is fired.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.alwaysStopPropagation_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to treat all shortcuts as if they had been passed
  ***REMOVED*** to setGlobalKeys().
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.allShortcutsAreGlobal_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to treat shortcuts with modifiers as if they had been passed
  ***REMOVED*** to setGlobalKeys().  Ignored if allShortcutsAreGlobal_ is true.  Applies
  ***REMOVED*** only to form elements (not content-editable).
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.modifierShortcutsAreGlobal_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to treat space key as a shortcut when the focused element is a
  ***REMOVED*** checkbox, radiobutton or button.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.allowSpaceKeyOnButtons_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tracks the currently pressed shortcut key, for Firefox.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activeShortcutKeyForGecko_ = null;

  this.initializeKeyListener(keyTarget);
***REMOVED***
goog.inherits(goog.ui.KeyboardShortcutHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Maximum allowed delay, in milliseconds, allowed between the first and second
***REMOVED*** key in a key sequence.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.KeyboardShortcutHandler.MAX_KEY_SEQUENCE_DELAY = 1500; // 1.5 sec


***REMOVED***
***REMOVED*** Bit values for modifier keys.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.KeyboardShortcutHandler.Modifiers = {
  NONE: 0,
  SHIFT: 1,
  CTRL: 2,
  ALT: 4,
  META: 8
***REMOVED***


***REMOVED***
***REMOVED*** Keys marked as global by default.
***REMOVED*** @type {Array.<goog.events.KeyCodes>}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.DEFAULT_GLOBAL_KEYS_ = [
  goog.events.KeyCodes.ESC,
  goog.events.KeyCodes.F1,
  goog.events.KeyCodes.F2,
  goog.events.KeyCodes.F3,
  goog.events.KeyCodes.F4,
  goog.events.KeyCodes.F5,
  goog.events.KeyCodes.F6,
  goog.events.KeyCodes.F7,
  goog.events.KeyCodes.F8,
  goog.events.KeyCodes.F9,
  goog.events.KeyCodes.F10,
  goog.events.KeyCodes.F11,
  goog.events.KeyCodes.F12,
  goog.events.KeyCodes.PAUSE
];


***REMOVED***
***REMOVED*** Text input types to allow only ENTER shortcuts.
***REMOVED*** Web Forms 2.0 for HTML5: Section 4.10.7 from 29 May 2012.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.DEFAULT_TEXT_INPUTS_ = [
  'color',
  'date',
  'datetime',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week'
];


***REMOVED***
***REMOVED*** Events.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.KeyboardShortcutHandler.EventType = {
  SHORTCUT_TRIGGERED: 'shortcut',
  SHORTCUT_PREFIX: 'shortcut_'
***REMOVED***


***REMOVED***
***REMOVED*** Cache for name to key code lookup.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.nameToKeyCodeCache_;


***REMOVED***
***REMOVED*** Target on which to listen for key events.
***REMOVED*** @type {goog.events.EventTarget|EventTarget}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.keyTarget_;


***REMOVED***
***REMOVED*** Due to a bug in the way that Gecko on Mac handles cut/copy/paste key events
***REMOVED*** using the meta key, it is necessary to fake the keyDown for the action key
***REMOVED*** (C,V,X) by capturing it on keyUp.
***REMOVED*** Because users will often release the meta key a slight moment before they
***REMOVED*** release the action key, we need this variable that will store whether the
***REMOVED*** meta key has been released recently.
***REMOVED*** It will be cleared after a short delay in the key handling logic.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.metaKeyRecentlyReleased_;


***REMOVED***
***REMOVED*** Whether a key event is a printable-key event. Windows uses ctrl+alt
***REMOVED*** (alt-graph) keys to type characters on European keyboards. For such keys, we
***REMOVED*** cannot identify whether these keys are used for typing characters when
***REMOVED*** receiving keydown events. Therefore, we set this flag when we receive their
***REMOVED*** respective keypress events and fire shortcut events only when we do not
***REMOVED*** receive them.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.isPrintableKey_;


***REMOVED***
***REMOVED*** Static method for getting the key code for a given key.
***REMOVED*** @param {string} name Name of key.
***REMOVED*** @return {number} The key code.
***REMOVED***
goog.ui.KeyboardShortcutHandler.getKeyCode = function(name) {
  // Build reverse lookup object the first time this method is called.
  if (!goog.ui.KeyboardShortcutHandler.nameToKeyCodeCache_) {
    var map = {***REMOVED***
    for (var key in goog.events.KeyNames) {
      map[goog.events.KeyNames[key]] = key;
    }
    goog.ui.KeyboardShortcutHandler.nameToKeyCodeCache_ = map;
  }

  // Check if key is in cache.
  return goog.ui.KeyboardShortcutHandler.nameToKeyCodeCache_[name];
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to always prevent the default action when a shortcut event is
***REMOVED*** fired. If false, the default action is prevented only if preventDefault is
***REMOVED*** called on either of the corresponding SHORTCUT_TRIGGERED or SHORTCUT_PREFIX
***REMOVED*** events. If true, the default action is prevented whenever a shortcut event
***REMOVED*** is fired. The default value is true.
***REMOVED*** @param {boolean} alwaysPreventDefault Whether to always call preventDefault.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setAlwaysPreventDefault = function(
    alwaysPreventDefault) {
  this.alwaysPreventDefault_ = alwaysPreventDefault;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the default action will always be prevented when a shortcut
***REMOVED*** event is fired. The default value is true.
***REMOVED*** @see #setAlwaysPreventDefault
***REMOVED*** @return {boolean} Whether preventDefault will always be called.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getAlwaysPreventDefault = function() {
  return this.alwaysPreventDefault_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to always stop propagation for the event when fired. If false,
***REMOVED*** the propagation is stopped only if stopPropagation is called on either of the
***REMOVED*** corresponding SHORT_CUT_TRIGGERED or SHORTCUT_PREFIX events. If true, the
***REMOVED*** event is prevented from propagating beyond its target whenever it is fired.
***REMOVED*** The default value is false.
***REMOVED*** @param {boolean} alwaysStopPropagation Whether to always call
***REMOVED***     stopPropagation.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setAlwaysStopPropagation = function(
    alwaysStopPropagation) {
  this.alwaysStopPropagation_ = alwaysStopPropagation;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the event will always be stopped from propagating beyond its
***REMOVED*** target when a shortcut event is fired. The default value is false.
***REMOVED*** @see #setAlwaysStopPropagation
***REMOVED*** @return {boolean} Whether stopPropagation will always be called.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getAlwaysStopPropagation =
    function() {
  return this.alwaysStopPropagation_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to treat all shortcuts (including modifier shortcuts) as if the
***REMOVED*** keys had been passed to the setGlobalKeys function.
***REMOVED*** @param {boolean} allShortcutsGlobal Whether to treat all shortcuts as global.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setAllShortcutsAreGlobal = function(
    allShortcutsGlobal) {
  this.allShortcutsAreGlobal_ = allShortcutsGlobal;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether all shortcuts (including modifier shortcuts) are treated as
***REMOVED*** if the keys had been passed to the setGlobalKeys function.
***REMOVED*** @see #setAllShortcutsAreGlobal
***REMOVED*** @return {boolean} Whether all shortcuts are treated as globals.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getAllShortcutsAreGlobal =
    function() {
  return this.allShortcutsAreGlobal_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to treat shortcuts with modifiers as if the keys had been
***REMOVED*** passed to the setGlobalKeys function.  Ignored if you have called
***REMOVED*** setAllShortcutsAreGlobal(true).  Applies only to form elements (not
***REMOVED*** content-editable).
***REMOVED*** @param {boolean} modifierShortcutsGlobal Whether to treat shortcuts with
***REMOVED***     modifiers as global.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setModifierShortcutsAreGlobal =
    function(modifierShortcutsGlobal) {
  this.modifierShortcutsAreGlobal_ = modifierShortcutsGlobal;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether shortcuts with modifiers are treated as if the keys had been
***REMOVED*** passed to the setGlobalKeys function.  Ignored if you have called
***REMOVED*** setAllShortcutsAreGlobal(true).  Applies only to form elements (not
***REMOVED*** content-editable).
***REMOVED*** @see #setModifierShortcutsAreGlobal
***REMOVED*** @return {boolean} Whether shortcuts with modifiers are treated as globals.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getModifierShortcutsAreGlobal =
    function() {
  return this.modifierShortcutsAreGlobal_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to treat space key as a shortcut when the focused element is a
***REMOVED*** checkbox, radiobutton or button.
***REMOVED*** @param {boolean} allowSpaceKeyOnButtons Whether to treat space key as a
***REMOVED***     shortcut when the focused element is a checkbox, radiobutton or button.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setAllowSpaceKeyOnButtons = function(
    allowSpaceKeyOnButtons) {
  this.allowSpaceKeyOnButtons_ = allowSpaceKeyOnButtons;
***REMOVED***


***REMOVED***
***REMOVED*** Registers a keyboard shortcut.
***REMOVED*** @param {string} identifier Identifier for the task performed by the keyboard
***REMOVED***                 combination. Multiple shortcuts can be provided for the same
***REMOVED***                 task by specifying the same identifier.
***REMOVED*** @param {...(number|string|Array.<number>)} var_args See below.
***REMOVED***
***REMOVED*** param {number} keyCode Numeric code for key
***REMOVED*** param {number=} opt_modifiers Bitmap indicating required modifier keys.
***REMOVED***                goog.ui.KeyboardShortcutHandler.Modifiers.SHIFT, CONTROL,
***REMOVED***                ALT, or META.
***REMOVED***
***REMOVED*** The last two parameters can be repeated any number of times to create a
***REMOVED*** shortcut using a sequence of strokes. Instead of varagrs the second parameter
***REMOVED*** could also be an array where each element would be ragarded as a parameter.
***REMOVED***
***REMOVED*** A string representation of the shortcut can be supplied instead of the last
***REMOVED*** two parameters. In that case the method only takes two arguments, the
***REMOVED*** identifier and the string.
***REMOVED***
***REMOVED*** Examples:
***REMOVED***   g               registerShortcut(str, G_KEYCODE)
***REMOVED***   Ctrl+g          registerShortcut(str, G_KEYCODE, CTRL)
***REMOVED***   Ctrl+Shift+g    registerShortcut(str, G_KEYCODE, CTRL | SHIFT)
***REMOVED***   Ctrl+g a        registerShortcut(str, G_KEYCODE, CTRL, A_KEYCODE)
***REMOVED***   Ctrl+g Shift+a  registerShortcut(str, G_KEYCODE, CTRL, A_KEYCODE, SHIFT)
***REMOVED***   g a             registerShortcut(str, G_KEYCODE, NONE, A_KEYCODE)
***REMOVED***
***REMOVED*** Examples using string representation for shortcuts:
***REMOVED***   g               registerShortcut(str, 'g')
***REMOVED***   Ctrl+g          registerShortcut(str, 'ctrl+g')
***REMOVED***   Ctrl+Shift+g    registerShortcut(str, 'ctrl+shift+g')
***REMOVED***   Ctrl+g a        registerShortcut(str, 'ctrl+g a')
***REMOVED***   Ctrl+g Shift+a  registerShortcut(str, 'ctrl+g shift+a')
***REMOVED***   g a             registerShortcut(str, 'g a').
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.registerShortcut = function(
    identifier, var_args) {

  // Add shortcut to shortcuts_ tree
  goog.ui.KeyboardShortcutHandler.setShortcut_(
      this.shortcuts_, this.interpretStrokes_(1, arguments), identifier);
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters a keyboard shortcut by keyCode and modifiers or string
***REMOVED*** representation of sequence.
***REMOVED***
***REMOVED*** param {number} keyCode Numeric code for key
***REMOVED*** param {number=} opt_modifiers Bitmap indicating required modifier keys.
***REMOVED***                 goog.ui.KeyboardShortcutHandler.Modifiers.SHIFT, CONTROL,
***REMOVED***                 ALT, or META.
***REMOVED***
***REMOVED*** The two parameters can be repeated any number of times to create a shortcut
***REMOVED*** using a sequence of strokes.
***REMOVED***
***REMOVED*** A string representation of the shortcut can be supplied instead see
***REMOVED*** {@link #registerShortcut} for syntax. In that case the method only takes one
***REMOVED*** argument.
***REMOVED***
***REMOVED*** @param {...(number|string|Array.<number>)} var_args String representation, or
***REMOVED***     array or list of alternating key codes and modifiers.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.unregisterShortcut = function(
    var_args) {
  // Remove shortcut from tree
  goog.ui.KeyboardShortcutHandler.setShortcut_(
      this.shortcuts_, this.interpretStrokes_(0, arguments), null);
***REMOVED***


***REMOVED***
***REMOVED*** Verifies if a particular keyboard shortcut is registered already. It has
***REMOVED*** the same interface as the unregistering of shortcuts.
***REMOVED***
***REMOVED*** param {number} keyCode Numeric code for key
***REMOVED*** param {number=} opt_modifiers Bitmap indicating required modifier keys.
***REMOVED***                 goog.ui.KeyboardShortcutHandler.Modifiers.SHIFT, CONTROL,
***REMOVED***                 ALT, or META.
***REMOVED***
***REMOVED*** The two parameters can be repeated any number of times to create a shortcut
***REMOVED*** using a sequence of strokes.
***REMOVED***
***REMOVED*** A string representation of the shortcut can be supplied instead see
***REMOVED*** {@link #registerShortcut} for syntax. In that case the method only takes one
***REMOVED*** argument.
***REMOVED***
***REMOVED*** @param {...(number|string|Array.<number>)} var_args String representation, or
***REMOVED***     array or list of alternating key codes and modifiers.
***REMOVED*** @return {boolean} Whether the specified keyboard shortcut is registered.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.isShortcutRegistered = function(
    var_args) {
  return this.checkShortcut_(this.interpretStrokes_(0, arguments));
***REMOVED***


***REMOVED***
***REMOVED*** Parses the variable arguments for registerShortcut and unregisterShortcut.
***REMOVED*** @param {number} initialIndex The first index of "args" to treat as
***REMOVED***     variable arguments.
***REMOVED*** @param {Object} args The "arguments" array passed
***REMOVED***     to registerShortcut or unregisterShortcut.  Please see the comments in
***REMOVED***     registerShortcut for list of allowed forms.
***REMOVED*** @return {!Array.<Object>} The sequence of objects containing the
***REMOVED***     keyCode and modifiers of each key in sequence.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.interpretStrokes_ = function(
    initialIndex, args) {
  var strokes;

  // Build strokes array from string.
  if (goog.isString(args[initialIndex])) {
    strokes = goog.ui.KeyboardShortcutHandler.parseStringShortcut(
        args[initialIndex]);

  // Build strokes array from arguments list or from array.
  } else {
    var strokesArgs = args, i = initialIndex;
    if (goog.isArray(args[initialIndex])) {
      strokesArgs = args[initialIndex];
      i = 0;
    }

    strokes = [];
    for (; i < strokesArgs.length; i += 2) {
      strokes.push({
        keyCode: strokesArgs[i],
        modifiers: strokesArgs[i + 1]
      });
    }
  }

  return strokes;
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters all keyboard shortcuts.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.unregisterAll = function() {
  this.shortcuts_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Sets the global keys; keys that are safe to always regarded as shortcuts,
***REMOVED*** even if entered in a textarea or input field.
***REMOVED*** @param {Array.<number>} keys List of keys.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.setGlobalKeys = function(keys) {
  this.globalKeys_ = goog.object.createSet(keys);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<string>} The global keys, i.e. keys that are safe to always
***REMOVED***     regard as shortcuts, even if entered in a textarea or input field.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getGlobalKeys = function() {
  return goog.object.getKeys(this.globalKeys_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.disposeInternal = function() {
  goog.ui.KeyboardShortcutHandler.superClass_.disposeInternal.call(this);
  this.unregisterAll();
  this.clearKeyListener();
***REMOVED***


***REMOVED***
***REMOVED*** Returns event type for a specific shortcut.
***REMOVED*** @param {string} identifier Identifier for the shortcut task.
***REMOVED*** @return {string} Theh event type.
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getEventType =
    function(identifier) {

  return goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_PREFIX + identifier;
***REMOVED***


***REMOVED***
***REMOVED*** Builds stroke array from string representation of shortcut.
***REMOVED*** @param {string} s String representation of shortcut.
***REMOVED*** @return {!Array.<Object>} The stroke array.
***REMOVED***
goog.ui.KeyboardShortcutHandler.parseStringShortcut = function(s) {
  // Normalize whitespace and force to lower case.
  s = s.replace(/[ +]*\+[ +]*/g, '+').replace(/[ ]+/g, ' ').toLowerCase();

  // Build strokes array from string, space separates strokes, plus separates
  // individual keys.
  var groups = s.split(' ');
  var strokes = [];
  for (var group, i = 0; group = groups[i]; i++) {
    var keys = group.split('+');
    var keyCode, modifiers = goog.ui.KeyboardShortcutHandler.Modifiers.NONE;
    for (var key, j = 0; key = keys[j]; j++) {
      switch (key) {
        case 'shift':
          modifiers |= goog.ui.KeyboardShortcutHandler.Modifiers.SHIFT;
          continue;
        case 'ctrl':
          modifiers |= goog.ui.KeyboardShortcutHandler.Modifiers.CTRL;
          continue;
        case 'alt':
          modifiers |= goog.ui.KeyboardShortcutHandler.Modifiers.ALT;
          continue;
        case 'meta':
          modifiers |= goog.ui.KeyboardShortcutHandler.Modifiers.META;
          continue;
      }
      keyCode = goog.ui.KeyboardShortcutHandler.getKeyCode(key);
      break;
    }
    strokes.push({keyCode: keyCode, modifiers: modifiers});
  }

  return strokes;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a key event listener that triggers {@link #handleKeyDown_} when keys
***REMOVED*** are pressed.
***REMOVED*** @param {goog.events.EventTarget|EventTarget} keyTarget Event target that the
***REMOVED***     event listener should be attached to.
***REMOVED*** @protected
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.initializeKeyListener =
    function(keyTarget) {
  this.keyTarget_ = keyTarget;

***REMOVED***this.keyTarget_, goog.events.EventType.KEYDOWN,
      this.handleKeyDown_, false, this);

  if (goog.userAgent.GECKO) {
  ***REMOVED***this.keyTarget_, goog.events.EventType.KEYUP,
        this.handleGeckoKeyUp_, false, this);
  }

  // Windows uses ctrl+alt keys (a.k.a. alt-graph keys) for typing characters
  // on European keyboards (e.g. ctrl+alt+e for an an euro sign.) Unfortunately,
  // Windows browsers except Firefox does not have any methods except listening
  // keypress and keyup events to identify if ctrl+alt keys are really used for
  // inputting characters. Therefore, we listen to these events and prevent
  // firing shortcut-key events if ctrl+alt keys are used for typing characters.
  if (goog.userAgent.WINDOWS && !goog.userAgent.GECKO) {
  ***REMOVED***this.keyTarget_, goog.events.EventType.KEYPRESS,
                       this.handleWindowsKeyPress_, false, this);
  ***REMOVED***this.keyTarget_, goog.events.EventType.KEYUP,
                       this.handleWindowsKeyUp_, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for when a keyup event is fired in Firefox (Gecko).
***REMOVED*** @param {goog.events.BrowserEvent} e The key event.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.handleGeckoKeyUp_ = function(e) {
  // Due to a bug in the way that Gecko on Mac handles cut/copy/paste key events
  // using the meta key, it is necessary to fake the keyDown for the action keys
  // (C,V,X) by capturing it on keyUp.
  // This is because the keyDown events themselves are not fired by the browser
  // in this case.
  // Because users will often release the meta key a slight moment before they
  // release the action key, we need to store whether the meta key has been
  // released recently to avoid "flaky" cutting/pasting behavior.
  if (goog.userAgent.MAC) {
    if (e.keyCode == goog.events.KeyCodes.MAC_FF_META) {
      this.metaKeyRecentlyReleased_ = true;
      goog.Timer.callOnce(function() {
        this.metaKeyRecentlyReleased_ = false;
      }, 400, this);
      return;
    }

    var metaKey = e.metaKey || this.metaKeyRecentlyReleased_;
    if ((e.keyCode == goog.events.KeyCodes.C ||
        e.keyCode == goog.events.KeyCodes.X ||
        e.keyCode == goog.events.KeyCodes.V) && metaKey) {
      e.metaKey = metaKey;
      this.handleKeyDown_(e);
    }
  }

  // Firefox triggers buttons on space keyUp instead of keyDown.  So if space
  // keyDown activated a shortcut, do NOT also trigger the focused button.
  if (goog.events.KeyCodes.SPACE == this.activeShortcutKeyForGecko_ &&
      goog.events.KeyCodes.SPACE == e.keyCode) {
    e.preventDefault();
  }
  this.activeShortcutKeyForGecko_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this event is possibly used for typing a printable character.
***REMOVED*** Windows uses ctrl+alt (a.k.a. alt-graph) keys for typing characters on
***REMOVED*** European keyboards. Since only Firefox provides a method that can identify
***REMOVED*** whether ctrl+alt keys are used for typing characters, we need to check
***REMOVED*** whether Windows sends a keypress event to prevent firing shortcut event if
***REMOVED*** this event is used for typing characters.
***REMOVED*** @param {goog.events.BrowserEvent} e The key event.
***REMOVED*** @return {boolean} Whether this event is a possible printable-key event.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.isPossiblePrintableKey_ =
    function(e) {
  return goog.userAgent.WINDOWS && !goog.userAgent.GECKO &&
      e.ctrlKey && e.altKey && !e.shiftKey;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for when a keypress event is fired on Windows.
***REMOVED*** @param {goog.events.BrowserEvent} e The key event.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.handleWindowsKeyPress_ = function(e) {
  // When this keypress event consists of a printable character, set the flag to
  // prevent firing shortcut key events when we receive the succeeding keyup
  // event. We accept all Unicode characters except control ones since this
  // keyCode may be a non-ASCII character.
  if (e.keyCode > 0x20 && this.isPossiblePrintableKey_(e)) {
    this.isPrintableKey_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for when a keyup event is fired on Windows.
***REMOVED*** @param {goog.events.BrowserEvent} e The key event.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.handleWindowsKeyUp_ = function(e) {
  // For possible printable-key events, try firing a shortcut-key event only
  // when this event is not used for typing a character.
  if (!this.isPrintableKey_ && this.isPossiblePrintableKey_(e)) {
    this.handleKeyDown_(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the listener that was added by link {@link #initializeKeyListener}.
***REMOVED*** @protected
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.clearKeyListener = function() {
  goog.events.unlisten(this.keyTarget_, goog.events.EventType.KEYDOWN,
      this.handleKeyDown_, false, this);
  if (goog.userAgent.GECKO) {
    goog.events.unlisten(this.keyTarget_, goog.events.EventType.KEYUP,
        this.handleGeckoKeyUp_, false, this);
  }
  if (goog.userAgent.WINDOWS && !goog.userAgent.GECKO) {
    goog.events.unlisten(this.keyTarget_, goog.events.EventType.KEYPRESS,
        this.handleWindowsKeyPress_, false, this);
    goog.events.unlisten(this.keyTarget_, goog.events.EventType.KEYUP,
        this.handleWindowsKeyUp_, false, this);
  }
  this.keyTarget_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes a stroke node to/from the given parent node.
***REMOVED*** @param {Object} parent Parent node to add/remove stroke to/from.
***REMOVED*** @param {Array.<Object>} strokes Array of strokes for shortcut.
***REMOVED*** @param {?string} identifier Identifier for the task performed by shortcut or
***REMOVED***     null to clear.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.setShortcut_ = function(parent,
                                                        strokes,
                                                        identifier) {
  var stroke = strokes.shift();
  var key = goog.ui.KeyboardShortcutHandler.makeKey_(stroke.keyCode,
                                                     stroke.modifiers);
  var node = parent[key];
  if (node && identifier && (strokes.length == 0 || goog.isString(node))) {
    throw Error('Keyboard shortcut conflicts with existing shortcut');
  }

  if (strokes.length) {
    if (!node) {
      node = parent[key] = {***REMOVED***
    }
    goog.ui.KeyboardShortcutHandler.setShortcut_(node,
                                                 strokes,
                                                 identifier);
  }
  else {
    parent[key] = identifier;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns shortcut for a specific set of strokes.
***REMOVED*** @param {Array.<number>} strokes Strokes array.
***REMOVED*** @param {number=} opt_index Index in array to start with.
***REMOVED*** @param {Object=} opt_list List to search for shortcut in.
***REMOVED*** @return {string|Object} The shortcut.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.getShortcut_ = function(
    strokes, opt_index, opt_list) {

  var list = opt_list || this.shortcuts_;
  var index = opt_index || 0;
  var stroke = strokes[index];
  var node = list[stroke];

  if (node && !goog.isString(node) && strokes.length - index > 1) {
    return this.getShortcut_(strokes, index + 1, node);
  }

  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a particular keyboard shortcut is registered.
***REMOVED*** @param {Array.<Object>} strokes Strokes array.
***REMOVED*** @return {boolean} True iff the keyboard is registred.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.checkShortcut_ = function(strokes) {
  var node = this.shortcuts_;
  while (strokes.length > 0 && node) {
    var stroke = strokes.shift();
    var key = goog.ui.KeyboardShortcutHandler.makeKey_(stroke.keyCode,
                                                       stroke.modifiers);
    node = node[key];
    if (goog.isString(node)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Constructs key from key code and modifiers.
***REMOVED***
***REMOVED*** The lower 8 bits are used for the key code, the following 3 for modifiers and
***REMOVED*** the remaining bits are unused.
***REMOVED***
***REMOVED*** @param {number} keyCode Numeric key code.
***REMOVED*** @param {number} modifiers Required modifiers.
***REMOVED*** @return {number} The key.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.makeKey_ = function(keyCode, modifiers) {
  // Make sure key code is just 8 bits and OR it with the modifiers left shifted
  // 8 bits.
  return (keyCode & 255) | (modifiers << 8);
***REMOVED***


***REMOVED***
***REMOVED*** Keypress handler.
***REMOVED*** @param {goog.events.BrowserEvent} event Keypress event.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.handleKeyDown_ = function(event) {
  if (!this.isValidShortcut_(event)) {
    return;
  }
  // For possible printable-key events, we cannot identify whether the events
  // are used for typing characters until we receive respective keyup events.
  // Therefore, we handle this event when we receive a succeeding keyup event
  // to verify this event is not used for typing characters.
  if (event.type == 'keydown' && this.isPossiblePrintableKey_(event)) {
    this.isPrintableKey_ = false;
    return;
  }

  var keyCode = goog.userAgent.GECKO ?
      goog.events.KeyCodes.normalizeGeckoKeyCode(event.keyCode) :
      event.keyCode;

  var modifiers =
      (event.shiftKey ? goog.ui.KeyboardShortcutHandler.Modifiers.SHIFT : 0) |
      (event.ctrlKey ? goog.ui.KeyboardShortcutHandler.Modifiers.CTRL : 0) |
      (event.altKey ? goog.ui.KeyboardShortcutHandler.Modifiers.ALT : 0) |
      (event.metaKey ? goog.ui.KeyboardShortcutHandler.Modifiers.META : 0);
  var stroke = goog.ui.KeyboardShortcutHandler.makeKey_(keyCode, modifiers);

  // Check if any previous strokes where entered within the acceptable time
  // period.
  var node, shortcut;
  var now = goog.now();
  if (this.lastKeys_.strokes.length && now - this.lastKeys_.time <=
      goog.ui.KeyboardShortcutHandler.MAX_KEY_SEQUENCE_DELAY) {
    node = this.getShortcut_(this.lastKeys_.strokes);
  } else {
    this.lastKeys_.strokes.length = 0;
  }

  // Check if this stroke triggers a shortcut, either on its own or combined
  // with previous strokes.
  node = node ? node[stroke] : this.shortcuts_[stroke];
  if (!node) {
    node = this.shortcuts_[stroke];
    this.lastKeys_.strokes = [];
  }
  // Check if stroke triggers a node.
  if (node && goog.isString(node)) {
    shortcut = node;
  }

  // Entered stroke(s) are a part of a sequence, store stroke and record
  // time to allow the following stroke(s) to trigger the shortcut.
  else if (node) {
    this.lastKeys_.strokes.push(stroke);
    this.lastKeys_.time = now;
    // Prevent default action so find-as-you-type doesn't steal keyboard focus.
    if (goog.userAgent.GECKO) {
      event.preventDefault();
    }
  }

  // No strokes for sequence, clear stored strokes.
  else {
    this.lastKeys_.strokes.length = 0;
  }

  // Dispatch keyboard shortcut event if a shortcut was triggered. In addition
  // to the generic keyboard shortcut event a more specific fine grained one,
  // specific for the shortcut identifier, is fired.
  if (shortcut) {
    if (this.alwaysPreventDefault_) {
      event.preventDefault();
    }

    if (this.alwaysStopPropagation_) {
      event.stopPropagation();
    }

    var types = goog.ui.KeyboardShortcutHandler.EventType;

    // Dispatch SHORTCUT_TRIGGERED event
    var target =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (event.target);
    var triggerEvent = new goog.ui.KeyboardShortcutEvent(
        types.SHORTCUT_TRIGGERED, shortcut, target);
    var retVal = this.dispatchEvent(triggerEvent);

    // Dispatch SHORTCUT_PREFIX_<identifier> event
    var prefixEvent = new goog.ui.KeyboardShortcutEvent(
        types.SHORTCUT_PREFIX + shortcut, shortcut, target);
    retVal &= this.dispatchEvent(prefixEvent);

    // The default action is prevented if 'preventDefault' was
    // called on either event, or if a listener returned false.
    if (!retVal) {
      event.preventDefault();
    }

    // Clear stored strokes
    this.lastKeys_.strokes.length = 0;

    // For Firefox, track which shortcut key was pushed.
    if (goog.userAgent.GECKO) {
      this.activeShortcutKeyForGecko_ = keyCode;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a given keypress event may be treated as a shortcut.
***REMOVED*** @param {goog.events.BrowserEvent} event Keypress event.
***REMOVED*** @return {boolean} Whether to attempt to process the event as a shortcut.
***REMOVED*** @private
***REMOVED***
goog.ui.KeyboardShortcutHandler.prototype.isValidShortcut_ = function(event) {
  var keyCode = event.keyCode;

  // Ignore Ctrl, Shift and ALT
  if (keyCode == goog.events.KeyCodes.SHIFT ||
      keyCode == goog.events.KeyCodes.CTRL ||
      keyCode == goog.events.KeyCodes.ALT) {
    return false;
  }
  var el =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (event.target);
  var isFormElement =
      el.tagName == 'TEXTAREA' || el.tagName == 'INPUT' ||
      el.tagName == 'BUTTON' || el.tagName == 'SELECT';

  var isContentEditable = !isFormElement && (el.isContentEditable ||
      (el.ownerDocument && el.ownerDocument.designMode == 'on'));

  if (!isFormElement && !isContentEditable) {
    return true;
  }
  // Always allow keys registered as global to be used (typically Esc, the
  // F-keys and other keys that are not typically used to manipulate text).
  if (this.globalKeys_[keyCode] || this.allShortcutsAreGlobal_) {
    return true;
  }
  if (isContentEditable) {
    // For events originating from an element in editing mode we only let
    // global key codes through.
    return false;
  }
  // Event target is one of (TEXTAREA, INPUT, BUTTON, SELECT).
  // Allow modifier shortcuts, unless we shouldn't.
  if (this.modifierShortcutsAreGlobal_ && (
      event.altKey || event.ctrlKey || event.metaKey)) {
    return true;
  }
  // Allow ENTER to be used as shortcut for text inputs.
  if (el.tagName == 'INPUT' && this.textInputs_[el.type]) {
    return keyCode == goog.events.KeyCodes.ENTER;
  }
  // Checkboxes, radiobuttons and buttons. Allow all but SPACE as shortcut.
  if (el.tagName == 'INPUT' || el.tagName == 'BUTTON') {
    // TODO(gboyer): If more flexibility is needed, create protected helper
    // methods for each case (e.g. button, input, etc).
    if (this.allowSpaceKeyOnButtons_) {
      return true;
    } else {
      return keyCode != goog.events.KeyCodes.SPACE;
    }
  }
  // Don't allow any additional shortcut keys for textareas or selects.
  return false;
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a keyboard shortcut event.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {string} identifier Task identifier for the triggered shortcut.
***REMOVED*** @param {Node|goog.events.EventTarget} target Target the original key press
***REMOVED***     event originated from.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.KeyboardShortcutEvent = function(type, identifier, target) {
  goog.events.Event.call(this, type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Task identifier for the triggered shortcut
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.identifier = identifier;
***REMOVED***
goog.inherits(goog.ui.KeyboardShortcutEvent, goog.events.Event);
