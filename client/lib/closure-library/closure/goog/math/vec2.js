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
***REMOVED*** @fileoverview Defines a 2-element vector class that can be used for
***REMOVED*** coordinate math, useful for animation systems and point manipulation.
***REMOVED***
***REMOVED*** Vec2 objects inherit from goog.math.Coordinate and may be used wherever a
***REMOVED*** Coordinate is required. Where appropriate, Vec2 functions accept both Vec2
***REMOVED*** and Coordinate objects as input.
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED***

goog.provide('goog.math.Vec2');

goog.require('goog.math');
goog.require('goog.math.Coordinate');



***REMOVED***
***REMOVED*** Class for a two-dimensional vector object and assorted functions useful for
***REMOVED*** manipulating points.
***REMOVED***
***REMOVED*** @param {number} x The x coordinate for the vector.
***REMOVED*** @param {number} y The y coordinate for the vector.
***REMOVED***
***REMOVED*** @extends {goog.math.Coordinate}
***REMOVED***
goog.math.Vec2 = function(x, y) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** X-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.x = x;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.y = y;
***REMOVED***
goog.inherits(goog.math.Vec2, goog.math.Coordinate);


***REMOVED***
***REMOVED*** @return {!goog.math.Vec2} A random unit-length vector.
***REMOVED***
goog.math.Vec2.randomUnit = function() {
  var angle = Math.random()***REMOVED*** Math.PI***REMOVED*** 2;
  return new goog.math.Vec2(Math.cos(angle), Math.sin(angle));
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Vec2} A random vector inside the unit-disc.
***REMOVED***
goog.math.Vec2.random = function() {
  var mag = Math.sqrt(Math.random());
  var angle = Math.random()***REMOVED*** Math.PI***REMOVED*** 2;

  return new goog.math.Vec2(Math.cos(angle)***REMOVED*** mag, Math.sin(angle)***REMOVED*** mag);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new Vec2 object from a given coordinate.
***REMOVED*** @param {!goog.math.Coordinate} a The coordinate.
***REMOVED*** @return {!goog.math.Vec2} A new vector object.
***REMOVED***
goog.math.Vec2.fromCoordinate = function(a) {
  return new goog.math.Vec2(a.x, a.y);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Vec2} A new vector with the same coordinates as this one.
***REMOVED*** @override
***REMOVED***
goog.math.Vec2.prototype.clone = function() {
  return new goog.math.Vec2(this.x, this.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the vector measured from the origin.
***REMOVED*** @return {number} The length of the vector.
***REMOVED***
goog.math.Vec2.prototype.magnitude = function() {
  return Math.sqrt(this.x***REMOVED*** this.x + this.y***REMOVED*** this.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared magnitude of the vector measured from the origin.
***REMOVED*** NOTE(brenneman): Leaving out the square root is not a significant
***REMOVED*** optimization in JavaScript.
***REMOVED*** @return {number} The length of the vector, squared.
***REMOVED***
goog.math.Vec2.prototype.squaredMagnitude = function() {
  return this.x***REMOVED*** this.x + this.y***REMOVED*** this.y;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Vec2} This coordinate after scaling.
***REMOVED*** @override
***REMOVED***
goog.math.Vec2.prototype.scale =
   ***REMOVED*****REMOVED*** @type {function(number, number=):!goog.math.Vec2}***REMOVED***
    (goog.math.Coordinate.prototype.scale);


***REMOVED***
***REMOVED*** Reverses the sign of the vector. Equivalent to scaling the vector by -1.
***REMOVED*** @return {!goog.math.Vec2} The inverted vector.
***REMOVED***
goog.math.Vec2.prototype.invert = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the current vector to have a magnitude of 1.
***REMOVED*** @return {!goog.math.Vec2} The normalized vector.
***REMOVED***
goog.math.Vec2.prototype.normalize = function() {
  return this.scale(1 / this.magnitude());
***REMOVED***


***REMOVED***
***REMOVED*** Adds another vector to this vector in-place.
***REMOVED*** @param {!goog.math.Coordinate} b The vector to add.
***REMOVED*** @return {!goog.math.Vec2}  This vector with {@code b} added.
***REMOVED***
goog.math.Vec2.prototype.add = function(b) {
  this.x += b.x;
  this.y += b.y;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Subtracts another vector from this vector in-place.
***REMOVED*** @param {!goog.math.Coordinate} b The vector to subtract.
***REMOVED*** @return {!goog.math.Vec2} This vector with {@code b} subtracted.
***REMOVED***
goog.math.Vec2.prototype.subtract = function(b) {
  this.x -= b.x;
  this.y -= b.y;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rotates this vector in-place by a given angle, specified in radians.
***REMOVED*** @param {number} angle The angle, in radians.
***REMOVED*** @return {!goog.math.Vec2} This vector rotated {@code angle} radians.
***REMOVED***
goog.math.Vec2.prototype.rotate = function(angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var newX = this.x***REMOVED*** cos - this.y***REMOVED*** sin;
  var newY = this.y***REMOVED*** cos + this.x***REMOVED*** sin;
  this.x = newX;
  this.y = newY;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rotates a vector by a given angle, specified in radians, relative to a given
***REMOVED*** axis rotation point. The returned vector is a newly created instance - no
***REMOVED*** in-place changes are done.
***REMOVED*** @param {!goog.math.Vec2} v A vector.
***REMOVED*** @param {!goog.math.Vec2} axisPoint The rotation axis point.
***REMOVED*** @param {number} angle The angle, in radians.
***REMOVED*** @return {!goog.math.Vec2} The rotated vector in a newly created instance.
***REMOVED***
goog.math.Vec2.rotateAroundPoint = function(v, axisPoint, angle) {
  var res = v.clone();
  return res.subtract(axisPoint).rotate(angle).add(axisPoint);
***REMOVED***


***REMOVED***
***REMOVED*** Compares this vector with another for equality.
***REMOVED*** @param {!goog.math.Vec2} b The other vector.
***REMOVED*** @return {boolean} Whether this vector has the same x and y as the given
***REMOVED***     vector.
***REMOVED***
goog.math.Vec2.prototype.equals = function(b) {
  return this == b || !!b && this.x == b.x && this.y == b.y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two vectors.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {number} The distance.
***REMOVED***
goog.math.Vec2.distance = goog.math.Coordinate.distance;


***REMOVED***
***REMOVED*** Returns the squared distance between two vectors.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {number} The squared distance.
***REMOVED***
goog.math.Vec2.squaredDistance = goog.math.Coordinate.squaredDistance;


***REMOVED***
***REMOVED*** Compares vectors for equality.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {boolean} Whether the vectors have the same x and y coordinates.
***REMOVED***
goog.math.Vec2.equals = goog.math.Coordinate.equals;


***REMOVED***
***REMOVED*** Returns the sum of two vectors as a new Vec2.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {!goog.math.Vec2} The sum vector.
***REMOVED***
goog.math.Vec2.sum = function(a, b) {
  return new goog.math.Vec2(a.x + b.x, a.y + b.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the difference between two vectors as a new Vec2.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {!goog.math.Vec2} The difference vector.
***REMOVED***
goog.math.Vec2.difference = function(a, b) {
  return new goog.math.Vec2(a.x - b.x, a.y - b.y);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dot-product of two vectors.
***REMOVED*** @param {!goog.math.Coordinate} a The first vector.
***REMOVED*** @param {!goog.math.Coordinate} b The second vector.
***REMOVED*** @return {number} The dot-product of the two vectors.
***REMOVED***
goog.math.Vec2.dot = function(a, b) {
  return a.x***REMOVED*** b.x + a.y***REMOVED*** b.y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new Vec2 that is the linear interpolant between vectors a and b at
***REMOVED*** scale-value x.
***REMOVED*** @param {!goog.math.Coordinate} a Vector a.
***REMOVED*** @param {!goog.math.Coordinate} b Vector b.
***REMOVED*** @param {number} x The proportion between a and b.
***REMOVED*** @return {!goog.math.Vec2} The interpolated vector.
***REMOVED***
goog.math.Vec2.lerp = function(a, b, x) {
  return new goog.math.Vec2(goog.math.lerp(a.x, b.x, x),
                            goog.math.lerp(a.y, b.y, x));
***REMOVED***
