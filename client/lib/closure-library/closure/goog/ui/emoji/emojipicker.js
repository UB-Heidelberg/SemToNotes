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
***REMOVED*** @fileoverview Emoji Picker implementation. This provides a UI widget for
***REMOVED*** choosing an emoji from a grid of possible choices.
***REMOVED***
***REMOVED*** @see ../demos/popupemojipicker.html for an example of how to instantiate
***REMOVED*** an emoji picker.
***REMOVED***
***REMOVED*** Based on goog.ui.ColorPicker (colorpicker.js).
***REMOVED***
***REMOVED*** @see ../../demos/popupemojipicker.html
***REMOVED***

goog.provide('goog.ui.emoji.EmojiPicker');

goog.require('goog.log');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.TabPane');
goog.require('goog.ui.emoji.Emoji');
goog.require('goog.ui.emoji.EmojiPalette');
goog.require('goog.ui.emoji.EmojiPaletteRenderer');
goog.require('goog.ui.emoji.ProgressiveEmojiPaletteRenderer');



***REMOVED***
***REMOVED*** Creates a new, empty emoji picker. An emoji picker is a grid of emoji, each
***REMOVED*** cell of the grid containing a single emoji. The picker may contain multiple
***REMOVED*** pages of emoji.
***REMOVED***
***REMOVED*** When a user selects an emoji, by either clicking or pressing enter, the
***REMOVED*** picker fires a goog.ui.Component.EventType.ACTION event with the id. The
***REMOVED*** client listens on this event and in the handler can retrieve the id of the
***REMOVED*** selected emoji and do something with it, for instance, inserting an image
***REMOVED*** tag into a rich text control. An emoji picker does not maintain state. That
***REMOVED*** is, once an emoji is selected, the emoji picker does not remember which emoji
***REMOVED*** was selected.
***REMOVED***
***REMOVED*** The emoji picker is implemented as a tabpane with each tabpage being a table.
***REMOVED*** Each of the tables are the same size to prevent jittering when switching
***REMOVED*** between pages.
***REMOVED***
***REMOVED*** @param {string} defaultImgUrl Url of the img that should be used to fill up
***REMOVED***     the cells in the emoji table, to prevent jittering. Should be the same
***REMOVED***     size as the emoji.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.emoji.EmojiPicker = function(defaultImgUrl, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

  this.defaultImgUrl_ = defaultImgUrl;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Emoji that this picker displays.
  ***REMOVED***
  ***REMOVED*** @type {Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.emoji_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Pages of this emoji picker.
  ***REMOVED***
  ***REMOVED*** @type {Array.<goog.ui.emoji.EmojiPalette>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pages_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keeps track of which pages in the picker have been loaded. Used for delayed
  ***REMOVED*** loading of tabs.
  ***REMOVED***
  ***REMOVED*** @type {Array.<boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pageLoadStatus_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tabpane to hold the pages of this emojipicker.
  ***REMOVED***
  ***REMOVED*** @type {goog.ui.TabPane}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tabPane_ = null;

  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
      this.onEmojiPaletteAction_);
***REMOVED***
goog.inherits(goog.ui.emoji.EmojiPicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Default number of rows per grid of emoji.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.ui.emoji.EmojiPicker.DEFAULT_NUM_ROWS = 5;


***REMOVED***
***REMOVED*** Default number of columns per grid of emoji.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.ui.emoji.EmojiPicker.DEFAULT_NUM_COLS = 10;


***REMOVED***
***REMOVED*** Default location of the tabs in relation to the emoji grids.
***REMOVED***
***REMOVED*** @type {goog.ui.TabPane.TabLocation}
***REMOVED***
goog.ui.emoji.EmojiPicker.DEFAULT_TAB_LOCATION =
    goog.ui.TabPane.TabLocation.TOP;


***REMOVED***
***REMOVED*** Number of rows per grid of emoji.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.numRows_ =
    goog.ui.emoji.EmojiPicker.DEFAULT_NUM_ROWS;


***REMOVED***
***REMOVED*** Number of columns per grid of emoji.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.numCols_ =
    goog.ui.emoji.EmojiPicker.DEFAULT_NUM_COLS;


***REMOVED***
***REMOVED*** Whether the number of rows in the picker should be automatically determined
***REMOVED*** by the specified number of columns so as to minimize/eliminate jitter when
***REMOVED*** switching between tabs.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.autoSizeByColumnCount_ = true;


***REMOVED***
***REMOVED*** Location of the tabs for the picker tabpane.
***REMOVED***
***REMOVED*** @type {goog.ui.TabPane.TabLocation}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.tabLocation_ =
    goog.ui.emoji.EmojiPicker.DEFAULT_TAB_LOCATION;


***REMOVED***
***REMOVED*** Whether the component is focusable.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.focusable_ = true;


***REMOVED***
***REMOVED*** Url of the img that should be used for cells in the emoji picker that are
***REMOVED*** not filled with emoji, i.e., after all the emoji have already been placed
***REMOVED*** on a page.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.defaultImgUrl_;


***REMOVED***
***REMOVED*** If present, indicates a prefix that should be prepended to all URLs
***REMOVED*** of images in this emojipicker. This provides an optimization if the URLs
***REMOVED*** are long, so that the client does not have to send a long string for each
***REMOVED*** emoji.
***REMOVED***
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.urlPrefix_;


***REMOVED***
***REMOVED*** If true, delay loading the images for the emojipalettes until after
***REMOVED*** construction. This gives a better user experience before the images are in
***REMOVED*** the cache, since other widgets waiting for construction of the emojipalettes
***REMOVED*** won't have to wait for all the images (which may be a substantial amount) to
***REMOVED*** load.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.delayedLoad_ = false;


***REMOVED***
***REMOVED*** Whether to use progressive rendering in the emojipicker's palette, if using
***REMOVED*** sprited imgs. If true, then uses img tags, which most browsers render
***REMOVED*** progressively (i.e., as the data comes in). If false, then uses div tags
***REMOVED*** with the background-image, which some newer browsers render progressively
***REMOVED*** but older ones do not.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.progressiveRender_ = false;


***REMOVED***
***REMOVED*** Whether to require the caller to manually specify when to start loading
***REMOVED*** animated emoji. This is primarily for unittests to be able to test the
***REMOVED*** structure of the emojipicker palettes before and after the animated emoji
***REMOVED*** have been loaded.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.manualLoadOfAnimatedEmoji_ = false;


***REMOVED***
***REMOVED*** Index of the active page in the picker.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.activePage_ = -1;


***REMOVED***
***REMOVED*** Adds a group of emoji to the picker.
***REMOVED***
***REMOVED*** @param {string|Element} title Title for the group.
***REMOVED*** @param {Array.<Array.<string>>} emojiGroup A new group of emoji to be added
***REMOVED***    Each internal array contains [emojiUrl, emojiId].
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.addEmojiGroup =
    function(title, emojiGroup) {
  this.emoji_.push({title: title, emoji: emojiGroup});
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number of rows per grid in the emoji picker.
***REMOVED***
***REMOVED*** @return {number} number of rows per grid.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getNumRows = function() {
  return this.numRows_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number of columns per grid in the emoji picker.
***REMOVED***
***REMOVED*** @return {number} number of columns per grid.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getNumColumns = function() {
  return this.numCols_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of rows per grid in the emoji picker. This should only be
***REMOVED*** called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {number} numRows Number of rows per grid.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setNumRows = function(numRows) {
  this.numRows_ = numRows;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of columns per grid in the emoji picker. This should only be
***REMOVED*** called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {number} numCols Number of columns per grid.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setNumColumns = function(numCols) {
  this.numCols_ = numCols;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to automatically size the emojipicker based on the number of
***REMOVED*** columns and the number of emoji in each group, so as to reduce jitter.
***REMOVED***
***REMOVED*** @param {boolean} autoSize Whether to automatically size the picker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setAutoSizeByColumnCount =
    function(autoSize) {
  this.autoSizeByColumnCount_ = autoSize;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the location of the tabs in relation to the emoji grids. This should
***REMOVED*** only be called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane.TabLocation} tabLocation The location of the tabs.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setTabLocation = function(tabLocation) {
  this.tabLocation_ = tabLocation;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether loading of images should be delayed until after dom creation.
***REMOVED*** Thus, this function must be called before {@link #createDom}. If set to true,
***REMOVED*** the client must call {@link #loadImages} when they wish the images to be
***REMOVED*** loaded.
***REMOVED***
***REMOVED*** @param {boolean} shouldDelay Whether to delay loading the images.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setDelayedLoad = function(shouldDelay) {
  this.delayedLoad_ = shouldDelay;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to require the caller to manually specify when to start loading
***REMOVED*** animated emoji. This is primarily for unittests to be able to test the
***REMOVED*** structure of the emojipicker palettes before and after the animated emoji
***REMOVED*** have been loaded. This only affects sprited emojipickers with sprite data
***REMOVED*** for animated emoji.
***REMOVED***
***REMOVED*** @param {boolean} manual Whether to load animated emoji manually.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setManualLoadOfAnimatedEmoji =
    function(manual) {
  this.manualLoadOfAnimatedEmoji_ = manual;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is focusable, false otherwise.  The default
***REMOVED*** is true.  Focusable components always have a tab index and allocate a key
***REMOVED*** handler to handle keyboard events while focused.
***REMOVED*** @return {boolean} Whether the component is focusable.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.isFocusable = function() {
  return this.focusable_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the component is focusable.  The default is true.
***REMOVED*** Focusable components always have a tab index and allocate a key handler to
***REMOVED*** handle keyboard events while focused.
***REMOVED*** @param {boolean} focusable Whether the component is focusable.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setFocusable = function(focusable) {
  this.focusable_ = focusable;
  for (var i = 0; i < this.pages_.length; i++) {
    if (this.pages_[i]) {
      this.pages_[i].setSupportedState(goog.ui.Component.State.FOCUSED,
                                       focusable);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the URL prefix for the emoji URLs.
***REMOVED***
***REMOVED*** @param {string} urlPrefix Prefix that should be prepended to all URLs.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setUrlPrefix = function(urlPrefix) {
  this.urlPrefix_ = urlPrefix;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the progressive rendering aspect of this emojipicker. Must be called
***REMOVED*** before createDom to have an effect.
***REMOVED***
***REMOVED*** @param {boolean} progressive Whether this picker should render progressively.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.setProgressiveRender =
    function(progressive) {
  this.progressiveRender_ = progressive;
***REMOVED***


***REMOVED***
***REMOVED*** Logger for the emoji picker.
***REMOVED***
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.logger_ =
    goog.log.getLogger('goog.ui.emoji.EmojiPicker');


***REMOVED***
***REMOVED*** Adjusts the number of rows to be the maximum row count out of all the emoji
***REMOVED*** groups, in order to prevent jitter in switching among the tabs.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.adjustNumRowsIfNecessary_ = function() {
  var currentMax = 0;

  for (var i = 0; i < this.emoji_.length; i++) {
    var numEmoji = this.emoji_[i].emoji.length;
    var rowsNeeded = Math.ceil(numEmoji / this.numCols_);
    if (rowsNeeded > currentMax) {
      currentMax = rowsNeeded;
    }
  }

  this.setNumRows(currentMax);
***REMOVED***


***REMOVED***
***REMOVED*** Causes the emoji imgs to be loaded into the picker. Used for delayed loading.
***REMOVED*** No-op if delayed loading is not set.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.loadImages = function() {
  if (!this.delayedLoad_) {
    return;
  }

  // Load the first page only
  this.loadPage_(0);
  this.activePage_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @suppress {deprecated} Using deprecated goog.ui.TabPane.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.createDom = function() {
  this.setElementInternal(this.getDomHelper().createDom('div'));

  if (this.autoSizeByColumnCount_) {
    this.adjustNumRowsIfNecessary_();
  }

  if (this.emoji_.length == 0) {
    throw Error('Must add some emoji to the picker');
  }

  // If there is more than one group of emoji, we construct a tabpane
  if (this.emoji_.length > 1) {
    // Give the tabpane a div to use as its content element, since tabpane
    // overwrites the CSS class of the element it's passed
    var div = this.getDomHelper().createDom('div');
    this.getElement().appendChild(div);
    this.tabPane_ = new goog.ui.TabPane(div,
                                        this.tabLocation_,
                                        this.getDomHelper(),
                                        true  /* use MOUSEDOWN***REMOVED***);
  }

  this.renderer_ = this.progressiveRender_ ?
      new goog.ui.emoji.ProgressiveEmojiPaletteRenderer(this.defaultImgUrl_) :
      new goog.ui.emoji.EmojiPaletteRenderer(this.defaultImgUrl_);

  for (var i = 0; i < this.emoji_.length; i++) {
    var emoji = this.emoji_[i].emoji;
    var page = this.delayedLoad_ ?
               this.createPlaceholderEmojiPage_(emoji) :
               this.createEmojiPage_(emoji, i);
    this.pages_.push(page);
  }

  this.activePage_ = 0;
  this.getElement().tabIndex = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Used by unittests to manually load the animated emoji for this picker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.manuallyLoadAnimatedEmoji = function() {
  for (var i = 0; i < this.pages_.length; i++) {
    this.pages_[i].loadAnimatedEmoji();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a page if it has not already been loaded. This has the side effects
***REMOVED*** of setting the load status of the page to true.
***REMOVED***
***REMOVED*** @param {Array.<Array.<string>>} emoji Emoji for this page. See
***REMOVED***     {@link addEmojiGroup} for more details.
***REMOVED*** @param {number} index Index of the page in the emojipicker.
***REMOVED*** @return {goog.ui.emoji.EmojiPalette} the emoji page.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.createEmojiPage_ = function(emoji, index) {
  // Safeguard against trying to create the same page twice
  if (this.pageLoadStatus_[index]) {
    return null;
  }

  var palette = new goog.ui.emoji.EmojiPalette(emoji,
                                               this.urlPrefix_,
                                               this.renderer_,
                                               this.getDomHelper());
  if (!this.manualLoadOfAnimatedEmoji_) {
    palette.loadAnimatedEmoji();
  }
  palette.setSize(this.numCols_, this.numRows_);
  palette.setSupportedState(goog.ui.Component.State.FOCUSED, this.focusable_);
  palette.createDom();
  palette.setParent(this);

  this.pageLoadStatus_[index] = true;

  return palette;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of emoji whose real URLs have been replaced with the
***REMOVED*** default img URL. Used for delayed loading.
***REMOVED***
***REMOVED*** @param {Array.<Array.<string>>} emoji Original emoji array.
***REMOVED*** @return {!Array.<!Array.<string>>} emoji array with all emoji pointing to the
***REMOVED***     default img.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getPlaceholderEmoji_ = function(emoji) {
  var placeholderEmoji = [];

  for (var i = 0; i < emoji.length; i++) {
    placeholderEmoji.push([this.defaultImgUrl_, emoji[i][1]]);
  }

  return placeholderEmoji;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an emoji page using placeholder emoji pointing to the default
***REMOVED*** img instead of the real emoji. Used for delayed loading.
***REMOVED***
***REMOVED*** @param {Array.<Array.<string>>} emoji Emoji for this page. See
***REMOVED***     {@link addEmojiGroup} for more details.
***REMOVED*** @return {!goog.ui.emoji.EmojiPalette} the emoji page.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.createPlaceholderEmojiPage_ =
    function(emoji) {
  var placeholderEmoji = this.getPlaceholderEmoji_(emoji);

  var palette = new goog.ui.emoji.EmojiPalette(placeholderEmoji,
                                               null,  // no url prefix
                                               this.renderer_,
                                               this.getDomHelper());
  palette.setSize(this.numCols_, this.numRows_);
  palette.setSupportedState(goog.ui.Component.State.FOCUSED, this.focusable_);
  palette.createDom();
  palette.setParent(this);

  return palette;
***REMOVED***


***REMOVED***
***REMOVED*** EmojiPickers cannot be used to decorate pre-existing html, since the
***REMOVED*** structure they build is fairly complicated.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Returns always false.
***REMOVED*** @override
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.canDecorate = function(element) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @suppress {deprecated} Using deprecated goog.ui.TabPane.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.enterDocument = function() {
  goog.ui.emoji.EmojiPicker.superClass_.enterDocument.call(this);

  for (var i = 0; i < this.pages_.length; i++) {
    this.pages_[i].enterDocument();
    var pageElement = this.pages_[i].getElement();

    // Add a new tab to the tabpane if there's more than one group of emoji.
    // If there is just one group of emoji, then we simply use the single
    // page's element as the content for the picker
    if (this.pages_.length > 1) {
      // Create a simple default title containg the page number if the title
      // was not provided in the emoji group params
      var title = this.emoji_[i].title || (i + 1);
      this.tabPane_.addPage(new goog.ui.TabPane.TabPage(
          pageElement, title, this.getDomHelper()));
    } else {
      this.getElement().appendChild(pageElement);
    }
  }

  // Initialize listeners. Note that we need to initialize this listener
  // after createDom, because addPage causes the goog.ui.TabPane.Events.CHANGE
  // event to fire, but we only want the handler (which loads delayed images)
  // to run after the picker has been constructed.
  if (this.tabPane_) {
    this.getHandler().listen(
        this.tabPane_, goog.ui.TabPane.Events.CHANGE, this.onPageChanged_);

    // Make the tabpane unselectable so that changing tabs doesn't disturb the
    // cursor
    goog.style.setUnselectable(this.tabPane_.getElement(), true);
  }

  this.getElement().unselectable = 'on';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.exitDocument = function() {
  goog.ui.emoji.EmojiPicker.superClass_.exitDocument.call(this);
  for (var i = 0; i < this.pages_.length; i++) {
    this.pages_[i].exitDocument();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.disposeInternal = function() {
  goog.ui.emoji.EmojiPicker.superClass_.disposeInternal.call(this);

  if (this.tabPane_) {
    this.tabPane_.dispose();
    this.tabPane_ = null;
  }

  for (var i = 0; i < this.pages_.length; i++) {
    this.pages_[i].dispose();
  }
  this.pages_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} CSS class for the root element of EmojiPicker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getCssClass = function() {
  return goog.getCssName('goog-ui-emojipicker');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently selected emoji from this picker. If the picker is
***REMOVED*** using the URL prefix optimization, allocates a new emoji object with the
***REMOVED*** full URL. This method is meant to be used by clients of the emojipicker,
***REMOVED*** e.g., in a listener on goog.ui.component.EventType.ACTION that wants to use
***REMOVED*** the just-selected emoji.
***REMOVED***
***REMOVED*** @return {goog.ui.emoji.Emoji} The currently selected emoji from this picker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getSelectedEmoji = function() {
  return this.urlPrefix_ ?
      new goog.ui.emoji.Emoji(this.urlPrefix_ + this.selectedEmoji_.getId(),
                              this.selectedEmoji_.getId()) :
      this.selectedEmoji_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of emoji groups in this picker.
***REMOVED***
***REMOVED*** @return {number} The number of emoji groups in this picker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getNumEmojiGroups = function() {
  return this.emoji_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a page from the picker. This should be considered protected, and is
***REMOVED*** ONLY FOR TESTING.
***REMOVED***
***REMOVED*** @param {number} index Index of the page to return.
***REMOVED*** @return {goog.ui.emoji.EmojiPalette?} the page at the specified index or null
***REMOVED***     if none exists.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getPage = function(index) {
  return this.pages_[index];
***REMOVED***


***REMOVED***
***REMOVED*** Returns all the pages from the picker. This should be considered protected,
***REMOVED*** and is ONLY FOR TESTING.
***REMOVED***
***REMOVED*** @return {Array.<goog.ui.emoji.EmojiPalette>?} the pages in the picker or
***REMOVED***     null if none exist.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getPages = function() {
  return this.pages_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tabpane if this is a multipage picker. This should be considered
***REMOVED*** protected, and is ONLY FOR TESTING.
***REMOVED***
***REMOVED*** @return {goog.ui.TabPane} the tabpane if it is a multipage picker,
***REMOVED***     or null if it does not exist or is a single page picker.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getTabPane = function() {
  return this.tabPane_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.emoji.EmojiPalette} The active page of the emoji picker.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.getActivePage_ = function() {
  return this.pages_[this.activePage_];
***REMOVED***


***REMOVED***
***REMOVED*** Handles actions from the EmojiPalettes that this picker contains.
***REMOVED***
***REMOVED*** @param {goog.ui.Component.EventType} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.onEmojiPaletteAction_ = function(e) {
  this.selectedEmoji_ = this.getActivePage_().getSelectedEmoji();
***REMOVED***


***REMOVED***
***REMOVED*** Handles changes in the active page in the tabpane.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPaneEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.onPageChanged_ = function(e) {
  var index =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (e.page.getIndex());
  this.loadPage_(index);
  this.activePage_ = index;
***REMOVED***


***REMOVED***
***REMOVED*** Loads a page into the picker if it has not yet been loaded.
***REMOVED***
***REMOVED*** @param {number} index Index of the page to load.
***REMOVED*** @private
***REMOVED*** @suppress {deprecated} Using deprecated goog.ui.TabPane.
***REMOVED***
goog.ui.emoji.EmojiPicker.prototype.loadPage_ = function(index) {
  if (index < 0 || index > this.pages_.length) {
    throw Error('Index out of bounds');
  }

  if (!this.pageLoadStatus_[index]) {
    var oldPage = this.pages_[index];
    this.pages_[index] = this.createEmojiPage_(this.emoji_[index].emoji,
                                               index);
    this.pages_[index].enterDocument();
    var pageElement = this.pages_[index].getElement();
    if (this.pages_.length > 1) {
      this.tabPane_.removePage(index);
      var title = this.emoji_[index].title || (index + 1);
      this.tabPane_.addPage(new goog.ui.TabPane.TabPage(
          pageElement, title, this.getDomHelper()), index);
      this.tabPane_.setSelectedIndex(index);
    } else {
      var el = this.getElement();
      el.appendChild(pageElement);
    }
    if (oldPage) {
      oldPage.dispose();
    }
  }
***REMOVED***
