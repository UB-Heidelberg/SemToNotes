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
***REMOVED*** @fileoverview Common positioning code.
***REMOVED***
***REMOVED***

goog.provide('goog.positioning');
goog.provide('goog.positioning.Corner');
goog.provide('goog.positioning.CornerBit');
goog.provide('goog.positioning.Overflow');
goog.provide('goog.positioning.OverflowStatus');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.style.bidi');


***REMOVED***
***REMOVED*** Enum for representing an element corner for positioning the popup.
***REMOVED***
***REMOVED*** The START constants map to LEFT if element directionality is left
***REMOVED*** to right and RIGHT if the directionality is right to left.
***REMOVED*** Likewise END maps to RIGHT or LEFT depending on the directionality.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.positioning.Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: 2,
  BOTTOM_LEFT: 1,
  BOTTOM_RIGHT: 3,
  TOP_START: 4,
  TOP_END: 6,
  BOTTOM_START: 5,
  BOTTOM_END: 7
***REMOVED***


***REMOVED***
***REMOVED*** Enum for bits in the {@see goog.positioning.Corner) bitmap.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.positioning.CornerBit = {
  BOTTOM: 1,
  RIGHT: 2,
  FLIP_RTL: 4
***REMOVED***


***REMOVED***
***REMOVED*** Enum for representing position handling in cases where the element would be
***REMOVED*** positioned outside the viewport.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.positioning.Overflow = {
 ***REMOVED*****REMOVED*** Ignore overflow***REMOVED***
  IGNORE: 0,

 ***REMOVED*****REMOVED*** Try to fit horizontally in the viewport at all costs.***REMOVED***
  ADJUST_X: 1,

 ***REMOVED*****REMOVED*** If the element can't fit horizontally, report positioning failure.***REMOVED***
  FAIL_X: 2,

 ***REMOVED*****REMOVED*** Try to fit vertically in the viewport at all costs.***REMOVED***
  ADJUST_Y: 4,

 ***REMOVED*****REMOVED*** If the element can't fit vertically, report positioning failure.***REMOVED***
  FAIL_Y: 8,

 ***REMOVED*****REMOVED*** Resize the element's width to fit in the viewport.***REMOVED***
  RESIZE_WIDTH: 16,

 ***REMOVED*****REMOVED*** Resize the element's height to fit in the viewport.***REMOVED***
  RESIZE_HEIGHT: 32,

 ***REMOVED*****REMOVED***
  ***REMOVED*** If the anchor goes off-screen in the x-direction, position the movable
  ***REMOVED*** element off-screen. Otherwise, try to fit horizontally in the viewport.
 ***REMOVED*****REMOVED***
  ADJUST_X_EXCEPT_OFFSCREEN: 64 | 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** If the anchor goes off-screen in the y-direction, position the movable
  ***REMOVED*** element off-screen. Otherwise, try to fit vertically in the viewport.
 ***REMOVED*****REMOVED***
  ADJUST_Y_EXCEPT_OFFSCREEN: 128 | 4
***REMOVED***


***REMOVED***
***REMOVED*** Enum for representing the outcome of a positioning call.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.positioning.OverflowStatus = {
  NONE: 0,
  ADJUSTED_X: 1,
  ADJUSTED_Y: 2,
  WIDTH_ADJUSTED: 4,
  HEIGHT_ADJUSTED: 8,
  FAILED_LEFT: 16,
  FAILED_RIGHT: 32,
  FAILED_TOP: 64,
  FAILED_BOTTOM: 128,
  FAILED_OUTSIDE_VIEWPORT: 256
***REMOVED***


***REMOVED***
***REMOVED*** Shorthand to check if a status code contains any fail code.
***REMOVED*** @type {number}
***REMOVED***
goog.positioning.OverflowStatus.FAILED =
    goog.positioning.OverflowStatus.FAILED_LEFT |
    goog.positioning.OverflowStatus.FAILED_RIGHT |
    goog.positioning.OverflowStatus.FAILED_TOP |
    goog.positioning.OverflowStatus.FAILED_BOTTOM |
    goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT;


***REMOVED***
***REMOVED*** Shorthand to check if horizontal positioning failed.
***REMOVED*** @type {number}
***REMOVED***
goog.positioning.OverflowStatus.FAILED_HORIZONTAL =
    goog.positioning.OverflowStatus.FAILED_LEFT |
    goog.positioning.OverflowStatus.FAILED_RIGHT;


***REMOVED***
***REMOVED*** Shorthand to check if vertical positioning failed.
***REMOVED*** @type {number}
***REMOVED***
goog.positioning.OverflowStatus.FAILED_VERTICAL =
    goog.positioning.OverflowStatus.FAILED_TOP |
    goog.positioning.OverflowStatus.FAILED_BOTTOM;


***REMOVED***
***REMOVED*** Positions a movable element relative to an anchor element. The caller
***REMOVED*** specifies the corners that should touch. This functions then moves the
***REMOVED*** movable element accordingly.
***REMOVED***
***REMOVED*** @param {Element} anchorElement The element that is the anchor for where
***REMOVED***    the movable element should position itself.
***REMOVED*** @param {goog.positioning.Corner} anchorElementCorner The corner of the
***REMOVED***     anchorElement for positioning the movable element.
***REMOVED*** @param {Element} movableElement The element to move.
***REMOVED*** @param {goog.positioning.Corner} movableElementCorner The corner of the
***REMOVED***     movableElement that that should be positioned adjacent to the anchor
***REMOVED***     element.
***REMOVED*** @param {goog.math.Coordinate=} opt_offset An offset specified in pixels.
***REMOVED***    After the normal positioning algorithm is applied, the offset is then
***REMOVED***    applied. Positive coordinates move the popup closer to the center of the
***REMOVED***    anchor element. Negative coordinates move the popup away from the center
***REMOVED***    of the anchor element.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED***    After the normal positioning algorithm is applied and any offset, the
***REMOVED***    margin is then applied. Positive coordinates move the popup away from the
***REMOVED***    spot it was positioned towards its center. Negative coordinates move it
***REMOVED***    towards the spot it was positioned away from its center.
***REMOVED*** @param {?number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
***REMOVED***     not specified. Bitmap, {@see goog.positioning.Overflow}.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize The preferred size of the
***REMOVED***     movableElement.
***REMOVED*** @param {goog.math.Box=} opt_viewport Box object describing the dimensions of
***REMOVED***     the viewport. If not provided, a default one will be calculated by the
***REMOVED***     position of the anchorElement and its moveable parent element.
***REMOVED*** @return {goog.positioning.OverflowStatus} Status bitmap,
***REMOVED***     {@see goog.positioning.OverflowStatus}.
***REMOVED***
goog.positioning.positionAtAnchor = function(anchorElement,
                                             anchorElementCorner,
                                             movableElement,
                                             movableElementCorner,
                                             opt_offset,
                                             opt_margin,
                                             opt_overflow,
                                             opt_preferredSize,
                                             opt_viewport) {

  goog.asserts.assert(movableElement);
  var movableParentTopLeft =
      goog.positioning.getOffsetParentPageOffset(movableElement);

  // Get the visible part of the anchor element.  anchorRect is
  // relative to anchorElement's page.
  var anchorRect = goog.positioning.getVisiblePart_(anchorElement);

  // Translate anchorRect to be relative to movableElement's page.
  goog.style.translateRectForAnotherFrame(
      anchorRect,
      goog.dom.getDomHelper(anchorElement),
      goog.dom.getDomHelper(movableElement));

  // Offset based on which corner of the element we want to position against.
  var corner = goog.positioning.getEffectiveCorner(anchorElement,
                                                   anchorElementCorner);
  // absolutePos is a candidate position relative to the
  // movableElement's window.
  var absolutePos = new goog.math.Coordinate(
      corner & goog.positioning.CornerBit.RIGHT ?
          anchorRect.left + anchorRect.width : anchorRect.left,
      corner & goog.positioning.CornerBit.BOTTOM ?
          anchorRect.top + anchorRect.height : anchorRect.top);

  // Translate absolutePos to be relative to the offsetParent.
  absolutePos =
      goog.math.Coordinate.difference(absolutePos, movableParentTopLeft);

  // Apply offset, if specified
  if (opt_offset) {
    absolutePos.x += (corner & goog.positioning.CornerBit.RIGHT ? -1 : 1)***REMOVED***
        opt_offset.x;
    absolutePos.y += (corner & goog.positioning.CornerBit.BOTTOM ? -1 : 1)***REMOVED***
        opt_offset.y;
  }

  // Determine dimension of viewport.
  var viewport;
  if (opt_overflow) {
    if (opt_viewport) {
      viewport = opt_viewport;
    } else {
      viewport = goog.style.getVisibleRectForElement(movableElement);
      if (viewport) {
        viewport.top -= movableParentTopLeft.y;
        viewport.right -= movableParentTopLeft.x;
        viewport.bottom -= movableParentTopLeft.y;
        viewport.left -= movableParentTopLeft.x;
      }
    }
  }

  return goog.positioning.positionAtCoordinate(absolutePos,
                                               movableElement,
                                               movableElementCorner,
                                               opt_margin,
                                               viewport,
                                               opt_overflow,
                                               opt_preferredSize);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the page offset of the given element's
***REMOVED*** offsetParent. This value can be used to translate any x- and
***REMOVED*** y-offset relative to the page to an offset relative to the
***REMOVED*** offsetParent, which can then be used directly with as position
***REMOVED*** coordinate for {@code positionWithCoordinate}.
***REMOVED*** @param {!Element} movableElement The element to calculate.
***REMOVED*** @return {!goog.math.Coordinate} The page offset, may be (0, 0).
***REMOVED***
goog.positioning.getOffsetParentPageOffset = function(movableElement) {
  // Ignore offset for the BODY element unless its position is non-static.
  // For cases where the offset parent is HTML rather than the BODY (such as in
  // IE strict mode) there's no need to get the position of the BODY as it
  // doesn't affect the page offset.
  var movableParentTopLeft;
  var parent = movableElement.offsetParent;
  if (parent) {
    var isBody = parent.tagName == goog.dom.TagName.HTML ||
        parent.tagName == goog.dom.TagName.BODY;
    if (!isBody ||
        goog.style.getComputedPosition(parent) != 'static') {
      // Get the top-left corner of the parent, in page coordinates.
      movableParentTopLeft = goog.style.getPageOffset(parent);

      if (!isBody) {
        movableParentTopLeft = goog.math.Coordinate.difference(
            movableParentTopLeft,
            new goog.math.Coordinate(goog.style.bidi.getScrollLeft(parent),
                parent.scrollTop));
      }
    }
  }

  return movableParentTopLeft || new goog.math.Coordinate();
***REMOVED***


***REMOVED***
***REMOVED*** Returns intersection of the specified element and
***REMOVED*** goog.style.getVisibleRectForElement for it.
***REMOVED***
***REMOVED*** @param {Element} el The target element.
***REMOVED*** @return {goog.math.Rect} Intersection of getVisibleRectForElement
***REMOVED***     and the current bounding rectangle of the element.  If the
***REMOVED***     intersection is empty, returns the bounding rectangle.
***REMOVED*** @private
***REMOVED***
goog.positioning.getVisiblePart_ = function(el) {
  var rect = goog.style.getBounds(el);
  var visibleBox = goog.style.getVisibleRectForElement(el);
  if (visibleBox) {
    rect.intersection(goog.math.Rect.createFromBox(visibleBox));
  }
  return rect;
***REMOVED***


***REMOVED***
***REMOVED*** Positions the specified corner of the movable element at the
***REMOVED*** specified coordinate.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate} absolutePos The coordinate to position the
***REMOVED***     element at.
***REMOVED*** @param {Element} movableElement The element to be positioned.
***REMOVED*** @param {goog.positioning.Corner} movableElementCorner The corner of the
***REMOVED***     movableElement that that should be positioned.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED***    After the normal positioning algorithm is applied and any offset, the
***REMOVED***    margin is then applied. Positive coordinates move the popup away from the
***REMOVED***    spot it was positioned towards its center. Negative coordinates move it
***REMOVED***    towards the spot it was positioned away from its center.
***REMOVED*** @param {goog.math.Box=} opt_viewport Box object describing the dimensions of
***REMOVED***     the viewport. Required if opt_overflow is specified.
***REMOVED*** @param {?number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
***REMOVED***     not specified, {@see goog.positioning.Overflow}.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize The preferred size of the
***REMOVED***     movableElement. Defaults to the current size.
***REMOVED*** @return {goog.positioning.OverflowStatus} Status bitmap.
***REMOVED***
goog.positioning.positionAtCoordinate = function(absolutePos,
                                                 movableElement,
                                                 movableElementCorner,
                                                 opt_margin,
                                                 opt_viewport,
                                                 opt_overflow,
                                                 opt_preferredSize) {
  absolutePos = absolutePos.clone();
  var status = goog.positioning.OverflowStatus.NONE;

  // Offset based on attached corner and desired margin.
  var corner = goog.positioning.getEffectiveCorner(movableElement,
                                                   movableElementCorner);
  var elementSize = goog.style.getSize(movableElement);
  var size = opt_preferredSize ? opt_preferredSize.clone() :
      elementSize.clone();

  if (opt_margin || corner != goog.positioning.Corner.TOP_LEFT) {
    if (corner & goog.positioning.CornerBit.RIGHT) {
      absolutePos.x -= size.width + (opt_margin ? opt_margin.right : 0);
    } else if (opt_margin) {
      absolutePos.x += opt_margin.left;
    }
    if (corner & goog.positioning.CornerBit.BOTTOM) {
      absolutePos.y -= size.height + (opt_margin ? opt_margin.bottom : 0);
    } else if (opt_margin) {
      absolutePos.y += opt_margin.top;
    }
  }

  // Adjust position to fit inside viewport.
  if (opt_overflow) {
    status = opt_viewport ?
        goog.positioning.adjustForViewport_(
            absolutePos, size, opt_viewport, opt_overflow) :
        goog.positioning.OverflowStatus.FAILED_OUTSIDE_VIEWPORT;
    if (status & goog.positioning.OverflowStatus.FAILED) {
      return status;
    }
  }

  goog.style.setPosition(movableElement, absolutePos);
  if (!goog.math.Size.equals(elementSize, size)) {
    goog.style.setBorderBoxSize(movableElement, size);
  }

  return status;
***REMOVED***


***REMOVED***
***REMOVED*** Adjusts the position and/or size of an element, identified by its position
***REMOVED*** and size, to fit inside the viewport. If the position or size of the element
***REMOVED*** is adjusted the pos or size objects, respectively, are modified.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate} pos Position of element, updated if the
***REMOVED***     position is adjusted.
***REMOVED*** @param {goog.math.Size} size Size of element, updated if the size is
***REMOVED***     adjusted.
***REMOVED*** @param {goog.math.Box} viewport Bounding box describing the viewport.
***REMOVED*** @param {number} overflow Overflow handling mode,
***REMOVED***     {@see goog.positioning.Overflow}.
***REMOVED*** @return {goog.positioning.OverflowStatus} Status bitmap,
***REMOVED***     {@see goog.positioning.OverflowStatus}.
***REMOVED*** @private
***REMOVED***
goog.positioning.adjustForViewport_ = function(pos, size, viewport, overflow) {
  var status = goog.positioning.OverflowStatus.NONE;

  var ADJUST_X_EXCEPT_OFFSCREEN =
      goog.positioning.Overflow.ADJUST_X_EXCEPT_OFFSCREEN;
  var ADJUST_Y_EXCEPT_OFFSCREEN =
      goog.positioning.Overflow.ADJUST_Y_EXCEPT_OFFSCREEN;
  if ((overflow & ADJUST_X_EXCEPT_OFFSCREEN) == ADJUST_X_EXCEPT_OFFSCREEN &&
      (pos.x < viewport.left || pos.x >= viewport.right)) {
    overflow &= ~goog.positioning.Overflow.ADJUST_X;
  }
  if ((overflow & ADJUST_Y_EXCEPT_OFFSCREEN) == ADJUST_Y_EXCEPT_OFFSCREEN &&
      (pos.y < viewport.top || pos.y >= viewport.bottom)) {
    overflow &= ~goog.positioning.Overflow.ADJUST_Y;
  }

  // Left edge outside viewport, try to move it.
  if (pos.x < viewport.left && overflow & goog.positioning.Overflow.ADJUST_X) {
    pos.x = viewport.left;
    status |= goog.positioning.OverflowStatus.ADJUSTED_X;
  }

  // Left edge inside and right edge outside viewport, try to resize it.
  if (pos.x < viewport.left &&
      pos.x + size.width > viewport.right &&
      overflow & goog.positioning.Overflow.RESIZE_WIDTH) {
    size.width = Math.max(
        size.width - ((pos.x + size.width) - viewport.right), 0);
    status |= goog.positioning.OverflowStatus.WIDTH_ADJUSTED;
  }

  // Right edge outside viewport, try to move it.
  if (pos.x + size.width > viewport.right &&
      overflow & goog.positioning.Overflow.ADJUST_X) {
    pos.x = Math.max(viewport.right - size.width, viewport.left);
    status |= goog.positioning.OverflowStatus.ADJUSTED_X;
  }

  // Left or right edge still outside viewport, fail if the FAIL_X option was
  // specified, ignore it otherwise.
  if (overflow & goog.positioning.Overflow.FAIL_X) {
    status |= (pos.x < viewport.left ?
                   goog.positioning.OverflowStatus.FAILED_LEFT : 0) |
              (pos.x + size.width > viewport.right ?
                   goog.positioning.OverflowStatus.FAILED_RIGHT : 0);
  }

  // Top edge outside viewport, try to move it.
  if (pos.y < viewport.top && overflow & goog.positioning.Overflow.ADJUST_Y) {
    pos.y = viewport.top;
    status |= goog.positioning.OverflowStatus.ADJUSTED_Y;
  }

  // Bottom edge inside and top edge outside viewport, try to resize it.
  if (pos.y <= viewport.top &&
      pos.y + size.height < viewport.bottom &&
      overflow & goog.positioning.Overflow.RESIZE_HEIGHT) {
    size.height = Math.max(size.height - (viewport.top - pos.y), 0);
    pos.y = 0;
    status |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED;
  }

  // Top edge inside and bottom edge outside viewport, try to resize it.
  if (pos.y >= viewport.top &&
      pos.y + size.height > viewport.bottom &&
      overflow & goog.positioning.Overflow.RESIZE_HEIGHT) {
    size.height = Math.max(
        size.height - ((pos.y + size.height) - viewport.bottom), 0);
    status |= goog.positioning.OverflowStatus.HEIGHT_ADJUSTED;
  }

  // Bottom edge outside viewport, try to move it.
  if (pos.y + size.height > viewport.bottom &&
      overflow & goog.positioning.Overflow.ADJUST_Y) {
    pos.y = Math.max(viewport.bottom - size.height, viewport.top);
    status |= goog.positioning.OverflowStatus.ADJUSTED_Y;
  }

  // Top or bottom edge still outside viewport, fail if the FAIL_Y option was
  // specified, ignore it otherwise.
  if (overflow & goog.positioning.Overflow.FAIL_Y) {
    status |= (pos.y < viewport.top ?
                   goog.positioning.OverflowStatus.FAILED_TOP : 0) |
              (pos.y + size.height > viewport.bottom ?
                   goog.positioning.OverflowStatus.FAILED_BOTTOM : 0);
  }

  return status;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an absolute corner (top/bottom left/right) given an absolute
***REMOVED*** or relative (top/bottom start/end) corner and the direction of an element.
***REMOVED*** Absolute corners remain unchanged.
***REMOVED*** @param {Element} element DOM element to test for RTL direction.
***REMOVED*** @param {goog.positioning.Corner} corner The popup corner used for
***REMOVED***     positioning.
***REMOVED*** @return {goog.positioning.Corner} Effective corner.
***REMOVED***
goog.positioning.getEffectiveCorner = function(element, corner) {
  return***REMOVED*****REMOVED*** @type {goog.positioning.Corner}***REMOVED*** (
      (corner & goog.positioning.CornerBit.FLIP_RTL &&
          goog.style.isRightToLeft(element) ?
          corner ^ goog.positioning.CornerBit.RIGHT :
          corner
      ) & ~goog.positioning.CornerBit.FLIP_RTL);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the corner opposite the given one horizontally.
***REMOVED*** @param {goog.positioning.Corner} corner The popup corner used to flip.
***REMOVED*** @return {goog.positioning.Corner} The opposite corner horizontally.
***REMOVED***
goog.positioning.flipCornerHorizontal = function(corner) {
  return***REMOVED*****REMOVED*** @type {goog.positioning.Corner}***REMOVED*** (corner ^
      goog.positioning.CornerBit.RIGHT);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the corner opposite the given one vertically.
***REMOVED*** @param {goog.positioning.Corner} corner The popup corner used to flip.
***REMOVED*** @return {goog.positioning.Corner} The opposite corner vertically.
***REMOVED***
goog.positioning.flipCornerVertical = function(corner) {
  return***REMOVED*****REMOVED*** @type {goog.positioning.Corner}***REMOVED*** (corner ^
      goog.positioning.CornerBit.BOTTOM);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the corner opposite the given one horizontally and vertically.
***REMOVED*** @param {goog.positioning.Corner} corner The popup corner used to flip.
***REMOVED*** @return {goog.positioning.Corner} The opposite corner horizontally and
***REMOVED***     vertically.
***REMOVED***
goog.positioning.flipCorner = function(corner) {
  return***REMOVED*****REMOVED*** @type {goog.positioning.Corner}***REMOVED*** (corner ^
      goog.positioning.CornerBit.BOTTOM ^
      goog.positioning.CornerBit.RIGHT);
***REMOVED***

