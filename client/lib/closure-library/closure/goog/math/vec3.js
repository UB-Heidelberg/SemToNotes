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
***REMOVED*** @fileoverview Defines a 3-element vector class that can be used for
***REMOVED*** coordinate math, useful for animation systems and point manipulation.
***REMOVED***
***REMOVED*** Based heavily on code originally by:
***REMOVED***


goog.provide('goog.math.Vec3');

goog.require('goog.math');
goog.require('goog.math.Coordinate3');



***REMOVED***
***REMOVED*** Class for a three-dimensional vector object and assorted functions useful for
***REMOVED*** manipulation.
***REMOVED***
***REMOVED*** Inherits from goog.math.Coordinate3 so that a Vec3 may be passed in to any
***REMOVED*** function that requires a Coordinate.
***REMOVED***
***REMOVED*** @param {number} x The x value for the vector.
***REMOVED*** @param {number} y The y value for the vector.
***REMOVED*** @param {number} z The z value for the vector.
***REMOVED***
***REMOVED*** @extends {goog.math.Coordinate3}
***REMOVED***
goog.math.Vec3 = function(x, y, z) {
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

 ***REMOVED*****REMOVED***
  ***REMOVED*** Z-value
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.z = z;
***REMOVED***
goog.inherits(goog.math.Vec3, goog.math.Coordinate3);


***REMOVED***
***REMOVED*** Generates a random unit vector.
***REMOVED***
***REMOVED*** http://mathworld.wolfram.com/SpherePointPicking.html
***REMOVED*** Using (6), (7), and (8) to generate coordinates.
***REMOVED*** @return {!goog.math.Vec3} A random unit-length vector.
***REMOVED***
goog.math.Vec3.randomUnit = function() {
  var theta = Math.random()***REMOVED*** Math.PI***REMOVED*** 2;
  var phi = Math.random()***REMOVED*** Math.PI***REMOVED*** 2;

  var z = Math.cos(phi);
  var x = Math.sqrt(1 - z***REMOVED*** z)***REMOVED*** Math.cos(theta);
  var y = Math.sqrt(1 - z***REMOVED*** z)***REMOVED*** Math.sin(theta);

  return new goog.math.Vec3(x, y, z);
***REMOVED***


***REMOVED***
***REMOVED*** Generates a random vector inside the unit sphere.
***REMOVED***
***REMOVED*** @return {!goog.math.Vec3} A random vector.
***REMOVED***
goog.math.Vec3.random = function() {
  return goog.math.Vec3.randomUnit().scale(Math.random());
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new Vec3 object from a given coordinate.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate3} a The coordinate.
***REMOVED*** @return {!goog.math.Vec3} A new vector object.
***REMOVED***
goog.math.Vec3.fromCoordinate3 = function(a) {
  return new goog.math.Vec3(a.x, a.y, a.z);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new copy of this Vec3.
***REMOVED***
***REMOVED*** @return {!goog.math.Vec3} A new vector with the same coordinates as this one.
***REMOVED*** @override
***REMOVED***
goog.math.Vec3.prototype.clone = function() {
  return new goog.math.Vec3(this.x, this.y, this.z);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the vector measured from the origin.
***REMOVED***
***REMOVED*** @return {number} The length of the vector.
***REMOVED***
goog.math.Vec3.prototype.magnitude = function() {
  return Math.sqrt(this.x***REMOVED*** this.x + this.y***REMOVED*** this.y + this.z***REMOVED*** this.z);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared magnitude of the vector measured from the origin.
***REMOVED*** NOTE(brenneman): Leaving out the square root is not a significant
***REMOVED*** optimization in JavaScript.
***REMOVED***
***REMOVED*** @return {number} The length of the vector, squared.
***REMOVED***
goog.math.Vec3.prototype.squaredMagnitude = function() {
  return this.x***REMOVED*** this.x + this.y***REMOVED*** this.y + this.z***REMOVED*** this.z;
***REMOVED***


***REMOVED***
***REMOVED*** Scales the current vector by a constant.
***REMOVED***
***REMOVED*** @param {number} s The scale factor.
***REMOVED*** @return {!goog.math.Vec3} This vector, scaled.
***REMOVED***
goog.math.Vec3.prototype.scale = function(s) {
  this.x***REMOVED***= s;
  this.y***REMOVED***= s;
  this.z***REMOVED***= s;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Reverses the sign of the vector. Equivalent to scaling the vector by -1.
***REMOVED***
***REMOVED*** @return {!goog.math.Vec3} This vector, inverted.
***REMOVED***
goog.math.Vec3.prototype.invert = function() {
  this.x = -this.x;
  this.y = -this.y;
  this.z = -this.z;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the current vector to have a magnitude of 1.
***REMOVED***
***REMOVED*** @return {!goog.math.Vec3} This vector, normalized.
***REMOVED***
goog.math.Vec3.prototype.normalize = function() {
  return this.scale(1 / this.magnitude());
***REMOVED***


***REMOVED***
***REMOVED*** Adds another vector to this vector in-place.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} b The vector to add.
***REMOVED*** @return {!goog.math.Vec3} This vector with {@code b} added.
***REMOVED***
goog.math.Vec3.prototype.add = function(b) {
  this.x += b.x;
  this.y += b.y;
  this.z += b.z;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Subtracts another vector from this vector in-place.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} b The vector to subtract.
***REMOVED*** @return {!goog.math.Vec3} This vector with {@code b} subtracted.
***REMOVED***
goog.math.Vec3.prototype.subtract = function(b) {
  this.x -= b.x;
  this.y -= b.y;
  this.z -= b.z;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Compares this vector with another for equality.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} b The other vector.
***REMOVED*** @return {boolean} True if this vector's x, y and z equal the given vector's
***REMOVED***     x, y, and z, respectively.
***REMOVED***
goog.math.Vec3.prototype.equals = function(b) {
  return this == b || !!b && this.x == b.x && this.y == b.y && this.z == b.z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two vectors.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {number} The distance.
***REMOVED***
goog.math.Vec3.distance = goog.math.Coordinate3.distance;


***REMOVED***
***REMOVED*** Returns the squared distance between two vectors.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {number} The squared distance.
***REMOVED***
goog.math.Vec3.squaredDistance = goog.math.Coordinate3.squaredDistance;


***REMOVED***
***REMOVED*** Compares vectors for equality.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {boolean} True if the vectors have equal x, y, and z coordinates.
***REMOVED***
goog.math.Vec3.equals = goog.math.Coordinate3.equals;


***REMOVED***
***REMOVED*** Returns the sum of two vectors as a new Vec3.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {!goog.math.Vec3} The sum vector.
***REMOVED***
goog.math.Vec3.sum = function(a, b) {
  return new goog.math.Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the difference of two vectors as a new Vec3.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {!goog.math.Vec3} The difference vector.
***REMOVED***
goog.math.Vec3.difference = function(a, b) {
  return new goog.math.Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dot-product of two vectors.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {number} The dot-product of the two vectors.
***REMOVED***
goog.math.Vec3.dot = function(a, b) {
  return a.x***REMOVED*** b.x + a.y***REMOVED*** b.y + a.z***REMOVED*** b.z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the cross-product of two vectors.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a The first vector.
***REMOVED*** @param {goog.math.Vec3} b The second vector.
***REMOVED*** @return {!goog.math.Vec3} The cross-product of the two vectors.
***REMOVED***
goog.math.Vec3.cross = function(a, b) {
  return new goog.math.Vec3(a.y***REMOVED*** b.z - a.z***REMOVED*** b.y,
                            a.z***REMOVED*** b.x - a.x***REMOVED*** b.z,
                            a.x***REMOVED*** b.y - a.y***REMOVED*** b.x);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new Vec3 that is the linear interpolant between vectors a and b at
***REMOVED*** scale-value x.
***REMOVED***
***REMOVED*** @param {goog.math.Vec3} a Vector a.
***REMOVED*** @param {goog.math.Vec3} b Vector b.
***REMOVED*** @param {number} x The proportion between a and b.
***REMOVED*** @return {!goog.math.Vec3} The interpolated vector.
***REMOVED***
goog.math.Vec3.lerp = function(a, b, x) {
  return new goog.math.Vec3(goog.math.lerp(a.x, b.x, x),
                            goog.math.lerp(a.y, b.y, x),
                            goog.math.lerp(a.z, b.z, x));
***REMOVED***
