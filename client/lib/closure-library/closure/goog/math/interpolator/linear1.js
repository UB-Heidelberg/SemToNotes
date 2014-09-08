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
***REMOVED*** @fileoverview A one dimensional linear interpolator.
***REMOVED***
***REMOVED***

goog.provide('goog.math.interpolator.Linear1');

goog.require('goog.array');
goog.require('goog.math');
goog.require('goog.math.interpolator.Interpolator1');



***REMOVED***
***REMOVED*** A one dimensional linear interpolator.
***REMOVED*** @implements {goog.math.interpolator.Interpolator1}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.math.interpolator.Linear1 = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The abscissa of the data points.
  ***REMOVED*** @type {!Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The ordinate of the data points.
  ***REMOVED*** @type {!Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y_ = [];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.math.interpolator.Linear1.prototype.setData = function(x, y) {
  goog.asserts.assert(x.length == y.length,
      'input arrays to setData should have the same length');
  if (x.length == 1) {
    this.x_ = [x[0], x[0] + 1];
    this.y_ = [y[0], y[0]];
  } else {
    this.x_ = x.slice();
    this.y_ = y.slice();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.math.interpolator.Linear1.prototype.interpolate = function(x) {
  var pos = goog.array.binarySearch(this.x_, x);
  if (pos < 0) {
    pos = -pos - 2;
  }
  pos = goog.math.clamp(pos, 0, this.x_.length - 2);

  var progress = (x - this.x_[pos]) / (this.x_[pos + 1] - this.x_[pos]);
  return goog.math.lerp(this.y_[pos], this.y_[pos + 1], progress);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.math.interpolator.Linear1.prototype.getInverse = function() {
  var interpolator = new goog.math.interpolator.Linear1();
  interpolator.setData(this.y_, this.x_);
  return interpolator;
***REMOVED***
