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
***REMOVED*** @fileoverview Popup Emoji Picker implementation. This provides a UI widget
***REMOVED*** for choosing an emoji from a grid of possible choices. The widget is a popup,
***REMOVED*** so it is suitable for a toolbar, for instance the TrogEdit toolbar.
***REMOVED***
***REMOVED*** @see ../demos/popupemojipicker.html for an example of how to instantiate
***REMOVED*** an emoji picker.
***REMOVED***
***REMOVED*** See goog.ui.emoji.EmojiPicker in emojipicker.js for more details.
***REMOVED***
***REMOVED*** Based on goog.ui.PopupColorPicker (popupcolorpicker.js).
***REMOVED***
***REMOVED*** @see ../../demos/popupemojipicker.html
***REMOVED***

goog.provide('goog.ui.emoji.PopupEmojiPicker');

***REMOVED***
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Component');
goog.require('goog.ui.Popup');
goog.require('goog.ui.emoji.EmojiPicker');



***REMOVED***
***REMOVED*** Constructs a popup emoji picker widget.
***REMOVED***
***REMOVED*** @param {string} defaultImgUrl Url of the img that should be used to fill up
***REMOVED***     the cells in the emoji table, to prevent jittering. Should be the same
***REMOVED***     size as the emoji.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.emoji.PopupEmojiPicker =
    function(defaultImgUrl, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

  this.emojiPicker_ = new goog.ui.emoji.EmojiPicker(defaultImgUrl,
                                                    opt_domHelper);
  this.addChild(this.emojiPicker_);

  this.getHandler().listen(this.emojiPicker_,
      goog.ui.Component.EventType.ACTION, this.onEmojiPicked_);
***REMOVED***
goog.inherits(goog.ui.emoji.PopupEmojiPicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Instance of an emoji picker control.
***REMOVED*** @type {goog.ui.emoji.EmojiPicker}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.emojiPicker_ = null;


***REMOVED***
***REMOVED*** Instance of goog.ui.Popup used to manage the behavior of the emoji picker.
***REMOVED*** @type {goog.ui.Popup}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.popup_ = null;


***REMOVED***
***REMOVED*** Reference to the element that triggered the last popup.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.lastTarget_ = null;


***REMOVED***
***REMOVED*** Whether the emoji picker can accept focus.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.focusable_ = true;


***REMOVED***
***REMOVED*** If true, then the emojipicker will toggle off if it is already visible.
***REMOVED*** Default is true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.toggleMode_ = true;


***REMOVED***
***REMOVED*** Adds a group of emoji to the picker.
***REMOVED***
***REMOVED*** @param {string|Element} title Title for the group.
***REMOVED*** @param {Array.<Array>} emojiGroup A new group of emoji to be added. Each
***REMOVED***    internal array contains [emojiUrl, emojiId].
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.addEmojiGroup =
    function(title, emojiGroup) {
  this.emojiPicker_.addEmojiGroup(title, emojiGroup);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the emoji picker should toggle if it is already open.
***REMOVED*** @param {boolean} toggle The toggle mode to use.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setToggleMode = function(toggle) {
  this.toggleMode_ = toggle;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the emojipicker is in toggle mode
***REMOVED*** @return {boolean} toggle.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getToggleMode = function() {
  return this.toggleMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether loading of images should be delayed until after dom creation.
***REMOVED*** Thus, this function must be called before {@link #createDom}. If set to true,
***REMOVED*** the client must call {@link #loadImages} when they wish the images to be
***REMOVED*** loaded.
***REMOVED***
***REMOVED*** @param {boolean} shouldDelay Whether to delay loading the images.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setDelayedLoad =
    function(shouldDelay) {
  if (this.emojiPicker_) {
    this.emojiPicker_.setDelayedLoad(shouldDelay);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the emoji picker can accept focus.
***REMOVED*** @param {boolean} focusable Whether the emoji picker should accept focus.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setFocusable = function(focusable) {
  this.focusable_ = focusable;
  if (this.emojiPicker_) {
    // TODO(user): In next revision sort the behavior of passing state to
    // children correctly
    this.emojiPicker_.setFocusable(focusable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the URL prefix for the emoji URLs.
***REMOVED***
***REMOVED*** @param {string} urlPrefix Prefix that should be prepended to all URLs.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setUrlPrefix = function(urlPrefix) {
  this.emojiPicker_.setUrlPrefix(urlPrefix);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the location of the tabs in relation to the emoji grids. This should
***REMOVED*** only be called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane.TabLocation} tabLocation The location of the tabs.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setTabLocation =
    function(tabLocation) {
  this.emojiPicker_.setTabLocation(tabLocation);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of rows per grid in the emoji picker. This should only be
***REMOVED*** called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {number} numRows Number of rows per grid.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setNumRows = function(numRows) {
  this.emojiPicker_.setNumRows(numRows);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of columns per grid in the emoji picker. This should only be
***REMOVED*** called before the picker has been rendered.
***REMOVED***
***REMOVED*** @param {number} numCols Number of columns per grid.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setNumColumns = function(numCols) {
  this.emojiPicker_.setNumColumns(numCols);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the progressive rendering aspect of this emojipicker. Must be called
***REMOVED*** before createDom to have an effect.
***REMOVED***
***REMOVED*** @param {boolean} progressive Whether the picker should render progressively.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setProgressiveRender =
    function(progressive) {
  if (this.emojiPicker_) {
    this.emojiPicker_.setProgressiveRender(progressive);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of emoji groups in this picker.
***REMOVED***
***REMOVED*** @return {number} The number of emoji groups in this picker.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getNumEmojiGroups = function() {
  return this.emojiPicker_.getNumEmojiGroups();
***REMOVED***


***REMOVED***
***REMOVED*** Causes the emoji imgs to be loaded into the picker. Used for delayed loading.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.loadImages = function() {
  if (this.emojiPicker_) {
    this.emojiPicker_.loadImages();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.createDom = function() {
  goog.ui.emoji.PopupEmojiPicker.superClass_.createDom.call(this);

  this.emojiPicker_.createDom();

  this.getElement().className = goog.getCssName('goog-ui-popupemojipicker');
  this.getElement().appendChild(this.emojiPicker_.getElement());

  this.popup_ = new goog.ui.Popup(this.getElement());
  this.getElement().unselectable = 'on';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.disposeInternal = function() {
  goog.ui.emoji.PopupEmojiPicker.superClass_.disposeInternal.call(this);
  this.emojiPicker_ = null;
  this.lastTarget_ = null;
  if (this.popup_) {
    this.popup_.dispose();
    this.popup_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the popup emoji picker to an element.
***REMOVED***
***REMOVED*** @param {Element} element The element to attach to.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.attach = function(element) {
  // TODO(user): standardize event type, popups should use MOUSEDOWN, but
  // currently apps are using click.
  this.getHandler().listen(element, goog.events.EventType.CLICK, this.show_);
***REMOVED***


***REMOVED***
***REMOVED*** Detatches the popup emoji picker from an element.
***REMOVED***
***REMOVED*** @param {Element} element The element to detach from.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.detach = function(element) {
  this.getHandler().unlisten(element, goog.events.EventType.CLICK, this.show_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.emoji.EmojiPicker} The emoji picker instance.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getEmojiPicker = function() {
  return this.emojiPicker_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the Popup dismisses itself when the user clicks outside of
***REMOVED*** it.
***REMOVED*** @return {boolean} Whether the Popup autohides on an external click.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getAutoHide = function() {
  return !!this.popup_ && this.popup_.getAutoHide();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Popup dismisses itself when the user clicks outside of it -
***REMOVED*** must be called after the Popup has been created (in createDom()),
***REMOVED*** otherwise it does nothing.
***REMOVED***
***REMOVED*** @param {boolean} autoHide Whether to autohide on an external click.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setAutoHide = function(autoHide) {
  if (this.popup_) {
    this.popup_.setAutoHide(autoHide);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks, or null if it was not set. Null indicates the entire document is
***REMOVED*** the autohide region.
***REMOVED*** @return {Element} The DOM element for autohide, or null if it hasn't been
***REMOVED***     set.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getAutoHideRegion = function() {
  return this.popup_ && this.popup_.getAutoHideRegion();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks - must be called after the Popup has been created (in createDom()),
***REMOVED*** otherwise it does nothing.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element for autohide.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.setAutoHideRegion = function(element) {
  if (this.popup_) {
    this.popup_.setAutoHideRegion(element);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@link goog.ui.PopupBase} from this picker. Returns null if the
***REMOVED*** popup has not yet been created.
***REMOVED***
***REMOVED*** NOTE: This should***REMOVED***ONLY* be called from tests. If called before createDom(),
***REMOVED*** this should return null.
***REMOVED***
***REMOVED*** @return {goog.ui.PopupBase?} The popup, or null if it hasn't been created.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getPopup = function() {
  return this.popup_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The last element that triggered the popup.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getLastTarget = function() {
  return this.lastTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.emoji.Emoji} The currently selected emoji.
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.getSelectedEmoji = function() {
  return this.emojiPicker_.getSelectedEmoji();
***REMOVED***


***REMOVED***
***REMOVED*** Handles click events on the element this picker is attached to and shows the
***REMOVED*** emoji picker in a popup.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.show_ = function(e) {
  if (this.popup_.isOrWasRecentlyVisible() && this.toggleMode_ &&
      this.lastTarget_ == e.currentTarget) {
    this.popup_.setVisible(false);
    return;
  }

  this.lastTarget_ =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (e.currentTarget);
  this.popup_.setPosition(new goog.positioning.AnchoredPosition(
      this.lastTarget_, goog.positioning.Corner.BOTTOM_LEFT));
  this.popup_.setVisible(true);
***REMOVED***


***REMOVED***
***REMOVED*** Handles selection of an emoji.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.PopupEmojiPicker.prototype.onEmojiPicked_ = function(e) {
  this.popup_.setVisible(false);
***REMOVED***
