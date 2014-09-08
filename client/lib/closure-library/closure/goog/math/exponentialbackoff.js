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
***REMOVED*** @fileoverview Utility class to manage the mathematics behind computing an
***REMOVED*** exponential backoff model.  Given an initial backoff value and a maximum
***REMOVED*** backoff value, every call to backoff() will double the value until maximum
***REMOVED*** backoff value is reached.
***REMOVED***
***REMOVED***


goog.provide('goog.math.ExponentialBackoff');

goog.require('goog.asserts');



***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED*** @param {number} initialValue The initial backoff value.
***REMOVED*** @param {number} maxValue The maximum backoff value.
***REMOVED***
goog.math.ExponentialBackoff = function(initialValue, maxValue) {
  goog.asserts.assert(initialValue > 0,
      'Initial value must be greater than zero.');
  goog.asserts.assert(maxValue >= initialValue,
      'Max value should be at least as large as initial value.');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initialValue_ = initialValue;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxValue_ = maxValue;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current backoff value.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.currValue_ = initialValue;
***REMOVED***


***REMOVED***
***REMOVED*** The number of backoffs that have happened.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.ExponentialBackoff.prototype.currCount_ = 0;


***REMOVED***
***REMOVED*** Resets the backoff value to its initial value.
***REMOVED***
goog.math.ExponentialBackoff.prototype.reset = function() {
  this.currValue_ = this.initialValue_;
  this.currCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The current backoff value.
***REMOVED***
goog.math.ExponentialBackoff.prototype.getValue = function() {
  return this.currValue_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of times this class has backed off.
***REMOVED***
goog.math.ExponentialBackoff.prototype.getBackoffCount = function() {
  return this.currCount_;
***REMOVED***


***REMOVED***
***REMOVED*** Initiates a backoff.
***REMOVED***
goog.math.ExponentialBackoff.prototype.backoff = function() {
  this.currValue_ = Math.min(this.maxValue_, this.currValue_***REMOVED*** 2);
  this.currCount_++;
***REMOVED***
