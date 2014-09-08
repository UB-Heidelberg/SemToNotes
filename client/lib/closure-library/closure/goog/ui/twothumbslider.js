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
***REMOVED*** @fileoverview Twothumbslider is a slider that allows to select a subrange
***REMOVED*** within a range by dragging two thumbs. The selected sub-range is exposed
***REMOVED*** through getValue() and getExtent().
***REMOVED***
***REMOVED*** To decorate, the twothumbslider should be bound to an element with the class
***REMOVED*** name 'goog-twothumbslider-[vertical / horizontal]' containing children with
***REMOVED*** the classname 'goog-twothumbslider-value-thumb' and
***REMOVED*** 'goog-twothumbslider-extent-thumb', respectively.
***REMOVED***
***REMOVED*** Decorate Example:
***REMOVED*** <div id="twothumbslider" class="goog-twothumbslider-horizontal">
***REMOVED***   <div class="goog-twothumbslider-value-thumb">
***REMOVED***   <div class="goog-twothumbslider-extent-thumb">
***REMOVED*** </div>
***REMOVED*** <script>
***REMOVED***
***REMOVED*** var slider = new goog.ui.TwoThumbSlider;
***REMOVED*** slider.decorate(document.getElementById('twothumbslider'));
***REMOVED***
***REMOVED*** TODO(user): add a11y once we know what this element is
***REMOVED***
***REMOVED*** @see ../demos/twothumbslider.html
***REMOVED***

goog.provide('goog.ui.TwoThumbSlider');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom');
goog.require('goog.ui.SliderBase');



***REMOVED***
***REMOVED*** This creates a TwoThumbSlider object.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.SliderBase}
***REMOVED***
goog.ui.TwoThumbSlider = function(opt_domHelper) {
  goog.ui.SliderBase.call(this, opt_domHelper);
  this.rangeModel.setValue(this.getMinimum());
  this.rangeModel.setExtent(this.getMaximum() - this.getMinimum());
***REMOVED***
goog.inherits(goog.ui.TwoThumbSlider, goog.ui.SliderBase);


***REMOVED***
***REMOVED*** The prefix we use for the CSS class names for the slider and its elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX =
    goog.getCssName('goog-twothumbslider');


***REMOVED***
***REMOVED*** CSS class name for the value thumb element.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TwoThumbSlider.VALUE_THUMB_CSS_CLASS =
    goog.getCssName(goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX, 'value-thumb');


***REMOVED***
***REMOVED*** CSS class name for the extent thumb element.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TwoThumbSlider.EXTENT_THUMB_CSS_CLASS =
    goog.getCssName(goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX, 'extent-thumb');


***REMOVED***
***REMOVED*** CSS class name for the range highlight element.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TwoThumbSlider.RANGE_HIGHLIGHT_CSS_CLASS =
    goog.getCssName(goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX, 'rangehighlight');


***REMOVED***
***REMOVED*** @param {goog.ui.SliderBase.Orientation} orient orientation of the slider.
***REMOVED*** @return {string} The CSS class applied to the twothumbslider element.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.TwoThumbSlider.prototype.getCssClass = function(orient) {
  return orient == goog.ui.SliderBase.Orientation.VERTICAL ?
      goog.getCssName(goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX, 'vertical') :
      goog.getCssName(goog.ui.TwoThumbSlider.CSS_CLASS_PREFIX, 'horizontal');
***REMOVED***


***REMOVED***
***REMOVED*** This creates a thumb element with the specified CSS class name.
***REMOVED*** @param {string} cs  CSS class name of the thumb to be created.
***REMOVED*** @return {HTMLDivElement} The created thumb element.
***REMOVED*** @private
***REMOVED***
goog.ui.TwoThumbSlider.prototype.createThumb_ = function(cs) {
  var thumb = this.getDomHelper().createDom('div', cs);
  goog.a11y.aria.setRole(thumb, goog.a11y.aria.Role.BUTTON);
  return***REMOVED*****REMOVED*** @type {HTMLDivElement}***REMOVED*** (thumb);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the thumb members for a twothumbslider. If the
***REMOVED*** element contains a child with a class name 'goog-twothumbslider-value-thumb'
***REMOVED*** (or 'goog-twothumbslider-extent-thumb', respectively), then that will be used
***REMOVED*** as the valueThumb (or as the extentThumb, respectively). If the element
***REMOVED*** contains a child with a class name 'goog-twothumbslider-rangehighlight',
***REMOVED*** then that will be used as the range highlight.
***REMOVED*** @override
***REMOVED***
goog.ui.TwoThumbSlider.prototype.createThumbs = function() {
  // find range highlight and thumbs
  var valueThumb = goog.dom.getElementsByTagNameAndClass(
      null, goog.ui.TwoThumbSlider.VALUE_THUMB_CSS_CLASS, this.getElement())[0];
  var extentThumb = goog.dom.getElementsByTagNameAndClass(null,
      goog.ui.TwoThumbSlider.EXTENT_THUMB_CSS_CLASS, this.getElement())[0];
  var rangeHighlight = goog.dom.getElementsByTagNameAndClass(null,
      goog.ui.TwoThumbSlider.RANGE_HIGHLIGHT_CSS_CLASS, this.getElement())[0];
  if (!valueThumb) {
    valueThumb =
        this.createThumb_(goog.ui.TwoThumbSlider.VALUE_THUMB_CSS_CLASS);
    this.getElement().appendChild(valueThumb);
  }
  if (!extentThumb) {
    extentThumb =
        this.createThumb_(goog.ui.TwoThumbSlider.EXTENT_THUMB_CSS_CLASS);
    this.getElement().appendChild(extentThumb);
  }
  if (!rangeHighlight) {
    rangeHighlight = this.getDomHelper().createDom('div',
        goog.ui.TwoThumbSlider.RANGE_HIGHLIGHT_CSS_CLASS);
    // Insert highlight before value thumb so that it renders under the thumbs.
    this.getDomHelper().insertSiblingBefore(rangeHighlight, valueThumb);
  }
  this.valueThumb = valueThumb;
  this.extentThumb = extentThumb;
  this.rangeHighlight = rangeHighlight;
***REMOVED***
