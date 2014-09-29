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
***REMOVED*** @fileoverview A thin wrapper around the DOM element for rectangles.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.RectElement');

goog.require('goog.graphics.StrokeAndFillElement');



***REMOVED***
***REMOVED*** Interface for a graphics rectangle element.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return an implementation of this interface for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.StrokeAndFillElement}
***REMOVED***
goog.graphics.RectElement = function(element, graphics, stroke, fill) {
  goog.graphics.StrokeAndFillElement.call(this, element, graphics, stroke,
      fill);
***REMOVED***
goog.inherits(goog.graphics.RectElement, goog.graphics.StrokeAndFillElement);


***REMOVED***
***REMOVED*** Update the position of the rectangle.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED***
goog.graphics.RectElement.prototype.setPosition = goog.abstractMethod;


***REMOVED***
***REMOVED*** Update the size of the rectangle.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED***
goog.graphics.RectElement.prototype.setSize = goog.abstractMethod;
