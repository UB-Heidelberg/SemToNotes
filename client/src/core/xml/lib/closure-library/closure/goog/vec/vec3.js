// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Supplies 3 element vectors that are compatible with WebGL.
***REMOVED*** Each element is a float32 since that is typically the desired size of a
***REMOVED*** 3-vector in the GPU.  The API is structured to avoid unnecessary memory
***REMOVED*** allocations.  The last parameter will typically be the output vector and
***REMOVED*** an object can be both an input and output parameter to all methods except
***REMOVED*** where noted.
***REMOVED***
***REMOVED***
goog.provide('goog.vec.Vec3');

goog.require('goog.vec');

***REMOVED*** @typedef {goog.vec.Float32}***REMOVED*** goog.vec.Vec3.Float32;
***REMOVED*** @typedef {goog.vec.Float64}***REMOVED*** goog.vec.Vec3.Float64;
***REMOVED*** @typedef {goog.vec.Number}***REMOVED*** goog.vec.Vec3.Number;
***REMOVED*** @typedef {goog.vec.AnyType}***REMOVED*** goog.vec.Vec3.AnyType;

// The following two types are deprecated - use the above types instead.
***REMOVED*** @typedef {Float32Array}***REMOVED*** goog.vec.Vec3.Type;
***REMOVED*** @typedef {goog.vec.ArrayType}***REMOVED*** goog.vec.Vec3.Vec3Like;


***REMOVED***
***REMOVED*** Creates a 3 element vector of Float32. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec3.Float32} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createFloat32 = function() {
  return new Float32Array(3);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 3 element vector of Float64. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec3.Float64} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createFloat64 = function() {
  return new Float64Array(3);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 3 element vector of Number. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec3.Number} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createNumber = function() {
  var a = new Array(3);
  goog.vec.Vec3.setFromValues(a, 0, 0, 0);
  return a;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 3 element vector of Float32Array. The array is initialized to zero.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32.
***REMOVED*** @return {!goog.vec.Vec3.Type} The new 3 element array.
***REMOVED***
goog.vec.Vec3.create = function() {
  return new Float32Array(3);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 3 element FLoat32 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec The source 3 element array.
***REMOVED*** @return {!goog.vec.Vec3.Float32} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createFloat32FromArray = function(vec) {
  var newVec = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 3 element Float32 vector initialized with the supplied values.
***REMOVED***
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @return {!goog.vec.Vec3.Float32} The new vector.
***REMOVED***
goog.vec.Vec3.createFloat32FromValues = function(v0, v1, v2) {
  var a = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromValues(a, v0, v1, v2);
  return a;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 3 element Float32 vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.Float32} vec The source 3 element vector.
***REMOVED*** @return {!goog.vec.Vec3.Float32} The new cloned vector.
***REMOVED***
goog.vec.Vec3.cloneFloat32 = goog.vec.Vec3.createFloat32FromArray;


***REMOVED***
***REMOVED*** Creates a new 3 element Float64 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec The source 3 element array.
***REMOVED*** @return {!goog.vec.Vec3.Float64} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createFloat64FromArray = function(vec) {
  var newVec = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
* Creates a new 3 element Float64 vector initialized with the supplied values.
*
* @param {number} v0 The value for element at index 0.
* @param {number} v1 The value for element at index 1.
* @param {number} v2 The value for element at index 2.
* @return {!goog.vec.Vec3.Float64} The new vector.
*/
goog.vec.Vec3.createFloat64FromValues = function(v0, v1, v2) {
  var vec = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromValues(vec, v0, v1, v2);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 3 element vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.Float64} vec The source 3 element vector.
***REMOVED*** @return {!goog.vec.Vec3.Float64} The new cloned vector.
***REMOVED***
goog.vec.Vec3.cloneFloat64 = goog.vec.Vec3.createFloat64FromArray;


***REMOVED***
***REMOVED*** Creates a new 3 element vector initialized with the value from the given
***REMOVED*** array.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32FromArray.
***REMOVED*** @param {goog.vec.Vec3.Vec3Like} vec The source 3 element array.
***REMOVED*** @return {!goog.vec.Vec3.Type} The new 3 element array.
***REMOVED***
goog.vec.Vec3.createFromArray = function(vec) {
  var newVec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 3 element vector initialized with the supplied values.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32FromValues.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @return {!goog.vec.Vec3.Type} The new vector.
***REMOVED***
goog.vec.Vec3.createFromValues = function(v0, v1, v2) {
  var vec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromValues(vec, v0, v1, v2);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 3 element vector.
***REMOVED***
***REMOVED*** @deprecated Use cloneFloat32.
***REMOVED*** @param {goog.vec.Vec3.Vec3Like} vec The source 3 element vector.
***REMOVED*** @return {!goog.vec.Vec3.Type} The new cloned vector.
***REMOVED***
goog.vec.Vec3.clone = function(vec) {
  var newVec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec The vector to receive the values.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.setFromValues = function(vec, v0, v1, v2) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given array of values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec The vector to receive the
***REMOVED***     values.
***REMOVED*** @param {goog.vec.Vec3.AnyType} values The array of values.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.setFromArray = function(vec, values) {
  vec[0] = values[0];
  vec[1] = values[1];
  vec[2] = values[2];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise addition of vec0 and vec1 together storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The first addend.
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec1 The second addend.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  resultVec[2] = vec0[2] + vec1[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise subtraction of vec1 from vec0 storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The minuend.
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec1 The subtrahend.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Negates vec0, storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The vector to negate.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  resultVec[2] = -vec0[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies each component of vec0 with scalar storing the product into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The source vector.
***REMOVED*** @param {number} scalar The value to multiply with each component of vec0.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0]***REMOVED*** scalar;
  resultVec[1] = vec0[1]***REMOVED*** scalar;
  resultVec[2] = vec0[2]***REMOVED*** scalar;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitudeSquared of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec3.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec3.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z);
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given vector storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 The vector to normalize.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.normalize = function(vec0, resultVec) {
  var ilen = 1 / goog.vec.Vec3.magnitude(vec0);
  resultVec[0] = vec0[0]***REMOVED*** ilen;
  resultVec[1] = vec0[1]***REMOVED*** ilen;
  resultVec[2] = vec0[2]***REMOVED*** ilen;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scalar product of vectors v0 and v1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec3.AnyType} v1 The second vector.
***REMOVED*** @return {number} The scalar product.
***REMOVED***
goog.vec.Vec3.dot = function(v0, v1) {
  return v0[0]***REMOVED*** v1[0] + v0[1]***REMOVED*** v1[1] + v0[2]***REMOVED*** v1[2];
***REMOVED***


***REMOVED***
***REMOVED*** Computes the vector (cross) product of v0 and v1 storing the result into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec3.AnyType} v1 The second vector.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
***REMOVED***     results. May be either v0 or v1.
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.cross = function(v0, v1, resultVec) {
  var x0 = v0[0], y0 = v0[1], z0 = v0[2];
  var x1 = v1[0], y1 = v1[1], z1 = v1[2];
  resultVec[0] = y0***REMOVED*** z1 - z0***REMOVED*** y1;
  resultVec[1] = z0***REMOVED*** x1 - x0***REMOVED*** z1;
  resultVec[2] = x0***REMOVED*** y1 - y0***REMOVED*** x1;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the squared distance between two points.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 First point.
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec1 Second point.
***REMOVED*** @return {number} The squared distance between the points.
***REMOVED***
goog.vec.Vec3.distanceSquared = function(vec0, vec1) {
  var x = vec0[0] - vec1[0];
  var y = vec0[1] - vec1[1];
  var z = vec0[2] - vec1[2];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two points.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 First point.
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec1 Second point.
***REMOVED*** @return {number} The distance between the points.
***REMOVED***
goog.vec.Vec3.distance = function(vec0, vec1) {
  return Math.sqrt(goog.vec.Vec3.distanceSquared(vec0, vec1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns a unit vector pointing from one point to another.
***REMOVED*** If the input points are equal then the result will be all zeros.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec0 Origin point.
***REMOVED*** @param {goog.vec.Vec3.AnyType} vec1 Target point.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or vec1).
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.direction = function(vec0, vec1, resultVec) {
  var x = vec1[0] - vec0[0];
  var y = vec1[1] - vec0[1];
  var z = vec1[2] - vec0[2];
  var d = Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z);
  if (d) {
    d = 1 / d;
    resultVec[0] = x***REMOVED*** d;
    resultVec[1] = y***REMOVED*** d;
    resultVec[2] = z***REMOVED*** d;
  } else {
    resultVec[0] = resultVec[1] = resultVec[2] = 0;
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Linearly interpolate from vec0 to v1 according to f. The value of f should be
***REMOVED*** in the range [0..1] otherwise the results are undefined.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec3.AnyType} v1 The second vector.
***REMOVED*** @param {number} f The interpolation factor.
***REMOVED*** @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be v0 or v1).
***REMOVED*** @return {!goog.vec.Vec3.AnyType} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec3.lerp = function(v0, v1, f, resultVec) {
  var x = v0[0], y = v0[1], z = v0[2];
  resultVec[0] = (v1[0] - x)***REMOVED*** f + x;
  resultVec[1] = (v1[1] - y)***REMOVED*** f + y;
  resultVec[2] = (v1[2] - z)***REMOVED*** f + z;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the components of v0 are equal to the components of v1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec3.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec3.AnyType} v1 The second vector.
***REMOVED*** @return {boolean} True if the vectors are equal, false otherwise.
***REMOVED***
goog.vec.Vec3.equals = function(v0, v1) {
  return v0.length == v1.length &&
      v0[0] == v1[0] && v0[1] == v1[1] && v0[2] == v1[2];
***REMOVED***
