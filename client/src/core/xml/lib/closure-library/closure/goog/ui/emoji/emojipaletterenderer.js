// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Emoji Palette renderer implementation.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.emoji.EmojiPaletteRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.dom');
goog.require('goog.ui.PaletteRenderer');
goog.require('goog.ui.emoji.Emoji');
goog.require('goog.ui.emoji.SpriteInfo');



***REMOVED***
***REMOVED*** Renders an emoji palette.
***REMOVED***
***REMOVED*** @param {?string} defaultImgUrl Url of the img that should be used to fill up
***REMOVED***     the cells in the emoji table, to prevent jittering. Will be stretched
***REMOVED***     to the emoji cell size. A good image is a transparent dot.
***REMOVED***
***REMOVED*** @extends {goog.ui.PaletteRenderer}
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer = function(defaultImgUrl) {
  goog.ui.PaletteRenderer.call(this);

  this.defaultImgUrl_ = defaultImgUrl;
***REMOVED***
goog.inherits(goog.ui.emoji.EmojiPaletteRenderer, goog.ui.PaletteRenderer);


***REMOVED***
***REMOVED*** Globally unique ID sequence for cells rendered by this renderer class.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.cellId_ = 0;


***REMOVED***
***REMOVED*** Url of the img that should be used for cells in the emoji palette that are
***REMOVED*** not filled with emoji, i.e., after all the emoji have already been placed
***REMOVED*** on a page.
***REMOVED***
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.defaultImgUrl_ = null;


***REMOVED*** @override***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.getCssClass = function() {
  return goog.getCssName('goog-ui-emojipalette');
***REMOVED***


***REMOVED***
***REMOVED*** Creates a palette item from the given emoji data.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for constructing DOM elements.
***REMOVED*** @param {string} id Goomoji id for the emoji.
***REMOVED*** @param {goog.ui.emoji.SpriteInfo} spriteInfo Spriting info for the emoji.
***REMOVED*** @param {string} displayUrl URL of the image served for this cell, whether
***REMOVED***     an individual emoji image or a sprite.
***REMOVED*** @return {HTMLDivElement} The palette item for this emoji.
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.createPaletteItem =
    function(dom, id, spriteInfo, displayUrl) {
  var el;

  if (spriteInfo) {
    var cssClass = spriteInfo.getCssClass();
    if (cssClass) {
      el = dom.createDom('div', cssClass);
    } else {
      el = this.buildElementFromSpriteMetadata(dom, spriteInfo, displayUrl);
    }
  } else {
    el = dom.createDom('img', {'src': displayUrl});
  }

  var outerdiv =
      dom.createDom('div', goog.getCssName('goog-palette-cell-wrapper'), el);
  outerdiv.setAttribute(goog.ui.emoji.Emoji.ATTRIBUTE, id);
  return***REMOVED*****REMOVED*** @type {HTMLDivElement}***REMOVED*** (outerdiv);
***REMOVED***


***REMOVED***
***REMOVED*** Modifies a palette item containing an animated emoji, in response to the
***REMOVED*** animated emoji being successfully downloaded.
***REMOVED***
***REMOVED*** @param {Element} item The palette item to update.
***REMOVED*** @param {Image} animatedImg An Image object containing the animated emoji.
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.updateAnimatedPaletteItem =
    function(item, animatedImg) {
  // An animated emoji is one that had sprite info for a static version and is
  // now being updated. See createPaletteItem for the structure of the palette
  // items we're modifying.

  var inner =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (item.firstChild);

  // The first case is a palette item with a CSS class representing the sprite,
  // and an animated emoji.
  var classes = goog.dom.classes.get(inner);
  if (classes && classes.length == 1) {
    inner.className = '';
  }

  goog.style.setStyle(inner, {
    'width': animatedImg.width,
    'height': animatedImg.height,
    'background-image': 'url(' + animatedImg.src + ')',
    'background-position': '0 0'
  });
***REMOVED***


***REMOVED***
***REMOVED*** Builds the inner contents of a palette item out of sprite metadata.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for constructing DOM elements.
***REMOVED*** @param {goog.ui.emoji.SpriteInfo} spriteInfo The metadata to create the css
***REMOVED***     for the sprite.
***REMOVED*** @param {string} displayUrl The URL of the image for this cell.
***REMOVED*** @return {HTMLDivElement} The inner element for a palette item.
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.buildElementFromSpriteMetadata =
    function(dom, spriteInfo, displayUrl) {
  var width = spriteInfo.getWidthCssValue();
  var height = spriteInfo.getHeightCssValue();
  var x = spriteInfo.getXOffsetCssValue();
  var y = spriteInfo.getYOffsetCssValue();

  var el = dom.createDom('div');
  goog.style.setStyle(el, {
    'width': width,
    'height': height,
    'background-image': 'url(' + displayUrl + ')',
    'background-repeat': 'no-repeat',
    'background-position': x + ' ' + y
  });

  return***REMOVED*****REMOVED*** @type {HTMLDivElement}***REMOVED*** (el);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.createCell = function(node, dom) {
  // Create a cell with  the default img if we're out of items, in order to
  // prevent jitter in the table. If there's no default img url, just create an
  // empty div, to prevent trying to fetch a null url.
  if (!node) {
    var elem = this.defaultImgUrl_ ?
               dom.createDom('img', {'src': this.defaultImgUrl_}) :
               dom.createDom('div');
    node = dom.createDom('div', goog.getCssName('goog-palette-cell-wrapper'),
                         elem);
  }

  var cell = dom.createDom('td', {
    'class': goog.getCssName(this.getCssClass(), 'cell'),
    // Cells must have an ID, for accessibility, so we generate one here.
    'id': this.getCssClass() + '-cell-' +
        goog.ui.emoji.EmojiPaletteRenderer.cellId_++
  }, node);
  goog.a11y.aria.setRole(cell, 'gridcell');
  return cell;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the item corresponding to the given node, or null if the node is
***REMOVED*** neither a palette cell nor part of a palette item.
***REMOVED*** @param {goog.ui.Palette} palette Palette in which to look for the item.
***REMOVED*** @param {Node} node Node to look for.
***REMOVED*** @return {Node} The corresponding palette item (null if not found).
***REMOVED*** @override
***REMOVED***
goog.ui.emoji.EmojiPaletteRenderer.prototype.getContainingItem =
    function(palette, node) {
  var root = palette.getElement();
  while (node && node.nodeType == goog.dom.NodeType.ELEMENT && node != root) {
    if (node.tagName == 'TD') {
      return node.firstChild;
    }
    node = node.parentNode;
  }

  return null;
***REMOVED***
