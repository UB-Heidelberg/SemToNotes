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
***REMOVED*** @fileoverview Wrapper for a IndexedDB key range.
***REMOVED***
***REMOVED***


goog.provide('goog.db.KeyRange');



***REMOVED***
***REMOVED*** Creates a new IDBKeyRange wrapper object. Should not be created directly,
***REMOVED*** instead use one of the static factory methods. For example:
***REMOVED*** @see goog.db.KeyRange.bound
***REMOVED*** @see goog.db.KeyRange.lowerBound
***REMOVED***
***REMOVED*** @param {!IDBKeyRange} range Underlying IDBKeyRange object.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.db.KeyRange = function(range) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying IDBKeyRange object.
  ***REMOVED***
  ***REMOVED*** @type {!IDBKeyRange}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.range_ = range;
***REMOVED***


***REMOVED***
***REMOVED*** The IDBKeyRange.
***REMOVED*** @type {!Object}
***REMOVED*** @private
***REMOVED***
goog.db.KeyRange.IDB_KEY_RANGE_ = goog.global.IDBKeyRange ||
    goog.global.webkitIDBKeyRange;


***REMOVED***
***REMOVED*** Creates a new key range for a single value.
***REMOVED***
***REMOVED*** @param {IDBKeyType} key The single value in the range.
***REMOVED*** @return {!goog.db.KeyRange} The key range.
***REMOVED***
goog.db.KeyRange.only = function(key) {
  return new goog.db.KeyRange(goog.db.KeyRange.IDB_KEY_RANGE_.only(key));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a key range with upper and lower bounds.
***REMOVED***
***REMOVED*** @param {IDBKeyType} lower The value of the lower bound.
***REMOVED*** @param {IDBKeyType} upper The value of the upper bound.
***REMOVED*** @param {boolean=} opt_lowerOpen If true, the range excludes the lower bound
***REMOVED***     value.
***REMOVED*** @param {boolean=} opt_upperOpen If true, the range excludes the upper bound
***REMOVED***     value.
***REMOVED*** @return {!goog.db.KeyRange} The key range.
***REMOVED***
goog.db.KeyRange.bound = function(lower, upper, opt_lowerOpen, opt_upperOpen) {
  return new goog.db.KeyRange(goog.db.KeyRange.IDB_KEY_RANGE_.bound(
      lower, upper, opt_lowerOpen, opt_upperOpen));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a key range with a lower bound only, finishes at the last record.
***REMOVED***
***REMOVED*** @param {IDBKeyType} lower The value of the lower bound.
***REMOVED*** @param {boolean=} opt_lowerOpen If true, the range excludes the lower bound
***REMOVED***     value.
***REMOVED*** @return {!goog.db.KeyRange} The key range.
***REMOVED***
goog.db.KeyRange.lowerBound = function(lower, opt_lowerOpen) {
  return new goog.db.KeyRange(goog.db.KeyRange.IDB_KEY_RANGE_.lowerBound(
      lower, opt_lowerOpen));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a key range with a upper bound only, starts at the first record.
***REMOVED***
***REMOVED*** @param {IDBKeyType} upper The value of the upper bound.
***REMOVED*** @param {boolean=} opt_upperOpen If true, the range excludes the upper bound
***REMOVED***     value.
***REMOVED*** @return {!goog.db.KeyRange} The key range.
***REMOVED***
goog.db.KeyRange.upperBound = function(upper, opt_upperOpen) {
  return new goog.db.KeyRange(goog.db.KeyRange.IDB_KEY_RANGE_.upperBound(
      upper, opt_upperOpen));
***REMOVED***


***REMOVED***
***REMOVED*** Returns underlying key range object. This is used in ObjectStore's openCursor
***REMOVED*** and count methods.
***REMOVED*** @return {!IDBKeyRange}
***REMOVED***
goog.db.KeyRange.prototype.range = function() {
  return this.range_;
***REMOVED***
