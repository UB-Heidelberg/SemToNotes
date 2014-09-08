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
***REMOVED*** @fileoverview The base interface for one-dimensional data interpolation.
***REMOVED***
***REMOVED***

goog.provide('goog.math.interpolator.Interpolator1');



***REMOVED***
***REMOVED*** An interface for one dimensional data interpolation.
***REMOVED*** @interface
***REMOVED***
goog.math.interpolator.Interpolator1 = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Sets the data to be interpolated. Note that the data points are expected
***REMOVED*** to be sorted according to their abscissa values and not have duplicate
***REMOVED*** values. E.g. calling setData([0, 0, 1], [1, 1, 3]) may give undefined
***REMOVED*** results, the correct call should be setData([0, 1], [1, 3]).
***REMOVED*** Calling setData multiple times does not merge the data samples. The last
***REMOVED*** call to setData is the one used when computing the interpolation.
***REMOVED*** @param {!Array.<number>} x The abscissa of the data points.
***REMOVED*** @param {!Array.<number>} y The ordinate of the data points.
***REMOVED***
goog.math.interpolator.Interpolator1.prototype.setData;


***REMOVED***
***REMOVED*** Computes the interpolated value at abscissa x. If x is outside the range
***REMOVED*** of the data points passed in setData, the value is extrapolated.
***REMOVED*** @param {number} x The abscissa to sample at.
***REMOVED*** @return {number} The interpolated value at abscissa x.
***REMOVED***
goog.math.interpolator.Interpolator1.prototype.interpolate;


***REMOVED***
***REMOVED*** Computes the inverse interpolator. That is, it returns invInterp s.t.
***REMOVED*** this.interpolate(invInterp.interpolate(t))) = t. Note that the inverse
***REMOVED*** interpolator is only well defined if the data being interpolated is
***REMOVED*** 'invertible', i.e. it represents a bijective function.
***REMOVED*** In addition, the returned interpolator is only guaranteed to give the exact
***REMOVED*** inverse at the input data passed in getData.
***REMOVED*** If 'this' has no data, the returned Interpolator will be empty as well.
***REMOVED*** @return {!goog.math.interpolator.Interpolator1} The inverse interpolator.
***REMOVED***
goog.math.interpolator.Interpolator1.prototype.getInverse;
