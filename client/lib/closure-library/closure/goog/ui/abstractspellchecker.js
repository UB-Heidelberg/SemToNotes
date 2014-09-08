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
***REMOVED*** @fileoverview Abstract base class for spell checker implementations.
***REMOVED***
***REMOVED*** The spell checker supports two modes - synchronous and asynchronous.
***REMOVED***
***REMOVED*** In synchronous mode subclass calls processText_ which processes all the text
***REMOVED*** given to it before it returns. If the text string is very long, it could
***REMOVED*** cause warnings from the browser that considers the script to be
***REMOVED*** busy-looping.
***REMOVED***
***REMOVED*** Asynchronous mode allows breaking processing large text segments without
***REMOVED*** encountering stop script warnings by rescheduling remaining parts of the
***REMOVED*** text processing to another stack.
***REMOVED***
***REMOVED*** In asynchronous mode abstract spell checker keeps track of a number of text
***REMOVED*** chunks that have been processed after the very beginning, and returns every
***REMOVED*** so often so that the calling function could reschedule its execution on a
***REMOVED*** different stack (for example by calling setInterval(0)).
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author sergeys@google.com (Sergey Solyanik)
***REMOVED***

goog.provide('goog.ui.AbstractSpellChecker');
goog.provide('goog.ui.AbstractSpellChecker.AsyncResult');

goog.require('goog.a11y.aria');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classlist');
goog.require('goog.dom.selection');
***REMOVED***
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.math.Coordinate');
goog.require('goog.spell.SpellCheck');
goog.require('goog.structs.Set');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.PopupMenu');



***REMOVED***
***REMOVED*** Abstract base class for spell checker editor implementations. Provides basic
***REMOVED*** functionality such as word lookup and caching.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck} spellCheck Instance of the SpellCheck
***REMOVED***     support object to use. A single instance can be shared by multiple editor
***REMOVED***     components.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.AbstractSpellChecker = function(spellCheck, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler to use for caching and lookups.
  ***REMOVED*** @type {goog.spell.SpellCheck}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.spellCheck = spellCheck;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Word to element references. Used by replace/ignore.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.wordElements_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of all 'edit word' input elements.
  ***REMOVED*** @type {Array.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.inputElements_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Global regular expression for splitting a string into individual words and
  ***REMOVED*** blocks of separators. Matches zero or one word followed by zero or more
  ***REMOVED*** separators.
  ***REMOVED*** @type {RegExp}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.splitRegex_ = new RegExp(
      '([^' + goog.spell.SpellCheck.WORD_BOUNDARY_CHARS + ']*)' +
      '([' + goog.spell.SpellCheck.WORD_BOUNDARY_CHARS + ']*)', 'g');

***REMOVED***this.spellCheck,
      goog.spell.SpellCheck.EventType.WORD_CHANGED, this.onWordChanged_,
      false, this);
***REMOVED***
goog.inherits(goog.ui.AbstractSpellChecker, goog.ui.Component);


***REMOVED***
***REMOVED*** The prefix to mark keys with.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.KEY_PREFIX_ = ':';


***REMOVED***
***REMOVED*** The prefix for ids on the spans.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.ID_SUFFIX_ = 'sc';


***REMOVED***
***REMOVED*** The attribute name for original element contents (to offer subsequent
***REMOVED*** correction menu).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.ORIGINAL_ = 'g-spell-original';


***REMOVED***
***REMOVED*** Suggestions menu.
***REMOVED***
***REMOVED*** @type {goog.ui.PopupMenu|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.menu_;


***REMOVED***
***REMOVED*** Separator between suggestions and ignore in suggestions menu.
***REMOVED***
***REMOVED*** @type {goog.ui.MenuSeparator|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.menuSeparator_;


***REMOVED***
***REMOVED*** Menu item for ignore option.
***REMOVED***
***REMOVED*** @type {goog.ui.MenuItem|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.menuIgnore_;


***REMOVED***
***REMOVED*** Menu item for edit word option.
***REMOVED***
***REMOVED*** @type {goog.ui.MenuItem|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.menuEdit_;


***REMOVED***
***REMOVED*** Whether the correction UI is visible.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.isVisible_ = false;


***REMOVED***
***REMOVED*** Cache for corrected words. All corrected words are reverted to their original
***REMOVED*** status on resume. Therefore that status is never written to the cache and is
***REMOVED*** instead indicated by this set.
***REMOVED***
***REMOVED*** @type {goog.structs.Set|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.correctedWords_;


***REMOVED***
***REMOVED*** Class name for suggestions menu.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.suggestionsMenuClassName =
    goog.getCssName('goog-menu');


***REMOVED***
***REMOVED*** Whether corrected words should be highlighted.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.markCorrected = false;


***REMOVED***
***REMOVED*** Word the correction menu is displayed for.
***REMOVED***
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.activeWord_;


***REMOVED***
***REMOVED*** Element the correction menu is displayed for.
***REMOVED***
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.activeElement_;


***REMOVED***
***REMOVED*** Indicator that the spell checker is running in the asynchronous mode.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.asyncMode_ = false;


***REMOVED***
***REMOVED*** Maximum number of words to process on a single stack in asynchronous mode.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.asyncWordsPerBatch_ = 1000;


***REMOVED***
***REMOVED*** Current text to process when running in the asynchronous mode.
***REMOVED***
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.asyncText_;


***REMOVED***
***REMOVED*** Current start index of the range that spell-checked correctly.
***REMOVED***
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.asyncRangeStart_;


***REMOVED***
***REMOVED*** Current node with which the asynchronous text is associated.
***REMOVED***
***REMOVED*** @type {Node|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.asyncNode_;


***REMOVED***
***REMOVED*** Number of elements processed in the asyncronous mode since last yield.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.processedElementsCount_ = 0;


***REMOVED***
***REMOVED*** Markers for the text that does not need to be included in the processing.
***REMOVED***
***REMOVED*** For rich text editor this is a list of strings formatted as
***REMOVED*** tagName.className or className. If both are specified, the element will be
***REMOVED*** excluded if BOTH are matched. If only a className is specified, then we will
***REMOVED*** exclude regions with the className. If only one marker is needed, it may be
***REMOVED*** passed as a string.
***REMOVED*** For plain text editor this is a RegExp that matches the excluded text.
***REMOVED***
***REMOVED*** Used exclusively by the derived classes
***REMOVED***
***REMOVED*** @type {Array.<string>|string|RegExp|undefined}
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.excludeMarker;


***REMOVED***
***REMOVED*** Next unique instance ID for a misspelled word.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.nextId_ = 1;


***REMOVED***
***REMOVED*** @return {goog.spell.SpellCheck} The handler used for caching and lookups.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getSpellCheck = function() {
  return this.spellCheck;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.spell.SpellCheck} The handler used for caching and lookups.
***REMOVED*** @override
***REMOVED*** @suppress {checkTypes} This method makes no sense. It overrides
***REMOVED***     Component's getHandler with something different.
***REMOVED*** @deprecated Use #getSpellCheck instead.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getHandler = function() {
  return this.getSpellCheck();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the spell checker used for caching and lookups.
***REMOVED*** @param {goog.spell.SpellCheck} spellCheck The handler used for caching and
***REMOVED***     lookups.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.setSpellCheck = function(spellCheck) {
  this.spellCheck = spellCheck;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the handler used for caching and lookups.
***REMOVED*** @param {goog.spell.SpellCheck} handler The handler used for caching and
***REMOVED***     lookups.
***REMOVED*** @deprecated Use #setSpellCheck instead.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.setHandler = function(handler) {
  this.setSpellCheck(handler);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.PopupMenu|undefined} The suggestions menu.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getMenu = function() {
  return this.menu_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.MenuItem|undefined} The menu item for edit word option.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getMenuEdit = function() {
  return this.menuEdit_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The next unique instance ID for a misspelled word.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.getNextId = function() {
  return goog.ui.AbstractSpellChecker.nextId_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the marker for the excluded text.
***REMOVED***
***REMOVED*** {@see goog.ui.AbstractSpellChecker.prototype.excludeMarker}
***REMOVED***
***REMOVED*** @param {Array.<string>|string|RegExp|null} marker A RegExp for plain text
***REMOVED***        or class names for the rich text spell checker for the elements to
***REMOVED***        exclude from checking.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.setExcludeMarker = function(marker) {
  this.excludeMarker = marker || undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Checks spelling for all text.
***REMOVED*** Should be overridden by implementation.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.check = function() {
  this.isVisible_ = true;
  if (this.markCorrected) {
    this.correctedWords_ = new goog.structs.Set();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Hides correction UI.
***REMOVED*** Should be overridden by implementation.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.resume = function() {
  this.isVisible_ = false;
  this.clearWordElements();

  var input;
  while (input = this.inputElements_.pop()) {
    input.parentNode.replaceChild(
        this.getDomHelper().createTextNode(input.value), input);
  }

  if (this.correctedWords_) {
    this.correctedWords_.clear();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the correction ui is visible.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.isVisible = function() {
  return this.isVisible_;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the word to element references map used by replace/ignore.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.clearWordElements = function() {
  this.wordElements_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Ignores spelling of word.
***REMOVED***
***REMOVED*** @param {string} word Word to add.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.ignoreWord = function(word) {
  this.spellCheck.setWordStatus(word,
      goog.spell.SpellCheck.WordStatus.IGNORED);
***REMOVED***


***REMOVED***
***REMOVED*** Edits a word.
***REMOVED***
***REMOVED*** @param {Element} el An element wrapping the word that should be edited.
***REMOVED*** @param {string} old Word to edit.
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.editWord_ = function(el, old) {
  var input = this.getDomHelper().createDom(
      'input', {'type': 'text', 'value': old});
  var w = goog.style.getSize(el).width;

  // Minimum width to ensure there's always enough room to type.
  if (w < 50) {
    w = 50;
  }
  input.style.width = w + 'px';
  el.parentNode.replaceChild(input, el);
  try {
    input.focus();
    goog.dom.selection.setCursorPosition(input, old.length);
  } catch (o) { }

  this.inputElements_.push(input);
***REMOVED***


***REMOVED***
***REMOVED*** Replaces word.
***REMOVED***
***REMOVED*** @param {Element} el An element wrapping the word that should be replaced.
***REMOVED*** @param {string} old Word that was replaced.
***REMOVED*** @param {string} word Word to replace with.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.replaceWord = function(el, old, word) {
  if (old != word) {
    if (!el.getAttribute(goog.ui.AbstractSpellChecker.ORIGINAL_)) {
      el.setAttribute(goog.ui.AbstractSpellChecker.ORIGINAL_, old);
    }
    goog.dom.setTextContent(el, word);

    var status = this.spellCheck.checkWord(word);

    // Indicate that the word is corrected unless the status is 'INVALID'.
    // (if markCorrected is enabled).
    if (this.markCorrected && this.correctedWords_ &&
        status != goog.spell.SpellCheck.WordStatus.INVALID) {
      this.correctedWords_.add(word);
      status = goog.spell.SpellCheck.WordStatus.CORRECTED;
    }

    // Avoid potential collision with the built-in object namespace. For
    // example, 'watch' is a reserved name in FireFox.
    var oldIndex = goog.ui.AbstractSpellChecker.toInternalKey_(old);
    var newIndex = goog.ui.AbstractSpellChecker.toInternalKey_(word);

    // Remove reference between old word and element
    var elements = this.wordElements_[oldIndex];
    goog.array.remove(elements, el);

    if (status != goog.spell.SpellCheck.WordStatus.VALID) {
      // Create reference between new word and element
      if (this.wordElements_[newIndex]) {
        this.wordElements_[newIndex].push(el);
      } else {
        this.wordElements_[newIndex] = [el];
      }
    }

    // Update element based on status.
    this.updateElement(el, word, status);

    this.dispatchEvent(goog.events.EventType.CHANGE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the array of suggested spelling choices.
***REMOVED***
***REMOVED*** @return {Array.<string>} Suggested spelling choices.
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getSuggestions_ = function() {
  // Add new suggestion entries.
  var suggestions = this.spellCheck.getSuggestions(
     ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.activeWord_));
  if (!suggestions[0]) {
    var originalWord = this.activeElement_.getAttribute(
        goog.ui.AbstractSpellChecker.ORIGINAL_);
    if (originalWord && originalWord != this.activeWord_) {
      suggestions = this.spellCheck.getSuggestions(originalWord);
    }
  }
  return suggestions;
***REMOVED***


***REMOVED***
***REMOVED*** Displays suggestions menu.
***REMOVED***
***REMOVED*** @param {Element} el Element to display menu for.
***REMOVED*** @param {goog.events.BrowserEvent|goog.math.Coordinate=} opt_pos Position to
***REMOVED***     display menu at relative to the viewport (in client coordinates), or a
***REMOVED***     mouse event.
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.showSuggestionsMenu = function(el,
                                                                      opt_pos) {
  this.activeWord_ = goog.dom.getTextContent(el);
  this.activeElement_ = el;

  // Remove suggestion entries from menu, if any.
  while (this.menu_.getChildAt(0) != this.menuSeparator_) {
    this.menu_.removeChildAt(0, true).dispose();
  }

  // Add new suggestion entries.
  var suggestions = this.getSuggestions_();
  for (var suggestion, i = 0; suggestion = suggestions[i]; i++) {
    this.menu_.addChildAt(new goog.ui.MenuItem(
        suggestion, suggestion, this.getDomHelper()), i, true);
  }

  if (!suggestions[0]) {
   ***REMOVED*****REMOVED*** @desc Item shown in menu when no suggestions are available.***REMOVED***
    var MSG_SPELL_NO_SUGGESTIONS = goog.getMsg('No Suggestions');
    var item = new goog.ui.MenuItem(
        MSG_SPELL_NO_SUGGESTIONS, '', this.getDomHelper());
    item.setEnabled(false);
    this.menu_.addChildAt(item, 0, true);
  }

  // Show 'Edit word' option if {@link markCorrected} is enabled and don't show
  // 'Ignore' option for corrected words.
  if (this.markCorrected) {
    var corrected = this.correctedWords_ &&
                    this.correctedWords_.contains(this.activeWord_);
    this.menuIgnore_.setVisible(!corrected);
    this.menuEdit_.setVisible(true);
  } else {
    this.menuIgnore_.setVisible(true);
    this.menuEdit_.setVisible(false);
  }

  if (opt_pos) {
    if (!(opt_pos instanceof goog.math.Coordinate)) { // it's an event
      var posX = opt_pos.clientX;
      var posY = opt_pos.clientY;
      // Certain implementations which derive from AbstractSpellChecker
      // use an iframe in which case the coordinates are relative to
      // that iframe's view port.
      if (this.getElement().contentDocument ||
          this.getElement().contentWindow) {
        var offset = goog.style.getClientPosition(this.getElement());
        posX += offset.x;
        posY += offset.y;
      }
      opt_pos = new goog.math.Coordinate(posX, posY);
    }
    this.menu_.showAt(opt_pos.x, opt_pos.y);
  } else {
    this.menu_.setVisible(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Initializes suggestions menu. Populates menu with separator and ignore option
***REMOVED*** that are always valid. Suggestions are later added above the separator.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.initSuggestionsMenu = function() {
  this.menu_ = new goog.ui.PopupMenu(this.getDomHelper());
  this.menuSeparator_ = new goog.ui.MenuSeparator(this.getDomHelper());

  // Leave alone setAllowAutoFocus at default (true). This allows menu to get
  // keyboard focus and thus allowing non-mouse users to get to the menu.

 ***REMOVED*****REMOVED*** @desc Ignore entry in suggestions menu.***REMOVED***
  var MSG_SPELL_IGNORE = goog.getMsg('Ignore');

 ***REMOVED*****REMOVED*** @desc Edit word entry in suggestions menu.***REMOVED***
  var MSG_SPELL_EDIT_WORD = goog.getMsg('Edit Word');

  this.menu_.addChild(this.menuSeparator_, true);
  this.menuIgnore_ =
      new goog.ui.MenuItem(MSG_SPELL_IGNORE, '', this.getDomHelper());
  this.menu_.addChild(this.menuIgnore_, true);
  this.menuEdit_ =
      new goog.ui.MenuItem(MSG_SPELL_EDIT_WORD, '', this.getDomHelper());
  this.menuEdit_.setVisible(false);
  this.menu_.addChild(this.menuEdit_, true);
  this.menu_.render();

  var menuElement = this.menu_.getElement();
  goog.asserts.assert(menuElement);
  goog.dom.classlist.add(menuElement,
      this.suggestionsMenuClassName);

***REMOVED***this.menu_, goog.ui.Component.EventType.ACTION,
      this.onCorrectionAction, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Handles correction menu actions.
***REMOVED***
***REMOVED*** @param {goog.events.Event} event Action event.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.onCorrectionAction = function(event) {
  var word =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.activeWord_);
  var el =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.activeElement_);
  if (event.target == this.menuIgnore_) {
    this.ignoreWord(word);
  } else if (event.target == this.menuEdit_) {
    this.editWord_(el, word);
  } else {
    this.replaceWord(el, word, event.target.getModel());
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  }

  delete this.activeWord_;
  delete this.activeElement_;
***REMOVED***


***REMOVED***
***REMOVED*** Removes spell-checker markup and restore the node to text.
***REMOVED***
***REMOVED*** @param {Element} el Word element. MUST have a text node child.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.removeMarkup = function(el) {
  var firstChild = el.firstChild;
  var text = firstChild.nodeValue;

  if (el.nextSibling &&
      el.nextSibling.nodeType == goog.dom.NodeType.TEXT) {
    if (el.previousSibling &&
        el.previousSibling.nodeType == goog.dom.NodeType.TEXT) {
      el.previousSibling.nodeValue = el.previousSibling.nodeValue + text +
          el.nextSibling.nodeValue;
      this.getDomHelper().removeNode(el.nextSibling);
    } else {
      el.nextSibling.nodeValue = text + el.nextSibling.nodeValue;
    }
  } else if (el.previousSibling &&
      el.previousSibling.nodeType == goog.dom.NodeType.TEXT) {
    el.previousSibling.nodeValue += text;
  } else {
    el.parentNode.insertBefore(firstChild, el);
  }

  this.getDomHelper().removeNode(el);
***REMOVED***


***REMOVED***
***REMOVED*** Updates element based on word status. Either converts it to a text node, or
***REMOVED*** merges it with the previous or next text node if the status of the world is
***REMOVED*** VALID, in which case the element itself is eliminated.
***REMOVED***
***REMOVED*** @param {Element} el Word element.
***REMOVED*** @param {string} word Word to update status for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.updateElement =
    function(el, word, status) {
  if (this.markCorrected && this.correctedWords_ &&
      this.correctedWords_.contains(word)) {
    status = goog.spell.SpellCheck.WordStatus.CORRECTED;
  }
  if (status == goog.spell.SpellCheck.WordStatus.VALID) {
    this.removeMarkup(el);
  } else {
    goog.dom.setProperties(el, this.getElementProperties(status));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Generates unique Ids for spell checker elements.
***REMOVED*** @param {number=} opt_id Id to suffix with.
***REMOVED*** @return {string} Unique element id.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.makeElementId = function(opt_id) {
  return (opt_id ? opt_id : goog.ui.AbstractSpellChecker.nextId_++) +
      '.' + goog.ui.AbstractSpellChecker.ID_SUFFIX_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the span element that matches the given number id.
***REMOVED*** @param {number} id Number id to make the element id.
***REMOVED*** @return {Element} The matching span element or null if no span matches.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getElementById = function(id) {
  return this.getDomHelper().getElement(this.makeElementId(id));
***REMOVED***


***REMOVED***
***REMOVED*** Creates an element for a specified word and stores a reference to it.
***REMOVED***
***REMOVED*** @param {string} word Word to create element for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @return {!HTMLSpanElement} The created element.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.createWordElement = function(
    word, status) {
  var parameters = this.getElementProperties(status);

  // Add id & tabindex as necessary.
  if (!parameters['id']) {
    parameters['id'] = this.makeElementId();
  }
  if (!parameters['tabIndex']) {
    parameters['tabIndex'] = -1;
  }

  var el =***REMOVED*****REMOVED*** @type {!HTMLSpanElement}***REMOVED***
      (this.getDomHelper().createDom('span', parameters, word));
  goog.a11y.aria.setRole(el, 'menuitem');
  goog.a11y.aria.setState(el, 'haspopup', true);
  this.registerWordElement(word, el);

  return el;
***REMOVED***


***REMOVED***
***REMOVED*** Stores a reference to word element.
***REMOVED***
***REMOVED*** @param {string} word The word to store.
***REMOVED*** @param {HTMLSpanElement} el The element associated with it.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.registerWordElement = function(
    word, el) {
  // Avoid potential collision with the built-in object namespace. For
  // example, 'watch' is a reserved name in FireFox.
  var index = goog.ui.AbstractSpellChecker.toInternalKey_(word);
  if (this.wordElements_[index]) {
    this.wordElements_[index].push(el);
  } else {
    this.wordElements_[index] = [el];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns desired element properties for the specified status.
***REMOVED*** Should be overridden by implementation.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @return {Object} Properties to apply to the element.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.getElementProperties =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Handles word change events and updates the word elements accordingly.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck.WordChangedEvent} event The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.onWordChanged_ = function(event) {
  // Avoid potential collision with the built-in object namespace. For
  // example, 'watch' is a reserved name in FireFox.
  var index = goog.ui.AbstractSpellChecker.toInternalKey_(event.word);
  var elements = this.wordElements_[index];
  if (elements) {
    for (var el, i = 0; el = elements[i]; i++) {
      this.updateElement(el, event.word, event.status);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.AbstractSpellChecker.prototype.disposeInternal = function() {
  if (this.isVisible_) {
    // Clears wordElements_
    this.resume();
  }

  goog.events.unlisten(this.spellCheck,
      goog.spell.SpellCheck.EventType.WORD_CHANGED, this.onWordChanged_,
      false, this);

  if (this.menu_) {
    this.menu_.dispose();
    delete this.menu_;
    delete this.menuIgnore_;
    delete this.menuSeparator_;
  }
  delete this.spellCheck;
  delete this.wordElements_;

  goog.ui.AbstractSpellChecker.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Precharges local dictionary cache. This is optional, but greatly reduces
***REMOVED*** amount of subsequent churn in the DOM tree because most of the words become
***REMOVED*** known from the very beginning.
***REMOVED***
***REMOVED*** @param {string} text Text to process.
***REMOVED*** @param {number} words Max number of words to scan.
***REMOVED*** @return {number} number of words actually scanned.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.populateDictionary = function(text,
                                                                     words) {
  this.splitRegex_.lastIndex = 0;
  var result;
  var numScanned = 0;
  while (result = this.splitRegex_.exec(text)) {
    if (result[0].length == 0) {
      break;
    }
    var word = result[1];
    if (word) {
      this.spellCheck.checkWord(word);
      ++numScanned;
      if (numScanned >= words) {
        break;
      }
    }
  }
  this.spellCheck.processPending();
  return numScanned;
***REMOVED***


***REMOVED***
***REMOVED*** Processes word.
***REMOVED*** Should be overridden by implementation.
***REMOVED***
***REMOVED*** @param {Node} node Node containing word.
***REMOVED*** @param {string} text Word to process.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of the word.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.processWord = function(
    node, text, status) {
  throw Error('Need to override processWord_ in derivative class');
***REMOVED***


***REMOVED***
***REMOVED*** Processes range of text that checks out (contains no unrecognized words).
***REMOVED*** Should be overridden by implementation. May contain words and separators.
***REMOVED***
***REMOVED*** @param {Node} node Node containing text range.
***REMOVED*** @param {string} text text to process.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.processRange = function(node, text) {
  throw Error('Need to override processRange_ in derivative class');
***REMOVED***


***REMOVED***
***REMOVED*** Starts asynchronous processing mode.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.initializeAsyncMode = function() {
  if (this.asyncMode_ || this.processedElementsCount_ ||
      this.asyncText_ != null || this.asyncNode_) {
    throw Error('Async mode already in progress.');
  }
  this.asyncMode_ = true;
  this.processedElementsCount_ = 0;
  delete this.asyncText_;
  this.asyncRangeStart_ = 0;
  delete this.asyncNode_;

  this.blockReadyEvents();
***REMOVED***


***REMOVED***
***REMOVED*** Finalizes asynchronous processing mode. Should be called after there is no
***REMOVED*** more text to process and processTextAsync and/or continueAsyncProcessing
***REMOVED*** returned FINISHED.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.finishAsyncProcessing = function() {
  if (!this.asyncMode_ || this.asyncText_ != null || this.asyncNode_) {
    throw Error('Async mode not started or there is still text to process.');
  }
  this.asyncMode_ = false;
  this.processedElementsCount_ = 0;

  this.unblockReadyEvents();
  this.spellCheck.processPending();
***REMOVED***


***REMOVED***
***REMOVED*** Blocks processing of spell checker READY events. This is used in dictionary
***REMOVED*** recharge and async mode so that completion is not signaled prematurely.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.blockReadyEvents = function() {
***REMOVED***this.spellCheck, goog.spell.SpellCheck.EventType.READY,
      goog.events.Event.stopPropagation, true);
***REMOVED***


***REMOVED***
***REMOVED*** Unblocks processing of spell checker READY events. This is used in
***REMOVED*** dictionary recharge and async mode so that completion is not signaled
***REMOVED*** prematurely.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.unblockReadyEvents = function() {
  goog.events.unlisten(this.spellCheck, goog.spell.SpellCheck.EventType.READY,
      goog.events.Event.stopPropagation, true);
***REMOVED***


***REMOVED***
***REMOVED*** Splits text into individual words and blocks of separators. Calls virtual
***REMOVED*** processWord_ and processRange_ methods.
***REMOVED***
***REMOVED*** @param {Node} node Node containing text.
***REMOVED*** @param {string} text Text to process.
***REMOVED*** @return {goog.ui.AbstractSpellChecker.AsyncResult} operation result.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.processTextAsync = function(
    node, text) {
  if (!this.asyncMode_ || this.asyncText_ != null || this.asyncNode_) {
    throw Error('Not in async mode or previous text has not been processed.');
  }

  this.splitRegex_.lastIndex = 0;
  var stringSegmentStart = 0;

  var result;
  while (result = this.splitRegex_.exec(text)) {
    if (result[0].length == 0) {
      break;
    }
    var word = result[1];
    if (word) {
      var status = this.spellCheck.checkWord(word);
      if (status != goog.spell.SpellCheck.WordStatus.VALID) {
        var preceedingText = text.substr(stringSegmentStart, result.index -
            stringSegmentStart);
        if (preceedingText) {
          this.processRange(node, preceedingText);
        }
        stringSegmentStart = result.index + word.length;
        this.processWord(node, word, status);
      }
    }
    this.processedElementsCount_++;
    if (this.processedElementsCount_ > this.asyncWordsPerBatch_) {
      this.asyncText_ = text;
      this.asyncRangeStart_ = stringSegmentStart;
      this.asyncNode_ = node;
      this.processedElementsCount_ = 0;
      return goog.ui.AbstractSpellChecker.AsyncResult.PENDING;
    }
  }

  var leftoverText = text.substr(stringSegmentStart);
  if (leftoverText) {
    this.processRange(node, leftoverText);
  }

  return goog.ui.AbstractSpellChecker.AsyncResult.DONE;
***REMOVED***


***REMOVED***
***REMOVED*** Continues processing started by processTextAsync. Calls virtual
***REMOVED*** processWord_ and processRange_ methods.
***REMOVED***
***REMOVED*** @return {goog.ui.AbstractSpellChecker.AsyncResult} operation result.
***REMOVED*** @protected
***REMOVED***
goog.ui.AbstractSpellChecker.prototype.continueAsyncProcessing = function() {
  if (!this.asyncMode_ || this.asyncText_ == null || !this.asyncNode_) {
    throw Error('Not in async mode or processing not started.');
  }
  var node =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (this.asyncNode_);
  var stringSegmentStart = this.asyncRangeStart_;
  goog.asserts.assertNumber(stringSegmentStart);
  var text = this.asyncText_;

  var result;
  while (result = this.splitRegex_.exec(text)) {
    if (result[0].length == 0) {
      break;
    }
    var word = result[1];
    if (word) {
      var status = this.spellCheck.checkWord(word);
      if (status != goog.spell.SpellCheck.WordStatus.VALID) {
        var preceedingText = text.substr(stringSegmentStart, result.index -
            stringSegmentStart);
        if (preceedingText) {
          this.processRange(node, preceedingText);
        }
        stringSegmentStart = result.index + word.length;
        this.processWord(node, word, status);
      }
    }
    this.processedElementsCount_++;
    if (this.processedElementsCount_ > this.asyncWordsPerBatch_) {
      this.processedElementsCount_ = 0;
      this.asyncRangeStart_ = stringSegmentStart;
      return goog.ui.AbstractSpellChecker.AsyncResult.PENDING;
    }
  }
  delete this.asyncText_;
  this.asyncRangeStart_ = 0;
  delete this.asyncNode_;

  var leftoverText = text.substr(stringSegmentStart);
  if (leftoverText) {
    this.processRange(node, leftoverText);
  }

  return goog.ui.AbstractSpellChecker.AsyncResult.DONE;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a word to an internal key representation. This is necessary to
***REMOVED*** avoid collisions with object's internal namespace. Only words that are
***REMOVED*** reserved need to be escaped.
***REMOVED***
***REMOVED*** @param {string} word The word to map.
***REMOVED*** @return {string} The index.
***REMOVED*** @private
***REMOVED***
goog.ui.AbstractSpellChecker.toInternalKey_ = function(word) {
  if (word in Object.prototype) {
    return goog.ui.AbstractSpellChecker.KEY_PREFIX_ + word;
  }
  return word;
***REMOVED***


***REMOVED***
***REMOVED*** Constants for representing the direction while navigating.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.AbstractSpellChecker.Direction = {
  PREVIOUS: 0,
  NEXT: 1
***REMOVED***


***REMOVED***
***REMOVED*** Constants for the result of asynchronous processing.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.AbstractSpellChecker.AsyncResult = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Caller must reschedule operation and call continueAsyncProcessing on the
  ***REMOVED*** new stack frame.
 ***REMOVED*****REMOVED***
  PENDING: 1,
 ***REMOVED*****REMOVED***
  ***REMOVED*** Current element has been fully processed. Caller can call
  ***REMOVED*** processTextAsync or finishAsyncProcessing.
 ***REMOVED*****REMOVED***
  DONE: 2
***REMOVED***
