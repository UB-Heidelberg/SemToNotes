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
***REMOVED*** @fileoverview A thin wrapper around the DOM element for ellipses.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.EllipseElement');

goog.require('goog.graphics.StrokeAndFillElement');



***REMOVED***
***REMOVED*** Interface for a graphics ellipse element.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return an implementation of this interface for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.StrokeAndFillElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED***
goog.graphics.EllipseElement = function(element, graphics, stroke, fill) {
  goog.graphics.StrokeAndFillElement.call(this, element, graphics, stroke,
      fill);
***REMOVED***
goog.inherits(goog.graphics.EllipseElement, goog.graphics.StrokeAndFillElement);


***REMOVED***
***REMOVED*** Update the center point of the ellipse.
***REMOVED*** @param {number} cx  Center X coordinate.
***REMOVED*** @param {number} cy  Center Y coordinate.
***REMOVED***
goog.graphics.EllipseElement.prototype.setCenter = goog.abstractMethod;


***REMOVED***
***REMOVED*** Update the radius of the ellipse.
***REMOVED*** @param {number} rx  Radius length for the x-axis.
***REMOVED*** @param {number} ry  Radius length for the y-axis.
***REMOVED***
goog.graphics.EllipseElement.prototype.setRadius = goog.abstractMethod;
