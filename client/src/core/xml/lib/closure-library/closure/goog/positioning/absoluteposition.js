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
***REMOVED*** @fileoverview Client viewport positioning class.
***REMOVED***
***REMOVED***

goog.provide('goog.positioning.AbsolutePosition');

goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.positioning');
goog.require('goog.positioning.AbstractPosition');



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup absolutely positioned by
***REMOVED*** setting the left/top style elements directly to the specified values.
***REMOVED*** The position is generally relative to the element's offsetParent. Normally,
***REMOVED*** this is the document body, but can be another element if the popup element
***REMOVED*** is scoped by an element with relative position.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AbstractPosition}
***REMOVED***
goog.positioning.AbsolutePosition = function(arg1, opt_arg2) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Coordinate to position popup at.
  ***REMOVED*** @type {goog.math.Coordinate}
 ***REMOVED*****REMOVED***
  this.coordinate = arg1 instanceof goog.math.Coordinate ? arg1 :
      new goog.math.Coordinate(***REMOVED*** @type {number}***REMOVED*** (arg1), opt_arg2);
***REMOVED***
goog.inherits(goog.positioning.AbsolutePosition,
              goog.positioning.AbstractPosition);


***REMOVED***
***REMOVED*** Repositions the popup according to the current state.
***REMOVED***
***REMOVED*** @param {Element} movableElement The DOM element to position.
***REMOVED*** @param {goog.positioning.Corner} movableCorner The corner of the movable
***REMOVED***     element that should be positioned at the specified position.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize Prefered size of the
***REMOVED***     movableElement.
***REMOVED*** @override
***REMOVED***
goog.positioning.AbsolutePosition.prototype.reposition = function(
    movableElement, movableCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtCoordinate(this.coordinate,
                                        movableElement,
                                        movableCorner,
                                        opt_margin,
                                        null,
                                        null,
                                        opt_preferredSize);
***REMOVED***
