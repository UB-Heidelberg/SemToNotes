// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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


////////////////////////// NOTE ABOUT EDITING THIS FILE ///////////////////////
//                                                                           //
// Any edits to this file must be applied to vec4f.js by running:            //
//   swap_type.sh vec4d.js > vec4f.js                                        //
//                                                                           //
////////////////////////// NOTE ABOUT EDITING THIS FILE ///////////////////////


***REMOVED***
***REMOVED*** @fileoverview Provides functions for operating on 4 element double (64bit)
***REMOVED*** vectors.
***REMOVED***
***REMOVED*** The last parameter will typically be the output object and an object
***REMOVED*** can be both an input and output parameter to all methods except where
***REMOVED*** noted.
***REMOVED***
***REMOVED*** See the README for notes about the design and structure of the API
***REMOVED*** (especially related to performance).
***REMOVED***
***REMOVED***
goog.provide('goog.vec.vec4d');
goog.provide('goog.vec.vec4d.Type');

***REMOVED*** @suppress {extraRequire}***REMOVED***
goog.require('goog.vec');

***REMOVED*** @typedef {goog.vec.Float64}***REMOVED*** goog.vec.vec4d.Type;


***REMOVED***
***REMOVED*** Creates a vec4d with all elements initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.vec4d.Type} The new vec4d.
***REMOVED***
goog.vec.vec4d.create = function() {
  return new Float64Array(4);
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec The vector to receive the values.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @param {number} v3 The value for element at index 3.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.setFromValues = function(vec, v0, v1, v2, v3) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  vec[3] = v3;
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec4d vec from vec4d src.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec The destination vector.
***REMOVED*** @param {goog.vec.vec4d.Type} src The source vector.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.setFromVec4d = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  vec[3] = src[3];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec4d vec from vec4f src (typed as a Float32Array to
***REMOVED*** avoid circular goog.requires).
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec The destination vector.
***REMOVED*** @param {Float32Array} src The source vector.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.setFromVec4f = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  vec[3] = src[3];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec4d vec from Array src.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec The destination vector.
***REMOVED*** @param {Array.<number>} src The source vector.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.setFromArray = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  vec[3] = src[3];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise addition of vec0 and vec1 together storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The first addend.
***REMOVED*** @param {goog.vec.vec4d.Type} vec1 The second addend.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.add = function(vec0, vec1, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The minuend.
***REMOVED*** @param {goog.vec.vec4d.Type} vec1 The subtrahend.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  resultVec[3] = vec0[3] - vec1[3];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Negates vec0, storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The vector to negate.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.negate = function(vec0, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to receive the result.
***REMOVED***     May be vec0.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.abs = function(vec0, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The source vector.
***REMOVED*** @param {number} scalar The value to multiply with each component of vec0.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0]***REMOVED*** scalar;
  resultVec[1] = vec0[1]***REMOVED*** scalar;
  resultVec[2] = vec0[2]***REMOVED*** scalar;
  resultVec[3] = vec0[3]***REMOVED*** scalar;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitudeSquared of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.vec4d.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z + w***REMOVED*** w;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.vec4d.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z + w***REMOVED*** w);
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given vector storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The vector to normalize.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.normalize = function(vec0, resultVec) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  var ilen = 1 / Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z + w***REMOVED*** w);
  resultVec[0] = x***REMOVED*** ilen;
  resultVec[1] = y***REMOVED*** ilen;
  resultVec[2] = z***REMOVED*** ilen;
  resultVec[3] = w***REMOVED*** ilen;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scalar product of vectors v0 and v1.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec4d.Type} v1 The second vector.
***REMOVED*** @return {number} The scalar product.
***REMOVED***
goog.vec.vec4d.dot = function(v0, v1) {
  return v0[0]***REMOVED*** v1[0] + v0[1]***REMOVED*** v1[1] + v0[2]***REMOVED*** v1[2] + v0[3]***REMOVED*** v1[3];
***REMOVED***


***REMOVED***
***REMOVED*** Linearly interpolate from v0 to v1 according to f. The value of f should be
***REMOVED*** in the range [0..1] otherwise the results are undefined.
***REMOVED***
***REMOVED*** @param {goog.vec.vec4d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec4d.Type} v1 The second vector.
***REMOVED*** @param {number} f The interpolation factor.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to receive the
***REMOVED***     results (may be v0 or v1).
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.lerp = function(v0, v1, f, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec4d.Type|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.max = function(vec0, limit, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec4d.Type|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.vec4d.Type} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.vec4d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec4d.min = function(vec0, limit, resultVec) {
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
***REMOVED*** @param {goog.vec.vec4d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec4d.Type} v1 The second vector.
***REMOVED*** @return {boolean} True if the vectors are equal, false otherwise.
***REMOVED***
goog.vec.vec4d.equals = function(v0, v1) {
  return v0.length == v1.length &&
      v0[0] == v1[0] && v0[1] == v1[1] && v0[2] == v1[2] && v0[3] == v1[3];
***REMOVED***
