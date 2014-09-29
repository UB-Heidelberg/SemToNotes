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
***REMOVED*** @fileoverview A utility class for representing rectangles.
***REMOVED***


goog.provide('goog.math.Rect');

goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');



***REMOVED***
***REMOVED*** Class for representing rectangular regions.
***REMOVED*** @param {number} x Left.
***REMOVED*** @param {number} y Top.
***REMOVED*** @param {number} w Width.
***REMOVED*** @param {number} h Height.
***REMOVED***
***REMOVED***
goog.math.Rect = function(x, y, w, h) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Left
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.left = x;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Top
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.top = y;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Width
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.width = w;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Height
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.height = h;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new copy of the rectangle.
***REMOVED*** @return {!goog.math.Rect} A clone of this Rectangle.
***REMOVED***
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new Box object with the same position and dimensions as this
***REMOVED*** rectangle.
***REMOVED*** @return {!goog.math.Box} A new Box representation of this Rectangle.
***REMOVED***
goog.math.Rect.prototype.toBox = function() {
  var right = this.left + this.width;
  var bottom = this.top + this.height;
  return new goog.math.Box(this.top,
                           right,
                           bottom,
                           this.left);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new Rect object with the same position and dimensions as a given
***REMOVED*** Box.  Note that this is only the inverse of toBox if left/top are defined.
***REMOVED*** @param {goog.math.Box} box A box.
***REMOVED*** @return {!goog.math.Rect} A new Rect initialized with the box's position
***REMOVED***     and size.
***REMOVED***
goog.math.Rect.createFromBox = function(box) {
  return new goog.math.Rect(box.left, box.top,
      box.right - box.left, box.bottom - box.top);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a nice string representing size and dimensions of rectangle.
  ***REMOVED*** @return {string} In the form (50, 73 - 75w x 25h).
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Rect.prototype.toString = function() {
    return '(' + this.left + ', ' + this.top + ' - ' + this.width + 'w x ' +
           this.height + 'h)';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Compares rectangles for equality.
***REMOVED*** @param {goog.math.Rect} a A Rectangle.
***REMOVED*** @param {goog.math.Rect} b A Rectangle.
***REMOVED*** @return {boolean} True iff the rectangles have the same left, top, width,
***REMOVED***     and height, or if both are null.
***REMOVED***
goog.math.Rect.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.left == b.left && a.width == b.width &&
         a.top == b.top && a.height == b.height;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the intersection of this rectangle and the rectangle parameter.  If
***REMOVED*** there is no intersection, returns false and leaves this rectangle as is.
***REMOVED*** @param {goog.math.Rect} rect A Rectangle.
***REMOVED*** @return {boolean} True iff this rectangle intersects with the parameter.
***REMOVED***
goog.math.Rect.prototype.intersection = function(rect) {
  var x0 = Math.max(this.left, rect.left);
  var x1 = Math.min(this.left + this.width, rect.left + rect.width);

  if (x0 <= x1) {
    var y0 = Math.max(this.top, rect.top);
    var y1 = Math.min(this.top + this.height, rect.top + rect.height);

    if (y0 <= y1) {
      this.left = x0;
      this.top = y0;
      this.width = x1 - x0;
      this.height = y1 - y0;

      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the intersection of two rectangles. Two rectangles intersect if they
***REMOVED*** touch at all, for example, two zero width and height rectangles would
***REMOVED*** intersect if they had the same top and left.
***REMOVED*** @param {goog.math.Rect} a A Rectangle.
***REMOVED*** @param {goog.math.Rect} b A Rectangle.
***REMOVED*** @return {goog.math.Rect} A new intersection rect (even if width and height
***REMOVED***     are 0), or null if there is no intersection.
***REMOVED***
goog.math.Rect.intersection = function(a, b) {
  // There is no nice way to do intersection via a clone, because any such
  // clone might be unnecessary if this function returns null.  So, we duplicate
  // code from above.

  var x0 = Math.max(a.left, b.left);
  var x1 = Math.min(a.left + a.width, b.left + b.width);

  if (x0 <= x1) {
    var y0 = Math.max(a.top, b.top);
    var y1 = Math.min(a.top + a.height, b.top + b.height);

    if (y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether two rectangles intersect. Two rectangles intersect if they
***REMOVED*** touch at all, for example, two zero width and height rectangles would
***REMOVED*** intersect if they had the same top and left.
***REMOVED*** @param {goog.math.Rect} a A Rectangle.
***REMOVED*** @param {goog.math.Rect} b A Rectangle.
***REMOVED*** @return {boolean} Whether a and b intersect.
***REMOVED***
goog.math.Rect.intersects = function(a, b) {
  return (a.left <= b.left + b.width && b.left <= a.left + a.width &&
      a.top <= b.top + b.height && b.top <= a.top + a.height);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether a rectangle intersects this rectangle.
***REMOVED*** @param {goog.math.Rect} rect A rectangle.
***REMOVED*** @return {boolean} Whether rect intersects this rectangle.
***REMOVED***
goog.math.Rect.prototype.intersects = function(rect) {
  return goog.math.Rect.intersects(this, rect);
***REMOVED***


***REMOVED***
***REMOVED*** Computes the difference regions between two rectangles. The return value is
***REMOVED*** an array of 0 to 4 rectangles defining the remaining regions of the first
***REMOVED*** rectangle after the second has been subtracted.
***REMOVED*** @param {goog.math.Rect} a A Rectangle.
***REMOVED*** @param {goog.math.Rect} b A Rectangle.
***REMOVED*** @return {!Array.<!goog.math.Rect>} An array with 0 to 4 rectangles which
***REMOVED***     together define the difference area of rectangle a minus rectangle b.
***REMOVED***
goog.math.Rect.difference = function(a, b) {
  var intersection = goog.math.Rect.intersection(a, b);
  if (!intersection || !intersection.height || !intersection.width) {
    return [a.clone()];
  }

  var result = [];

  var top = a.top;
  var height = a.height;

  var ar = a.left + a.width;
  var ab = a.top + a.height;

  var br = b.left + b.width;
  var bb = b.top + b.height;

  // Subtract off any area on top where A extends past B
  if (b.top > a.top) {
    result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    top = b.top;
    // If we're moving the top down, we also need to subtract the height diff.
    height -= b.top - a.top;
  }
  // Subtract off any area on bottom where A extends past B
  if (bb < ab) {
    result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb));
    height = bb - top;
  }
  // Subtract any area on left where A extends past B
  if (b.left > a.left) {
    result.push(new goog.math.Rect(a.left, top, b.left - a.left, height));
  }
  // Subtract any area on right where A extends past B
  if (br < ar) {
    result.push(new goog.math.Rect(br, top, ar - br, height));
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the difference regions between this rectangle and {@code rect}. The
***REMOVED*** return value is an array of 0 to 4 rectangles defining the remaining regions
***REMOVED*** of this rectangle after the other has been subtracted.
***REMOVED*** @param {goog.math.Rect} rect A Rectangle.
***REMOVED*** @return {!Array.<!goog.math.Rect>} An array with 0 to 4 rectangles which
***REMOVED***     together define the difference area of rectangle a minus rectangle b.
***REMOVED***
goog.math.Rect.prototype.difference = function(rect) {
  return goog.math.Rect.difference(this, rect);
***REMOVED***


***REMOVED***
***REMOVED*** Expand this rectangle to also include the area of the given rectangle.
***REMOVED*** @param {goog.math.Rect} rect The other rectangle.
***REMOVED***
goog.math.Rect.prototype.boundingRect = function(rect) {
  // We compute right and bottom before we change left and top below.
  var right = Math.max(this.left + this.width, rect.left + rect.width);
  var bottom = Math.max(this.top + this.height, rect.top + rect.height);

  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);

  this.width = right - this.left;
  this.height = bottom - this.top;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new rectangle which completely contains both input rectangles.
***REMOVED*** @param {goog.math.Rect} a A rectangle.
***REMOVED*** @param {goog.math.Rect} b A rectangle.
***REMOVED*** @return {goog.math.Rect} A new bounding rect, or null if either rect is
***REMOVED***     null.
***REMOVED***
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }

  var clone = a.clone();
  clone.boundingRect(b);

  return clone;
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether this rectangle entirely contains another rectangle or
***REMOVED*** coordinate.
***REMOVED***
***REMOVED*** @param {goog.math.Rect|goog.math.Coordinate} another The rectangle or
***REMOVED***     coordinate to test for containment.
***REMOVED*** @return {boolean} Whether this rectangle contains given rectangle or
***REMOVED***     coordinate.
***REMOVED***
goog.math.Rect.prototype.contains = function(another) {
  if (another instanceof goog.math.Rect) {
    return this.left <= another.left &&
           this.left + this.width >= another.left + another.width &&
           this.top <= another.top &&
           this.top + this.height >= another.top + another.height;
  } else { // (another instanceof goog.math.Coordinate)
    return another.x >= this.left &&
           another.x <= this.left + this.width &&
           another.y >= this.top &&
           another.y <= this.top + this.height;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the size of this rectangle.
***REMOVED*** @return {!goog.math.Size} The size of this rectangle.
***REMOVED***
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to the next larger integer values.
***REMOVED*** @return {!goog.math.Rect} This rectangle with ceil'd fields.
***REMOVED***
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to the next smaller integer values.
***REMOVED*** @return {!goog.math.Rect} This rectangle with floored fields.
***REMOVED***
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to nearest integer values.
***REMOVED*** @return {!goog.math.Rect} This rectangle with rounded fields.
***REMOVED***
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Translates this rectangle by the given offsets. If a
***REMOVED*** {@code goog.math.Coordinate} is given, then the left and top values are
***REMOVED*** translated by the coordinate's x and y values. Otherwise, top and left are
***REMOVED*** translated by {@code tx} and {@code opt_ty} respectively.
***REMOVED*** @param {number|goog.math.Coordinate} tx The value to translate left by or the
***REMOVED***     the coordinate to translate this rect by.
***REMOVED*** @param {number=} opt_ty The value to translate top by.
***REMOVED*** @return {!goog.math.Rect} This rectangle after translating.
***REMOVED***
goog.math.Rect.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.top += tx.y;
  } else {
    this.left += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Scales this rectangle by the given scale factors. The left and width values
***REMOVED*** are scaled by {@code sx} and the top and height values are scaled by
***REMOVED*** {@code opt_sy}.  If {@code opt_sy} is not given, then all fields are scaled
***REMOVED*** by {@code sx}.
***REMOVED*** @param {number} sx The scale factor to use for the x dimension.
***REMOVED*** @param {number=} opt_sy The scale factor to use for the y dimension.
***REMOVED*** @return {!goog.math.Rect} This rectangle after scaling.
***REMOVED***
goog.math.Rect.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left***REMOVED***= sx;
  this.width***REMOVED***= sx;
  this.top***REMOVED***= sy;
  this.height***REMOVED***= sy;
  return this;
***REMOVED***
