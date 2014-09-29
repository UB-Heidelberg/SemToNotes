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
***REMOVED*** @fileoverview A slider implementation that allows to select a value within a
***REMOVED*** range by dragging a thumb. The selected value is exposed through getValue().
***REMOVED***
***REMOVED*** To decorate, the slider should be bound to an element with the class name
***REMOVED*** 'goog-slider-[vertical / horizontal]' containing a child with the classname
***REMOVED*** 'goog-slider-thumb'.
***REMOVED***
***REMOVED*** Decorate Example:
***REMOVED*** <div id="slider" class="goog-slider-horizontal">
***REMOVED***   <div class="goog-twothumbslider-thumb">
***REMOVED*** </div>
***REMOVED*** <script>
***REMOVED***
***REMOVED*** var slider = new goog.ui.Slider;
***REMOVED*** slider.decorate(document.getElementById('slider'));
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/slider.html
***REMOVED***

// Implementation note: We implement slider by inheriting from baseslider,
// which allows to select sub-ranges within a range using two thumbs. All we do
// is we co-locate the two thumbs into one.

goog.provide('goog.ui.Slider');
goog.provide('goog.ui.Slider.Orientation');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom');
goog.require('goog.ui.SliderBase');
goog.require('goog.ui.SliderBase.Orientation');



***REMOVED***
***REMOVED*** This creates a slider object.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.SliderBase}
***REMOVED***
goog.ui.Slider = function(opt_domHelper) {
  goog.ui.SliderBase.call(this, opt_domHelper);
  this.rangeModel.setExtent(0);
***REMOVED***
goog.inherits(goog.ui.Slider, goog.ui.SliderBase);


***REMOVED***
***REMOVED*** Expose Enum of superclass (representing the orientation of the slider) within
***REMOVED*** Slider namespace.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Slider.Orientation = goog.ui.SliderBase.Orientation;


***REMOVED***
***REMOVED*** The prefix we use for the CSS class names for the slider and its elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.Slider.CSS_CLASS_PREFIX = goog.getCssName('goog-slider');


***REMOVED***
***REMOVED*** CSS class name for the single thumb element.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.Slider.THUMB_CSS_CLASS =
    goog.getCssName(goog.ui.Slider.CSS_CLASS_PREFIX, 'thumb');


***REMOVED***
***REMOVED*** Returns CSS class applied to the slider element.
***REMOVED*** @param {goog.ui.SliderBase.Orientation} orient Orientation of the slider.
***REMOVED*** @return {string} The CSS class applied to the slider element.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.Slider.prototype.getCssClass = function(orient) {
  return orient == goog.ui.SliderBase.Orientation.VERTICAL ?
      goog.getCssName(goog.ui.Slider.CSS_CLASS_PREFIX, 'vertical') :
      goog.getCssName(goog.ui.Slider.CSS_CLASS_PREFIX, 'horizontal');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Slider.prototype.createThumbs = function() {
  // find thumb
  var element = this.getElement();
  var thumb = goog.dom.getElementsByTagNameAndClass(
      null, goog.ui.Slider.THUMB_CSS_CLASS, element)[0];
  if (!thumb) {
    thumb = this.createThumb_();
    element.appendChild(thumb);
  }
  this.valueThumb = this.extentThumb = thumb;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the thumb element.
***REMOVED*** @return {HTMLDivElement} The created thumb element.
***REMOVED*** @private
***REMOVED***
goog.ui.Slider.prototype.createThumb_ = function() {
  var thumb =
      this.getDomHelper().createDom('div', goog.ui.Slider.THUMB_CSS_CLASS);
  goog.a11y.aria.setRole(thumb, goog.a11y.aria.Role.BUTTON);
  return***REMOVED*****REMOVED*** @type {HTMLDivElement}***REMOVED*** (thumb);
***REMOVED***

