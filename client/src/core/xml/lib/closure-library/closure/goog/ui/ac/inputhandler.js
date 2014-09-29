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
***REMOVED*** @fileoverview Class for managing the interactions between an
***REMOVED*** auto-complete object and a text-input or textarea.
***REMOVED***
***REMOVED*** IME note:
***REMOVED***
***REMOVED*** We used to suspend autocomplete while there are IME preedit characters, but
***REMOVED*** now for parity with Search we do not. We still detect the beginning and end
***REMOVED*** of IME entry because we need to listen to more events while an IME commit is
***REMOVED*** happening, but we update continuously as the user types.
***REMOVED***
***REMOVED*** IMEs vary across operating systems, browsers, and even input languages. This
***REMOVED*** class tries to handle IME for:
***REMOVED*** - Windows x {FF3, IE7, Chrome} x MS IME 2002 (Japanese)
***REMOVED*** - Mac     x {FF3, Safari3}     x Kotoeri (Japanese)
***REMOVED*** - Linux   x {FF3}              x UIM + Anthy (Japanese)
***REMOVED***
***REMOVED*** TODO(user): We cannot handle {Mac, Linux} x FF3 correctly.
***REMOVED*** TODO(user): We need to support Windows x Google IME.
***REMOVED***
***REMOVED*** This class was tested with hiragana input. The event sequence when inputting
***REMOVED*** 'ai<enter>' with IME on (which commits two characters) is as follows:
***REMOVED***
***REMOVED*** Notation: [key down code, key press, key up code]
***REMOVED***           key code or +: event fired
***REMOVED***           -: event not fired
***REMOVED***
***REMOVED*** - Win/FF3: [WIN_IME, +, A], [-, -, ENTER]
***REMOVED***            Note: No events are fired for 'i'.
***REMOVED***
***REMOVED*** - Win/IE7: [WIN_IME, -, A], [WIN_IME, -, I], [WIN_IME, -, ENTER]
***REMOVED***
***REMOVED*** - Win/Chrome: Same as Win/IE7
***REMOVED***
***REMOVED*** - Mac/FF3: [A, -, A], [I, -, I], [ENTER, -, ENTER]
***REMOVED***
***REMOVED*** - Mac/Safari3: Same as Win/IE7
***REMOVED***
***REMOVED*** - Linux/FF3: No events are generated.
***REMOVED***
***REMOVED*** With IME off,
***REMOVED***
***REMOVED*** - ALL: [A, +, A], [I, +, I], [ENTER, +, ENTER]
***REMOVED***        Note: Key code of key press event varies across configuration.
***REMOVED***
***REMOVED*** With Microsoft Pinyin IME 3.0 (Simplified Chinese),
***REMOVED***
***REMOVED*** - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese)
***REMOVED***
***REMOVED***   The issue with this IME is that the key sequence that ends preedit is not
***REMOVED***   a single ENTER key up.
***REMOVED***   - ENTER key up following either ENTER or SPACE ends preedit.
***REMOVED***   - SPACE key up following even number of LEFT, RIGHT, or SPACE (any
***REMOVED***     combination) ends preedit.
***REMOVED***   TODO(user): We only support SPACE-then-ENTER sequence.
***REMOVED***   TODO(mpd): With the change to autocomplete during IME, this might not be an
***REMOVED***   issue. Remove this comment once tested.
***REMOVED***
***REMOVED*** With Microsoft Korean IME 2002,
***REMOVED***
***REMOVED*** - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese), but there is no
***REMOVED***   sequence that ends the preedit.
***REMOVED***
***REMOVED*** The following is the algorithm we use to detect IME preedit:
***REMOVED***
***REMOVED*** - WIN_IME key down starts predit.
***REMOVED*** - (1) ENTER key up or (2) CTRL-M key up ends preedit.
***REMOVED*** - Any key press not immediately following WIN_IME key down signifies that
***REMOVED***   preedit has ended.
***REMOVED***
***REMOVED*** If you need to change this algorithm, please note the OS, browser, language,
***REMOVED*** and behavior above so that we can avoid regressions. Contact mpd or yuzo
***REMOVED*** if you have questions or concerns.
***REMOVED***
***REMOVED***


goog.provide('goog.ui.ac.InputHandler');

goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.selection');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.string');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');



***REMOVED***
***REMOVED*** Class for managing the interaction between an auto-complete object and a
***REMOVED*** text-input or textarea.
***REMOVED***
***REMOVED*** @param {?string=} opt_separators Separators to split multiple entries.
***REMOVED***     If none passed, uses ',' and ';'.
***REMOVED*** @param {?string=} opt_literals Characters used to delimit text literals.
***REMOVED*** @param {?boolean=} opt_multi Whether to allow multiple entries
***REMOVED***     (Default: true).
***REMOVED*** @param {?number=} opt_throttleTime Number of milliseconds to throttle
***REMOVED***     keyevents with (Default: 150). Use -1 to disable updates on typing. Note
***REMOVED***     that typing the separator will update autocomplete suggestions.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.ac.InputHandler = function(opt_separators, opt_literals,
    opt_multi, opt_throttleTime) {
  goog.Disposable.call(this);
  var throttleTime = opt_throttleTime || 150;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether this input accepts multiple values
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multi_ = opt_multi != null ? opt_multi : true;

  // Set separators depends on this.multi_ being set correctly
  this.setSeparators(opt_separators ||
      goog.ui.ac.InputHandler.STANDARD_LIST_SEPARATORS);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Characters that are used to delimit literal text. Separarator characters
  ***REMOVED*** found within literal text are not processed as separators
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.literals_ = opt_literals || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to prevent the default behavior (moving focus to another element)
  ***REMOVED*** when tab is pressed.  This occurs by default only for multi-value mode.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.preventDefaultOnTab_ = this.multi_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A timer object used to monitor for changes when an element is active.
  ***REMOVED***
  ***REMOVED*** TODO(user): Consider tuning the throttle time, so that it takes into
  ***REMOVED*** account the length of the token.  When the token is short it is likely to
  ***REMOVED*** match lots of rows, therefore we want to check less frequently.  Even
  ***REMOVED*** something as simple as <3-chars = 150ms, then 100ms otherwise.
  ***REMOVED***
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timer_ = throttleTime > 0 ? new goog.Timer(throttleTime) : null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler used by the input handler to manage events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eh_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler to help us find an input element that already has the focus.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activateHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The keyhandler used for listening on most key events.  This takes care of
  ***REMOVED*** abstracting away some of the browser differences.
  ***REMOVED*** @type {goog.events.KeyHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keyHandler_ = new goog.events.KeyHandler();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last key down key code.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastKeyCode_ = -1;  // Initialize to a non-existent value.
***REMOVED***
goog.inherits(goog.ui.ac.InputHandler, goog.Disposable);


***REMOVED***
***REMOVED*** Whether or not we need to pause the execution of the blur handler in order
***REMOVED*** to allow the execution of the selection handler to run first. This is
***REMOVED*** currently true when running on IOS version prior to 4.2, since we need
***REMOVED*** some special logic for these devices to handle bug 4484488.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.REQUIRES_ASYNC_BLUR_ =
    (goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) &&
        // Check the webkit version against the version for iOS 4.2.1.
        !goog.userAgent.isVersion('533.17.9');


***REMOVED***
***REMOVED*** Standard list separators.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.ui.ac.InputHandler.STANDARD_LIST_SEPARATORS = ',;';


***REMOVED***
***REMOVED*** Literals for quotes.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.ui.ac.InputHandler.QUOTE_LITERALS = '"';


***REMOVED***
***REMOVED*** The AutoComplete instance this inputhandler is associated with.
***REMOVED*** @type {goog.ui.ac.AutoComplete}
***REMOVED***
goog.ui.ac.InputHandler.prototype.ac_;


***REMOVED***
***REMOVED*** Characters that can be used to split multiple entries in an input string
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.separators_;


***REMOVED***
***REMOVED*** The separator we use to reconstruct the string
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.defaultSeparator_;


***REMOVED***
***REMOVED*** Regular expression used from trimming tokens or null for no trimming.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.trimmer_;


***REMOVED***
***REMOVED*** Regular expression to test whether a separator exists
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.separatorCheck_;


***REMOVED***
***REMOVED*** Should auto-completed tokens be wrapped in whitespace?  Used in selectRow.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.whitespaceWrapEntries_ = true;


***REMOVED***
***REMOVED*** Should the occurrence of a literal indicate a token boundary?
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.generateNewTokenOnLiteral_ = true;


***REMOVED***
***REMOVED*** Whether to flip the orientation of up & down for hiliting next
***REMOVED*** and previous autocomplete entries.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.upsideDown_ = false;


***REMOVED***
***REMOVED*** If we're in 'multi' mode, does typing a separator force the updating of
***REMOVED*** suggestions?
***REMOVED*** For example, if somebody finishes typing "obama, hillary,", should the last
***REMOVED*** comma trigger updating suggestions in a guaranteed manner? Especially useful
***REMOVED*** when the suggestions depend on complete keywords. Note that "obama, hill"
***REMOVED*** (a leading sub-string of "obama, hillary" will lead to different and possibly
***REMOVED*** irrelevant suggestions.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.separatorUpdates_ = true;


***REMOVED***
***REMOVED*** If we're in 'multi' mode, does typing a separator force the current term to
***REMOVED*** autocomplete?
***REMOVED*** For example, if 'tomato' is a suggested completion and the user has typed
***REMOVED*** 'to,', do we autocomplete to turn that into 'tomato,'?
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.separatorSelects_ = true;


***REMOVED***
***REMOVED*** The id of the currently active timeout, so it can be cleared if required.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.activeTimeoutId_ = null;


***REMOVED***
***REMOVED*** The element that is currently active.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.activeElement_ = null;


***REMOVED***
***REMOVED*** The previous value of the active element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.lastValue_ = '';


***REMOVED***
***REMOVED*** Flag used to indicate that the IME key has been seen and we need to wait for
***REMOVED*** the up event.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.waitingForIme_ = false;


***REMOVED***
***REMOVED*** Flag used to indicate that the user just selected a row and we should
***REMOVED*** therefore ignore the change of the input value.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.rowJustSelected_ = false;


***REMOVED***
***REMOVED*** Flag indicating whether the result list should be updated continuously
***REMOVED*** during typing or only after a short pause.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.updateDuringTyping_ = true;


***REMOVED***
***REMOVED*** Attach an instance of an AutoComplete
***REMOVED*** @param {goog.ui.ac.AutoComplete} ac Autocomplete object.
***REMOVED***
goog.ui.ac.InputHandler.prototype.attachAutoComplete = function(ac) {
  this.ac_ = ac;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the associated autocomplete instance.
***REMOVED*** @return {goog.ui.ac.AutoComplete} The associated autocomplete instance.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getAutoComplete = function() {
  return this.ac_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current active element.
***REMOVED*** @return {Element} The currently active element.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getActiveElement = function() {
  return this.activeElement_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the current active element.
***REMOVED*** @return {string} The value of the current active element.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getValue = function() {
  return this.activeElement_.value;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the current active element.
***REMOVED*** @param {string} value The new value.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setValue = function(value) {
  this.activeElement_.value = value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current cursor position.
***REMOVED*** @return {number} The index of the cursor position.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getCursorPosition = function() {
  return goog.dom.selection.getStart(this.activeElement_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the cursor at the given position.
***REMOVED*** @param {number} pos The index of the cursor position.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setCursorPosition = function(pos) {
  goog.dom.selection.setStart(this.activeElement_, pos);
  goog.dom.selection.setEnd(this.activeElement_, pos);
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the input handler to a target element. The target element
***REMOVED*** should be a textarea, input box, or other focusable element with the
***REMOVED*** same interface.
***REMOVED*** @param {Element|goog.events.EventTarget} target An element to attach the
***REMOVED***     input handler too.
***REMOVED***
goog.ui.ac.InputHandler.prototype.attachInput = function(target) {
  if (goog.dom.isElement(target)) {
    var el =***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (target);
    goog.a11y.aria.setState(el, 'haspopup', true);
  }

  this.eh_.listen(target, goog.events.EventType.FOCUS, this.handleFocus);
  this.eh_.listen(target, goog.events.EventType.BLUR, this.handleBlur);

  if (!this.activeElement_) {
    this.activateHandler_.listen(
        target, goog.events.EventType.KEYDOWN,
        this.onKeyDownOnInactiveElement_);

    // Don't wait for a focus event if the element already has focus.
    if (goog.dom.isElement(target)) {
      var ownerDocument = goog.dom.getOwnerDocument(
         ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (target));
      if (goog.dom.getActiveElement(ownerDocument) == target) {
        this.processFocus(***REMOVED*** @type {Element}***REMOVED*** (target));
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Detaches the input handler from the provided element.
***REMOVED*** @param {Element|goog.events.EventTarget} target An element to detach the
***REMOVED***     input handler from.
***REMOVED***
goog.ui.ac.InputHandler.prototype.detachInput = function(target) {
  if (target == this.activeElement_) {
    this.handleBlur();
  }
  this.eh_.unlisten(target, goog.events.EventType.FOCUS, this.handleFocus);
  this.eh_.unlisten(target, goog.events.EventType.BLUR, this.handleBlur);

  if (!this.activeElement_) {
    this.activateHandler_.unlisten(
        target, goog.events.EventType.KEYDOWN,
        this.onKeyDownOnInactiveElement_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the input handler to multiple elements.
***REMOVED*** @param {...Element} var_args Elements to attach the input handler too.
***REMOVED***
goog.ui.ac.InputHandler.prototype.attachInputs = function(var_args) {
  for (var i = 0; i < arguments.length; i++) {
    this.attachInput(arguments[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Detaches the input handler from multuple elements.
***REMOVED*** @param {...Element} var_args Variable arguments for elements to unbind from.
***REMOVED***
goog.ui.ac.InputHandler.prototype.detachInputs = function(var_args) {
  for (var i = 0; i < arguments.length; i++) {
    this.detachInput(arguments[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Selects the given row.  Implements the SelectionHandler interface.
***REMOVED*** @param {Object} row The row to select.
***REMOVED*** @param {boolean=} opt_multi Should this be treated as a single or multi-token
***REMOVED***     auto-complete?  Overrides previous setting of opt_multi on constructor.
***REMOVED*** @return {boolean} Whether to suppress the update event.
***REMOVED***
goog.ui.ac.InputHandler.prototype.selectRow = function(row, opt_multi) {
  this.setTokenText(row.toString(), opt_multi);
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the text of the current token without updating the autocomplete
***REMOVED*** choices.
***REMOVED*** @param {string} tokenText The text for the current token.
***REMOVED*** @param {boolean=} opt_multi Should this be treated as a single or multi-token
***REMOVED***     auto-complete?  Overrides previous setting of opt_multi on constructor.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.setTokenText =
    function(tokenText, opt_multi) {
  if (goog.isDef(opt_multi) ? opt_multi : this.multi_) {
    var index = this.getTokenIndex_(this.getValue(), this.getCursorPosition());

    // Break up the current input string.
    var entries = this.splitInput_(this.getValue());

    // Get the new value, ignoring whitespace associated with the entry.
    var replaceValue = tokenText;

    // Only add punctuation if there isn't already a separator available.
    if (!this.separatorCheck_.test(replaceValue)) {
      replaceValue = goog.string.trimRight(replaceValue) +
                     this.defaultSeparator_;
    }

    // Ensure there's whitespace wrapping the entries, if whitespaceWrapEntries_
    // has been set to true.
    if (this.whitespaceWrapEntries_) {
      if (index != 0 && !goog.string.isEmpty(entries[index - 1])) {
        replaceValue = ' ' + replaceValue;
      }
      // Add a space only if it's the last token; otherwise, we assume the
      // next token already has the proper spacing.
      if (index == entries.length - 1) {
        replaceValue = replaceValue + ' ';
      }
    }

    // If the token needs changing, then update the input box and move the
    // cursor to the correct position.
    if (replaceValue != entries[index]) {

      // Replace the value in the array.
      entries[index] = replaceValue;

      var el = this.activeElement_;
      // If there is an uncommitted IME in Firefox or IE 9, setting the value
      // fails and results in actually clearing the value that's already in the
      // input.
      // The FF bug is http://bugzilla.mozilla.org/show_bug.cgi?id=549674
      // Blurring before setting the value works around this problem. We'd like
      // to do this only if there is an uncommitted IME, but this isn't possible
      // to detect. Since text editing is finicky we restrict this
      // workaround to Firefox and IE 9 where it's necessary.
      if (goog.userAgent.GECKO ||
          (goog.userAgent.IE && goog.userAgent.isVersion('9'))) {
        el.blur();
      }
      // Join the array and replace the contents of the input.
      el.value = entries.join('');

      // Calculate which position to put the cursor at.
      var pos = 0;
      for (var i = 0; i <= index; i++) {
        pos += entries[i].length;
      }

      // Set the cursor.
      el.focus();
      this.setCursorPosition(pos);
    }
  } else {
    this.setValue(tokenText);
  }

  // Avoid triggering an autocomplete just because the value changed.
  this.rowJustSelected_ = true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ac.InputHandler.prototype.disposeInternal = function() {
  goog.ui.ac.InputHandler.superClass_.disposeInternal.call(this);
  if (this.activeTimeoutId_ != null) {
    // Need to check against null explicitly because 0 is a valid value.
    window.clearTimeout(this.activeTimeoutId_);
  }
  this.eh_.dispose();
  delete this.eh_;
  this.activateHandler_.dispose();
  this.keyHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the entry separator characters.
***REMOVED***
***REMOVED*** @param {string} separators The separator characters to set.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setSeparators = function(separators) {
  this.separators_ = separators;
  this.defaultSeparator_ = this.separators_.substring(0, 1);

  var wspaceExp = this.multi_ ? '[\\s' + this.separators_ + ']+' : '[\\s]+';

  this.trimmer_ = new RegExp('^' + wspaceExp + '|' + wspaceExp + '$', 'g');
  this.separatorCheck_ = new RegExp('\\s*[' + this.separators_ + ']$');
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to flip the orientation of up & down for hiliting next
***REMOVED*** and previous autocomplete entries.
***REMOVED*** @param {boolean} upsideDown Whether the orientation is upside down.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setUpsideDown = function(upsideDown) {
  this.upsideDown_ = upsideDown;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether auto-completed tokens should be wrapped with whitespace.
***REMOVED*** @param {boolean} newValue boolean value indicating whether or not
***REMOVED***     auto-completed tokens should be wrapped with whitespace.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setWhitespaceWrapEntries =
    function(newValue) {
  this.whitespaceWrapEntries_ = newValue;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether new tokens should be generated from literals.  That is, should
***REMOVED*** hello'world be two tokens, assuming ' is a literal?
***REMOVED*** @param {boolean} newValue boolean value indicating whether or not
***REMOVED*** new tokens should be generated from literals.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setGenerateNewTokenOnLiteral =
    function(newValue) {
  this.generateNewTokenOnLiteral_ = newValue;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the regular expression used to trim the tokens before passing them to
***REMOVED*** the matcher:  every substring that matches the given regular expression will
***REMOVED*** be removed.  This can also be set to null to disable trimming.
***REMOVED*** @param {RegExp} trimmer Regexp to use for trimming or null to disable it.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setTrimmingRegExp = function(trimmer) {
  this.trimmer_ = trimmer;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether we will prevent the default input behavior (moving focus to the
***REMOVED*** next focusable  element) on TAB.
***REMOVED*** @param {boolean} newValue Whether to preventDefault on TAB.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setPreventDefaultOnTab = function(newValue) {
  this.preventDefaultOnTab_ = newValue;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether separators perform autocomplete.
***REMOVED*** @param {boolean} newValue Whether to autocomplete on separators.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setSeparatorCompletes = function(newValue) {
  this.separatorUpdates_ = newValue;
  this.separatorSelects_ = newValue;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether separators perform autocomplete.
***REMOVED*** @param {boolean} newValue Whether to autocomplete on separators.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setSeparatorSelects = function(newValue) {
  this.separatorSelects_ = newValue;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the time to wait before updating the results. If the update during
***REMOVED*** typing flag is switched on, this delay counts from the last update,
***REMOVED*** otherwise from the last keypress.
***REMOVED*** @return {number} Throttle time in milliseconds.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getThrottleTime = function() {
  return this.timer_ ? this.timer_.getInterval() : -1;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a row has just been selected.
***REMOVED*** @param {boolean} justSelected Whether or not the row has just been selected.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setRowJustSelected = function(justSelected) {
  this.rowJustSelected_ = justSelected;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the time to wait before updating the results.
***REMOVED*** @param {number} time New throttle time in milliseconds.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setThrottleTime = function(time) {
  if (time < 0) {
    this.timer_.dispose();
    this.timer_ = null;
    return;
  }
  if (this.timer_) {
    this.timer_.setInterval(time);
  } else {
    this.timer_ = new goog.Timer(time);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the result list is updated during typing.
***REMOVED*** @return {boolean} Value of the flag.
***REMOVED***
goog.ui.ac.InputHandler.prototype.getUpdateDuringTyping = function() {
  return this.updateDuringTyping_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the result list should be updated during typing.
***REMOVED*** @param {boolean} value New value of the flag.
***REMOVED***
goog.ui.ac.InputHandler.prototype.setUpdateDuringTyping = function(value) {
  this.updateDuringTyping_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key event.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @return {boolean} True if the key event was handled.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleKeyEvent = function(e) {
  switch (e.keyCode) {

    // If the menu is open and 'down' caused a change then prevent the default
    // action and prevent scrolling.  If the box isn't a multi autocomplete
    // and the menu isn't open, we force it open now.
    case goog.events.KeyCodes.DOWN:
      if (this.ac_.isOpen()) {
        this.moveDown_();
        e.preventDefault();
        return true;

      } else if (!this.multi_) {
        this.update(true);
        e.preventDefault();
        return true;
      }
      break;

    // If the menu is open and 'up' caused a change then prevent the default
    // action and prevent scrolling.
    case goog.events.KeyCodes.UP:
      if (this.ac_.isOpen()) {
        this.moveUp_();
        e.preventDefault();
        return true;
      }
      break;

    // If tab key is pressed, select the current highlighted item.  The default
    // action is also prevented if the input is a multi input, to prevent the
    // user tabbing out of the field.
    case goog.events.KeyCodes.TAB:
      if (this.ac_.isOpen() && !e.shiftKey) {
        // Ensure the menu is up to date before completing.
        this.update();
        if (this.ac_.selectHilited() && this.preventDefaultOnTab_) {
          e.preventDefault();
          return true;
        }
      } else {
        this.ac_.dismiss();
      }
      break;

    // On enter, just select the highlighted row.
    case goog.events.KeyCodes.ENTER:
      if (this.ac_.isOpen()) {
        // Ensure the menu is up to date before completing.
        this.update();
        if (this.ac_.selectHilited()) {
          e.preventDefault();
          e.stopPropagation();
          return true;
        }
      } else {
        this.ac_.dismiss();
      }
      break;

    // On escape tell the autocomplete to dismiss.
    case goog.events.KeyCodes.ESC:
      if (this.ac_.isOpen()) {
        this.ac_.dismiss();
        e.preventDefault();
        e.stopPropagation();
        return true;
      }
      break;

    // The IME keycode indicates an IME sequence has started, we ignore all
    // changes until we get an enter key-up.
    case goog.events.KeyCodes.WIN_IME:
      if (!this.waitingForIme_) {
        this.startWaitingForIme_();
        return true;
      }
      break;

    default:
      if (this.timer_ && !this.updateDuringTyping_) {
        // Waits throttle time before sending the request again.
        this.timer_.stop();
        this.timer_.start();
      }
  }

  return this.handleSeparator_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key event for a separator key.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @return {boolean} True if the key event was handled.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleSeparator_ = function(e) {
  var isSeparatorKey = this.multi_ && e.charCode &&
      this.separators_.indexOf(String.fromCharCode(e.charCode)) != -1;
  if (this.separatorUpdates_ && isSeparatorKey) {
    this.update();
  }
  if (this.separatorSelects_ && isSeparatorKey) {
    if (this.ac_.selectHilited()) {
      e.preventDefault();
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this inputhandler need to listen on key-up.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.needKeyUpListener = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the key up event. Registered only if needKeyUpListener returns true.
***REMOVED*** @param {goog.events.Event} e The keyup event.
***REMOVED*** @return {boolean} Whether an action was taken or not.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleKeyUp = function(e) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the necessary input event handlers.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.addEventHandlers_ = function() {
  this.keyHandler_.attach(this.activeElement_);
  this.eh_.listen(
      this.keyHandler_, goog.events.KeyHandler.EventType.KEY, this.onKey_);
  if (this.needKeyUpListener()) {
    this.eh_.listen(this.activeElement_,
        goog.events.EventType.KEYUP, this.handleKeyUp);
  }
  this.eh_.listen(this.activeElement_,
      goog.events.EventType.MOUSEDOWN, this.onMouseDown_);

  // IE also needs a keypress to check if the user typed a separator
  if (goog.userAgent.IE) {
    this.eh_.listen(this.activeElement_,
        goog.events.EventType.KEYPRESS, this.onIeKeyPress_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the necessary input event handlers.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.removeEventHandlers_ = function() {
  this.eh_.unlisten(
      this.keyHandler_, goog.events.KeyHandler.EventType.KEY, this.onKey_);
  this.keyHandler_.detach();
  this.eh_.unlisten(this.activeElement_,
      goog.events.EventType.KEYUP, this.handleKeyUp);
  this.eh_.unlisten(this.activeElement_,
      goog.events.EventType.MOUSEDOWN, this.onMouseDown_);

  if (goog.userAgent.IE) {
    this.eh_.unlisten(this.activeElement_,
        goog.events.EventType.KEYPRESS, this.onIeKeyPress_);
  }

  if (this.waitingForIme_) {
    this.stopWaitingForIme_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles an element getting focus.
***REMOVED*** @param {goog.events.Event} e Browser event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleFocus = function(e) {
  this.processFocus(***REMOVED*** @type {Element}***REMOVED*** (e.target || null));
***REMOVED***


***REMOVED***
***REMOVED*** Registers handlers for the active element when it receives focus.
***REMOVED*** @param {Element} target The element to focus.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.processFocus = function(target) {
  this.activateHandler_.removeAll();

  if (this.ac_) {
    this.ac_.cancelDelayedDismiss();
  }

  // Double-check whether the active element has actually changed.
  // This is a fix for Safari 3, which fires spurious focus events.
  if (target != this.activeElement_) {
    this.activeElement_ = target;
    if (this.timer_) {
      this.timer_.start();
      this.eh_.listen(this.timer_, goog.Timer.TICK, this.onTick_);
    }
    this.lastValue_ = this.getValue();
    this.addEventHandlers_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles an element blurring.
***REMOVED*** @param {goog.events.Event=} opt_e Browser event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleBlur = function(opt_e) {
  // Phones running iOS prior to version 4.2.
  if (goog.ui.ac.InputHandler.REQUIRES_ASYNC_BLUR_) {
    // @bug 4484488 This is required so that the menu works correctly on
    // iOS prior to version 4.2. Otherwise, the blur action closes the menu
    // before the menu button click can be processed.
    // In order to fix the bug, we set a timeout to process the blur event, so
    // that any pending selection event can be processed first.
    this.activeTimeoutId_ =
        window.setTimeout(goog.bind(this.processBlur_, this), 0);
    return;
  } else {
    this.processBlur_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper function that does the logic to handle an element blurring.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.processBlur_ = function() {
  // it's possible that a blur event could fire when there's no active element,
  // in the case where attachInput was called on an input that already had
  // the focus
  if (this.activeElement_) {
    this.removeEventHandlers_();
    this.activeElement_ = null;

    if (this.timer_) {
      this.timer_.stop();
      this.eh_.unlisten(this.timer_, goog.Timer.TICK, this.onTick_);
    }

    if (this.ac_) {
      // Pause dismissal slightly to take into account any other events that
      // might fire on the renderer (e.g. a click will lose the focus).
      this.ac_.dismissOnDelay();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the timer's tick event.  Calculates the current token, and reports
***REMOVED*** any update to the autocomplete.
***REMOVED*** @param {goog.events.Event} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onTick_ = function(e) {
  this.update();
***REMOVED***


***REMOVED***
***REMOVED*** Handles typing in an inactive input element. Activate it.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onKeyDownOnInactiveElement_ = function(e) {
  this.handleFocus(e);
***REMOVED***


***REMOVED***
***REMOVED*** Handles typing in the active input element.  Checks if the key is a special
***REMOVED*** key and does the relevent action as appropriate.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onKey_ = function(e) {
  this.lastKeyCode_ = e.keyCode;
  if (this.ac_) {
    this.handleKeyEvent(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a KEYPRESS event generated by typing in the active input element.
***REMOVED*** Checks if IME input is ended.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onKeyPress_ = function(e) {
  if (this.waitingForIme_ &&
      this.lastKeyCode_ != goog.events.KeyCodes.WIN_IME) {
    this.stopWaitingForIme_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the key-up event.  This is only ever used by Mac FF or when we are in
***REMOVED*** an IME entry scenario.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onKeyUp_ = function(e) {
  if (this.waitingForIme_ &&
      (e.keyCode == goog.events.KeyCodes.ENTER ||
       (e.keyCode == goog.events.KeyCodes.M && e.ctrlKey))) {
    this.stopWaitingForIme_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse-down event.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onMouseDown_ = function(e) {
  if (this.ac_) {
    this.handleMouseDown(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** For subclasses to override to handle the mouse-down event.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.handleMouseDown = function(e) {
***REMOVED***


***REMOVED***
***REMOVED*** Starts waiting for IME.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.startWaitingForIme_ = function() {
  if (this.waitingForIme_) {
    return;
  }
  this.eh_.listen(
      this.activeElement_, goog.events.EventType.KEYUP, this.onKeyUp_);
  this.eh_.listen(
      this.activeElement_, goog.events.EventType.KEYPRESS, this.onKeyPress_);
  this.waitingForIme_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Stops waiting for IME.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.stopWaitingForIme_ = function() {
  if (!this.waitingForIme_) {
    return;
  }
  this.waitingForIme_ = false;
  this.eh_.unlisten(
      this.activeElement_, goog.events.EventType.KEYPRESS, this.onKeyPress_);
  this.eh_.unlisten(
      this.activeElement_, goog.events.EventType.KEYUP, this.onKeyUp_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the key-press event for IE, checking to see if the user typed a
***REMOVED*** separator character.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.onIeKeyPress_ = function(e) {
  this.handleSeparator_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if an update has occurred and notified the autocomplete of the new
***REMOVED*** token.
***REMOVED*** @param {boolean=} opt_force If true the menu will be forced to update.
***REMOVED***
goog.ui.ac.InputHandler.prototype.update = function(opt_force) {
  if (this.activeElement_ &&
      (opt_force || this.getValue() != this.lastValue_)) {
    if (opt_force || !this.rowJustSelected_) {
      var token = this.parseToken();

      if (this.ac_) {
        this.ac_.setTarget(this.activeElement_);
        this.ac_.setToken(token, this.getValue());
      }
    }
    this.lastValue_ = this.getValue();
  }
  this.rowJustSelected_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a text area or input box for the currently highlighted token.
***REMOVED*** @return {string} Token to complete.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.InputHandler.prototype.parseToken = function() {
  return this.parseToken_();
***REMOVED***


***REMOVED***
***REMOVED*** Moves hilite up.  May hilite next or previous depending on orientation.
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.moveUp_ = function() {
  return this.upsideDown_ ? this.ac_.hiliteNext() : this.ac_.hilitePrev();
***REMOVED***


***REMOVED***
***REMOVED*** Moves hilite down.  May hilite next or previous depending on orientation.
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.moveDown_ = function() {
  return this.upsideDown_ ? this.ac_.hilitePrev() : this.ac_.hiliteNext();
***REMOVED***


***REMOVED***
***REMOVED*** Parses a text area or input box for the currently highlighted token.
***REMOVED*** @return {string} Token to complete.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.parseToken_ = function() {
  var caret = this.getCursorPosition();
  var text = this.getValue();
  return this.trim_(this.splitInput_(text)[this.getTokenIndex_(text, caret)]);
***REMOVED***


***REMOVED***
***REMOVED*** Trims a token of characters that we want to ignore
***REMOVED*** @param {string} text string to trim.
***REMOVED*** @return {string} Trimmed string.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.trim_ = function(text) {
  return this.trimmer_ ? String(text).replace(this.trimmer_, '') : text;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the index of the currently highlighted token
***REMOVED*** @param {string} text string to parse.
***REMOVED*** @param {number} caret Position of cursor in string.
***REMOVED*** @return {number} Index of token.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.getTokenIndex_ = function(text, caret) {
  // Split up the input string into multiple entries
  var entries = this.splitInput_(text);

  // Short-circuit to select the last entry
  if (caret == text.length) return entries.length - 1;

  // Calculate which of the entries the cursor is currently in
  var current = 0;
  for (var i = 0, pos = 0; i < entries.length && pos <= caret; i++) {
    pos += entries[i].length;
    current = i;
  }

  // Get the token for the current item
  return current;
***REMOVED***


***REMOVED***
***REMOVED*** Splits an input string of text at the occurance of a character in
***REMOVED*** {@link goog.ui.ac.InputHandler.prototype.separators_} and creates
***REMOVED*** an array of tokens.  Each token may contain additional whitespace and
***REMOVED*** formatting marks.  If necessary use
***REMOVED*** {@link goog.ui.ac.InputHandler.prototype.trim_} to clean up the
***REMOVED*** entries.
***REMOVED***
***REMOVED*** @param {string} text Input text.
***REMOVED*** @return {Array} Parsed array.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.InputHandler.prototype.splitInput_ = function(text) {
  if (!this.multi_) {
    return [text];
  }

  var arr = String(text).split('');
  var parts = [];
  var cache = [];

  for (var i = 0, inLiteral = false; i < arr.length; i++) {
    if (this.literals_ && this.literals_.indexOf(arr[i]) != -1) {
      if (this.generateNewTokenOnLiteral_ && !inLiteral) {
        parts.push(cache.join(''));
        cache.length = 0;
      }
      cache.push(arr[i]);
      inLiteral = !inLiteral;

    } else if (!inLiteral && this.separators_.indexOf(arr[i]) != -1) {
      cache.push(arr[i]);
      parts.push(cache.join(''));
      cache.length = 0;

    } else {
      cache.push(arr[i]);
    }
  }
  parts.push(cache.join(''));

  return parts;
***REMOVED***
