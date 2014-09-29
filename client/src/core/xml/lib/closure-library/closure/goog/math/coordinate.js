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
***REMOVED*** @fileoverview A utility class for representing two-dimensional positions.
***REMOVED***


goog.provide('goog.math.Coordinate');

goog.require('goog.math');



***REMOVED***
***REMOVED*** Class for representing coordinates and positions.
***REMOVED*** @param {number=} opt_x Left, defaults to 0.
***REMOVED*** @param {number=} opt_y Top, defaults to 0.
***REMOVED***
***REMOVED***
goog.math.Coordinate = function(opt_x, opt_y) {
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
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new copy of the coordinate.
***REMOVED*** @return {!goog.math.Coordinate} A clone of this coordinate.
***REMOVED***
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a nice string representing the coordinate.
  ***REMOVED*** @return {string} In the form (50, 73).
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Coordinate.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Compares coordinates for equality.
***REMOVED*** @param {goog.math.Coordinate} a A Coordinate.
***REMOVED*** @param {goog.math.Coordinate} b A Coordinate.
***REMOVED*** @return {boolean} True iff the coordinates are equal, or if both are null.
***REMOVED***
goog.math.Coordinate.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two coordinates.
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} b A Coordinate.
***REMOVED*** @return {number} The distance between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx***REMOVED*** dx + dy***REMOVED*** dy);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of a coordinate.
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @return {number} The distance between the origin and {@code a}.
***REMOVED***
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x***REMOVED*** a.x + a.y***REMOVED*** a.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the angle from the origin to a coordinate.
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @return {number} The angle, in degrees, clockwise from the positive X
***REMOVED***     axis to {@code a}.
***REMOVED***
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared distance between two coordinates. Squared distances can
***REMOVED*** be used for comparisons when the actual value is not required.
***REMOVED***
***REMOVED*** Performance note: eliminating the square root is an optimization often used
***REMOVED*** in lower-level languages, but the speed difference is not nearly as
***REMOVED*** pronounced in JavaScript (only a few percent.)
***REMOVED***
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} b A Coordinate.
***REMOVED*** @return {number} The squared distance between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx***REMOVED*** dx + dy***REMOVED*** dy;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the difference between two coordinates as a new
***REMOVED*** goog.math.Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} b A Coordinate.
***REMOVED*** @return {!goog.math.Coordinate} A Coordinate representing the difference
***REMOVED***     between {@code a} and {@code b}.
***REMOVED***
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the sum of two coordinates as a new goog.math.Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} a A Coordinate.
***REMOVED*** @param {!goog.math.Coordinate} b A Coordinate.
***REMOVED*** @return {!goog.math.Coordinate} A Coordinate representing the sum of the two
***REMOVED***     coordinates.
***REMOVED***
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the x and y fields to the next larger integer values.
***REMOVED*** @return {!goog.math.Coordinate} This coordinate with ceil'd fields.
***REMOVED***
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the x and y fields to the next smaller integer values.
***REMOVED*** @return {!goog.math.Coordinate} This coordinate with floored fields.
***REMOVED***
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the x and y fields to the nearest integer values.
***REMOVED*** @return {!goog.math.Coordinate} This coordinate with rounded fields.
***REMOVED***
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Translates this box by the given offsets. If a {@code goog.math.Coordinate}
***REMOVED*** is given, then the x and y values are translated by the coordinate's x and y.
***REMOVED*** Otherwise, x and y are translated by {@code tx} and {@code opt_ty}
***REMOVED*** respectively.
***REMOVED*** @param {number|goog.math.Coordinate} tx The value to translate x by or the
***REMOVED***     the coordinate to translate this coordinate by.
***REMOVED*** @param {number=} opt_ty The value to translate y by.
***REMOVED*** @return {!goog.math.Coordinate} This coordinate after translating.
***REMOVED***
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.x += tx.x;
    this.y += tx.y;
  } else {
    this.x += tx;
    if (goog.isNumber(opt_ty)) {
      this.y += opt_ty;
    }
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Scales this coordinate by the given scale factors. The x and y values are
***REMOVED*** scaled by {@code sx} and {@code opt_sy} respectively.  If {@code opt_sy}
***REMOVED*** is not given, then {@code sx} is used for both x and y.
***REMOVED*** @param {number} sx The scale factor to use for the x dimension.
***REMOVED*** @param {number=} opt_sy The scale factor to use for the y dimension.
***REMOVED*** @return {!goog.math.Coordinate} This coordinate after scaling.
***REMOVED***
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x***REMOVED***= sx;
  this.y***REMOVED***= sy;
  return this;
***REMOVED***
