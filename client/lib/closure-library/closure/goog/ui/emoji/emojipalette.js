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
***REMOVED*** @fileoverview Emoji Palette implementation. This provides a UI widget for
***REMOVED*** choosing an emoji from a palette of possible choices. EmojiPalettes are
***REMOVED*** contained within EmojiPickers.
***REMOVED***
***REMOVED*** See ../demos/popupemojipicker.html for an example of how to instantiate
***REMOVED*** an emoji picker.
***REMOVED***
***REMOVED*** Based on goog.ui.ColorPicker (colorpicker.js).
***REMOVED***
***REMOVED***

goog.provide('goog.ui.emoji.EmojiPalette');

***REMOVED***
goog.require('goog.net.ImageLoader');
goog.require('goog.ui.Palette');
goog.require('goog.ui.emoji.Emoji');
goog.require('goog.ui.emoji.EmojiPaletteRenderer');



***REMOVED***
***REMOVED*** A page of emoji to be displayed in an EmojiPicker.
***REMOVED***
***REMOVED*** @param {Array.<Array>} emoji List of emoji for this page.
 ***REMOVED*** @param {?string=} opt_urlPrefix Prefix that should be prepended to all URL.
***REMOVED*** @param {goog.ui.PaletteRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the palette; defaults to {@link goog.ui.PaletteRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Palette}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.emoji.EmojiPalette = function(emoji,
                                      opt_urlPrefix,
                                      opt_renderer,
                                      opt_domHelper) {
  goog.ui.Palette.call(this,
                       null,
                       opt_renderer ||
                       new goog.ui.emoji.EmojiPaletteRenderer(null),
                       opt_domHelper);
 ***REMOVED*****REMOVED***
  ***REMOVED*** All the different emoji that this palette can display. Maps emoji ids
  ***REMOVED*** (string) to the goog.ui.emoji.Emoji for that id.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.emojiCells_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of emoji id to index into this.emojiCells_.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.emojiMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of the animated emoji in this palette. Each internal array is of type
  ***REMOVED*** [HTMLDivElement, goog.ui.emoji.Emoji], and represents the palette item
  ***REMOVED*** for that animated emoji, and the Emoji object.
  ***REMOVED***
  ***REMOVED*** @type {Array.<Array.<(HTMLDivElement|goog.ui.emoji.Emoji)>>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.animatedEmoji_ = [];

  this.urlPrefix_ = opt_urlPrefix || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Palette items that are displayed on this page of the emoji picker. Each
  ***REMOVED*** item is a div wrapped around a div or an img.
  ***REMOVED***
  ***REMOVED*** @type {Array.<HTMLDivElement>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.emoji_ = this.getEmojiArrayFromProperties_(emoji);

  this.setContent(this.emoji_);
***REMOVED***
goog.inherits(goog.ui.emoji.EmojiPalette, goog.ui.Palette);


***REMOVED***
***REMOVED*** Indicates a prefix that should be prepended to all URLs of images in this
***REMOVED*** emojipalette. This provides an optimization if the URLs are long, so that
***REMOVED*** the client does not have to send a long string for each emoji.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.urlPrefix_ = '';


***REMOVED***
***REMOVED*** Whether the emoji images have been loaded.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.imagesLoaded_ = false;


***REMOVED***
***REMOVED*** Image loader for loading animated emoji.
***REMOVED***
***REMOVED*** @type {goog.net.ImageLoader}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.imageLoader_;


***REMOVED***
***REMOVED*** Helps create an array of emoji palette items from an array of emoji
***REMOVED*** properties. Each element will be either a div with background-image set to
***REMOVED*** a sprite, or an img element pointing directly to an emoji, and all elements
***REMOVED*** are wrapped with an outer div for alignment issues (i.e., this allows
***REMOVED*** centering the inner div).
***REMOVED***
***REMOVED*** @param {Object} emojiGroup The group of emoji for this page.
***REMOVED*** @return {!Array.<!HTMLDivElement>} The emoji items.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getEmojiArrayFromProperties_ =
    function(emojiGroup) {
  var emojiItems = [];

  for (var i = 0; i < emojiGroup.length; i++) {
    var url = emojiGroup[i][0];
    var id = emojiGroup[i][1];
    var spriteInfo = emojiGroup[i][2];
    var displayUrl = spriteInfo ? spriteInfo.getUrl() :
                     this.urlPrefix_ + url;

    var item = this.getRenderer().createPaletteItem(
        this.getDomHelper(), id, spriteInfo, displayUrl);
    emojiItems.push(item);

    var emoji = new goog.ui.emoji.Emoji(url, id);
    this.emojiCells_[id] = emoji;
    this.emojiMap_[id] = i;

    // Keep track of sprited emoji that are animated, for later loading.
    if (spriteInfo && spriteInfo.isAnimated()) {
      this.animatedEmoji_.push([item, emoji]);
    }
  }

  // Create the image loader now so that tests can access it before it has
  // started loading images.
  if (this.animatedEmoji_.length > 0) {
    this.imageLoader_ = new goog.net.ImageLoader();
  }

  this.imagesLoaded_ = true;
  return emojiItems;
***REMOVED***


***REMOVED***
***REMOVED*** Sends off requests for all the animated emoji and replaces their static
***REMOVED*** sprites when the images are done downloading.
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.loadAnimatedEmoji = function() {
  if (this.animatedEmoji_.length > 0) {
    for (var i = 0; i < this.animatedEmoji_.length; i++) {
      var paletteItem =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.animatedEmoji_[i][0]);
      var emoji =
         ***REMOVED*****REMOVED*** @type {goog.ui.emoji.Emoji}***REMOVED*** (this.animatedEmoji_[i][1]);
      var url = this.urlPrefix_ + emoji.getUrl();

      this.imageLoader_.addImage(emoji.getId(), url);
    }

    this.getHandler().listen(this.imageLoader_, goog.events.EventType.LOAD,
        this.handleImageLoad_);
    this.imageLoader_.start();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles image load events from the ImageLoader.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.handleImageLoad_ = function(e) {
  var id = e.target.id;
  var url = e.target.src;
  // Just to be safe, we check to make sure we have an id and src url from
  // the event target, which the ImageLoader sets to an Image object.
  if (id && url) {
    var item = this.emoji_[this.emojiMap_[id]];
    if (item) {
      this.getRenderer().updateAnimatedPaletteItem(item, e.target);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the image loader that this palette uses. Used for testing.
***REMOVED***
***REMOVED*** @return {goog.net.ImageLoader} the image loader.
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getImageLoader = function() {
  return this.imageLoader_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.disposeInternal = function() {
  goog.ui.emoji.EmojiPalette.superClass_.disposeInternal.call(this);

  if (this.imageLoader_) {
    this.imageLoader_.dispose();
    this.imageLoader_ = null;
  }
  this.animatedEmoji_ = null;
  this.emojiCells_ = null;
  this.emojiMap_ = null;
  this.emoji_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a goomoji id from an img or the containing td, or null if none
***REMOVED*** exists for that element.
***REMOVED***
***REMOVED*** @param {Element} el The element to get the Goomoji id from.
***REMOVED*** @return {?string} A goomoji id from an img or the containing td, or null if
***REMOVED***     none exists for that element.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getGoomojiIdFromElement_ = function(el) {
  if (!el) {
    return null;
  }

  var item = this.getRenderer().getContainingItem(this, el);
  return item ? item.getAttribute(goog.ui.emoji.Emoji.ATTRIBUTE) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.emoji.Emoji} The currently selected emoji from this palette.
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getSelectedEmoji = function() {
  var elem =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getSelectedItem());
  var goomojiId = this.getGoomojiIdFromElement_(elem);
  return this.emojiCells_[goomojiId];
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of emoji managed by this palette.
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getNumberOfEmoji = function() {
  return this.emojiCells_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the index of the specified emoji within this palette.
***REMOVED***
***REMOVED*** @param {string} id Id of the emoji to look up.
***REMOVED*** @return {number} The index of the specified emoji within this palette.
***REMOVED***
goog.ui.emoji.EmojiPalette.prototype.getEmojiIndex = function(id) {
  return this.emojiMap_[id];
***REMOVED***
