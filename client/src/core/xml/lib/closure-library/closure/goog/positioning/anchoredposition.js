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
***REMOVED*** @fileoverview Client positioning class.
***REMOVED***
***REMOVED***

goog.provide('goog.positioning.AnchoredPosition');

goog.require('goog.math.Box');
goog.require('goog.positioning');
goog.require('goog.positioning.AbstractPosition');



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is anchored at a corner of
***REMOVED*** an element.
***REMOVED***
***REMOVED*** When using AnchoredPosition, it is recommended that the popup element
***REMOVED*** specified in the Popup constructor or Popup.setElement be absolutely
***REMOVED*** positioned.
***REMOVED***
***REMOVED*** @param {Element} anchorElement Element the movable element should be
***REMOVED***     anchored against.
***REMOVED*** @param {goog.positioning.Corner} corner Corner of anchored element the
***REMOVED***     movable element should be positioned at.
***REMOVED*** @param {number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
***REMOVED***     not specified. Bitmap, {@see goog.positioning.Overflow}.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AbstractPosition}
***REMOVED***
goog.positioning.AnchoredPosition = function(anchorElement,
                                             corner,
                                             opt_overflow) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Element the movable element should be anchored against.
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.element = anchorElement;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Corner of anchored element the movable element should be positioned at.
  ***REMOVED*** @type {goog.positioning.Corner}
 ***REMOVED*****REMOVED***
  this.corner = corner;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Overflow handling mode. Defaults to IGNORE if not specified.
  ***REMOVED*** Bitmap, {@see goog.positioning.Overflow}.
  ***REMOVED*** @type {number|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.overflow_ = opt_overflow;
***REMOVED***
goog.inherits(goog.positioning.AnchoredPosition,
              goog.positioning.AbstractPosition);


***REMOVED***
***REMOVED*** Repositions the movable element.
***REMOVED***
***REMOVED*** @param {Element} movableElement Element to position.
***REMOVED*** @param {goog.positioning.Corner} movableCorner Corner of the movable element
***REMOVED***     that should be positioned adjacent to the anchored element.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specifin pixels.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize PreferredSize of the
***REMOVED***     movableElement (unused in this class).
***REMOVED*** @override
***REMOVED***
goog.positioning.AnchoredPosition.prototype.reposition = function(
    movableElement, movableCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtAnchor(this.element,
                                    this.corner,
                                    movableElement,
                                    movableCorner,
                                    undefined,
                                    opt_margin,
                                    this.overflow_);
***REMOVED***
