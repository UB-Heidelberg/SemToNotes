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
***REMOVED*** @fileoverview Anchored viewport positioning class.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.positioning.AnchoredViewportPosition');

goog.require('goog.math.Box');
goog.require('goog.positioning');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.Overflow');
goog.require('goog.positioning.OverflowStatus');



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is anchored at a corner of
***REMOVED*** an element. The corners are swapped if dictated by the viewport. For instance
***REMOVED*** if a popup is anchored with its top left corner to the bottom left corner of
***REMOVED*** the anchor the popup is either displayed below the anchor (as specified) or
***REMOVED*** above it if there's not enough room to display it below.
***REMOVED***
***REMOVED*** When using this positioning object it's recommended that the movable element
***REMOVED*** be absolutely positioned.
***REMOVED***
***REMOVED*** @param {Element} anchorElement Element the movable element should be
***REMOVED***     anchored against.
***REMOVED*** @param {goog.positioning.Corner} corner Corner of anchored element the
***REMOVED***     movable element should be positioned at.
***REMOVED*** @param {boolean=} opt_adjust Whether the positioning should be adjusted until
***REMOVED***     the element fits inside the viewport even if that means that the anchored
***REMOVED***     corners are ignored.
***REMOVED*** @param {goog.math.Box=} opt_overflowConstraint Box object describing the
***REMOVED***     dimensions in which the movable element could be shown.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AnchoredPosition}
***REMOVED***
goog.positioning.AnchoredViewportPosition = function(anchorElement,
                                                     corner,
                                                     opt_adjust,
                                                     opt_overflowConstraint) {
  goog.positioning.AnchoredPosition.call(this, anchorElement, corner);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last resort algorithm to use if the algorithm can't fit inside
  ***REMOVED*** the viewport.
  ***REMOVED***
  ***REMOVED*** IGNORE = do nothing, just display at the preferred position.
  ***REMOVED***
  ***REMOVED*** ADJUST_X | ADJUST_Y = Adjust until the element fits, even if that means
  ***REMOVED*** that the anchored corners are ignored.
  ***REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastResortOverflow_ = opt_adjust ?
      (goog.positioning.Overflow.ADJUST_X |
       goog.positioning.Overflow.ADJUST_Y) :
      goog.positioning.Overflow.IGNORE;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The dimensions in which the movable element could be shown.
  ***REMOVED*** @type {goog.math.Box|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.overflowConstraint_ = opt_overflowConstraint || undefined;
***REMOVED***
goog.inherits(goog.positioning.AnchoredViewportPosition,
              goog.positioning.AnchoredPosition);


***REMOVED***
***REMOVED*** @return {goog.math.Box|undefined} The box object describing the
***REMOVED***     dimensions in which the movable element will be shown.
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.getOverflowConstraint =
    function() {
  return this.overflowConstraint_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Box|undefined} overflowConstraint Box object describing the
***REMOVED***     dimensions in which the movable element could be shown.
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.setOverflowConstraint =
    function(overflowConstraint) {
  this.overflowConstraint_ = overflowConstraint;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} A bitmask for the "last resort" overflow.
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.getLastResortOverflow =
    function() {
  return this.lastResortOverflow_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} lastResortOverflow A bitmask for the "last resort" overflow,
***REMOVED***     if we fail to fit the element on-screen.
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.setLastResortOverflow =
    function(lastResortOverflow) {
  this.lastResortOverflow_ = lastResortOverflow;
***REMOVED***


***REMOVED***
***REMOVED*** Repositions the movable element.
***REMOVED***
***REMOVED*** @param {Element} movableElement Element to position.
***REMOVED*** @param {goog.positioning.Corner} movableCorner Corner of the movable element
***REMOVED***     that should be positioned adjacent to the anchored element.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize The preferred size of the
***REMOVED***     movableElement.
***REMOVED*** @override
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.reposition = function(
    movableElement, movableCorner, opt_margin, opt_preferredSize) {
  var status = goog.positioning.positionAtAnchor(this.element, this.corner,
      movableElement, movableCorner, null, opt_margin,
      goog.positioning.Overflow.FAIL_X | goog.positioning.Overflow.FAIL_Y,
      opt_preferredSize, this.overflowConstraint_);

  // If the desired position is outside the viewport try mirroring the corners
  // horizontally or vertically.
  if (status & goog.positioning.OverflowStatus.FAILED) {
    var cornerFallback = this.adjustCorner(status, this.corner);
    var movableCornerFallback = this.adjustCorner(status, movableCorner);

    status = goog.positioning.positionAtAnchor(this.element, cornerFallback,
        movableElement, movableCornerFallback, null, opt_margin,
        goog.positioning.Overflow.FAIL_X | goog.positioning.Overflow.FAIL_Y,
        opt_preferredSize, this.overflowConstraint_);

    if (status & goog.positioning.OverflowStatus.FAILED) {
      // If that also fails, pick the best corner from the two tries,
      // and adjust the position until it fits.
      cornerFallback = this.adjustCorner(status, cornerFallback);
      movableCornerFallback = this.adjustCorner(
          status, movableCornerFallback);

      goog.positioning.positionAtAnchor(this.element, cornerFallback,
          movableElement, movableCornerFallback, null, opt_margin,
          this.getLastResortOverflow(), opt_preferredSize,
          this.overflowConstraint_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adjusts the corner if X or Y positioning failed.
***REMOVED*** @param {number} status The status of the last positionAtAnchor call.
***REMOVED*** @param {goog.positioning.Corner} corner The corner to adjust.
***REMOVED*** @return {goog.positioning.Corner} The adjusted corner.
***REMOVED*** @protected
***REMOVED***
goog.positioning.AnchoredViewportPosition.prototype.adjustCorner = function(
    status, corner) {
  if (status & goog.positioning.OverflowStatus.FAILED_HORIZONTAL) {
    corner = goog.positioning.flipCornerHorizontal(corner);
  }

  if (status & goog.positioning.OverflowStatus.FAILED_VERTICAL) {
    corner = goog.positioning.flipCornerVertical(corner);
  }

  return corner;
***REMOVED***

