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
***REMOVED*** @fileoverview A thin wrapper around the DOM element returned from
***REMOVED*** the different draw methods of the graphics implementation, and
***REMOVED*** all interfaces that the various element types support.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.Element');

***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.graphics.AffineTransform');
goog.require('goog.math');



***REMOVED***
***REMOVED*** Base class for a thin wrapper around the DOM element returned from
***REMOVED*** the different draw methods of the graphics.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element  The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics  The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @suppress {visibility} Accessing private field of superclass (see TODO).
***REMOVED***
goog.graphics.Element = function(element, graphics) {
  goog.events.EventTarget.call(this);
  this.element_ = element;
  this.graphics_ = graphics;
  // Overloading EventTarget field to state that this is not a custom event.
  // TODO(user) Should be handled in EventTarget.js (see bug 846824).
  this.customEvent_ = false;
***REMOVED***
goog.inherits(goog.graphics.Element, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The graphics object that contains this element.
***REMOVED*** @type {goog.graphics.AbstractGraphics?}
***REMOVED*** @private
***REMOVED***
goog.graphics.Element.prototype.graphics_ = null;


***REMOVED***
***REMOVED*** The native browser element this class wraps.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.graphics.Element.prototype.element_ = null;


***REMOVED***
***REMOVED*** The transformation applied to this element.
***REMOVED*** @type {goog.graphics.AffineTransform?}
***REMOVED*** @private
***REMOVED***
goog.graphics.Element.prototype.transform_ = null;


***REMOVED***
***REMOVED*** Returns the underlying object.
***REMOVED*** @return {Element} The underlying element.
***REMOVED***
goog.graphics.Element.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the graphics.
***REMOVED*** @return {goog.graphics.AbstractGraphics} The graphics that created the
***REMOVED***     element.
***REMOVED***
goog.graphics.Element.prototype.getGraphics = function() {
  return this.graphics_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the transformation of the element.
***REMOVED*** @param {number} x The x coordinate of the translation transform.
***REMOVED*** @param {number} y The y coordinate of the translation transform.
***REMOVED*** @param {number} rotate The angle of the rotation transform.
***REMOVED*** @param {number} centerX The horizontal center of the rotation transform.
***REMOVED*** @param {number} centerY The vertical center of the rotation transform.
***REMOVED***
goog.graphics.Element.prototype.setTransformation = function(x, y, rotate,
    centerX, centerY) {
  // TODO(robbyw): Add skew and scale.

  this.transform_ = goog.graphics.AffineTransform.getRotateInstance(
      goog.math.toRadians(rotate), centerX, centerY).translate(x, y);
  this.getGraphics().setElementTransform(this, x, y, rotate, centerX, centerY);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.AffineTransform} The transformation applied to
***REMOVED***     this element.
***REMOVED***
goog.graphics.Element.prototype.getTransform = function() {
  return this.transform_ ? this.transform_.clone() :
      new goog.graphics.AffineTransform();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.Element.prototype.addEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
***REMOVED***this.element_, type, handler, opt_capture,
      opt_handlerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.Element.prototype.removeEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this.element_, type, handler, opt_capture,
      opt_handlerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.Element.prototype.disposeInternal = function() {
  goog.graphics.Element.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this.element_);
***REMOVED***
