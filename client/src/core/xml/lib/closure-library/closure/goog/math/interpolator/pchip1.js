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
***REMOVED*** @fileoverview A one dimensional monotone cubic spline interpolator.
***REMOVED***
***REMOVED*** See http://en.wikipedia.org/wiki/Monotone_cubic_interpolation.
***REMOVED***
***REMOVED***

goog.provide('goog.math.interpolator.Pchip1');

goog.require('goog.math');
goog.require('goog.math.interpolator.Spline1');



***REMOVED***
***REMOVED*** A one dimensional monotone cubic spline interpolator.
***REMOVED*** @extends {goog.math.interpolator.Spline1}
***REMOVED***
***REMOVED***
goog.math.interpolator.Pchip1 = function() {
  goog.base(this);
***REMOVED***
goog.inherits(goog.math.interpolator.Pchip1, goog.math.interpolator.Spline1);


***REMOVED*** @override***REMOVED***
goog.math.interpolator.Pchip1.prototype.computeDerivatives = function(
    dx, slope) {
  var len = dx.length;
  var deriv = new Array(len + 1);
  for (var i = 1; i < len; ++i) {
    if (goog.math.sign(slope[i - 1])***REMOVED*** goog.math.sign(slope[i]) <= 0) {
      deriv[i] = 0;
    } else {
      var w1 = 2***REMOVED*** dx[i] + dx[i - 1];
      var w2 = dx[i] + 2***REMOVED*** dx[i - 1];
      deriv[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }
  deriv[0] = this.computeDerivativeAtBoundary_(
      dx[0], dx[1], slope[0], slope[1]);
  deriv[len] = this.computeDerivativeAtBoundary_(
      dx[len - 1], dx[len - 2], slope[len - 1], slope[len - 2]);
  return deriv;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the derivative of a data point at a boundary.
***REMOVED*** @param {number} dx0 The spacing of the 1st data point.
***REMOVED*** @param {number} dx1 The spacing of the 2nd data point.
***REMOVED*** @param {number} slope0 The slope of the 1st data point.
***REMOVED*** @param {number} slope1 The slope of the 2nd data point.
***REMOVED*** @return {number} The derivative at the 1st data point.
***REMOVED*** @private
***REMOVED***
goog.math.interpolator.Pchip1.prototype.computeDerivativeAtBoundary_ = function(
    dx0, dx1, slope0, slope1) {
  var deriv = ((2***REMOVED*** dx0 + dx1)***REMOVED*** slope0 - dx0***REMOVED*** slope1) / (dx0 + dx1);
  if (goog.math.sign(deriv) != goog.math.sign(slope0)) {
    deriv = 0;
  } else if (goog.math.sign(slope0) != goog.math.sign(slope1) &&
      Math.abs(deriv) > Math.abs(3***REMOVED*** slope0)) {
    deriv = 3***REMOVED*** slope0;
  }
  return deriv;
***REMOVED***
