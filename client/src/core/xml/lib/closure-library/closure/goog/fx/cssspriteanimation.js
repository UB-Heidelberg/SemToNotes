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
***REMOVED*** @fileoverview An animation class that animates CSS sprites by changing the
***REMOVED*** CSS background-position.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/cssspriteanimation.html
***REMOVED***

goog.provide('goog.fx.CssSpriteAnimation');

goog.require('goog.fx.Animation');



***REMOVED***
***REMOVED*** This animation class is used to animate a CSS sprite (moving a background
***REMOVED*** image).  This moves through a series of images in a single image sprite and
***REMOVED*** loops the animation when done.  You should set up the
***REMOVED*** {@code background-image} and size in a CSS rule for the relevant element.
***REMOVED***
***REMOVED*** @param {Element} element The HTML element to animate the background for.
***REMOVED*** @param {goog.math.Size} size The size of one image in the image sprite.
***REMOVED*** @param {goog.math.Box} box The box describing the layout of the sprites to
***REMOVED***     use in the large image.  The sprites can be position horizontally or
***REMOVED***     vertically and using a box here allows the implementation to know which
***REMOVED***     way to go.
***REMOVED*** @param {number} time The duration in milliseconds for one iteration of the
***REMOVED***     animation.  For example, if the sprite contains 4 images and the duration
***REMOVED***     is set to 400ms then each sprite will be displayed for 100ms.
***REMOVED*** @param {function(number) : number=} opt_acc Acceleration function,
***REMOVED***    returns 0-1 for inputs 0-1.  This can be used to make certain frames be
***REMOVED***    shown for a longer period of time.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.fx.Animation}
***REMOVED***
goog.fx.CssSpriteAnimation = function(element, size, box, time, opt_acc) {
  var start = [box.left, box.top];
  // We never draw for the end so we do not need to subtract for the size
  var end = [box.right, box.bottom];
  goog.base(this, start, end, time, opt_acc);

 ***REMOVED*****REMOVED***
  ***REMOVED*** HTML element that will be used in the animation.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The size of an individual sprite in the image sprite.
  ***REMOVED*** @type {goog.math.Size}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.size_ = size;
***REMOVED***
goog.inherits(goog.fx.CssSpriteAnimation, goog.fx.Animation);


***REMOVED*** @override***REMOVED***
goog.fx.CssSpriteAnimation.prototype.onAnimate = function() {
  // Round to nearest sprite.
  var x = -Math.floor(this.coords[0] / this.size_.width)***REMOVED*** this.size_.width;
  var y = -Math.floor(this.coords[1] / this.size_.height)***REMOVED*** this.size_.height;
  this.element_.style.backgroundPosition = x + 'px ' + y + 'px';

  goog.base(this, 'onAnimate');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.CssSpriteAnimation.prototype.onFinish = function() {
  this.play(true);
  goog.base(this, 'onFinish');
***REMOVED***


***REMOVED***
***REMOVED*** Clears the background position style set directly on the element
***REMOVED*** by the animation. Allows to apply CSS styling for background position on the
***REMOVED*** same element when the sprite animation is not runniing.
***REMOVED***
goog.fx.CssSpriteAnimation.prototype.clearSpritePosition = function() {
  var style = this.element_.style;
  style.backgroundPosition = '';

  if (typeof style.backgroundPositionX != 'undefined') {
    // IE needs to clear x and y to actually clear the position
    style.backgroundPositionX = '';
    style.backgroundPositionY = '';
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.CssSpriteAnimation.prototype.disposeInternal = function() {
  goog.fx.CssSpriteAnimation.superClass_.disposeInternal.call(this);
  this.element_ = null;
***REMOVED***
