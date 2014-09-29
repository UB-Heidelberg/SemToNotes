// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Predefined DHTML animations such as slide, resize and fade.
***REMOVED***
***REMOVED*** @see ../demos/effects.html
***REMOVED***

goog.provide('goog.fx.dom');
goog.provide('goog.fx.dom.BgColorTransform');
goog.provide('goog.fx.dom.ColorTransform');
goog.provide('goog.fx.dom.Fade');
goog.provide('goog.fx.dom.FadeIn');
goog.provide('goog.fx.dom.FadeInAndShow');
goog.provide('goog.fx.dom.FadeOut');
goog.provide('goog.fx.dom.FadeOutAndHide');
goog.provide('goog.fx.dom.PredefinedEffect');
goog.provide('goog.fx.dom.Resize');
goog.provide('goog.fx.dom.ResizeHeight');
goog.provide('goog.fx.dom.ResizeWidth');
goog.provide('goog.fx.dom.Scroll');
goog.provide('goog.fx.dom.Slide');
goog.provide('goog.fx.dom.SlideFrom');
goog.provide('goog.fx.dom.Swipe');

goog.require('goog.color');
***REMOVED***
goog.require('goog.fx.Animation');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.style');
goog.require('goog.style.bidi');



***REMOVED***
***REMOVED*** Abstract class that provides reusable functionality for predefined animations
***REMOVED*** that manipulate a single DOM element
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start Array for start coordinates.
***REMOVED*** @param {Array.<number>} end Array for end coordinates.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.Animation}
***REMOVED***
***REMOVED***
goog.fx.dom.PredefinedEffect = function(element, start, end, time, opt_acc) {
  goog.fx.Animation.call(this, start, end, time, opt_acc);

 ***REMOVED*****REMOVED***
  ***REMOVED*** DOM Node that will be used in the animation
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.element = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the element is rendered right-to-left. We cache this here for
  ***REMOVED*** efficiency.
  ***REMOVED*** @type {boolean|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rightToLeft_;
***REMOVED***
goog.inherits(goog.fx.dom.PredefinedEffect, goog.fx.Animation);


***REMOVED***
***REMOVED*** Called to update the style of the element.
***REMOVED*** @protected
***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.updateStyle = goog.nullFunction;


***REMOVED***
***REMOVED*** Whether the element is rendered right-to-left. We initialize this lazily.
***REMOVED*** @type {boolean|undefined}
***REMOVED*** @private
***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.rightToLeft_;


***REMOVED***
***REMOVED*** Whether the DOM element being manipulated is rendered right-to-left.
***REMOVED*** @return {boolean} True if the DOM element is rendered right-to-left, false
***REMOVED***     otherwise.
***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.isRightToLeft = function() {
  if (!goog.isDef(this.rightToLeft_)) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.element);
  }
  return this.rightToLeft_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.onAnimate = function() {
  this.updateStyle();
  goog.fx.dom.PredefinedEffect.superClass_.onAnimate.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.onEnd = function() {
  this.updateStyle();
  goog.fx.dom.PredefinedEffect.superClass_.onEnd.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.dom.PredefinedEffect.prototype.onBegin = function() {
  this.updateStyle();
  goog.fx.dom.PredefinedEffect.superClass_.onBegin.call(this);
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will slide an element from A to B.  (This
***REMOVED*** in effect automatically sets up the onanimate event for an Animation object)
***REMOVED***
***REMOVED*** Start and End should be 2 dimensional arrays
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 2D array for start coordinates (X, Y).
***REMOVED*** @param {Array.<number>} end 2D array for end coordinates (X, Y).
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.Slide = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
***REMOVED***
goog.inherits(goog.fx.dom.Slide, goog.fx.dom.PredefinedEffect);


***REMOVED*** @override***REMOVED***
goog.fx.dom.Slide.prototype.updateStyle = function() {
  var pos = (this.isRightPositioningForRtlEnabled() && this.isRightToLeft()) ?
      'right' : 'left';
  this.element.style[pos] = Math.round(this.coords[0]) + 'px';
  this.element.style.top = Math.round(this.coords[1]) + 'px';
***REMOVED***



***REMOVED***
***REMOVED*** Slides an element from its current position.
***REMOVED***
***REMOVED*** @param {Element} element DOM node to be used in the animation.
***REMOVED*** @param {Array.<number>} end 2D array for end coordinates (X, Y).
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.Slide}
***REMOVED***
***REMOVED***
goog.fx.dom.SlideFrom = function(element, end, time, opt_acc) {
  var offsetLeft = this.isRightPositioningForRtlEnabled() ?
      goog.style.bidi.getOffsetStart(element) : element.offsetLeft;
  var start = [offsetLeft, element.offsetTop];
  goog.fx.dom.Slide.call(this, element, start, end, time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.SlideFrom, goog.fx.dom.Slide);


***REMOVED*** @override***REMOVED***
goog.fx.dom.SlideFrom.prototype.onBegin = function() {
  var offsetLeft = this.isRightPositioningForRtlEnabled() ?
      goog.style.bidi.getOffsetStart(this.element) : this.element.offsetLeft;
  this.startPoint = [offsetLeft, this.element.offsetTop];
  goog.fx.dom.SlideFrom.superClass_.onBegin.call(this);
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will slide an element into its final size.
***REMOVED*** Requires that the element is absolutely positioned.
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 2D array for start size (W, H).
***REMOVED*** @param {Array.<number>} end 2D array for end size (W, H).
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.Swipe = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);

  /*
  ***REMOVED*** Maximum width for element.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxWidth_ = Math.max(this.endPoint[0], this.startPoint[0]);

  /*
  ***REMOVED*** Maximum height for element.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxHeight_ = Math.max(this.endPoint[1], this.startPoint[1]);
***REMOVED***
goog.inherits(goog.fx.dom.Swipe, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will resize an element by setting its width,
***REMOVED*** height and clipping.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.Swipe.prototype.updateStyle = function() {
  var x = this.coords[0];
  var y = this.coords[1];
  this.clip_(Math.round(x), Math.round(y), this.maxWidth_, this.maxHeight_);
  this.element.style.width = Math.round(x) + 'px';
  var marginX = (this.isRightPositioningForRtlEnabled() &&
      this.isRightToLeft()) ? 'marginRight' : 'marginLeft';

  this.element.style[marginX] = Math.round(x) - this.maxWidth_ + 'px';
  this.element.style.marginTop = Math.round(y) - this.maxHeight_ + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for setting element clipping.
***REMOVED*** @param {number} x Current element width.
***REMOVED*** @param {number} y Current element height.
***REMOVED*** @param {number} w Maximum element width.
***REMOVED*** @param {number} h Maximum element height.
***REMOVED*** @private
***REMOVED***
goog.fx.dom.Swipe.prototype.clip_ = function(x, y, w, h) {
  this.element.style.clip =
      'rect(' + (h - y) + 'px ' + w + 'px ' + h + 'px ' + (w - x) + 'px)';
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will scroll an element from A to B.
***REMOVED***
***REMOVED*** Start and End should be 2 dimensional arrays
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 2D array for start scroll left and top.
***REMOVED*** @param {Array.<number>} end 2D array for end scroll left and top.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.Scroll = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
***REMOVED***
goog.inherits(goog.fx.dom.Scroll, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will set the scroll posiiton of an element
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.Scroll.prototype.updateStyle = function() {
  if (this.isRightPositioningForRtlEnabled()) {
    goog.style.bidi.setScrollOffset(this.element, Math.round(this.coords[0]));
  } else {
    this.element.scrollLeft = Math.round(this.coords[0]);
  }
  this.element.scrollTop = Math.round(this.coords[1]);
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will resize an element between two widths
***REMOVED*** and heights.
***REMOVED***
***REMOVED*** Start and End should be 2 dimensional arrays
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 2D array for start width and height.
***REMOVED*** @param {Array.<number>} end 2D array for end width and height.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.Resize = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
***REMOVED***
goog.inherits(goog.fx.dom.Resize, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will resize an element by setting its width and
***REMOVED*** height.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.Resize.prototype.updateStyle = function() {
  this.element.style.width = Math.round(this.coords[0]) + 'px';
  this.element.style.height = Math.round(this.coords[1]) + 'px';
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will resize an element between two widths
***REMOVED***
***REMOVED*** Start and End should be numbers
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} start Start width.
***REMOVED*** @param {number} end End width.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.ResizeWidth = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.call(this, element, [start],
                                    [end], time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.ResizeWidth, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will resize an element by setting its width.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.ResizeWidth.prototype.updateStyle = function() {
  this.element.style.width = Math.round(this.coords[0]) + 'px';
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that will resize an element between two heights
***REMOVED***
***REMOVED*** Start and End should be numbers
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} start Start height.
***REMOVED*** @param {number} end End height.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.ResizeHeight = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.call(this, element, [start],
                                    [end], time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.ResizeHeight, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will resize an element by setting its height.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.ResizeHeight.prototype.updateStyle = function() {
  this.element.style.height = Math.round(this.coords[0]) + 'px';
***REMOVED***



***REMOVED***
***REMOVED*** Creates an animation object that fades the opacity of an element between two
***REMOVED*** limits.
***REMOVED***
***REMOVED*** Start and End should be floats between 0 and 1
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>|number} start 1D Array or Number with start opacity.
***REMOVED*** @param {Array.<number>|number} end 1D Array or Number for end opacity.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.Fade = function(element, start, end, time, opt_acc) {
  if (goog.isNumber(start)) start = [start];
  if (goog.isNumber(end)) end = [end];

  goog.fx.dom.PredefinedEffect.call(this, element, start, end, time, opt_acc);

  if (start.length != 1 || end.length != 1) {
    throw Error('Start and end points must be 1D');
  }
***REMOVED***
goog.inherits(goog.fx.dom.Fade, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will set the opacity of an element.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.Fade.prototype.updateStyle = function() {
  goog.style.setOpacity(this.element, this.coords[0]);
***REMOVED***


***REMOVED***
***REMOVED*** Animation event handler that will show the element.
***REMOVED***
goog.fx.dom.Fade.prototype.show = function() {
  this.element.style.display = '';
***REMOVED***


***REMOVED***
***REMOVED*** Animation event handler that will hide the element
***REMOVED***
goog.fx.dom.Fade.prototype.hide = function() {
  this.element.style.display = 'none';
***REMOVED***



***REMOVED***
***REMOVED*** Fades an element out from full opacity to completely transparent.
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.Fade}
***REMOVED***
***REMOVED***
goog.fx.dom.FadeOut = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 1, 0, time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.FadeOut, goog.fx.dom.Fade);



***REMOVED***
***REMOVED*** Fades an element in from completely transparent to fully opacity.
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.Fade}
***REMOVED***
***REMOVED***
goog.fx.dom.FadeIn = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 0, 1, time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.FadeIn, goog.fx.dom.Fade);



***REMOVED***
***REMOVED*** Fades an element out from full opacity to completely transparent and then
***REMOVED*** sets the display to 'none'
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.Fade}
***REMOVED***
***REMOVED***
goog.fx.dom.FadeOutAndHide = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 1, 0, time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.FadeOutAndHide, goog.fx.dom.Fade);


***REMOVED*** @override***REMOVED***
goog.fx.dom.FadeOutAndHide.prototype.onBegin = function() {
  this.show();
  goog.fx.dom.FadeOutAndHide.superClass_.onBegin.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.dom.FadeOutAndHide.prototype.onEnd = function() {
  this.hide();
  goog.fx.dom.FadeOutAndHide.superClass_.onEnd.call(this);
***REMOVED***



***REMOVED***
***REMOVED*** Sets an element's display to be visible and then fades an element in from
***REMOVED*** completely transparent to fully opacity
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.Fade}
***REMOVED***
***REMOVED***
goog.fx.dom.FadeInAndShow = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 0, 1, time, opt_acc);
***REMOVED***
goog.inherits(goog.fx.dom.FadeInAndShow, goog.fx.dom.Fade);


***REMOVED*** @override***REMOVED***
goog.fx.dom.FadeInAndShow.prototype.onBegin = function() {
  this.show();
  goog.fx.dom.FadeInAndShow.superClass_.onBegin.call(this);
***REMOVED***



***REMOVED***
***REMOVED*** Provides a transformation of an elements background-color.
***REMOVED***
***REMOVED*** Start and End should be 3D arrays representing R,G,B
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 3D Array for RGB of start color.
***REMOVED*** @param {Array.<number>} end 3D Array for RGB of end color.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
***REMOVED***
goog.fx.dom.BgColorTransform = function(element, start, end, time, opt_acc) {
  if (start.length != 3 || end.length != 3) {
    throw Error('Start and end points must be 3D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
***REMOVED***
goog.inherits(goog.fx.dom.BgColorTransform, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will set the background-color of an element
***REMOVED***
goog.fx.dom.BgColorTransform.prototype.setColor = function() {
  var coordsAsInts = [];
  for (var i = 0; i < this.coords.length; i++) {
    coordsAsInts[i] = Math.round(this.coords[i]);
  }
  var color = 'rgb(' + coordsAsInts.join(',') + ')';
  this.element.style.backgroundColor = color;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.dom.BgColorTransform.prototype.updateStyle = function() {
  this.setColor();
***REMOVED***


***REMOVED***
***REMOVED*** Fade elements background color from start color to the element's current
***REMOVED*** background color.
***REMOVED***
***REMOVED*** Start should be a 3D array representing R,G,B
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 3D Array for RGB of start color.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {goog.events.EventHandler=} opt_eventHandler Optional event handler
***REMOVED***     to use when listening for events.
***REMOVED***
goog.fx.dom.bgColorFadeIn = function(element, start, time, opt_eventHandler) {
  var initialBgColor = element.style.backgroundColor || '';
  var computedBgColor = goog.style.getBackgroundColor(element);
  var end;

  if (computedBgColor && computedBgColor != 'transparent' &&
      computedBgColor != 'rgba(0, 0, 0, 0)') {
    end = goog.color.hexToRgb(goog.color.parse(computedBgColor).hex);
  } else {
    end = [255, 255, 255];
  }

  var anim = new goog.fx.dom.BgColorTransform(element, start, end, time);

  function setBgColor() {
    element.style.backgroundColor = initialBgColor;
  }

  if (opt_eventHandler) {
    opt_eventHandler.listen(
        anim, goog.fx.Transition.EventType.END, setBgColor);
  } else {
  ***REMOVED***
        anim, goog.fx.Transition.EventType.END, setBgColor);
  }

  anim.play();
***REMOVED***



***REMOVED***
***REMOVED*** Provides a transformation of an elements color.
***REMOVED***
***REMOVED*** @param {Element} element Dom Node to be used in the animation.
***REMOVED*** @param {Array.<number>} start 3D Array representing R,G,B.
***REMOVED*** @param {Array.<number>} end 3D Array representing R,G,B.
***REMOVED*** @param {number} time Length of animation in milliseconds.
***REMOVED*** @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
***REMOVED***
***REMOVED*** @extends {goog.fx.dom.PredefinedEffect}
***REMOVED***
goog.fx.dom.ColorTransform = function(element, start, end, time, opt_acc) {
  if (start.length != 3 || end.length != 3) {
    throw Error('Start and end points must be 3D');
  }
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
***REMOVED***
goog.inherits(goog.fx.dom.ColorTransform, goog.fx.dom.PredefinedEffect);


***REMOVED***
***REMOVED*** Animation event handler that will set the color of an element.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.fx.dom.ColorTransform.prototype.updateStyle = function() {
  var coordsAsInts = [];
  for (var i = 0; i < this.coords.length; i++) {
    coordsAsInts[i] = Math.round(this.coords[i]);
  }
  var color = 'rgb(' + coordsAsInts.join(',') + ')';
  this.element.style.color = color;
***REMOVED***
