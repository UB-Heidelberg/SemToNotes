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
***REMOVED*** @fileoverview A utility class for representing a numeric box.
***REMOVED***


goog.provide('goog.math.Box');

goog.require('goog.math.Coordinate');



***REMOVED***
***REMOVED*** Class for representing a box. A box is specified as a top, right, bottom,
***REMOVED*** and left. A box is useful for representing margins and padding.
***REMOVED***
***REMOVED*** @param {number} top Top.
***REMOVED*** @param {number} right Right.
***REMOVED*** @param {number} bottom Bottom.
***REMOVED*** @param {number} left Left.
***REMOVED***
***REMOVED***
goog.math.Box = function(top, right, bottom, left) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Top
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.top = top;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Right
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.right = right;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Bottom
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.bottom = bottom;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Left
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.left = left;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Box by bounding a collection of goog.math.Coordinate objects
***REMOVED*** @param {...goog.math.Coordinate} var_args Coordinates to be included inside
***REMOVED***     the box.
***REMOVED*** @return {!goog.math.Box} A Box containing all the specified Coordinates.
***REMOVED***
goog.math.Box.boundingBox = function(var_args) {
  var box = new goog.math.Box(arguments[0].y, arguments[0].x,
                              arguments[0].y, arguments[0].x);
  for (var i = 1; i < arguments.length; i++) {
    var coord = arguments[i];
    box.top = Math.min(box.top, coord.y);
    box.right = Math.max(box.right, coord.x);
    box.bottom = Math.max(box.bottom, coord.y);
    box.left = Math.min(box.left, coord.x);
  }
  return box;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a copy of the box with the same dimensions.
***REMOVED*** @return {!goog.math.Box} A clone of this Box.
***REMOVED***
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a nice string representing the box.
  ***REMOVED*** @return {string} In the form (50t, 73r, 24b, 13l).
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Box.prototype.toString = function() {
    return '(' + this.top + 't, ' + this.right + 'r, ' + this.bottom + 'b, ' +
           this.left + 'l)';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Returns whether the box contains a coordinate or another box.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate|goog.math.Box} other A Coordinate or a Box.
***REMOVED*** @return {boolean} Whether the box contains the coordinate or other box.
***REMOVED***
goog.math.Box.prototype.contains = function(other) {
  return goog.math.Box.contains(this, other);
***REMOVED***


***REMOVED***
***REMOVED*** Expands box with the given margins.
***REMOVED***
***REMOVED*** @param {number|goog.math.Box} top Top margin or box with all margins.
***REMOVED*** @param {number=} opt_right Right margin.
***REMOVED*** @param {number=} opt_bottom Bottom margin.
***REMOVED*** @param {number=} opt_left Left margin.
***REMOVED*** @return {!goog.math.Box} A reference to this Box.
***REMOVED***
goog.math.Box.prototype.expand = function(top, opt_right, opt_bottom,
    opt_left) {
  if (goog.isObject(top)) {
    this.top -= top.top;
    this.right += top.right;
    this.bottom += top.bottom;
    this.left -= top.left;
  } else {
    this.top -= top;
    this.right += opt_right;
    this.bottom += opt_bottom;
    this.left -= opt_left;
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Expand this box to include another box.
***REMOVED*** NOTE(user): This is used in code that needs to be very fast, please don't
***REMOVED*** add functionality to this function at the expense of speed (variable
***REMOVED*** arguments, accepting multiple argument types, etc).
***REMOVED*** @param {goog.math.Box} box The box to include in this one.
***REMOVED***
goog.math.Box.prototype.expandToInclude = function(box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom);
***REMOVED***


***REMOVED***
***REMOVED*** Compares boxes for equality.
***REMOVED*** @param {goog.math.Box} a A Box.
***REMOVED*** @param {goog.math.Box} b A Box.
***REMOVED*** @return {boolean} True iff the boxes are equal, or if both are null.
***REMOVED***
goog.math.Box.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.top == b.top && a.right == b.right &&
         a.bottom == b.bottom && a.left == b.left;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether a box contains a coordinate or another box.
***REMOVED***
***REMOVED*** @param {goog.math.Box} box A Box.
***REMOVED*** @param {goog.math.Coordinate|goog.math.Box} other A Coordinate or a Box.
***REMOVED*** @return {boolean} Whether the box contains the coordinate or other box.
***REMOVED***
goog.math.Box.contains = function(box, other) {
  if (!box || !other) {
    return false;
  }

  if (other instanceof goog.math.Box) {
    return other.left >= box.left && other.right <= box.right &&
        other.top >= box.top && other.bottom <= box.bottom;
  }

  // other is a Coordinate.
  return other.x >= box.left && other.x <= box.right &&
         other.y >= box.top && other.y <= box.bottom;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the relative x position of a coordinate compared to a box.  Returns
***REMOVED*** zero if the coordinate is inside the box.
***REMOVED***
***REMOVED*** @param {goog.math.Box} box A Box.
***REMOVED*** @param {goog.math.Coordinate} coord A Coordinate.
***REMOVED*** @return {number} The x position of {@code coord} relative to the nearest
***REMOVED***     side of {@code box}, or zero if {@code coord} is inside {@code box}.
***REMOVED***
goog.math.Box.relativePositionX = function(box, coord) {
  if (coord.x < box.left) {
    return coord.x - box.left;
  } else if (coord.x > box.right) {
    return coord.x - box.right;
  }
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the relative y position of a coordinate compared to a box.  Returns
***REMOVED*** zero if the coordinate is inside the box.
***REMOVED***
***REMOVED*** @param {goog.math.Box} box A Box.
***REMOVED*** @param {goog.math.Coordinate} coord A Coordinate.
***REMOVED*** @return {number} The y position of {@code coord} relative to the nearest
***REMOVED***     side of {@code box}, or zero if {@code coord} is inside {@code box}.
***REMOVED***
goog.math.Box.relativePositionY = function(box, coord) {
  if (coord.y < box.top) {
    return coord.y - box.top;
  } else if (coord.y > box.bottom) {
    return coord.y - box.bottom;
  }
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between a coordinate and the nearest corner/side of a
***REMOVED*** box. Returns zero if the coordinate is inside the box.
***REMOVED***
***REMOVED*** @param {goog.math.Box} box A Box.
***REMOVED*** @param {goog.math.Coordinate} coord A Coordinate.
***REMOVED*** @return {number} The distance between {@code coord} and the nearest
***REMOVED***     corner/side of {@code box}, or zero if {@code coord} is inside
***REMOVED***     {@code box}.
***REMOVED***
goog.math.Box.distance = function(box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord);
  var y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether two boxes intersect.
***REMOVED***
***REMOVED*** @param {goog.math.Box} a A Box.
***REMOVED*** @param {goog.math.Box} b A second Box.
***REMOVED*** @return {boolean} Whether the boxes intersect.
***REMOVED***
goog.math.Box.intersects = function(a, b) {
  return (a.left <= b.right && b.left <= a.right &&
          a.top <= b.bottom && b.top <= a.bottom);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether two boxes would intersect with additional padding.
***REMOVED***
***REMOVED*** @param {goog.math.Box} a A Box.
***REMOVED*** @param {goog.math.Box} b A second Box.
***REMOVED*** @param {number} padding The additional padding.
***REMOVED*** @return {boolean} Whether the boxes intersect.
***REMOVED***
goog.math.Box.intersectsWithPadding = function(a, b, padding) {
  return (a.left <= b.right + padding && b.left <= a.right + padding &&
          a.top <= b.bottom + padding && b.top <= a.bottom + padding);
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to the next larger integer values.
***REMOVED***
***REMOVED*** @return {!goog.math.Box} This box with ceil'd fields.
***REMOVED***
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to the next smaller integer values.
***REMOVED***
***REMOVED*** @return {!goog.math.Box} This box with floored fields.
***REMOVED***
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the fields to nearest integer values.
***REMOVED***
***REMOVED*** @return {!goog.math.Box} This box with rounded fields.
***REMOVED***
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Translates this box by the given offsets. If a {@code goog.math.Coordinate}
***REMOVED*** is given, then the left and right values are translated by the coordinate's
***REMOVED*** x value and the top and bottom values are translated by the coordinate's y
***REMOVED*** value.  Otherwise, {@code tx} and {@code opt_ty} are used to translate the x
***REMOVED*** and y dimension values.
***REMOVED***
***REMOVED*** @param {number|goog.math.Coordinate} tx The value to translate the x
***REMOVED***     dimension values by or the the coordinate to translate this box by.
***REMOVED*** @param {number=} opt_ty The value to translate y dimension values by.
***REMOVED*** @return {!goog.math.Box} This box after translating.
***REMOVED***
goog.math.Box.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.right += tx.x;
    this.top += tx.y;
    this.bottom += tx.y;
  } else {
    this.left += tx;
    this.right += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
      this.bottom += opt_ty;
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Scales this coordinate by the given scale factors. The x and y dimension
***REMOVED*** values are scaled by {@code sx} and {@code opt_sy} respectively.
***REMOVED*** If {@code opt_sy} is not given, then {@code sx} is used for both x and y.
***REMOVED***
***REMOVED*** @param {number} sx The scale factor to use for the x dimension.
***REMOVED*** @param {number=} opt_sy The scale factor to use for the y dimension.
***REMOVED*** @return {!goog.math.Box} This box after scaling.
***REMOVED***
goog.math.Box.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left***REMOVED***= sx;
  this.right***REMOVED***= sx;
  this.top***REMOVED***= sy;
  this.bottom***REMOVED***= sy;
  return this;
***REMOVED***
