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
***REMOVED*** @fileoverview Gmail-like AutoComplete logic.
***REMOVED***
***REMOVED*** @see ../../demos/autocomplete-basic.html
***REMOVED***

goog.provide('goog.ui.ac.AutoComplete');
goog.provide('goog.ui.ac.AutoComplete.EventType');

goog.require('goog.array');
goog.require('goog.asserts');
***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.object');



***REMOVED***
***REMOVED*** This is the central manager class for an AutoComplete instance. The matcher
***REMOVED*** can specify disabled rows that should not be hilited or selected by
***REMOVED*** implementing <code>isRowDisabled(row):boolean</code> for each autocomplete
***REMOVED*** row. No row will be considered disabled if this method is not implemented.
***REMOVED***
***REMOVED*** @param {Object} matcher A data source and row matcher, implements
***REMOVED***        <code>requestMatchingRows(token, maxMatches, matchCallback)</code>.
***REMOVED*** @param {goog.events.EventTarget} renderer An object that implements
***REMOVED***        <code>
***REMOVED***          isVisible():boolean<br>
***REMOVED***          renderRows(rows:Array, token:string, target:Element);<br>
***REMOVED***          hiliteId(row-id:number);<br>
***REMOVED***          dismiss();<br>
***REMOVED***          dispose():
***REMOVED***        </code>.
***REMOVED*** @param {Object} selectionHandler An object that implements
***REMOVED***        <code>
***REMOVED***          selectRow(row);<br>
***REMOVED***          update(opt_force);
***REMOVED***        </code>.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.ac.AutoComplete = function(matcher, renderer, selectionHandler) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A data-source which provides autocomplete suggestions.
  ***REMOVED***
  ***REMOVED*** TODO(user): Tighten the type to !goog.ui.ac.AutoComplete.Matcher.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.matcher_ = matcher;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A handler which interacts with the input DOM element (textfield, textarea,
  ***REMOVED*** or richedit).
  ***REMOVED***
  ***REMOVED*** TODO(user): Tighten the type to !Object.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.selectionHandler_ = selectionHandler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A renderer to render/show/highlight/hide the autocomplete menu.
  ***REMOVED*** @type {goog.events.EventTarget}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.renderer_ = renderer;
***REMOVED***
      renderer,
      [
        goog.ui.ac.AutoComplete.EventType.HILITE,
        goog.ui.ac.AutoComplete.EventType.SELECT,
        goog.ui.ac.AutoComplete.EventType.CANCEL_DISMISS,
        goog.ui.ac.AutoComplete.EventType.DISMISS
      ],
      this.handleEvent, false, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Currently typed token which will be used for completion.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.token_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Autocomplete suggestion items.
  ***REMOVED*** @type {Array}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.rows_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Id of the currently highlighted row.
  ***REMOVED*** @type {number}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.hiliteId_ = -1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Id of the first row in autocomplete menu. Note that new ids are assigned
  ***REMOVED*** everytime new suggestions are fetched.
  ***REMOVED***
  ***REMOVED*** TODO(user): Figure out what subclass does with this value
  ***REMOVED*** and whether we should expose a more proper API.
  ***REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.firstRowId_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The target HTML node for displaying.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.target_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The timer id for dismissing autocomplete menu with a delay.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dismissTimer_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Mapping from text input element to the anchor element. If the
  ***REMOVED*** mapping does not exist, the input element will act as the anchor
  ***REMOVED*** element.
  ***REMOVED*** @type {Object.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.inputToAnchorMap_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.ui.ac.AutoComplete, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The maximum number of matches that should be returned
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.maxMatches_ = 10;


***REMOVED***
***REMOVED*** True iff the first row should automatically be highlighted
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.autoHilite_ = true;


***REMOVED***
***REMOVED*** True iff the user can unhilight all rows by pressing the up arrow.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.allowFreeSelect_ = false;


***REMOVED***
***REMOVED*** True iff item selection should wrap around from last to first. If
***REMOVED***     allowFreeSelect_ is on in conjunction, there is a step of free selection
***REMOVED***     before wrapping.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.wrap_ = false;


***REMOVED***
***REMOVED*** Whether completion from suggestion triggers fetching new suggestion.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.triggerSuggestionsOnUpdate_ = false;


***REMOVED***
***REMOVED*** Events associated with the autocomplete
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ac.AutoComplete.EventType = {

 ***REMOVED*****REMOVED*** A row has been highlighted by the renderer***REMOVED***
  ROW_HILITE: 'rowhilite',

  // Note: The events below are used for internal autocomplete events only and
  // should not be used in non-autocomplete code.

 ***REMOVED*****REMOVED*** A row has been mouseovered and should be highlighted by the renderer.***REMOVED***
  HILITE: 'hilite',

 ***REMOVED*****REMOVED*** A row has been selected by the renderer***REMOVED***
  SELECT: 'select',

 ***REMOVED*****REMOVED*** A dismiss event has occurred***REMOVED***
  DISMISS: 'dismiss',

 ***REMOVED*****REMOVED*** Event that cancels a dismiss event***REMOVED***
  CANCEL_DISMISS: 'canceldismiss',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Field value was updated.  A row field is included and is non-null when a
  ***REMOVED*** row has been selected.  The value of the row typically includes fields:
  ***REMOVED*** contactData and formattedValue as well as a toString function (though none
  ***REMOVED*** of these fields are guaranteed to exist).  The row field may be used to
  ***REMOVED*** return custom-type row data.
 ***REMOVED*****REMOVED***
  UPDATE: 'update',

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of suggestions has been updated, usually because either the list
  ***REMOVED*** has opened, or because the user has typed another character and the
  ***REMOVED*** suggestions have been updated, or the user has dismissed the autocomplete.
 ***REMOVED*****REMOVED***
  SUGGESTIONS_UPDATE: 'suggestionsupdate'
***REMOVED***


***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   requestMatchingRows:(!Function|undefined),
***REMOVED***   isRowDisabled:(!Function|undefined)
***REMOVED*** }}
***REMOVED***
goog.ui.ac.AutoComplete.Matcher;


***REMOVED***
***REMOVED*** @return {!Object} The data source providing the `autocomplete
***REMOVED***     suggestions.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getMatcher = function() {
  return goog.asserts.assert(this.matcher_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the data source providing the autocomplete suggestions.
***REMOVED***
***REMOVED*** See constructor documentation for the interface.
***REMOVED***
***REMOVED*** @param {!Object} matcher The matcher.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setMatcher = function(matcher) {
  this.matcher_ = matcher;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} The handler used to interact with the input DOM
***REMOVED***     element (textfield, textarea, or richedit), e.g. to update the
***REMOVED***     input DOM element with selected value.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getSelectionHandler = function() {
  return goog.asserts.assert(this.selectionHandler_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.events.EventTarget} The renderer that
***REMOVED***     renders/shows/highlights/hides the autocomplete menu.
***REMOVED***     See constructor documentation for the expected renderer API.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getRenderer = function() {
  return this.renderer_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the renderer that renders/shows/highlights/hides the autocomplete
***REMOVED*** menu.
***REMOVED***
***REMOVED*** See constructor documentation for the expected renderer API.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} renderer The renderer.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setRenderer = function(renderer) {
  this.renderer_ = renderer;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The currently typed token used for completion.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getToken = function() {
  return this.token_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current token (without changing the rendered autocompletion).
***REMOVED***
***REMOVED*** NOTE(user): This method will likely go away when we figure
***REMOVED*** out a better API.
***REMOVED***
***REMOVED*** @param {?string} token The new token.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setTokenInternal = function(token) {
  this.token_ = token;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} index The suggestion index, must be within the
***REMOVED***     interval [0, this.getSuggestionCount()).
***REMOVED*** @return {Object} The currently suggested item at the given index
***REMOVED***     (or null if there is none).
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getSuggestion = function(index) {
  return this.rows_[index];
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array} The current autocomplete suggestion items.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getAllSuggestions = function() {
  return goog.asserts.assert(this.rows_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of currently suggested items.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getSuggestionCount = function() {
  return this.rows_.length;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The id (not index!) of the currently highlighted row.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getHighlightedId = function() {
  return this.hiliteId_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current highlighted row to the given id (not index). Note
***REMOVED*** that this does not change any rendering.
***REMOVED***
***REMOVED*** NOTE(user): This method will likely go away when we figure
***REMOVED*** out a better API.
***REMOVED***
***REMOVED*** @param {number} id The new highlighted row id.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setHighlightedIdInternal = function(id) {
  this.hiliteId_ = id;
***REMOVED***


***REMOVED***
***REMOVED*** Generic event handler that handles any events this object is listening to.
***REMOVED*** @param {goog.events.Event} e Event Object.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.handleEvent = function(e) {
  var matcher =***REMOVED*****REMOVED*** @type {?goog.ui.ac.AutoComplete.Matcher}***REMOVED*** (this.matcher_);

  if (e.target == this.renderer_) {
    switch (e.type) {
      case goog.ui.ac.AutoComplete.EventType.HILITE:
        this.hiliteId(***REMOVED*** @type {number}***REMOVED*** (e.row));
        break;

      case goog.ui.ac.AutoComplete.EventType.SELECT:
        var rowDisabled = false;

        // e.row can be either a valid row id or empty.
        if (goog.isNumber(e.row)) {
          var rowId = e.row;
          var index = this.getIndexOfId(rowId);
          var row = this.rows_[index];

          // Make sure the row selected is not a disabled row.
          rowDisabled = !!row && matcher.isRowDisabled &&
              matcher.isRowDisabled(row);
          if (row && !rowDisabled && this.hiliteId_ != rowId) {
            // Event target row not currently highlighted - fix the mismatch.
            this.hiliteId(rowId);
          }
        }
        if (!rowDisabled) {
          // Note that rowDisabled can be false even if e.row does not
          // contain a valid row ID; at least one client depends on us
          // proceeding anyway.
          this.selectHilited();
        }
        break;

      case goog.ui.ac.AutoComplete.EventType.CANCEL_DISMISS:
        this.cancelDelayedDismiss();
        break;

      case goog.ui.ac.AutoComplete.EventType.DISMISS:
        this.dismissOnDelay();
        break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the max number of matches to fetch from the Matcher.
***REMOVED***
***REMOVED*** @param {number} max Max number of matches.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setMaxMatches = function(max) {
  this.maxMatches_ = max;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether or not the first row should be highlighted by default.
***REMOVED***
***REMOVED*** @param {boolean} autoHilite true iff the first row should be
***REMOVED***      highlighted by default.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setAutoHilite = function(autoHilite) {
  this.autoHilite_ = autoHilite;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether or not the up/down arrow can unhilite all rows.
***REMOVED***
***REMOVED*** @param {boolean} allowFreeSelect true iff the up arrow can unhilite all rows.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setAllowFreeSelect =
    function(allowFreeSelect) {
  this.allowFreeSelect_ = allowFreeSelect;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether or not selections can wrap around the edges.
***REMOVED***
***REMOVED*** @param {boolean} wrap true iff sections should wrap around the edges.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setWrap = function(wrap) {
  this.wrap_ = wrap;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether or not to request new suggestions immediately after completion
***REMOVED*** of a suggestion.
***REMOVED***
***REMOVED*** @param {boolean} triggerSuggestionsOnUpdate true iff completion should fetch
***REMOVED***     new suggestions.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setTriggerSuggestionsOnUpdate = function(
    triggerSuggestionsOnUpdate) {
  this.triggerSuggestionsOnUpdate_ = triggerSuggestionsOnUpdate;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the token to match against.  This triggers calls to the Matcher to
***REMOVED*** fetch the matches (up to maxMatches), and then it triggers a call to
***REMOVED*** <code>renderer.renderRows()</code>.
***REMOVED***
***REMOVED*** @param {string} token The string for which to search in the Matcher.
***REMOVED*** @param {string=} opt_fullString Optionally, the full string in the input
***REMOVED***     field.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setToken = function(token, opt_fullString) {
  if (this.token_ == token) {
    return;
  }
  this.token_ = token;
  this.matcher_.requestMatchingRows(this.token_,
      this.maxMatches_, goog.bind(this.matchListener_, this), opt_fullString);
  this.cancelDelayedDismiss();
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current target HTML node for displaying autocomplete UI.
***REMOVED*** @return {Element} The current target HTML node for displaying autocomplete
***REMOVED***     UI.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getTarget = function() {
  return this.target_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current target HTML node for displaying autocomplete UI.
***REMOVED*** Can be an implementation specific definition of how to display UI in relation
***REMOVED*** to the target node.
***REMOVED*** This target will be passed into  <code>renderer.renderRows()</code>
***REMOVED***
***REMOVED*** @param {Element} target The current target HTML node for displaying
***REMOVED***     autocomplete UI.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.setTarget = function(target) {
  this.target_ = target;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the autocomplete's renderer is open.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.isOpen = function() {
  return this.renderer_.isVisible();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Number of rows in the autocomplete.
***REMOVED*** @deprecated Use this.getSuggestionCount().
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getRowCount = function() {
  return this.getSuggestionCount();
***REMOVED***


***REMOVED***
***REMOVED*** Moves the hilite to the next non-disabled row.
***REMOVED*** Calls renderer.hiliteId() when there's something to do.
***REMOVED*** @return {boolean} Returns true on a successful hilite.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.hiliteNext = function() {
  var lastId = this.firstRowId_ + this.rows_.length - 1;
  var toHilite = this.hiliteId_;
  // Hilite the next row, skipping any disabled rows.
  for (var i = 0; i < this.rows_.length; i++) {
    // Increment to the next row.
    if (toHilite >= this.firstRowId_ && toHilite < lastId) {
      toHilite++;
    } else if (toHilite == -1) {
      toHilite = this.firstRowId_;
    } else if (this.allowFreeSelect_ && toHilite == lastId) {
      this.hiliteId(-1);
      return false;
    } else if (this.wrap_ && toHilite == lastId) {
      toHilite = this.firstRowId_;
    } else {
      return false;
    }

    if (this.hiliteId(toHilite)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Moves the hilite to the previous non-disabled row.  Calls
***REMOVED*** renderer.hiliteId() when there's something to do.
***REMOVED*** @return {boolean} Returns true on a successful hilite.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.hilitePrev = function() {
  var lastId = this.firstRowId_ + this.rows_.length - 1;
  var toHilite = this.hiliteId_;
  // Hilite the previous row, skipping any disabled rows.
  for (var i = 0; i < this.rows_.length; i++) {
    // Decrement to the previous row.
    if (toHilite > this.firstRowId_) {
      toHilite--;
    } else if (this.allowFreeSelect_ && toHilite == this.firstRowId_) {
      this.hiliteId(-1);
      return false;
    } else if (this.wrap_ && (toHilite == -1 || toHilite == this.firstRowId_)) {
      toHilite = lastId;
    } else {
      return false;
    }

    if (this.hiliteId(toHilite)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Hilites the id if it's valid and the row is not disabled, otherwise does
***REMOVED*** nothing.
***REMOVED*** @param {number} id A row id (not index).
***REMOVED*** @return {boolean} Whether the id was hilited. Returns false if the row is
***REMOVED***     disabled.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.hiliteId = function(id) {
  var index = this.getIndexOfId(id);
  var row = this.rows_[index];
  var rowDisabled = !!row && this.matcher_.isRowDisabled &&
      this.matcher_.isRowDisabled(row);
  if (!rowDisabled) {
    this.hiliteId_ = id;
    this.renderer_.hiliteId(id);
    return index != -1;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Hilites the index, if it's valid and the row is not disabled, otherwise does
***REMOVED*** nothing.
***REMOVED*** @param {number} index The row's index.
***REMOVED*** @return {boolean} Whether the index was hilited.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.hiliteIndex = function(index) {
  return this.hiliteId(this.getIdOfIndex_(index));
***REMOVED***


***REMOVED***
***REMOVED*** If there are any current matches, this passes the hilited row data to
***REMOVED*** <code>selectionHandler.selectRow()</code>
***REMOVED*** @return {boolean} Whether there are any current matches.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.selectHilited = function() {
  var index = this.getIndexOfId(this.hiliteId_);
  if (index != -1) {
    var selectedRow = this.rows_[index];
    var suppressUpdate = this.selectionHandler_.selectRow(selectedRow);
    if (this.triggerSuggestionsOnUpdate_) {
      this.token_ = null;
      this.dismissOnDelay();
    } else {
      this.dismiss();
    }
    if (!suppressUpdate) {
      this.dispatchEvent({
        type: goog.ui.ac.AutoComplete.EventType.UPDATE,
        row: selectedRow,
        index: index
      });
      if (this.triggerSuggestionsOnUpdate_) {
        this.selectionHandler_.update(true);
      }
    }
    return true;
  } else {
    this.dismiss();
    this.dispatchEvent(
        {
          type: goog.ui.ac.AutoComplete.EventType.UPDATE,
          row: null,
          index: null
        });
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not the autocomplete is open and has a highlighted row.
***REMOVED*** @return {boolean} Whether an autocomplete row is highlighted.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.hasHighlight = function() {
  return this.isOpen() && this.getIndexOfId(this.hiliteId_) != -1;
***REMOVED***


***REMOVED***
***REMOVED*** Clears out the token, rows, and hilite, and calls
***REMOVED*** <code>renderer.dismiss()</code>
***REMOVED***
goog.ui.ac.AutoComplete.prototype.dismiss = function() {
  this.hiliteId_ = -1;
  this.token_ = null;
  this.firstRowId_ += this.rows_.length;
  this.rows_ = [];
  window.clearTimeout(this.dismissTimer_);
  this.dismissTimer_ = null;
  this.renderer_.dismiss();
  this.dispatchEvent(goog.ui.ac.AutoComplete.EventType.SUGGESTIONS_UPDATE);
  this.dispatchEvent(goog.ui.ac.AutoComplete.EventType.DISMISS);
***REMOVED***


***REMOVED***
***REMOVED*** Call a dismiss after a delay, if there's already a dismiss active, ignore.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.dismissOnDelay = function() {
  if (!this.dismissTimer_) {
    this.dismissTimer_ = window.setTimeout(goog.bind(this.dismiss, this), 100);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels any delayed dismiss events immediately.
***REMOVED*** @return {boolean} Whether a delayed dismiss was cancelled.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.immediatelyCancelDelayedDismiss_ =
    function() {
  if (this.dismissTimer_) {
    window.clearTimeout(this.dismissTimer_);
    this.dismissTimer_ = null;
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Cancel the active delayed dismiss if there is one.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.cancelDelayedDismiss = function() {
  // Under certain circumstances a cancel event occurs immediately prior to a
  // delayedDismiss event that it should be cancelling. To handle this situation
  // properly, a timer is used to stop that event.
  // Using only the timer creates undesirable behavior when the cancel occurs
  // less than 10ms before the delayed dismiss timout ends. If that happens the
  // clearTimeout() will occur too late and have no effect.
  if (!this.immediatelyCancelDelayedDismiss_()) {
    window.setTimeout(goog.bind(this.immediatelyCancelDelayedDismiss_, this),
        10);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ac.AutoComplete.prototype.disposeInternal = function() {
  goog.ui.ac.AutoComplete.superClass_.disposeInternal.call(this);
  delete this.inputToAnchorMap_;
  this.renderer_.dispose();
  this.selectionHandler_.dispose();
  this.matcher_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Callback passed to Matcher when requesting matches for a token.
***REMOVED*** This might be called synchronously, or asynchronously, or both, for
***REMOVED*** any implementation of a Matcher.
***REMOVED*** If the Matcher calls this back, with the same token this AutoComplete
***REMOVED*** has set currently, then this will package the matching rows in object
***REMOVED*** of the form
***REMOVED*** <pre>
***REMOVED*** {
***REMOVED***   id: an integer ID unique to this result set and AutoComplete instance,
***REMOVED***   data: the raw row data from Matcher
***REMOVED*** }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {string} matchedToken Token that corresponds with the rows.
***REMOVED*** @param {!Array} rows Set of data that match the given token.
***REMOVED*** @param {(boolean|goog.ui.ac.RenderOptions)=} opt_options If true,
***REMOVED***     keeps the currently hilited (by index) element hilited. If false not.
***REMOVED***     Otherwise a RenderOptions object.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.matchListener_ =
    function(matchedToken, rows, opt_options) {
  if (this.token_ != matchedToken) {
    // Matcher's response token doesn't match current token.
    // This is probably an async response that came in after
    // the token was changed, so don't do anything.
    return;
  }

  this.renderRows(rows, opt_options);
***REMOVED***


***REMOVED***
***REMOVED*** Renders the rows and adds highlighting.
***REMOVED*** @param {!Array} rows Set of data that match the given token.
***REMOVED*** @param {(boolean|goog.ui.ac.RenderOptions)=} opt_options If true,
***REMOVED***     keeps the currently hilited (by index) element hilited. If false not.
***REMOVED***     Otherwise a RenderOptions object.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.renderRows = function(rows, opt_options) {
  // The optional argument should be a RenderOptions object.  It can be a
  // boolean for backwards compatibility, defaulting to false.
  var optionsObj = goog.typeOf(opt_options) == 'object' && opt_options;

  var preserveHilited =
      optionsObj ? optionsObj.getPreserveHilited() : opt_options;
  var indexToHilite = preserveHilited ? this.getIndexOfId(this.hiliteId_) : -1;

  // Current token matches the matcher's response token.
  this.firstRowId_ += this.rows_.length;
  this.rows_ = rows;
  var rendRows = [];
  for (var i = 0; i < rows.length; ++i) {
    rendRows.push({
      id: this.getIdOfIndex_(i),
      data: rows[i]
    });
  }

  var anchor = null;
  if (this.target_) {
    anchor = this.inputToAnchorMap_[goog.getUid(this.target_)] || this.target_;
  }
  this.renderer_.setAnchorElement(anchor);
  this.renderer_.renderRows(rendRows, this.token_, this.target_);

  var autoHilite = this.autoHilite_;
  if (optionsObj && optionsObj.getAutoHilite() !== undefined) {
    autoHilite = optionsObj.getAutoHilite();
  }
  this.hiliteId_ = -1;
  if ((autoHilite || indexToHilite >= 0) &&
      rendRows.length != 0 &&
      this.token_) {
    if (indexToHilite >= 0) {
      this.hiliteId(this.getIdOfIndex_(indexToHilite));
    } else {
      // Hilite the first non-disabled row.
      this.hiliteNext();
    }
  }
  this.dispatchEvent(goog.ui.ac.AutoComplete.EventType.SUGGESTIONS_UPDATE);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the index corresponding to a particular id.
***REMOVED*** @param {number} id A unique id for the row.
***REMOVED*** @return {number} A valid index into rows_, or -1 if the id is invalid.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getIndexOfId = function(id) {
  var index = id - this.firstRowId_;
  if (index < 0 || index >= this.rows_.length) {
    return -1;
  }
  return index;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the id corresponding to a particular index.  (Does no checking.)
***REMOVED*** @param {number} index The index of a row in the result set.
***REMOVED*** @return {number} The id that currently corresponds to that index.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.AutoComplete.prototype.getIdOfIndex_ = function(index) {
  return this.firstRowId_ + index;
***REMOVED***


***REMOVED***
***REMOVED*** Attach text areas or input boxes to the autocomplete by DOM reference.  After
***REMOVED*** elements are attached to the autocomplete, when a user types they will see
***REMOVED*** the autocomplete drop down.
***REMOVED*** @param {...Element} var_args Variable args: Input or text area elements to
***REMOVED***     attach the autocomplete too.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.attachInputs = function(var_args) {
  // Delegate to the input handler
  var inputHandler =***REMOVED*****REMOVED*** @type {goog.ui.ac.InputHandler}***REMOVED***
      (this.selectionHandler_);
  inputHandler.attachInputs.apply(inputHandler, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Detach text areas or input boxes to the autocomplete by DOM reference.
***REMOVED*** @param {...Element} var_args Variable args: Input or text area elements to
***REMOVED***     detach from the autocomplete.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.detachInputs = function(var_args) {
  // Delegate to the input handler
  var inputHandler =***REMOVED*****REMOVED*** @type {goog.ui.ac.InputHandler}***REMOVED***
      (this.selectionHandler_);
  inputHandler.detachInputs.apply(inputHandler, arguments);

  // Remove mapping from input to anchor if one exists.
  goog.array.forEach(arguments, function(input) {
    goog.object.remove(this.inputToAnchorMap_, goog.getUid(input));
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the autocompleter to a text area or text input element
***REMOVED*** with an anchor element. The anchor element is the element the
***REMOVED*** autocomplete box will be positioned against.
***REMOVED*** @param {Element} inputElement The input element. May be 'textarea',
***REMOVED***     text 'input' element, or any other element that exposes similar
***REMOVED***     interface.
***REMOVED*** @param {Element} anchorElement The anchor element.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.attachInputWithAnchor = function(
    inputElement, anchorElement) {
  this.inputToAnchorMap_[goog.getUid(inputElement)] = anchorElement;
  this.attachInputs(inputElement);
***REMOVED***


***REMOVED***
***REMOVED*** Forces an update of the display.
***REMOVED*** @param {boolean=} opt_force Whether to force an update.
***REMOVED***
goog.ui.ac.AutoComplete.prototype.update = function(opt_force) {
  var inputHandler =***REMOVED*****REMOVED*** @type {goog.ui.ac.InputHandler}***REMOVED***
      (this.selectionHandler_);
  inputHandler.update(opt_force);
***REMOVED***
