// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Additional mathematical functions.
***REMOVED***

goog.provide('goog.math');

goog.require('goog.array');
goog.require('goog.asserts');


***REMOVED***
***REMOVED*** Returns a random integer greater than or equal to 0 and less than {@code a}.
***REMOVED*** @param {number} a  The upper bound for the random integer (exclusive).
***REMOVED*** @return {number} A random integer N such that 0 <= N < a.
***REMOVED***
goog.math.randomInt = function(a) {
  return Math.floor(Math.random()***REMOVED*** a);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a random number greater than or equal to {@code a} and less than
***REMOVED*** {@code b}.
***REMOVED*** @param {number} a  The lower bound for the random number (inclusive).
***REMOVED*** @param {number} b  The upper bound for the random number (exclusive).
***REMOVED*** @return {number} A random number N such that a <= N < b.
***REMOVED***
goog.math.uniformRandom = function(a, b) {
  return a + Math.random()***REMOVED*** (b - a);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a number and clamps it to within the provided bounds.
***REMOVED*** @param {number} value The input number.
***REMOVED*** @param {number} min The minimum value to return.
***REMOVED*** @param {number} max The maximum value to return.
***REMOVED*** @return {number} The input number if it is within bounds, or the nearest
***REMOVED***     number within the bounds.
***REMOVED***
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
***REMOVED***


***REMOVED***
***REMOVED*** The % operator in JavaScript returns the remainder of a / b, but differs from
***REMOVED*** some other languages in that the result will have the same sign as the
***REMOVED*** dividend. For example, -1 % 8 == -1, whereas in some other languages
***REMOVED*** (such as Python) the result would be 7. This function emulates the more
***REMOVED*** correct modulo behavior, which is useful for certain applications such as
***REMOVED*** calculating an offset index in a circular list.
***REMOVED***
***REMOVED*** @param {number} a The dividend.
***REMOVED*** @param {number} b The divisor.
***REMOVED*** @return {number} a % b where the result is between 0 and b (either 0 <= x < b
***REMOVED***     or b < x <= 0, depending on the sign of b).
***REMOVED***
goog.math.modulo = function(a, b) {
  var r = a % b;
  // If r and b differ in sign, add b to wrap the result to the correct sign.
  return (r***REMOVED*** b < 0) ? r + b : r;
***REMOVED***


***REMOVED***
***REMOVED*** Performs linear interpolation between values a and b. Returns the value
***REMOVED*** between a and b proportional to x (when x is between 0 and 1. When x is
***REMOVED*** outside this range, the return value is a linear extrapolation).
***REMOVED*** @param {number} a A number.
***REMOVED*** @param {number} b A number.
***REMOVED*** @param {number} x The proportion between a and b.
***REMOVED*** @return {number} The interpolated value between a and b.
***REMOVED***
goog.math.lerp = function(a, b, x) {
  return a + x***REMOVED*** (b - a);
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the two values are equal to each other, within a certain
***REMOVED*** tolerance to adjust for floating pount errors.
***REMOVED*** @param {number} a A number.
***REMOVED*** @param {number} b A number.
***REMOVED*** @param {number=} opt_tolerance Optional tolerance range. Defaults
***REMOVED***     to 0.000001. If specified, should be greater than 0.
***REMOVED*** @return {boolean} Whether {@code a} and {@code b} are nearly equal.
***REMOVED***
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 0.000001);
***REMOVED***


***REMOVED***
***REMOVED*** Standardizes an angle to be in range [0-360). Negative angles become
***REMOVED*** positive, and values greater than 360 are returned modulo 360.
***REMOVED*** @param {number} angle Angle in degrees.
***REMOVED*** @return {number} Standardized angle.
***REMOVED***
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
***REMOVED***


***REMOVED***
***REMOVED*** Converts degrees to radians.
***REMOVED*** @param {number} angleDegrees Angle in degrees.
***REMOVED*** @return {number} Angle in radians.
***REMOVED***
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees***REMOVED*** Math.PI / 180;
***REMOVED***


***REMOVED***
***REMOVED*** Converts radians to degrees.
***REMOVED*** @param {number} angleRadians Angle in radians.
***REMOVED*** @return {number} Angle in degrees.
***REMOVED***
goog.math.toDegrees = function(angleRadians) {
  return angleRadians***REMOVED*** 180 / Math.PI;
***REMOVED***


***REMOVED***
***REMOVED*** For a given angle and radius, finds the X portion of the offset.
***REMOVED*** @param {number} degrees Angle in degrees (zero points in +X direction).
***REMOVED*** @param {number} radius Radius.
***REMOVED*** @return {number} The x-distance for the angle and radius.
***REMOVED***
goog.math.angleDx = function(degrees, radius) {
  return radius***REMOVED*** Math.cos(goog.math.toRadians(degrees));
***REMOVED***


***REMOVED***
***REMOVED*** For a given angle and radius, finds the Y portion of the offset.
***REMOVED*** @param {number} degrees Angle in degrees (zero points in +X direction).
***REMOVED*** @param {number} radius Radius.
***REMOVED*** @return {number} The y-distance for the angle and radius.
***REMOVED***
goog.math.angleDy = function(degrees, radius) {
  return radius***REMOVED*** Math.sin(goog.math.toRadians(degrees));
***REMOVED***


***REMOVED***
***REMOVED*** Computes the angle between two points (x1,y1) and (x2,y2).
***REMOVED*** Angle zero points in the +X direction, 90 degrees points in the +Y
***REMOVED*** direction (down) and from there we grow clockwise towards 360 degrees.
***REMOVED*** @param {number} x1 x of first point.
***REMOVED*** @param {number} y1 y of first point.
***REMOVED*** @param {number} x2 x of second point.
***REMOVED*** @param {number} y2 y of second point.
***REMOVED*** @return {number} Standardized angle in degrees of the vector from
***REMOVED***     x1,y1 to x2,y2.
***REMOVED***
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1,
                                                                x2 - x1)));
***REMOVED***


***REMOVED***
***REMOVED*** Computes the difference between startAngle and endAngle (angles in degrees).
***REMOVED*** @param {number} startAngle  Start angle in degrees.
***REMOVED*** @param {number} endAngle  End angle in degrees.
***REMOVED*** @return {number} The number of degrees that when added to
***REMOVED***     startAngle will result in endAngle. Positive numbers mean that the
***REMOVED***     direction is clockwise. Negative numbers indicate a counter-clockwise
***REMOVED***     direction.
***REMOVED***     The shortest route (clockwise vs counter-clockwise) between the angles
***REMOVED***     is used.
***REMOVED***     When the difference is 180 degrees, the function returns 180 (not -180)
***REMOVED***     angleDifference(30, 40) is 10, and angleDifference(40, 30) is -10.
***REMOVED***     angleDifference(350, 10) is 20, and angleDifference(10, 350) is -20.
***REMOVED***
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) -
          goog.math.standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else if (d <= -180) {
    d = 360 + d;
  }
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the sign of a number as per the "sign" or "signum" function.
***REMOVED*** @param {number} x The number to take the sign of.
***REMOVED*** @return {number} -1 when negative, 1 when positive, 0 when 0.
***REMOVED***
goog.math.sign = function(x) {
  return x == 0 ? 0 : (x < 0 ? -1 : 1);
***REMOVED***


***REMOVED***
***REMOVED*** JavaScript implementation of Longest Common Subsequence problem.
***REMOVED*** http://en.wikipedia.org/wiki/Longest_common_subsequence
***REMOVED***
***REMOVED*** Returns the longest possible array that is subarray of both of given arrays.
***REMOVED***
***REMOVED*** @param {Array.<Object>} array1 First array of objects.
***REMOVED*** @param {Array.<Object>} array2 Second array of objects.
***REMOVED*** @param {Function=} opt_compareFn Function that acts as a custom comparator
***REMOVED***     for the array ojects. Function should return true if objects are equal,
***REMOVED***     otherwise false.
***REMOVED*** @param {Function=} opt_collectorFn Function used to decide what to return
***REMOVED***     as a result subsequence. It accepts 2 arguments: index of common element
***REMOVED***     in the first array and index in the second. The default function returns
***REMOVED***     element from the first array.
***REMOVED*** @return {Array.<Object>} A list of objects that are common to both arrays
***REMOVED***     such that there is no common subsequence with size greater than the
***REMOVED***     length of the list.
***REMOVED***
goog.math.longestCommonSubsequence = function(
    array1, array2, opt_compareFn, opt_collectorFn) {

  var compare = opt_compareFn || function(a, b) {
    return a == b;
 ***REMOVED*****REMOVED***

  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
 ***REMOVED*****REMOVED***

  var length1 = array1.length;
  var length2 = array2.length;

  var arr = [];
  for (var i = 0; i < length1 + 1; i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }

  for (var j = 0; j < length2 + 1; j++) {
    arr[0][j] = 0;
  }

  for (i = 1; i <= length1; i++) {
    for (j = 1; j <= length1; j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }

  // Backtracking
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the sum of the arguments.
***REMOVED*** @param {...number} var_args Numbers to add.
***REMOVED*** @return {number} The sum of the arguments (0 if no arguments were provided,
***REMOVED***     {@code NaN} if any of the arguments is not a valid number).
***REMOVED***
goog.math.sum = function(var_args) {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (goog.array.reduce(arguments,
      function(sum, value) {
        return sum + value;
      }, 0));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the arithmetic mean of the arguments.
***REMOVED*** @param {...number} var_args Numbers to average.
***REMOVED*** @return {number} The average of the arguments ({@code NaN} if no arguments
***REMOVED***     were provided or any of the arguments is not a valid number).
***REMOVED***
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the sample standard deviation of the arguments.  For a definition of
***REMOVED*** sample standard deviation, see e.g.
***REMOVED*** http://en.wikipedia.org/wiki/Standard_deviation
***REMOVED*** @param {...number} var_args Number samples to analyze.
***REMOVED*** @return {number} The sample standard deviation of the arguments (0 if fewer
***REMOVED***     than two samples were provided, or {@code NaN} if any of the samples is
***REMOVED***     not a valid number).
***REMOVED***
goog.math.standardDeviation = function(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }

  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments,
      function(val) {
        return Math.pow(val - mean, 2);
      })) / (sampleSize - 1);

  return Math.sqrt(variance);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the supplied number represents an integer, i.e. that is has
***REMOVED*** no fractional component.  No range-checking is performed on the number.
***REMOVED*** @param {number} num The number to test.
***REMOVED*** @return {boolean} Whether {@code num} is an integer.
***REMOVED***
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the supplied number is finite and not NaN.
***REMOVED*** @param {number} num The number to test.
***REMOVED*** @return {boolean} Whether {@code num} is a finite number.
***REMOVED***
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
***REMOVED***


***REMOVED***
***REMOVED*** A tweaked variant of {@code Math.floor} which tolerates if the passed number
***REMOVED*** is infinitesimally smaller than the closest integer. It often happens with
***REMOVED*** the results of floating point calculations because of the finite precision
***REMOVED*** of the intermediate results. For example {@code Math.floor(Math.log(1000) /
***REMOVED*** Math.LN10) == 2}, not 3 as one would expect.
***REMOVED*** @param {number} num A number.
***REMOVED*** @param {number=} opt_epsilon An infinitesimally small positive number, the
***REMOVED***     rounding error to tolerate.
***REMOVED*** @return {number} The largest integer less than or equal to {@code num}.
***REMOVED***
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2e-15));
***REMOVED***


***REMOVED***
***REMOVED*** A tweaked variant of {@code Math.ceil}. See {@code goog.math.safeFloor} for
***REMOVED*** details.
***REMOVED*** @param {number} num A number.
***REMOVED*** @param {number=} opt_epsilon An infinitesimally small positive number, the
***REMOVED***     rounding error to tolerate.
***REMOVED*** @return {number} The smallest integer greater than or equal to {@code num}.
***REMOVED***
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2e-15));
***REMOVED***
