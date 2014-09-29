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
***REMOVED*** @fileoverview A thin wrapper around the DOM element for elements with a
***REMOVED*** stroke and fill.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.StrokeAndFillElement');

goog.require('goog.graphics.Element');



***REMOVED***
***REMOVED*** Interface for a graphics element with a stroke and fill.
***REMOVED*** This is the base interface for ellipse, rectangle and other
***REMOVED*** shape interfaces.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return an implementation of this interface for you.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.Element}
***REMOVED***
goog.graphics.StrokeAndFillElement = function(element, graphics, stroke, fill) {
  goog.graphics.Element.call(this, element, graphics);
  this.setStroke(stroke);
  this.setFill(fill);
***REMOVED***
goog.inherits(goog.graphics.StrokeAndFillElement, goog.graphics.Element);


***REMOVED***
***REMOVED*** The latest fill applied to this element.
***REMOVED*** @type {goog.graphics.Fill?}
***REMOVED*** @protected
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.fill = null;


***REMOVED***
***REMOVED*** The latest stroke applied to this element.
***REMOVED*** @type {goog.graphics.Stroke?}
***REMOVED*** @private
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.stroke_ = null;


***REMOVED***
***REMOVED*** Sets the fill for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill object.
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.setFill = function(fill) {
  this.fill = fill;
  this.getGraphics().setElementFill(this, fill);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.Fill?} fill The fill object.
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.getFill = function() {
  return this.fill;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke for this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.setStroke = function(stroke) {
  this.stroke_ = stroke;
  this.getGraphics().setElementStroke(this, stroke);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.getStroke = function() {
  return this.stroke_;
***REMOVED***


***REMOVED***
***REMOVED*** Re-strokes the element to react to coordinate size changes.
***REMOVED***
goog.graphics.StrokeAndFillElement.prototype.reapplyStroke = function() {
  if (this.stroke_) {
    this.setStroke(this.stroke_);
  }
***REMOVED***
