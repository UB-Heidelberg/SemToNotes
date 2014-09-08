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
***REMOVED*** @fileoverview Provides inversion and inversion map functionality for storing
***REMOVED*** integer ranges and corresponding values.
***REMOVED***
***REMOVED***

goog.provide('goog.structs.InversionMap');

goog.require('goog.array');



***REMOVED***
***REMOVED*** Maps ranges to values.
***REMOVED*** @param {Array.<number>} rangeArray An array of monotonically
***REMOVED***     increasing integer values, with at least one instance.
***REMOVED*** @param {Array.<T>} valueArray An array of corresponding values.
***REMOVED***     Length must be the same as rangeArray.
***REMOVED*** @param {boolean=} opt_delta If true, saves only delta from previous value.
***REMOVED***
***REMOVED*** @template T
***REMOVED***
goog.structs.InversionMap = function(rangeArray, valueArray, opt_delta) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @protected {Array}
 ***REMOVED*****REMOVED***
  this.rangeArray = null;

  if (rangeArray.length != valueArray.length) {
    // rangeArray and valueArray has to match in number of entries.
    return null;
  }
  this.storeInversion_(rangeArray, opt_delta);

 ***REMOVED*****REMOVED*** @protected {Array.<T>}***REMOVED***
  this.values = valueArray;
***REMOVED***


***REMOVED***
***REMOVED*** Stores the integers as ranges (half-open).
***REMOVED*** If delta is true, the integers are delta from the previous value and
***REMOVED*** will be restored to the absolute value.
***REMOVED*** When used as a set, even indices are IN, and odd are OUT.
***REMOVED*** @param {Array.<number?>} rangeArray An array of monotonically
***REMOVED***     increasing integer values, with at least one instance.
***REMOVED*** @param {boolean=} opt_delta If true, saves only delta from previous value.
***REMOVED*** @private
***REMOVED***
goog.structs.InversionMap.prototype.storeInversion_ = function(rangeArray,
    opt_delta) {
  this.rangeArray = rangeArray;

  for (var i = 1; i < rangeArray.length; i++) {
    if (rangeArray[i] == null) {
      rangeArray[i] = rangeArray[i - 1] + 1;
    } else if (opt_delta) {
      rangeArray[i] += rangeArray[i - 1];
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Splices a range -> value map into this inversion map.
***REMOVED*** @param {Array.<number>} rangeArray An array of monotonically
***REMOVED***     increasing integer values, with at least one instance.
***REMOVED*** @param {Array.<T>} valueArray An array of corresponding values.
***REMOVED***     Length must be the same as rangeArray.
***REMOVED*** @param {boolean=} opt_delta If true, saves only delta from previous value.
***REMOVED***
goog.structs.InversionMap.prototype.spliceInversion = function(
    rangeArray, valueArray, opt_delta) {
  // By building another inversion map, we build the arrays that we need
  // to splice in.
  var otherMap = new goog.structs.InversionMap(
      rangeArray, valueArray, opt_delta);

  // Figure out where to splice those arrays.
  var startRange = otherMap.rangeArray[0];
  var endRange =
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (goog.array.peek(otherMap.rangeArray));
  var startSplice = this.getLeast(startRange);
  var endSplice = this.getLeast(endRange);

  // The inversion map works by storing the start points of ranges...
  if (startRange != this.rangeArray[startSplice]) {
    // ...if we're splicing in a start point that isn't already here,
    // then we need to insert it after the insertion point.
    startSplice++;
  } // otherwise we overwrite the insertion point.

  var spliceLength = endSplice - startSplice + 1;
  goog.partial(goog.array.splice, this.rangeArray, startSplice,
      spliceLength).apply(null, otherMap.rangeArray);
  goog.partial(goog.array.splice, this.values, startSplice,
      spliceLength).apply(null, otherMap.values);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value corresponding to a number from the inversion map.
***REMOVED*** @param {number} intKey The number for which value needs to be retrieved
***REMOVED***     from inversion map.
***REMOVED*** @return {T|null} Value retrieved from inversion map; null if not found.
***REMOVED***
goog.structs.InversionMap.prototype.at = function(intKey) {
  var index = this.getLeast(intKey);
  if (index < 0) {
    return null;
  }
  return this.values[index];
***REMOVED***


***REMOVED***
***REMOVED*** Gets the largest index such that rangeArray[index] <= intKey from the
***REMOVED*** inversion map.
***REMOVED*** @param {number} intKey The probe for which rangeArray is searched.
***REMOVED*** @return {number} Largest index such that rangeArray[index] <= intKey.
***REMOVED*** @protected
***REMOVED***
goog.structs.InversionMap.prototype.getLeast = function(intKey) {
  var arr = this.rangeArray;
  var low = 0;
  var high = arr.length;
  while (high - low > 8) {
    var mid = (high + low) >> 1;
    if (arr[mid] <= intKey) {
      low = mid;
    } else {
      high = mid;
    }
  }
  for (; low < high; ++low) {
    if (intKey < arr[low]) {
      break;
    }
  }
  return low - 1;
***REMOVED***
