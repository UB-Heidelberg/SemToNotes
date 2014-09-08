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
***REMOVED*** @fileoverview Support class for spell checker components.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.spell.SpellCheck');
goog.provide('goog.spell.SpellCheck.WordChangedEvent');

goog.require('goog.Timer');
goog.require('goog.events.EventTarget');
goog.require('goog.structs.Set');



***REMOVED***
***REMOVED*** Support class for spell checker components. Provides basic functionality
***REMOVED*** such as word lookup and caching.
***REMOVED***
***REMOVED*** @param {Function=} opt_lookupFunction Function to use for word lookup. Must
***REMOVED***     accept an array of words, an object reference and a callback function as
***REMOVED***     parameters. It must also call the callback function (as a method on the
***REMOVED***     object), once ready, with an array containing the original words, their
***REMOVED***     spelling status and optionally an array of suggestions.
***REMOVED*** @param {string=} opt_language Content language.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.spell.SpellCheck = function(opt_lookupFunction, opt_language) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Function used to lookup spelling of words.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lookupFunction_ = opt_lookupFunction || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cache for words not yet checked with lookup function.
  ***REMOVED*** @type {goog.structs.Set}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.unknownWords_ = new goog.structs.Set();

  this.setLanguage(opt_language);
***REMOVED***
goog.inherits(goog.spell.SpellCheck, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Delay, in ms, to wait for additional words to be entered before a lookup
***REMOVED*** operation is triggered.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.LOOKUP_DELAY_ = 100;


***REMOVED***
***REMOVED*** Constants for event names
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.spell.SpellCheck.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when all pending words have been processed.
 ***REMOVED*****REMOVED***
  READY: 'ready',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when all lookup function failed.
 ***REMOVED*****REMOVED***
  ERROR: 'error',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when a word's status is changed.
 ***REMOVED*****REMOVED***
  WORD_CHANGED: 'wordchanged'
***REMOVED***


***REMOVED***
***REMOVED*** Cache. Shared across all spell checker instances. Map with langauge as the
***REMOVED*** key and a cache for that language as the value.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.cache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Content Language.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.language_ = '';


***REMOVED***
***REMOVED*** Cache for set language. Reference to the element corresponding to the set
***REMOVED*** language in the static goog.spell.SpellCheck.cache_.
***REMOVED***
***REMOVED*** @type {Object|undefined}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.cache_;


***REMOVED***
***REMOVED*** Id for timer processing the pending queue.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.queueTimer_ = 0;


***REMOVED***
***REMOVED*** Whether a lookup operation is in progress.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.lookupInProgress_ = false;


***REMOVED***
***REMOVED*** Codes representing the status of an individual word.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.spell.SpellCheck.WordStatus = {
  UNKNOWN: 0,
  VALID: 1,
  INVALID: 2,
  IGNORED: 3,
  CORRECTED: 4 // Temporary status, not stored in cache
***REMOVED***


***REMOVED***
***REMOVED*** Fields for word array in cache.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.spell.SpellCheck.CacheIndex = {
  STATUS: 0,
  SUGGESTIONS: 1
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for identifying word boundaries.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.spell.SpellCheck.WORD_BOUNDARY_CHARS =
    '\t\r\n\u00A0 !\"#$%&()*+,\-.\/:;<=>?@\[\\\]^_`{|}~';


***REMOVED***
***REMOVED*** Regular expression for identifying word boundaries.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED***
goog.spell.SpellCheck.WORD_BOUNDARY_REGEX = new RegExp(
    '[' + goog.spell.SpellCheck.WORD_BOUNDARY_CHARS + ']');


***REMOVED***
***REMOVED*** Regular expression for splitting a string into individual words and blocks of
***REMOVED*** separators. Matches zero or one word followed by zero or more separators.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED***
goog.spell.SpellCheck.SPLIT_REGEX = new RegExp(
    '([^' + goog.spell.SpellCheck.WORD_BOUNDARY_CHARS + ']*)' +
    '([' + goog.spell.SpellCheck.WORD_BOUNDARY_CHARS + ']*)');


***REMOVED***
***REMOVED*** Sets the lookup function.
***REMOVED***
***REMOVED*** @param {Function} f Function to use for word lookup. Must accept an array of
***REMOVED***     words, an object reference and a callback function as parameters.
***REMOVED***     It must also call the callback function (as a method on the object),
***REMOVED***     once ready, with an array containing the original words, their
***REMOVED***     spelling status and optionally an array of suggestions.
***REMOVED***
goog.spell.SpellCheck.prototype.setLookupFunction = function(f) {
  this.lookupFunction_ = f;
***REMOVED***


***REMOVED***
***REMOVED*** Sets language.
***REMOVED***
***REMOVED*** @param {string=} opt_language Content language.
***REMOVED***
goog.spell.SpellCheck.prototype.setLanguage = function(opt_language) {
  this.language_ = opt_language || '';

  if (!goog.spell.SpellCheck.cache_[this.language_]) {
    goog.spell.SpellCheck.cache_[this.language_] = {***REMOVED***
  }
  this.cache_ = goog.spell.SpellCheck.cache_[this.language_];
***REMOVED***


***REMOVED***
***REMOVED*** Returns language.
***REMOVED***
***REMOVED*** @return {string} Content language.
***REMOVED***
goog.spell.SpellCheck.prototype.getLanguage = function() {
  return this.language_;
***REMOVED***


***REMOVED***
***REMOVED*** Checks spelling for a block of text.
***REMOVED***
***REMOVED*** @param {string} text Block of text to spell check.
***REMOVED***
goog.spell.SpellCheck.prototype.checkBlock = function(text) {
  var words = text.split(goog.spell.SpellCheck.WORD_BOUNDARY_REGEX);

  var len = words.length;
  for (var word, i = 0; i < len; i++) {
    word = words[i];
    this.checkWord_(word);
  }

  if (!this.queueTimer_ && !this.lookupInProgress_ &&
      this.unknownWords_.getCount()) {
    this.processPending_();
  }
  else if (this.unknownWords_.getCount() == 0) {
    this.dispatchEvent(goog.spell.SpellCheck.EventType.READY);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks spelling for a single word. Returns the status of the supplied word,
***REMOVED*** or UNKNOWN if it's not cached. If it's not cached the word is added to a
***REMOVED*** queue and checked with the verification implementation with a short delay.
***REMOVED***
***REMOVED*** @param {string} word Word to check spelling of.
***REMOVED*** @return {goog.spell.SpellCheck.WordStatus} The status of the supplied word,
***REMOVED***     or UNKNOWN if it's not cached.
***REMOVED***
goog.spell.SpellCheck.prototype.checkWord = function(word) {
  var status = this.checkWord_(word);

  if (status == goog.spell.SpellCheck.WordStatus.UNKNOWN &&
      !this.queueTimer_ && !this.lookupInProgress_) {
    this.queueTimer_ = goog.Timer.callOnce(this.processPending_,
        goog.spell.SpellCheck.LOOKUP_DELAY_, this);
  }

  return status;
***REMOVED***


***REMOVED***
***REMOVED*** Checks spelling for a single word. Returns the status of the supplied word,
***REMOVED*** or UNKNOWN if it's not cached.
***REMOVED***
***REMOVED*** @param {string} word Word to check spelling of.
***REMOVED*** @return {goog.spell.SpellCheck.WordStatus} The status of the supplied word,
***REMOVED***     or UNKNOWN if it's not cached.
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.checkWord_ = function(word) {
  if (!word) {
    return goog.spell.SpellCheck.WordStatus.INVALID;
  }

  var cacheEntry = this.cache_[word];
  if (!cacheEntry) {
    this.unknownWords_.add(word);
    return goog.spell.SpellCheck.WordStatus.UNKNOWN;
  }

  return cacheEntry[goog.spell.SpellCheck.CacheIndex.STATUS];
***REMOVED***


***REMOVED***
***REMOVED*** Processes pending words unless a lookup operation has already been queued or
***REMOVED*** is in progress.
***REMOVED***
***REMOVED*** @throws {Error}
***REMOVED***
goog.spell.SpellCheck.prototype.processPending = function() {
  if (this.unknownWords_.getCount()) {
    if (!this.queueTimer_ && !this.lookupInProgress_) {
      this.processPending_();
    }
  } else {
    this.dispatchEvent(goog.spell.SpellCheck.EventType.READY);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Processes pending words using the verification callback.
***REMOVED***
***REMOVED*** @throws {Error}
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.processPending_ = function() {
  if (!this.lookupFunction_) {
    throw Error('No lookup function provided for spell checker.');
  }

  if (this.unknownWords_.getCount()) {
    this.lookupInProgress_ = true;
    var func = this.lookupFunction_;
    func(this.unknownWords_.getValues(), this, this.lookupCallback_);
  } else {
    this.dispatchEvent(goog.spell.SpellCheck.EventType.READY);
  }

  this.queueTimer_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Callback for lookup function.
***REMOVED***
***REMOVED*** @param {Array.<Array>} data Data array. Each word is represented by an
***REMOVED***     array containing the word, the status and optionally an array of
***REMOVED***     suggestions. Passing null indicates that the operation failed.
***REMOVED*** @private
***REMOVED***
***REMOVED*** Example:
***REMOVED*** obj.lookupCallback_([
***REMOVED***   ['word', VALID],
***REMOVED***   ['wrod', INVALID, ['word', 'wood', 'rod']]
***REMOVED*** ]);
***REMOVED***
goog.spell.SpellCheck.prototype.lookupCallback_ = function(data) {

  // Lookup function failed; abort then dispatch error event.
  if (data == null) {
    if (this.queueTimer_) {
      goog.Timer.clear(this.queueTimer_);
      this.queueTimer_ = 0;
    }
    this.lookupInProgress_ = false;

    this.dispatchEvent(goog.spell.SpellCheck.EventType.ERROR);
    return;
  }

  for (var a, i = 0; a = data[i]; i++) {
    this.setWordStatus_(a[0], a[1], a[2]);
  }
  this.lookupInProgress_ = false;

  // Fire ready event if all pending words have been processed.
  if (this.unknownWords_.getCount() == 0) {
    this.dispatchEvent(goog.spell.SpellCheck.EventType.READY);

  // Process pending
  } else if (!this.queueTimer_) {
    this.queueTimer_ = goog.Timer.callOnce(this.processPending_,
        goog.spell.SpellCheck.LOOKUP_DELAY_, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a words spelling status.
***REMOVED***
***REMOVED*** @param {string} word Word to set status for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @param {Array.<string>=} opt_suggestions Suggestions.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** obj.setWordStatus('word', VALID);
***REMOVED*** obj.setWordStatus('wrod', INVALID, ['word', 'wood', 'rod']);.
***REMOVED***
goog.spell.SpellCheck.prototype.setWordStatus =
    function(word, status, opt_suggestions) {
  this.setWordStatus_(word, status, opt_suggestions);
***REMOVED***


***REMOVED***
***REMOVED*** Sets a words spelling status.
***REMOVED***
***REMOVED*** @param {string} word Word to set status for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @param {Array.<string>=} opt_suggestions Suggestions.
***REMOVED*** @private
***REMOVED***
goog.spell.SpellCheck.prototype.setWordStatus_ =
    function(word, status, opt_suggestions) {
  var suggestions = opt_suggestions || [];
  this.cache_[word] = [status, suggestions];
  this.unknownWords_.remove(word);

  this.dispatchEvent(
      new goog.spell.SpellCheck.WordChangedEvent(this, word, status));
***REMOVED***


***REMOVED***
***REMOVED*** Returns suggestions for the given word.
***REMOVED***
***REMOVED*** @param {string} word Word to get suggestions for.
***REMOVED*** @return {Array.<string>} An array of suggestions for the given word.
***REMOVED***
goog.spell.SpellCheck.prototype.getSuggestions = function(word) {
  var cacheEntry = this.cache_[word];

  if (!cacheEntry) {
    this.checkWord(word);
    return [];
  }

  return cacheEntry[goog.spell.SpellCheck.CacheIndex.STATUS] ==
      goog.spell.SpellCheck.WordStatus.INVALID ?
      cacheEntry[goog.spell.SpellCheck.CacheIndex.SUGGESTIONS] : [];
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a word changed event. Fired when the status of a word
***REMOVED*** changes.
***REMOVED***
***REMOVED*** @param {goog.spell.SpellCheck} target Spellcheck object initiating event.
***REMOVED*** @param {string} word Word to set status for.
***REMOVED*** @param {goog.spell.SpellCheck.WordStatus} status Status of word.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.spell.SpellCheck.WordChangedEvent = function(target, word, status) {
  goog.events.Event.call(this, goog.spell.SpellCheck.EventType.WORD_CHANGED,
      target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Word the status has changed for.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.word = word;

 ***REMOVED*****REMOVED***
  ***REMOVED*** New status
  ***REMOVED*** @type {goog.spell.SpellCheck.WordStatus}
 ***REMOVED*****REMOVED***
  this.status = status;
***REMOVED***
goog.inherits(goog.spell.SpellCheck.WordChangedEvent, goog.events.Event);
