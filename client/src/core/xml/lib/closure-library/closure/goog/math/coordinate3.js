// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A utility class for representing three-dimensional points.
***REMOVED***
***REMOVED*** Based heavily on coordinate.js by:
***REMOVED***

goog.provide('goog.math.Coordinate3');



***REMOVED***
***REMOVED*** Class for representing coordinates and positions in 3 dimensions.
***REMOVED***
***REMOVED*** @param {number=} opt_x X coordinate, defaults to 0.
***REMOVED*** @param {number=} opt_y Y coordinate, defaults to 0.
***REMOVED*** @param {number=} opt_z Z coordinate, defaults to 0.
***REMOVED***
***REMOVED***
goog.math.Coordinate3 = function(opt_x, opt_y, opt_z) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** X-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.x = goog.isDef(opt_x) ? opt_x : 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.y = goog.isDef(opt_y) ? opt_y : 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Z-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.z = goog.isDef(opt_z) ? opt_z : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new copy of the coordinate.
***REMOVED***
***REMOVED*** @return {!goog.math.Coordinate3} A clone of this coordinate.
***REMOVED***
goog.math.Coordinate3.prototype.clone = function() {
  return new goog.math.Coordinate3(this.x, this.y, this.z);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a nice string representing the coordinate.
  ***REMOVED***
  ***REMOVED*** @return {string} In the form (50, 73, 31).
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Coordinate3.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Compares coordinates for equality.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate3} a A Coordinate3.
***REMOVED*** @param {goog.math.Coordinate3} b A Coordinate3.
***REMOVED*** @return {boolean} True iff the coordinates are equal, or if both are null.
***REMOVED***
goog.math.Coordinate3.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y && a.z == b.z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two coordinates.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate3} a A Coordinate3.
***REMOVED*** @param {goog.math.Coordinate3} b A Coordinate3.
***REMOVED*** @return {number} The distance between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate3.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dz = a.z - b.z;
  return Math.sqrt(dx***REMOVED*** dx + dy***REMOVED*** dy + dz***REMOVED*** dz);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared distance between two coordinates. Squared distances can
***REMOVED*** be used for comparisons when the actual value is not required.
***REMOVED***
***REMOVED*** Performance note: eliminating the square root is an optimization often used
***REMOVED*** in lower-level languages, but the speed difference is not nearly as
***REMOVED*** pronounced in JavaScript (only a few percent.)
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate3} a A Coordinate3.
***REMOVED*** @param {goog.math.Coordinate3} b A Coordinate3.
***REMOVED*** @return {number} The squared distance between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate3.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dz = a.z - b.z;
  return dx***REMOVED*** dx + dy***REMOVED*** dy + dz***REMOVED*** dz;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the difference between two coordinates as a new
***REMOVED*** goog.math.Coordinate3.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate3} a A Coordinate3.
***REMOVED*** @param {goog.math.Coordinate3} b A Coordinate3.
***REMOVED*** @return {!goog.math.Coordinate3} A Coordinate3 representing the difference
***REMOVED***     between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate3.difference = function(a, b) {
  return new goog.math.Coordinate3(a.x - b.x, a.y - b.y, a.z - b.z);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the contents of this coordinate as a 3 value Array.
***REMOVED***
***REMOVED*** @return {!Array.<number>} A new array.
***REMOVED***
goog.math.Coordinate3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
***REMOVED***


***REMOVED***
***REMOVED*** Converts a three element array into a Coordinate3 object.  If the value
***REMOVED*** passed in is not an array, not array-like, or not of the right length, an
***REMOVED*** error is thrown.
***REMOVED***
***REMOVED*** @param {Array.<number>} a Array of numbers to become a coordinate.
***REMOVED*** @return {!goog.math.Coordinate3} A new coordinate from the array values.
***REMOVED*** @throws {Error} When the oject passed in is not valid.
***REMOVED***
goog.math.Coordinate3.fromArray = function(a) {
  if (a.length <= 3) {
    return new goog.math.Coordinate3(a[0], a[1], a[2]);
  }

  throw Error('Conversion from an array requires an array of length 3');
***REMOVED***
