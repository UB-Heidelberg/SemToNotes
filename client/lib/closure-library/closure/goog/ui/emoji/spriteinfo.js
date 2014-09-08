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
***REMOVED*** @fileoverview SpriteInfo implementation. This is a simple wrapper class to
***REMOVED*** hold CSS metadata needed for sprited emoji.
***REMOVED***
***REMOVED*** @see ../demos/popupemojipicker.html or emojipicker_test.html for examples
***REMOVED*** of how to use this class.
***REMOVED***
***REMOVED***
goog.provide('goog.ui.emoji.SpriteInfo');



***REMOVED***
***REMOVED*** Creates a SpriteInfo object with the specified properties. If the image is
***REMOVED*** sprited via CSS, then only the first parameter needs a value. If the image
***REMOVED*** is sprited via metadata, then the first parameter should be left null.
***REMOVED***
***REMOVED*** @param {?string} cssClass CSS class to properly display the sprited image.
***REMOVED*** @param {string=} opt_url Url of the sprite image.
***REMOVED*** @param {number=} opt_width Width of the image being sprited.
***REMOVED*** @param {number=} opt_height Height of the image being sprited.
***REMOVED*** @param {number=} opt_xOffset Positive x offset of the image being sprited
***REMOVED***     within the sprite.
***REMOVED*** @param {number=} opt_yOffset Positive y offset of the image being sprited
***REMOVED***     within the sprite.
***REMOVED*** @param {boolean=} opt_animated Whether the sprite is animated.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.emoji.SpriteInfo = function(cssClass, opt_url, opt_width, opt_height,
                                    opt_xOffset, opt_yOffset, opt_animated) {
  if (cssClass != null) {
    this.cssClass_ = cssClass;
  } else {
    if (opt_url == undefined || opt_width === undefined ||
        opt_height === undefined || opt_xOffset == undefined ||
        opt_yOffset === undefined) {
      throw Error('Sprite info is not fully specified');
    }

    this.url_ = opt_url;
    this.width_ = opt_width;
    this.height_ = opt_height;
    this.xOffset_ = opt_xOffset;
    this.yOffset_ = opt_yOffset;
  }

  this.animated_ = !!opt_animated;
***REMOVED***


***REMOVED***
***REMOVED*** Name of the CSS class to properly display the sprited image.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.cssClass_;


***REMOVED***
***REMOVED*** Url of the sprite image.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.url_;


***REMOVED***
***REMOVED*** Width of the image being sprited.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.width_;


***REMOVED***
***REMOVED*** Height of the image being sprited.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.height_;


***REMOVED***
***REMOVED*** Positive x offset of the image being sprited within the sprite.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.xOffset_;


***REMOVED***
***REMOVED*** Positive y offset of the image being sprited within the sprite.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.yOffset_;


***REMOVED***
***REMOVED*** Whether the emoji specified by the sprite is animated.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.animated_;


***REMOVED***
***REMOVED*** Returns the css class of the sprited image.
***REMOVED*** @return {?string} Name of the CSS class to properly display the sprited
***REMOVED***     image.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getCssClass = function() {
  return this.cssClass_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the url of the sprite image.
***REMOVED*** @return {?string} Url of the sprite image.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getUrl = function() {
  return this.url_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the emoji specified by this sprite is animated.
***REMOVED*** @return {boolean} Whether the emoji is animated.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.isAnimated = function() {
  return this.animated_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the width of the image being sprited, appropriate for a CSS value.
***REMOVED*** @return {string} The width of the image being sprited.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getWidthCssValue = function() {
  return goog.ui.emoji.SpriteInfo.getCssPixelValue_(this.width_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the height of the image being sprited, appropriate for a CSS value.
***REMOVED*** @return {string} The height of the image being sprited.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getHeightCssValue = function() {
  return goog.ui.emoji.SpriteInfo.getCssPixelValue_(this.height_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the x offset of the image being sprited within the sprite,
***REMOVED*** appropriate for a CSS value.
***REMOVED*** @return {string} The x offset of the image being sprited within the sprite.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getXOffsetCssValue = function() {
  return goog.ui.emoji.SpriteInfo.getOffsetCssValue_(this.xOffset_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the positive y offset of the image being sprited within the sprite,
***REMOVED*** appropriate for a CSS value.
***REMOVED*** @return {string} The y offset of the image being sprited within the sprite.
***REMOVED***
goog.ui.emoji.SpriteInfo.prototype.getYOffsetCssValue = function() {
  return goog.ui.emoji.SpriteInfo.getOffsetCssValue_(this.yOffset_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string appropriate for use as a CSS value. If the value is zero,
***REMOVED*** then there is no unit appended.
***REMOVED***
***REMOVED*** @param {number|undefined} value A number to be turned into a
***REMOVED***     CSS size/location value.
***REMOVED*** @return {string} A string appropriate for use as a CSS value.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.getCssPixelValue_ = function(value) {
  return !value ? '0' : value + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string appropriate for use as a CSS value for a position offset,
***REMOVED*** such as the position argument for sprites.
***REMOVED***
***REMOVED*** @param {number|undefined} posOffset A positive offset for a position.
***REMOVED*** @return {string} A string appropriate for use as a CSS value.
***REMOVED*** @private
***REMOVED***
goog.ui.emoji.SpriteInfo.getOffsetCssValue_ = function(posOffset) {
  var offset = goog.ui.emoji.SpriteInfo.getCssPixelValue_(posOffset);
  return offset == '0' ? offset : '-' + offset;
***REMOVED***
