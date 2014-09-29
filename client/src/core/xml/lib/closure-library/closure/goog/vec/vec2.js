// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of 2 element vectors.  This follows the same design
***REMOVED*** patterns as Vec3 and Vec4.
***REMOVED***
***REMOVED***

goog.provide('goog.vec.Vec2');

goog.require('goog.vec');


***REMOVED*** @typedef {goog.vec.Float32}***REMOVED*** goog.vec.Vec2.Float32;
***REMOVED*** @typedef {goog.vec.Float64}***REMOVED*** goog.vec.Vec2.Float64;
***REMOVED*** @typedef {goog.vec.Number}***REMOVED*** goog.vec.Vec2.Number;
***REMOVED*** @typedef {goog.vec.AnyType}***REMOVED*** goog.vec.Vec2.AnyType;


***REMOVED***
***REMOVED*** Creates a 2 element vector of Float32. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec2.Float32} The new 2 element array.
***REMOVED***
goog.vec.Vec2.createFloat32 = function() {
  return new Float32Array(2);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 2 element vector of Float64. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec2.Float64} The new 2 element array.
***REMOVED***
goog.vec.Vec2.createFloat64 = function() {
  return new Float64Array(2);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 2 element vector of Number. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec2.Number} The new 2 element array.
***REMOVED***
goog.vec.Vec2.createNumber = function() {
  var a = new Array(2);
  goog.vec.Vec2.setFromValues(a, 0, 0);
  return a;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 2 element FLoat32 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec The source 2 element array.
***REMOVED*** @return {!goog.vec.Vec2.Float32} The new 2 element array.
***REMOVED***
goog.vec.Vec2.createFloat32FromArray = function(vec) {
  var newVec = goog.vec.Vec2.createFloat32();
  goog.vec.Vec2.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 2 element Float32 vector initialized with the supplied values.
***REMOVED***
***REMOVED*** @param {number} vec0 The value for element at index 0.
***REMOVED*** @param {number} vec1 The value for element at index 1.
***REMOVED*** @return {!goog.vec.Vec2.Float32} The new vector.
***REMOVED***
goog.vec.Vec2.createFloat32FromValues = function(vec0, vec1) {
  var a = goog.vec.Vec2.createFloat32();
  goog.vec.Vec2.setFromValues(a, vec0, vec1);
  return a;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 2 element Float32 vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.Float32} vec The source 2 element vector.
***REMOVED*** @return {!goog.vec.Vec2.Float32} The new cloned vector.
***REMOVED***
goog.vec.Vec2.cloneFloat32 = goog.vec.Vec2.createFloat32FromArray;


***REMOVED***
***REMOVED*** Creates a new 2 element Float64 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec The source 2 element array.
***REMOVED*** @return {!goog.vec.Vec2.Float64} The new 2 element array.
***REMOVED***
goog.vec.Vec2.createFloat64FromArray = function(vec) {
  var newVec = goog.vec.Vec2.createFloat64();
  goog.vec.Vec2.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
* Creates a new 2 element Float64 vector initialized with the supplied values.
*
* @param {number} vec0 The value for element at index 0.
* @param {number} vec1 The value for element at index 1.
* @return {!goog.vec.Vec2.Float64} The new vector.
*/
goog.vec.Vec2.createFloat64FromValues = function(vec0, vec1) {
  var vec = goog.vec.Vec2.createFloat64();
  goog.vec.Vec2.setFromValues(vec, vec0, vec1);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 2 element vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.Float64} vec The source 2 element vector.
***REMOVED*** @return {!goog.vec.Vec2.Float64} The new cloned vector.
***REMOVED***
goog.vec.Vec2.cloneFloat64 = goog.vec.Vec2.createFloat64FromArray;


***REMOVED***
***REMOVED*** Initializes the vector with the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec The vector to receive the values.
***REMOVED*** @param {number} vec0 The value for element at index 0.
***REMOVED*** @param {number} vec1 The value for element at index 1.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.setFromValues = function(vec, vec0, vec1) {
  vec[0] = vec0;
  vec[1] = vec1;
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given array of values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec The vector to receive the
***REMOVED***     values.
***REMOVED*** @param {goog.vec.Vec2.AnyType} values The array of values.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.setFromArray = function(vec, values) {
  vec[0] = values[0];
  vec[1] = values[1];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise addition of vec0 and vec1 together storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The first addend.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 The second addend.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise subtraction of vec1 from vec0 storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The minuend.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 The subtrahend.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Negates vec0, storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The vector to negate.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies each component of vec0 with scalar storing the product into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The source vector.
***REMOVED*** @param {number} scalar The value to multiply with each component of vec0.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0]***REMOVED*** scalar;
  resultVec[1] = vec0[1]***REMOVED*** scalar;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitudeSquared of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec2.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1];
  return x***REMOVED*** x + y***REMOVED*** y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec2.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1];
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y);
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given vector storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The vector to normalize.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.normalize = function(vec0, resultVec) {
  var ilen = 1 / goog.vec.Vec2.magnitude(vec0);
  resultVec[0] = vec0[0]***REMOVED*** ilen;
  resultVec[1] = vec0[1]***REMOVED*** ilen;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scalar product of vectors vec0 and vec1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The first vector.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 The second vector.
***REMOVED*** @return {number} The scalar product.
***REMOVED***
goog.vec.Vec2.dot = function(vec0, vec1) {
  return vec0[0]***REMOVED*** vec1[0] + vec0[1]***REMOVED*** vec1[1];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared distance between two points.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 First point.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 Second point.
***REMOVED*** @return {number} The squared distance between the points.
***REMOVED***
goog.vec.Vec2.distanceSquared = function(vec0, vec1) {
  var x = vec0[0] - vec1[0];
  var y = vec0[1] - vec1[1];
  return x***REMOVED*** x + y***REMOVED*** y;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two points.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 First point.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 Second point.
***REMOVED*** @return {number} The distance between the points.
***REMOVED***
goog.vec.Vec2.distance = function(vec0, vec1) {
  return Math.sqrt(goog.vec.Vec2.distanceSquared(vec0, vec1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns a unit vector pointing from one point to another.
***REMOVED*** If the input points are equal then the result will be all zeros.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 Origin point.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 Target point.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or vec1).
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.direction = function(vec0, vec1, resultVec) {
  var x = vec1[0] - vec0[0];
  var y = vec1[1] - vec0[1];
  var d = Math.sqrt(x***REMOVED*** x + y***REMOVED*** y);
  if (d) {
    d = 1 / d;
    resultVec[0] = x***REMOVED*** d;
    resultVec[1] = y***REMOVED*** d;
  } else {
    resultVec[0] = resultVec[1] = 0;
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Linearly interpolate from vec0 to vec1 according to f. The value of f should
***REMOVED*** be in the range [0..1] otherwise the results are undefined.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The first vector.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 The second vector.
***REMOVED*** @param {number} f The interpolation factor.
***REMOVED*** @param {goog.vec.Vec2.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or vec1).
***REMOVED*** @return {!goog.vec.Vec2.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec2.lerp = function(vec0, vec1, f, resultVec) {
  var x = vec0[0], y = vec0[1];
  resultVec[0] = (vec1[0] - x)***REMOVED*** f + x;
  resultVec[1] = (vec1[1] - y)***REMOVED*** f + y;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the components of vec0 are equal to the components of vec1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec0 The first vector.
***REMOVED*** @param {goog.vec.Vec2.AnyType} vec1 The second vector.
***REMOVED*** @return {boolean} True if the vectors are equal, false otherwise.
***REMOVED***
goog.vec.Vec2.equals = function(vec0, vec1) {
  return vec0.length == vec1.length &&
      vec0[0] == vec1[0] && vec0[1] == vec1[1];
***REMOVED***
