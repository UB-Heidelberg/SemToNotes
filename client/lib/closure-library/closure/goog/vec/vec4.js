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
***REMOVED*** @fileoverview Supplies 4 element vectors that are compatible with WebGL.
***REMOVED*** Each element is a float32 since that is typically the desired size of a
***REMOVED*** 4-vector in the GPU.  The API is structured to avoid unnecessary memory
***REMOVED*** allocations.  The last parameter will typically be the output vector and
***REMOVED*** an object can be both an input and output parameter to all methods except
***REMOVED*** where noted.
***REMOVED***
***REMOVED***
goog.provide('goog.vec.Vec4');

***REMOVED*** @suppress {extraRequire}***REMOVED***
goog.require('goog.vec');

***REMOVED*** @typedef {goog.vec.Float32}***REMOVED*** goog.vec.Vec4.Float32;
***REMOVED*** @typedef {goog.vec.Float64}***REMOVED*** goog.vec.Vec4.Float64;
***REMOVED*** @typedef {goog.vec.Number}***REMOVED*** goog.vec.Vec4.Number;
***REMOVED*** @typedef {goog.vec.AnyType}***REMOVED*** goog.vec.Vec4.AnyType;

// The following two types are deprecated - use the above types instead.
***REMOVED*** @typedef {Float32Array}***REMOVED*** goog.vec.Vec4.Type;
***REMOVED*** @typedef {goog.vec.ArrayType}***REMOVED*** goog.vec.Vec4.Vec4Like;


***REMOVED***
***REMOVED*** Creates a 4 element vector of Float32. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec4.Float32} The new 3 element array.
***REMOVED***
goog.vec.Vec4.createFloat32 = function() {
  return new Float32Array(4);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 4 element vector of Float64. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec4.Float64} The new 4 element array.
***REMOVED***
goog.vec.Vec4.createFloat64 = function() {
  return new Float64Array(4);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 4 element vector of Number. The array is initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.Vec4.Number} The new 4 element array.
***REMOVED***
goog.vec.Vec4.createNumber = function() {
  var v = new Array(4);
  goog.vec.Vec4.setFromValues(v, 0, 0, 0, 0);
  return v;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a 4 element vector of Float32Array. The array is initialized to zero.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32.
***REMOVED*** @return {!goog.vec.Vec4.Type} The new 4 element array.
***REMOVED***
goog.vec.Vec4.create = function() {
  return new Float32Array(4);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 4 element vector initialized with the value from the given
***REMOVED*** array.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32FromArray.
***REMOVED*** @param {goog.vec.Vec4.Vec4Like} vec The source 4 element array.
***REMOVED*** @return {!goog.vec.Vec4.Type} The new 4 element array.
***REMOVED***
goog.vec.Vec4.createFromArray = function(vec) {
  var newVec = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 4 element FLoat32 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec The source 3 element array.
***REMOVED*** @return {!goog.vec.Vec4.Float32} The new 3 element array.
***REMOVED***
goog.vec.Vec4.createFloat32FromArray = function(vec) {
  var newVec = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new 4 element Float32 vector initialized with the supplied values.
***REMOVED***
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @param {number} v3 The value for element at index 3.
***REMOVED*** @return {!goog.vec.Vec4.Float32} The new vector.
***REMOVED***
goog.vec.Vec4.createFloat32FromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 4 element Float32 vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.Float32} vec The source 3 element vector.
***REMOVED*** @return {!goog.vec.Vec4.Float32} The new cloned vector.
***REMOVED***
goog.vec.Vec4.cloneFloat32 = goog.vec.Vec4.createFloat32FromArray;


***REMOVED***
***REMOVED*** Creates a new 4 element Float64 vector initialized with the value from the
***REMOVED*** given array.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec The source 4 element array.
***REMOVED*** @return {!goog.vec.Vec4.Float64} The new 4 element array.
***REMOVED***
goog.vec.Vec4.createFloat64FromArray = function(vec) {
  var newVec = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
***REMOVED***


***REMOVED***
* Creates a new 4 element Float64 vector initialized with the supplied values.
*
* @param {number} v0 The value for element at index 0.
* @param {number} v1 The value for element at index 1.
* @param {number} v2 The value for element at index 2.
* @param {number} v3 The value for element at index 3.
* @return {!goog.vec.Vec4.Float64} The new vector.
*/
goog.vec.Vec4.createFloat64FromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 4 element vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.Float64} vec The source 4 element vector.
***REMOVED*** @return {!goog.vec.Vec4.Float64} The new cloned vector.
***REMOVED***
goog.vec.Vec4.cloneFloat64 = goog.vec.Vec4.createFloat64FromArray;


***REMOVED***
***REMOVED*** Creates a new 4 element vector initialized with the supplied values.
***REMOVED***
***REMOVED*** @deprecated Use createFloat32FromValues.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @param {number} v3 The value for element at index 3.
***REMOVED*** @return {!goog.vec.Vec4.Type} The new vector.
***REMOVED***
goog.vec.Vec4.createFromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a clone of the given 4 element vector.
***REMOVED***
***REMOVED*** @deprecated Use cloneFloat32.
***REMOVED*** @param {goog.vec.Vec4.Vec4Like} vec The source 4 element vector.
***REMOVED*** @return {!goog.vec.Vec4.Type} The new cloned vector.
***REMOVED***
goog.vec.Vec4.clone = goog.vec.Vec4.createFromArray;


***REMOVED***
***REMOVED*** Initializes the vector with the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec The vector to receive the values.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @param {number} v3 The value for element at index 3.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.setFromValues = function(vec, v0, v1, v2, v3) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  vec[3] = v3;
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given array of values.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec The vector to receive the
***REMOVED***     values.
***REMOVED*** @param {goog.vec.Vec4.AnyType} values The array of values.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.setFromArray = function(vec, values) {
  vec[0] = values[0];
  vec[1] = values[1];
  vec[2] = values[2];
  vec[3] = values[3];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise addition of vec0 and vec1 together storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The first addend.
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec1 The second addend.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  resultVec[2] = vec0[2] + vec1[2];
  resultVec[3] = vec0[3] + vec1[3];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise subtraction of vec1 from vec0 storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The minuend.
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec1 The subtrahend.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  resultVec[3] = vec0[3] - vec1[3];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Negates vec0, storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The vector to negate.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  resultVec[2] = -vec0[2];
  resultVec[3] = -vec0[3];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Takes the absolute value of each component of vec0 storing the result in
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The source vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the result.
***REMOVED***     May be vec0.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.abs = function(vec0, resultVec) {
  resultVec[0] = Math.abs(vec0[0]);
  resultVec[1] = Math.abs(vec0[1]);
  resultVec[2] = Math.abs(vec0[2]);
  resultVec[3] = Math.abs(vec0[3]);
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies each component of vec0 with scalar storing the product into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The source vector.
***REMOVED*** @param {number} scalar The value to multiply with each component of vec0.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0]***REMOVED*** scalar;
  resultVec[1] = vec0[1]***REMOVED*** scalar;
  resultVec[2] = vec0[2]***REMOVED*** scalar;
  resultVec[3] = vec0[3]***REMOVED*** scalar;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitudeSquared of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec4.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z + w***REMOVED*** w;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.Vec4.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z + w***REMOVED*** w);
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given vector storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The vector to normalize.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.normalize = function(vec0, resultVec) {
  var ilen = 1 / goog.vec.Vec4.magnitude(vec0);
  resultVec[0] = vec0[0]***REMOVED*** ilen;
  resultVec[1] = vec0[1]***REMOVED*** ilen;
  resultVec[2] = vec0[2]***REMOVED*** ilen;
  resultVec[3] = vec0[3]***REMOVED*** ilen;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scalar product of vectors v0 and v1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType} v1 The second vector.
***REMOVED*** @return {number} The scalar product.
***REMOVED***
goog.vec.Vec4.dot = function(v0, v1) {
  return v0[0]***REMOVED*** v1[0] + v0[1]***REMOVED*** v1[1] + v0[2]***REMOVED*** v1[2] + v0[3]***REMOVED*** v1[3];
***REMOVED***


***REMOVED***
***REMOVED*** Linearly interpolate from v0 to v1 according to f. The value of f should be
***REMOVED*** in the range [0..1] otherwise the results are undefined.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType} v1 The second vector.
***REMOVED*** @param {number} f The interpolation factor.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be v0 or v1).
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.lerp = function(v0, v1, f, resultVec) {
  var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
  resultVec[0] = (v1[0] - x)***REMOVED*** f + x;
  resultVec[1] = (v1[1] - y)***REMOVED*** f + y;
  resultVec[2] = (v1[2] - z)***REMOVED*** f + z;
  resultVec[3] = (v1[3] - w)***REMOVED*** f + w;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Compares the components of vec0 with the components of another vector or
***REMOVED*** scalar, storing the larger values in resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The source vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.max = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.max(vec0[0], limit);
    resultVec[1] = Math.max(vec0[1], limit);
    resultVec[2] = Math.max(vec0[2], limit);
    resultVec[3] = Math.max(vec0[3], limit);
  } else {
    resultVec[0] = Math.max(vec0[0], limit[0]);
    resultVec[1] = Math.max(vec0[1], limit[1]);
    resultVec[2] = Math.max(vec0[2], limit[2]);
    resultVec[3] = Math.max(vec0[3], limit[3]);
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Compares the components of vec0 with the components of another vector or
***REMOVED*** scalar, storing the smaller values in resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} vec0 The source vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.Vec4.min = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.min(vec0[0], limit);
    resultVec[1] = Math.min(vec0[1], limit);
    resultVec[2] = Math.min(vec0[2], limit);
    resultVec[3] = Math.min(vec0[3], limit);
  } else {
    resultVec[0] = Math.min(vec0[0], limit[0]);
    resultVec[1] = Math.min(vec0[1], limit[1]);
    resultVec[2] = Math.min(vec0[2], limit[2]);
    resultVec[3] = Math.min(vec0[3], limit[3]);
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the components of v0 are equal to the components of v1.
***REMOVED***
***REMOVED*** @param {goog.vec.Vec4.AnyType} v0 The first vector.
***REMOVED*** @param {goog.vec.Vec4.AnyType} v1 The second vector.
***REMOVED*** @return {boolean} True if the vectors are equal, false otherwise.
***REMOVED***
goog.vec.Vec4.equals = function(v0, v1) {
  return v0.length == v1.length &&
      v0[0] == v1[0] && v0[1] == v1[1] && v0[2] == v1[2] && v0[3] == v1[3];
***REMOVED***
