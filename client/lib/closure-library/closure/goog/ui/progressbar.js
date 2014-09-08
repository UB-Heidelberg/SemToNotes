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
***REMOVED*** @fileoverview Implementation of a progress bar.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/progressbar.html
***REMOVED***


goog.provide('goog.ui.ProgressBar');
goog.provide('goog.ui.ProgressBar.Orientation');

goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
***REMOVED***
***REMOVED***
goog.require('goog.ui.Component');
goog.require('goog.ui.RangeModel');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This creates a progress bar object.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.ProgressBar = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying data model for the progress bar.
  ***REMOVED*** @type {goog.ui.RangeModel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rangeModel_ = new goog.ui.RangeModel;
***REMOVED***this.rangeModel_, goog.ui.Component.EventType.CHANGE,
                     this.handleChange_, false, this);
***REMOVED***
goog.inherits(goog.ui.ProgressBar, goog.ui.Component);


***REMOVED***
***REMOVED*** Enum for representing the orientation of the progress bar.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ProgressBar.Orientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
***REMOVED***


***REMOVED***
***REMOVED*** Map from progress bar orientation to CSS class names.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_ = {***REMOVED***
goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[
    goog.ui.ProgressBar.Orientation.VERTICAL] =
    goog.getCssName('progress-bar-vertical');
goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[
    goog.ui.ProgressBar.Orientation.HORIZONTAL] =
    goog.getCssName('progress-bar-horizontal');


***REMOVED***
***REMOVED*** Creates the DOM nodes needed for the progress bar
***REMOVED*** @override
***REMOVED***
goog.ui.ProgressBar.prototype.createDom = function() {
  this.thumbElement_ = this.createThumb_();
  var cs = goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[this.orientation_];
  this.setElementInternal(
      this.getDomHelper().createDom('div', cs, this.thumbElement_));
  this.setValueState_();
  this.setMinimumState_();
  this.setMaximumState_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ProgressBar.prototype.enterDocument = function() {
  goog.ui.ProgressBar.superClass_.enterDocument.call(this);
  this.attachEvents_();
  this.updateUi_();

  var element = this.getElement();
  goog.asserts.assert(element,
      'The progress bar DOM element cannot be null.');
  // state live = polite will notify the user of updates,
  // but will not interrupt ongoing feedback
  goog.a11y.aria.setRole(element, 'progressbar');
  goog.a11y.aria.setState(element, 'live', 'polite');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ProgressBar.prototype.exitDocument = function() {
  goog.ui.ProgressBar.superClass_.exitDocument.call(this);
  this.detachEvents_();
***REMOVED***


***REMOVED***
***REMOVED*** This creates the thumb element.
***REMOVED*** @private
***REMOVED*** @return {HTMLDivElement} The created thumb element.
***REMOVED***
goog.ui.ProgressBar.prototype.createThumb_ = function() {
  return***REMOVED*****REMOVED*** @type {HTMLDivElement}***REMOVED*** (this.getDomHelper().createDom('div',
      goog.getCssName('progress-bar-thumb')));
***REMOVED***


***REMOVED***
***REMOVED*** Adds the initial event listeners to the element.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.attachEvents_ = function() {
  if (goog.userAgent.IE && goog.userAgent.VERSION < 7) {
  ***REMOVED***this.getElement(), goog.events.EventType.RESIZE,
                       this.updateUi_, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the event listeners added by attachEvents_.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.detachEvents_ = function() {
  if (goog.userAgent.IE && goog.userAgent.VERSION < 7) {
    goog.events.unlisten(this.getElement(), goog.events.EventType.RESIZE,
                         this.updateUi_, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decorates an existing HTML DIV element as a progress bar input. If the
***REMOVED*** element contains a child with a class name of 'progress-bar-thumb' that will
***REMOVED*** be used as the thumb.
***REMOVED*** @param {Element} element  The HTML element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.ProgressBar.prototype.decorateInternal = function(element) {
  goog.ui.ProgressBar.superClass_.decorateInternal.call(this, element);
  goog.dom.classlist.add(
      goog.asserts.assert(this.getElement()),
      goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[this.orientation_]);

  // find thumb
  var thumb = goog.dom.getElementsByTagNameAndClass(
      null, goog.getCssName('progress-bar-thumb'), this.getElement())[0];
  if (!thumb) {
    thumb = this.createThumb_();
    this.getElement().appendChild(thumb);
  }
  this.thumbElement_ = thumb;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The value.
***REMOVED***
goog.ui.ProgressBar.prototype.getValue = function() {
  return this.rangeModel_.getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value
***REMOVED*** @param {number} v The value.
***REMOVED***
goog.ui.ProgressBar.prototype.setValue = function(v) {
  this.rangeModel_.setValue(v);
  if (this.getElement()) {
    this.setValueState_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state for a11y of the current value.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.setValueState_ = function() {
  var element = this.getElement();
  goog.asserts.assert(element,
      'The progress bar DOM element cannot be null.');
  goog.a11y.aria.setState(element, 'valuenow', this.getValue());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum value.
***REMOVED***
goog.ui.ProgressBar.prototype.getMinimum = function() {
  return this.rangeModel_.getMinimum();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum number
***REMOVED*** @param {number} v The minimum value.
***REMOVED***
goog.ui.ProgressBar.prototype.setMinimum = function(v) {
  this.rangeModel_.setMinimum(v);
  if (this.getElement()) {
    this.setMinimumState_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state for a11y of the minimum value.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.setMinimumState_ = function() {
  var element = this.getElement();
  goog.asserts.assert(element,
      'The progress bar DOM element cannot be null.');
  goog.a11y.aria.setState(element, 'valuemin', this.getMinimum());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The maximum value.
***REMOVED***
goog.ui.ProgressBar.prototype.getMaximum = function() {
  return this.rangeModel_.getMaximum();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum number
***REMOVED*** @param {number} v The maximum value.
***REMOVED***
goog.ui.ProgressBar.prototype.setMaximum = function(v) {
  this.rangeModel_.setMaximum(v);
  if (this.getElement()) {
    this.setMaximumState_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the state for a11y of the maximum valiue.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.setMaximumState_ = function() {
  var element = this.getElement();
  goog.asserts.assert(element,
      'The progress bar DOM element cannot be null.');
  goog.a11y.aria.setState(element, 'valuemax', this.getMaximum());
***REMOVED***


***REMOVED***
***REMOVED***
***REMOVED*** @type {goog.ui.ProgressBar.Orientation}
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.orientation_ =
    goog.ui.ProgressBar.Orientation.HORIZONTAL;


***REMOVED***
***REMOVED*** Call back when the internal range model changes
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.handleChange_ = function(e) {
  this.updateUi_();
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** This is called when we need to update the size of the thumb. This happens
***REMOVED*** when first created as well as when the value and the orientation changes.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.updateUi_ = function() {
  if (this.thumbElement_) {
    var min = this.getMinimum();
    var max = this.getMaximum();
    var val = this.getValue();
    var ratio = (val - min) / (max - min);
    var size = Math.round(ratio***REMOVED*** 100);
    if (this.orientation_ == goog.ui.ProgressBar.Orientation.VERTICAL) {
      // Note(arv): IE up to version 6 has some serious computation bugs when
      // using percentages or bottom. We therefore first set the height to
      // 100% and measure that and base the top and height on that size instead.
      if (goog.userAgent.IE && goog.userAgent.VERSION < 7) {
        this.thumbElement_.style.top = 0;
        this.thumbElement_.style.height = '100%';
        var h = this.thumbElement_.offsetHeight;
        var bottom = Math.round(ratio***REMOVED*** h);
        this.thumbElement_.style.top = h - bottom + 'px';
        this.thumbElement_.style.height = bottom + 'px';
      } else {
        this.thumbElement_.style.top = (100 - size) + '%';
        this.thumbElement_.style.height = size + '%';
      }
    } else {
      this.thumbElement_.style.width = size + '%';
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** This is called when we need to setup the UI sizes and positions. This
***REMOVED*** happens when we create the element and when we change the orientation.
***REMOVED*** @private
***REMOVED***
goog.ui.ProgressBar.prototype.initializeUi_ = function() {
  var tStyle = this.thumbElement_.style;
  if (this.orientation_ == goog.ui.ProgressBar.Orientation.VERTICAL) {
    tStyle.left = 0;
    tStyle.width = '100%';
  } else {
    tStyle.top = tStyle.left = 0;
    tStyle.height = '100%';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the orientation
***REMOVED*** @param {goog.ui.ProgressBar.Orientation} orient The orientation.
***REMOVED***
goog.ui.ProgressBar.prototype.setOrientation = function(orient) {
  if (this.orientation_ != orient) {
    var oldCss =
        goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[this.orientation_];
    var newCss = goog.ui.ProgressBar.ORIENTATION_TO_CSS_NAME_[orient];
    this.orientation_ = orient;

    // Update the DOM
    var element = this.getElement();
    if (element) {
      goog.dom.classlist.swap(element, oldCss, newCss);
      this.initializeUi_();
      this.updateUi_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.ProgressBar.Orientation} The orientation of the
***REMOVED***     progress bar.
***REMOVED***
goog.ui.ProgressBar.prototype.getOrientation = function() {
  return this.orientation_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ProgressBar.prototype.disposeInternal = function() {
  this.detachEvents_();
  goog.ui.ProgressBar.superClass_.disposeInternal.call(this);
  this.thumbElement_ = null;
  this.rangeModel_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The step value used to determine how to round the value.
***REMOVED***
goog.ui.ProgressBar.prototype.getStep = function() {
  return this.rangeModel_.getStep();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the step value. The step value is used to determine how to round the
***REMOVED*** value.
***REMOVED*** @param {?number} step  The step size.
***REMOVED***
goog.ui.ProgressBar.prototype.setStep = function(step) {
  this.rangeModel_.setStep(step);
***REMOVED***
