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
***REMOVED*** @fileoverview Provides an object representation of an AffineTransform and
***REMOVED*** methods for working with it.
***REMOVED***


goog.provide('goog.graphics.AffineTransform');

goog.require('goog.math');



***REMOVED***
***REMOVED*** Creates a 2D affine transform. An affine transform performs a linear
***REMOVED*** mapping from 2D coordinates to other 2D coordinates that preserves the
***REMOVED*** "straightness" and "parallelness" of lines.
***REMOVED***
***REMOVED*** Such a coordinate transformation can be represented by a 3 row by 3 column
***REMOVED*** matrix with an implied last row of [ 0 0 1 ]. This matrix transforms source
***REMOVED*** coordinates (x,y) into destination coordinates (x',y') by considering them
***REMOVED*** to be a column vector and multiplying the coordinate vector by the matrix
***REMOVED*** according to the following process:
***REMOVED*** <pre>
***REMOVED***      [ x']   [  m00  m01  m02  ] [ x ]   [ m00x + m01y + m02 ]
***REMOVED***      [ y'] = [  m10  m11  m12  ] [ y ] = [ m10x + m11y + m12 ]
***REMOVED***      [ 1 ]   [   0    0    1   ] [ 1 ]   [         1         ]
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** This class is optimized for speed and minimizes calculations based on its
***REMOVED*** knowledge of the underlying matrix (as opposed to say simply performing
***REMOVED*** matrix multiplication).
***REMOVED***
***REMOVED*** @param {number=} opt_m00 The m00 coordinate of the transform.
***REMOVED*** @param {number=} opt_m10 The m10 coordinate of the transform.
***REMOVED*** @param {number=} opt_m01 The m01 coordinate of the transform.
***REMOVED*** @param {number=} opt_m11 The m11 coordinate of the transform.
***REMOVED*** @param {number=} opt_m02 The m02 coordinate of the transform.
***REMOVED*** @param {number=} opt_m12 The m12 coordinate of the transform.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.graphics.AffineTransform = function(opt_m00, opt_m10, opt_m01,
    opt_m11, opt_m02, opt_m12) {
  if (arguments.length == 6) {
    this.setTransform(***REMOVED*** @type {number}***REMOVED*** (opt_m00),
                     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_m10),
                     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_m01),
                     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_m11),
                     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_m02),
                     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_m12));
  } else if (arguments.length != 0) {
    throw Error('Insufficient matrix parameters');
  } else {
    this.m00_ = this.m11_ = 1;
    this.m10_ = this.m01_ = this.m02_ = this.m12_ = 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this transform is the identity transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.isIdentity = function() {
  return this.m00_ == 1 && this.m10_ == 0 && this.m01_ == 0 &&
      this.m11_ == 1 && this.m02_ == 0 && this.m12_ == 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.graphics.AffineTransform} A copy of this transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.clone = function() {
  return new goog.graphics.AffineTransform(this.m00_, this.m10_, this.m01_,
      this.m11_, this.m02_, this.m12_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to the matrix specified by the 6 values.
***REMOVED***
***REMOVED*** @param {number} m00 The m00 coordinate of the transform.
***REMOVED*** @param {number} m10 The m10 coordinate of the transform.
***REMOVED*** @param {number} m01 The m01 coordinate of the transform.
***REMOVED*** @param {number} m11 The m11 coordinate of the transform.
***REMOVED*** @param {number} m02 The m02 coordinate of the transform.
***REMOVED*** @param {number} m12 The m12 coordinate of the transform.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.setTransform = function(m00, m10, m01,
    m11, m02, m12) {
  if (!goog.isNumber(m00) || !goog.isNumber(m10) || !goog.isNumber(m01) ||
      !goog.isNumber(m11) || !goog.isNumber(m02) || !goog.isNumber(m12)) {
    throw Error('Invalid transform parameters');
  }
  this.m00_ = m00;
  this.m10_ = m10;
  this.m01_ = m01;
  this.m11_ = m11;
  this.m02_ = m02;
  this.m12_ = m12;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to be identical to the given transform.
***REMOVED***
***REMOVED*** @param {!goog.graphics.AffineTransform} tx The transform to copy.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.copyFrom = function(tx) {
  this.m00_ = tx.m00_;
  this.m10_ = tx.m10_;
  this.m01_ = tx.m01_;
  this.m11_ = tx.m11_;
  this.m02_ = tx.m02_;
  this.m12_ = tx.m12_;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates this transform with a scaling transformation.
***REMOVED***
***REMOVED*** @param {number} sx The x-axis scaling factor.
***REMOVED*** @param {number} sy The y-axis scaling factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.scale = function(sx, sy) {
  this.m00_***REMOVED***= sx;
  this.m10_***REMOVED***= sx;
  this.m01_***REMOVED***= sy;
  this.m11_***REMOVED***= sy;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Pre-concatenates this transform with a scaling transformation,
***REMOVED*** i.e. calculates the following matrix product:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** [sx  0 0] [m00 m01 m02]
***REMOVED*** [ 0 sy 0] [m10 m11 m12]
***REMOVED*** [ 0  0 1] [  0   0   1]
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} sx The x-axis scaling factor.
***REMOVED*** @param {number} sy The y-axis scaling factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.preScale = function(sx, sy) {
  this.m00_***REMOVED***= sx;
  this.m01_***REMOVED***= sx;
  this.m02_***REMOVED***= sx;
  this.m10_***REMOVED***= sy;
  this.m11_***REMOVED***= sy;
  this.m12_***REMOVED***= sy;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates this transform with a translate transformation.
***REMOVED***
***REMOVED*** @param {number} dx The distance to translate in the x direction.
***REMOVED*** @param {number} dy The distance to translate in the y direction.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.translate = function(dx, dy) {
  this.m02_ += dx***REMOVED*** this.m00_ + dy***REMOVED*** this.m01_;
  this.m12_ += dx***REMOVED*** this.m10_ + dy***REMOVED*** this.m11_;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Pre-concatenates this transform with a translate transformation,
***REMOVED*** i.e. calculates the following matrix product:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** [1 0 dx] [m00 m01 m02]
***REMOVED*** [0 1 dy] [m10 m11 m12]
***REMOVED*** [0 0  1] [  0   0   1]
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} dx The distance to translate in the x direction.
***REMOVED*** @param {number} dy The distance to translate in the y direction.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.preTranslate = function(dx, dy) {
  this.m02_ += dx;
  this.m12_ += dy;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates this transform with a rotation transformation around an anchor
***REMOVED*** point.
***REMOVED***
***REMOVED*** @param {number} theta The angle of rotation measured in radians.
***REMOVED*** @param {number} x The x coordinate of the anchor point.
***REMOVED*** @param {number} y The y coordinate of the anchor point.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.rotate = function(theta, x, y) {
  return this.concatenate(
      goog.graphics.AffineTransform.getRotateInstance(theta, x, y));
***REMOVED***


***REMOVED***
***REMOVED*** Pre-concatenates this transform with a rotation transformation around an
***REMOVED*** anchor point.
***REMOVED***
***REMOVED*** @param {number} theta The angle of rotation measured in radians.
***REMOVED*** @param {number} x The x coordinate of the anchor point.
***REMOVED*** @param {number} y The y coordinate of the anchor point.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.preRotate = function(theta, x, y) {
  return this.preConcatenate(
      goog.graphics.AffineTransform.getRotateInstance(theta, x, y));
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates this transform with a shear transformation.
***REMOVED***
***REMOVED*** @param {number} shx The x shear factor.
***REMOVED*** @param {number} shy The y shear factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.shear = function(shx, shy) {
  var m00 = this.m00_;
  var m10 = this.m10_;
  this.m00_ += shy***REMOVED*** this.m01_;
  this.m10_ += shy***REMOVED*** this.m11_;
  this.m01_ += shx***REMOVED*** m00;
  this.m11_ += shx***REMOVED*** m10;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Pre-concatenates this transform with a shear transformation.
***REMOVED*** i.e. calculates the following matrix product:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** [  1 shx 0] [m00 m01 m02]
***REMOVED*** [shy   1 0] [m10 m11 m12]
***REMOVED*** [  0   0 1] [  0   0   1]
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} shx The x shear factor.
***REMOVED*** @param {number} shy The y shear factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.preShear = function(shx, shy) {
  var m00 = this.m00_;
  var m01 = this.m01_;
  var m02 = this.m02_;
  this.m00_ += shx***REMOVED*** this.m10_;
  this.m01_ += shx***REMOVED*** this.m11_;
  this.m02_ += shx***REMOVED*** this.m12_;
  this.m10_ += shy***REMOVED*** m00;
  this.m11_ += shy***REMOVED*** m01;
  this.m12_ += shy***REMOVED*** m02;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} A string representation of this transform. The format of
***REMOVED***     of the string is compatible with SVG matrix notation, i.e.
***REMOVED***     "matrix(a,b,c,d,e,f)".
***REMOVED*** @override
***REMOVED***
goog.graphics.AffineTransform.prototype.toString = function() {
  return 'matrix(' +
      [this.m00_, this.m10_, this.m01_, this.m11_, this.m02_, this.m12_].join(
          ',') +
      ')';
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The scaling factor in the x-direction (m00).
***REMOVED***
goog.graphics.AffineTransform.prototype.getScaleX = function() {
  return this.m00_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The scaling factor in the y-direction (m11).
***REMOVED***
goog.graphics.AffineTransform.prototype.getScaleY = function() {
  return this.m11_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The translation in the x-direction (m02).
***REMOVED***
goog.graphics.AffineTransform.prototype.getTranslateX = function() {
  return this.m02_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The translation in the y-direction (m12).
***REMOVED***
goog.graphics.AffineTransform.prototype.getTranslateY = function() {
  return this.m12_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The shear factor in the x-direction (m01).
***REMOVED***
goog.graphics.AffineTransform.prototype.getShearX = function() {
  return this.m01_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The shear factor in the y-direction (m10).
***REMOVED***
goog.graphics.AffineTransform.prototype.getShearY = function() {
  return this.m10_;
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates an affine transform to this transform.
***REMOVED***
***REMOVED*** @param {!goog.graphics.AffineTransform} tx The transform to concatenate.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.concatenate = function(tx) {
  var m0 = this.m00_;
  var m1 = this.m01_;
  this.m00_ = tx.m00_***REMOVED*** m0 + tx.m10_***REMOVED*** m1;
  this.m01_ = tx.m01_***REMOVED*** m0 + tx.m11_***REMOVED*** m1;
  this.m02_ += tx.m02_***REMOVED*** m0 + tx.m12_***REMOVED*** m1;

  m0 = this.m10_;
  m1 = this.m11_;
  this.m10_ = tx.m00_***REMOVED*** m0 + tx.m10_***REMOVED*** m1;
  this.m11_ = tx.m01_***REMOVED*** m0 + tx.m11_***REMOVED*** m1;
  this.m12_ += tx.m02_***REMOVED*** m0 + tx.m12_***REMOVED*** m1;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Pre-concatenates an affine transform to this transform.
***REMOVED***
***REMOVED*** @param {!goog.graphics.AffineTransform} tx The transform to preconcatenate.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.preConcatenate = function(tx) {
  var m0 = this.m00_;
  var m1 = this.m10_;
  this.m00_ = tx.m00_***REMOVED*** m0 + tx.m01_***REMOVED*** m1;
  this.m10_ = tx.m10_***REMOVED*** m0 + tx.m11_***REMOVED*** m1;

  m0 = this.m01_;
  m1 = this.m11_;
  this.m01_ = tx.m00_***REMOVED*** m0 + tx.m01_***REMOVED*** m1;
  this.m11_ = tx.m10_***REMOVED*** m0 + tx.m11_***REMOVED*** m1;

  m0 = this.m02_;
  m1 = this.m12_;
  this.m02_ = tx.m00_***REMOVED*** m0 + tx.m01_***REMOVED*** m1 + tx.m02_;
  this.m12_ = tx.m10_***REMOVED*** m0 + tx.m11_***REMOVED*** m1 + tx.m12_;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Transforms an array of coordinates by this transform and stores the result
***REMOVED*** into a destination array.
***REMOVED***
***REMOVED*** @param {!Array.<number>} src The array containing the source points
***REMOVED***     as x, y value pairs.
***REMOVED*** @param {number} srcOff The offset to the first point to be transformed.
***REMOVED*** @param {!Array.<number>} dst The array into which to store the transformed
***REMOVED***     point pairs.
***REMOVED*** @param {number} dstOff The offset of the location of the first transformed
***REMOVED***     point in the destination array.
***REMOVED*** @param {number} numPts The number of points to tranform.
***REMOVED***
goog.graphics.AffineTransform.prototype.transform = function(src, srcOff, dst,
    dstOff, numPts) {
  var i = srcOff;
  var j = dstOff;
  var srcEnd = srcOff + 2***REMOVED*** numPts;
  while (i < srcEnd) {
    var x = src[i++];
    var y = src[i++];
    dst[j++] = x***REMOVED*** this.m00_ + y***REMOVED*** this.m01_ + this.m02_;
    dst[j++] = x***REMOVED*** this.m10_ + y***REMOVED*** this.m11_ + this.m12_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The determinant of this transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.getDeterminant = function() {
  return this.m00_***REMOVED*** this.m11_ - this.m01_***REMOVED*** this.m10_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the transform is invertible. A transform is not invertible
***REMOVED*** if the determinant is 0 or any value is non-finite or NaN.
***REMOVED***
***REMOVED*** @return {boolean} Whether the transform is invertible.
***REMOVED***
goog.graphics.AffineTransform.prototype.isInvertible = function() {
  var det = this.getDeterminant();
  return goog.math.isFiniteNumber(det) &&
      goog.math.isFiniteNumber(this.m02_) &&
      goog.math.isFiniteNumber(this.m12_) &&
      det != 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.graphics.AffineTransform} An AffineTransform object
***REMOVED***     representing the inverse transformation.
***REMOVED***
goog.graphics.AffineTransform.prototype.createInverse = function() {
  var det = this.getDeterminant();
  return new goog.graphics.AffineTransform(
      this.m11_ / det,
      -this.m10_ / det,
      -this.m01_ / det,
      this.m00_ / det,
      (this.m01_***REMOVED*** this.m12_ - this.m11_***REMOVED*** this.m02_) / det,
      (this.m10_***REMOVED*** this.m02_ - this.m00_***REMOVED*** this.m12_) / det);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a transform representing a scaling transformation.
***REMOVED***
***REMOVED*** @param {number} sx The x-axis scaling factor.
***REMOVED*** @param {number} sy The y-axis scaling factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} A transform representing a scaling
***REMOVED***     transformation.
***REMOVED***
goog.graphics.AffineTransform.getScaleInstance = function(sx, sy) {
  return new goog.graphics.AffineTransform().setToScale(sx, sy);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a transform representing a translation transformation.
***REMOVED***
***REMOVED*** @param {number} dx The distance to translate in the x direction.
***REMOVED*** @param {number} dy The distance to translate in the y direction.
***REMOVED*** @return {!goog.graphics.AffineTransform} A transform representing a
***REMOVED***     translation transformation.
***REMOVED***
goog.graphics.AffineTransform.getTranslateInstance = function(dx, dy) {
  return new goog.graphics.AffineTransform().setToTranslation(dx, dy);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a transform representing a shearing transformation.
***REMOVED***
***REMOVED*** @param {number} shx The x-axis shear factor.
***REMOVED*** @param {number} shy The y-axis shear factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} A transform representing a shearing
***REMOVED***     transformation.
***REMOVED***
goog.graphics.AffineTransform.getShearInstance = function(shx, shy) {
  return new goog.graphics.AffineTransform().setToShear(shx, shy);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a transform representing a rotation transformation.
***REMOVED***
***REMOVED*** @param {number} theta The angle of rotation measured in radians.
***REMOVED*** @param {number} x The x coordinate of the anchor point.
***REMOVED*** @param {number} y The y coordinate of the anchor point.
***REMOVED*** @return {!goog.graphics.AffineTransform} A transform representing a rotation
***REMOVED***     transformation.
***REMOVED***
goog.graphics.AffineTransform.getRotateInstance = function(theta, x, y) {
  return new goog.graphics.AffineTransform().setToRotation(theta, x, y);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to a scaling transformation.
***REMOVED***
***REMOVED*** @param {number} sx The x-axis scaling factor.
***REMOVED*** @param {number} sy The y-axis scaling factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.setToScale = function(sx, sy) {
  return this.setTransform(sx, 0, 0, sy, 0, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to a translation transformation.
***REMOVED***
***REMOVED*** @param {number} dx The distance to translate in the x direction.
***REMOVED*** @param {number} dy The distance to translate in the y direction.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.setToTranslation = function(dx, dy) {
  return this.setTransform(1, 0, 0, 1, dx, dy);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to a shearing transformation.
***REMOVED***
***REMOVED*** @param {number} shx The x-axis shear factor.
***REMOVED*** @param {number} shy The y-axis shear factor.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.setToShear = function(shx, shy) {
  return this.setTransform(1, shy, shx, 1, 0, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this transform to a rotation transformation.
***REMOVED***
***REMOVED*** @param {number} theta The angle of rotation measured in radians.
***REMOVED*** @param {number} x The x coordinate of the anchor point.
***REMOVED*** @param {number} y The y coordinate of the anchor point.
***REMOVED*** @return {!goog.graphics.AffineTransform} This affine transform.
***REMOVED***
goog.graphics.AffineTransform.prototype.setToRotation = function(theta, x, y) {
  var cos = Math.cos(theta);
  var sin = Math.sin(theta);
  return this.setTransform(cos, sin, -sin, cos,
      x - x***REMOVED*** cos + y***REMOVED*** sin, y - x***REMOVED*** sin - y***REMOVED*** cos);
***REMOVED***


***REMOVED***
***REMOVED*** Compares two affine transforms for equality.
***REMOVED***
***REMOVED*** @param {goog.graphics.AffineTransform} tx The other affine transform.
***REMOVED*** @return {boolean} whether the two transforms are equal.
***REMOVED***
goog.graphics.AffineTransform.prototype.equals = function(tx) {
  if (this == tx) {
    return true;
  }
  if (!tx) {
    return false;
  }
  return this.m00_ == tx.m00_ &&
      this.m01_ == tx.m01_ &&
      this.m02_ == tx.m02_ &&
      this.m10_ == tx.m10_ &&
      this.m11_ == tx.m11_ &&
      this.m12_ == tx.m12_;
***REMOVED***
