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
// Any edits to this file must be applied to vec3f.js by running:            //
//   swap_type.sh vec3d.js > vec3f.js                                        //
//                                                                           //
////////////////////////// NOTE ABOUT EDITING THIS FILE ///////////////////////


***REMOVED***
***REMOVED*** @fileoverview Provides functions for operating on 3 element double (64bit)
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
goog.provide('goog.vec.vec3d');
goog.provide('goog.vec.vec3d.Type');

***REMOVED*** @suppress {extraRequire}***REMOVED***
goog.require('goog.vec');

***REMOVED*** @typedef {goog.vec.Float64}***REMOVED*** goog.vec.vec3d.Type;


***REMOVED***
***REMOVED*** Creates a vec3d with all elements initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.vec3d.Type} The new vec3d.
***REMOVED***
goog.vec.vec3d.create = function() {
  return new Float64Array(3);
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the vector with the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec The vector to receive the values.
***REMOVED*** @param {number} v0 The value for element at index 0.
***REMOVED*** @param {number} v1 The value for element at index 1.
***REMOVED*** @param {number} v2 The value for element at index 2.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.setFromValues = function(vec, v0, v1, v2) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec3d vec from vec3d src.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec The destination vector.
***REMOVED*** @param {goog.vec.vec3d.Type} src The source vector.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.setFromVec3d = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec3d vec from vec3f src (typed as a Float32Array to
***REMOVED*** avoid circular goog.requires).
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec The destination vector.
***REMOVED*** @param {Float32Array} src The source vector.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.setFromVec3f = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes vec3d vec from Array src.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec The destination vector.
***REMOVED*** @param {Array.<number>} src The source vector.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.setFromArray = function(vec, src) {
  vec[0] = src[0];
  vec[1] = src[1];
  vec[2] = src[2];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise addition of vec0 and vec1 together storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The first addend.
***REMOVED*** @param {goog.vec.vec3d.Type} vec1 The second addend.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  resultVec[2] = vec0[2] + vec1[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a component-wise subtraction of vec1 from vec0 storing the
***REMOVED*** result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The minuend.
***REMOVED*** @param {goog.vec.vec3d.Type} vec1 The subtrahend.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0 or vec1.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Negates vec0, storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The vector to negate.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  resultVec[2] = -vec0[2];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Takes the absolute value of each component of vec0 storing the result in
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the result.
***REMOVED***     May be vec0.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.abs = function(vec0, resultVec) {
  resultVec[0] = Math.abs(vec0[0]);
  resultVec[1] = Math.abs(vec0[1]);
  resultVec[2] = Math.abs(vec0[2]);
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies each component of vec0 with scalar storing the product into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The source vector.
***REMOVED*** @param {number} scalar The value to multiply with each component of vec0.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0]***REMOVED*** scalar;
  resultVec[1] = vec0[1]***REMOVED*** scalar;
  resultVec[2] = vec0[2]***REMOVED*** scalar;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitudeSquared of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.vec3d.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitude of the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The vector.
***REMOVED*** @return {number} The magnitude of the vector.
***REMOVED***
goog.vec.vec3d.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z);
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given vector storing the result into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The vector to normalize.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to
***REMOVED***     receive the result. May be vec0.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.normalize = function(vec0, resultVec) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  var ilen = 1 / Math.sqrt(x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z);
  resultVec[0] = x***REMOVED*** ilen;
  resultVec[1] = y***REMOVED*** ilen;
  resultVec[2] = z***REMOVED*** ilen;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the scalar product of vectors v0 and v1.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec3d.Type} v1 The second vector.
***REMOVED*** @return {number} The scalar product.
***REMOVED***
goog.vec.vec3d.dot = function(v0, v1) {
  return v0[0]***REMOVED*** v1[0] + v0[1]***REMOVED*** v1[1] + v0[2]***REMOVED*** v1[2];
***REMOVED***


***REMOVED***
***REMOVED*** Computes the vector (cross) product of v0 and v1 storing the result into
***REMOVED*** resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec3d.Type} v1 The second vector.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the
***REMOVED***     results. May be either v0 or v1.
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.cross = function(v0, v1, resultVec) {
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
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 First point.
***REMOVED*** @param {goog.vec.vec3d.Type} vec1 Second point.
***REMOVED*** @return {number} The squared distance between the points.
***REMOVED***
goog.vec.vec3d.distanceSquared = function(vec0, vec1) {
  var x = vec0[0] - vec1[0];
  var y = vec0[1] - vec1[1];
  var z = vec0[2] - vec1[2];
  return x***REMOVED*** x + y***REMOVED*** y + z***REMOVED*** z;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the distance between two points.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 First point.
***REMOVED*** @param {goog.vec.vec3d.Type} vec1 Second point.
***REMOVED*** @return {number} The distance between the points.
***REMOVED***
goog.vec.vec3d.distance = function(vec0, vec1) {
  return Math.sqrt(goog.vec.vec3d.distanceSquared(vec0, vec1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns a unit vector pointing from one point to another.
***REMOVED*** If the input points are equal then the result will be all zeros.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 Origin point.
***REMOVED*** @param {goog.vec.vec3d.Type} vec1 Target point.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or vec1).
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.direction = function(vec0, vec1, resultVec) {
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
***REMOVED*** @param {goog.vec.vec3d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec3d.Type} v1 The second vector.
***REMOVED*** @param {number} f The interpolation factor.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the
***REMOVED***     results (may be v0 or v1).
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.lerp = function(v0, v1, f, resultVec) {
  var x = v0[0], y = v0[1], z = v0[2];
  resultVec[0] = (v1[0] - x)***REMOVED*** f + x;
  resultVec[1] = (v1[1] - y)***REMOVED*** f + y;
  resultVec[2] = (v1[2] - z)***REMOVED*** f + z;
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Compares the components of vec0 with the components of another vector or
***REMOVED*** scalar, storing the larger values in resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec3d.Type|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.max = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.max(vec0[0], limit);
    resultVec[1] = Math.max(vec0[1], limit);
    resultVec[2] = Math.max(vec0[2], limit);
  } else {
    resultVec[0] = Math.max(vec0[0], limit[0]);
    resultVec[1] = Math.max(vec0[1], limit[1]);
    resultVec[2] = Math.max(vec0[2], limit[2]);
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Compares the components of vec0 with the components of another vector or
***REMOVED*** scalar, storing the smaller values in resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} vec0 The source vector.
***REMOVED*** @param {goog.vec.vec3d.Type|number} limit The limit vector or scalar.
***REMOVED*** @param {goog.vec.vec3d.Type} resultVec The vector to receive the
***REMOVED***     results (may be vec0 or limit).
***REMOVED*** @return {!goog.vec.vec3d.Type} Return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.vec3d.min = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.min(vec0[0], limit);
    resultVec[1] = Math.min(vec0[1], limit);
    resultVec[2] = Math.min(vec0[2], limit);
  } else {
    resultVec[0] = Math.min(vec0[0], limit[0]);
    resultVec[1] = Math.min(vec0[1], limit[1]);
    resultVec[2] = Math.min(vec0[2], limit[2]);
  }
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the components of v0 are equal to the components of v1.
***REMOVED***
***REMOVED*** @param {goog.vec.vec3d.Type} v0 The first vector.
***REMOVED*** @param {goog.vec.vec3d.Type} v1 The second vector.
***REMOVED*** @return {boolean} True if the vectors are equal, false otherwise.
***REMOVED***
goog.vec.vec3d.equals = function(v0, v1) {
  return v0.length == v1.length &&
      v0[0] == v1[0] && v0[1] == v1[1] && v0[2] == v1[2];
***REMOVED***
