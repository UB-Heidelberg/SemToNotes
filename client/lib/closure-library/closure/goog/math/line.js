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
***REMOVED*** @fileoverview Represents a line in 2D space.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.math.Line');

goog.require('goog.math');
goog.require('goog.math.Coordinate');



***REMOVED***
***REMOVED*** Object representing a line.
***REMOVED*** @param {number} x0 X coordinate of the start point.
***REMOVED*** @param {number} y0 Y coordinate of the start point.
***REMOVED*** @param {number} x1 X coordinate of the end point.
***REMOVED*** @param {number} y1 Y coordinate of the end point.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.math.Line = function(x0, y0, x1, y1) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the first point.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.x0 = x0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the first point.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.y0 = y0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the first control point.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.x1 = x1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the first control point.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.y1 = y1;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Line} A copy of this line.
***REMOVED***
goog.math.Line.prototype.clone = function() {
  return new goog.math.Line(this.x0, this.y0, this.x1, this.y1);
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the given line is exactly the same as this one.
***REMOVED*** @param {goog.math.Line} other The other line.
***REMOVED*** @return {boolean} Whether the given line is the same as this one.
***REMOVED***
goog.math.Line.prototype.equals = function(other) {
  return this.x0 == other.x0 && this.y0 == other.y0 &&
         this.x1 == other.x1 && this.y1 == other.y1;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The squared length of the line segment used to define the
***REMOVED***     line.
***REMOVED***
goog.math.Line.prototype.getSegmentLengthSquared = function() {
  var xdist = this.x1 - this.x0;
  var ydist = this.y1 - this.y0;
  return xdist***REMOVED*** xdist + ydist***REMOVED*** ydist;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The length of the line segment used to define the line.
***REMOVED***
goog.math.Line.prototype.getSegmentLength = function() {
  return Math.sqrt(this.getSegmentLengthSquared());
***REMOVED***


***REMOVED***
***REMOVED*** Computes the interpolation parameter for the point on the line closest to
***REMOVED*** a given point.
***REMOVED*** @param {number|goog.math.Coordinate} x The x coordinate of the point, or
***REMOVED***     a coordinate object.
***REMOVED*** @param {number=} opt_y The y coordinate of the point - required if x is a
***REMOVED***     number, ignored if x is a goog.math.Coordinate.
***REMOVED*** @return {number} The interpolation parameter of the point on the line
***REMOVED***     closest to the given point.
***REMOVED*** @private
***REMOVED***
goog.math.Line.prototype.getClosestLinearInterpolation_ = function(x, opt_y) {
  var y;
  if (x instanceof goog.math.Coordinate) {
    y = x.y;
    x = x.x;
  } else {
    y = opt_y;
  }

  var x0 = this.x0;
  var y0 = this.y0;

  var xChange = this.x1 - x0;
  var yChange = this.y1 - y0;

  return ((x - x0)***REMOVED*** xChange + (y - y0)***REMOVED*** yChange) /
      this.getSegmentLengthSquared();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the point on the line segment proportional to t, where for t = 0 we
***REMOVED*** return the starting point and for t = 1 we return the end point.  For t < 0
***REMOVED*** or t > 1 we extrapolate along the line defined by the line segment.
***REMOVED*** @param {number} t The interpolation parameter along the line segment.
***REMOVED*** @return {!goog.math.Coordinate} The point on the line segment at t.
***REMOVED***
goog.math.Line.prototype.getInterpolatedPoint = function(t) {
  return new goog.math.Coordinate(
      goog.math.lerp(this.x0, this.x1, t),
      goog.math.lerp(this.y0, this.y1, t));
***REMOVED***


***REMOVED***
***REMOVED*** Computes the point on the line closest to a given point.  Note that a line
***REMOVED*** in this case is defined as the infinite line going through the start and end
***REMOVED*** points.  To find the closest point on the line segment itself see
***REMOVED*** {@see #getClosestSegmentPoint}.
***REMOVED*** @param {number|goog.math.Coordinate} x The x coordinate of the point, or
***REMOVED***     a coordinate object.
***REMOVED*** @param {number=} opt_y The y coordinate of the point - required if x is a
***REMOVED***     number, ignored if x is a goog.math.Coordinate.
***REMOVED*** @return {!goog.math.Coordinate} The point on the line closest to the given
***REMOVED***     point.
***REMOVED***
goog.math.Line.prototype.getClosestPoint = function(x, opt_y) {
  return this.getInterpolatedPoint(
      this.getClosestLinearInterpolation_(x, opt_y));
***REMOVED***


***REMOVED***
***REMOVED*** Computes the point on the line segment closest to a given point.
***REMOVED*** @param {number|goog.math.Coordinate} x The x coordinate of the point, or
***REMOVED***     a coordinate object.
***REMOVED*** @param {number=} opt_y The y coordinate of the point - required if x is a
***REMOVED***     number, ignored if x is a goog.math.Coordinate.
***REMOVED*** @return {!goog.math.Coordinate} The point on the line segment closest to the
***REMOVED***     given point.
***REMOVED***
goog.math.Line.prototype.getClosestSegmentPoint = function(x, opt_y) {
  return this.getInterpolatedPoint(
      goog.math.clamp(this.getClosestLinearInterpolation_(x, opt_y), 0, 1));
***REMOVED***
