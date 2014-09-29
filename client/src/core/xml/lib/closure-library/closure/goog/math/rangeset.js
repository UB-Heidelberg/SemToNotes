// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A RangeSet is a structure that manages a list of ranges.
***REMOVED*** Numeric ranges may be added and removed from the RangeSet, and the set may
***REMOVED*** be queried for the presence or absence of individual values or ranges of
***REMOVED*** values.
***REMOVED***
***REMOVED*** This may be used, for example, to track the availability of sparse elements
***REMOVED*** in an array without iterating over the entire array.
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED***

goog.provide('goog.math.RangeSet');

goog.require('goog.array');
goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');
goog.require('goog.math.Range');



***REMOVED***
***REMOVED*** Constructs a new RangeSet, which can store numeric ranges.
***REMOVED***
***REMOVED*** Ranges are treated as half-closed: that is, they are exclusive of their end
***REMOVED*** value [start, end).
***REMOVED***
***REMOVED*** New ranges added to the set which overlap the values in one or more existing
***REMOVED*** ranges will be merged.
***REMOVED***
***REMOVED***
***REMOVED***
goog.math.RangeSet = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** A sorted list of ranges that represent the values in the set.
  ***REMOVED*** @type {!Array.<!goog.math.Range>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ranges_ = [];
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {string} A debug string in the form [[1, 5], [8, 9], [15, 30]].
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.RangeSet.prototype.toString = function() {
    return '[' + this.ranges_.join(', ') + ']';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Compares two sets for equality.
***REMOVED***
***REMOVED*** @param {goog.math.RangeSet} a A range set.
***REMOVED*** @param {goog.math.RangeSet} b A range set.
***REMOVED*** @return {boolean} Whether both sets contain the same values.
***REMOVED***
goog.math.RangeSet.equals = function(a, b) {
  // Fast check for object equality. Also succeeds if a and b are both null.
  return a == b || !!(a && b && goog.array.equals(a.ranges_, b.ranges_,
      goog.math.Range.equals));
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet containing the same values as
***REMOVED***      this one.
***REMOVED***
goog.math.RangeSet.prototype.clone = function() {
  var set = new goog.math.RangeSet();

  for (var i = this.ranges_.length; i--;) {
    set.ranges_[i] = this.ranges_[i].clone();
  }

  return set;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a range to the set. If the new range overlaps existing values, those
***REMOVED*** ranges will be merged.
***REMOVED***
***REMOVED*** @param {goog.math.Range} a The range to add.
***REMOVED***
goog.math.RangeSet.prototype.add = function(a) {
  if (a.end <= a.start) {
    // Empty ranges are ignored.
    return;
  }

  a = a.clone();

  // Find the insertion point.
  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (a.start <= b.end) {
      a.start = Math.min(a.start, b.start);
      break;
    }
  }

  var insertionPoint = i;

  for (; b = this.ranges_[i]; i++) {
    if (a.end < b.start) {
      break;
    }
    a.end = Math.max(a.end, b.end);
  }

  this.ranges_.splice(insertionPoint, i - insertionPoint, a);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a range of values from the set.
***REMOVED***
***REMOVED*** @param {goog.math.Range} a The range to remove.
***REMOVED***
goog.math.RangeSet.prototype.remove = function(a) {
  if (a.end <= a.start) {
    // Empty ranges are ignored.
    return;
  }

  // Find the insertion point.
  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (a.start < b.end) {
      break;
    }
  }

  if (!b || a.end < b.start) {
    // The range being removed doesn't overlap any existing range. Exit early.
    return;
  }

  var insertionPoint = i;

  if (a.start > b.start) {
    // There is an overlap with the nearest range. Modify it accordingly.
    insertionPoint++;

    if (a.end < b.end) {
      goog.array.insertAt(this.ranges_,
                          new goog.math.Range(a.end, b.end),
                          insertionPoint);
    }
    b.end = a.start;
  }

  for (i = insertionPoint; b = this.ranges_[i]; i++) {
    b.start = Math.max(a.end, b.start);
    if (a.end < b.end) {
      break;
    }
  }

  this.ranges_.splice(insertionPoint, i - insertionPoint);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether a given range is in the set. Only succeeds if the entire
***REMOVED*** range is available.
***REMOVED***
***REMOVED*** @param {goog.math.Range} a The query range.
***REMOVED*** @return {boolean} Whether the entire requested range is set.
***REMOVED***
goog.math.RangeSet.prototype.contains = function(a) {
  if (a.end <= a.start) {
    return false;
  }

  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (a.start < b.end) {
      if (a.end >= b.start) {
        return goog.math.Range.contains(b, a);
      }
      break;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether a given value is set in the RangeSet.
***REMOVED***
***REMOVED*** @param {number} value The value to test.
***REMOVED*** @return {boolean} Whether the given value is in the set.
***REMOVED***
goog.math.RangeSet.prototype.containsValue = function(value) {
  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (value < b.end) {
      if (value >= b.start) {
        return true;
      }
      break;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the union of this RangeSet with another.
***REMOVED***
***REMOVED*** @param {goog.math.RangeSet} set Another RangeSet.
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet containing all values from
***REMOVED***     either set.
***REMOVED***
goog.math.RangeSet.prototype.union = function(set) {
  // TODO(brenneman): A linear-time merge would be preferable if it is ever a
  // bottleneck.
  set = set.clone();

  for (var i = 0, a; a = this.ranges_[i]; i++) {
    set.add(a);
  }

  return set;
***REMOVED***


***REMOVED***
***REMOVED*** Subtracts the ranges of another set from this one, returning the result
***REMOVED*** as a new RangeSet.
***REMOVED***
***REMOVED*** @param {!goog.math.RangeSet} set The RangeSet to subtract.
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet containing all values in this
***REMOVED***     set minus the values of the input set.
***REMOVED***
goog.math.RangeSet.prototype.difference = function(set) {
  var ret = this.clone();

  for (var i = 0, a; a = set.ranges_[i]; i++) {
    ret.remove(a);
  }

  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Intersects this RangeSet with another.
***REMOVED***
***REMOVED*** @param {goog.math.RangeSet} set The RangeSet to intersect with.
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet containing all values set in
***REMOVED***     both this and the input set.
***REMOVED***
goog.math.RangeSet.prototype.intersection = function(set) {
  if (this.isEmpty() || set.isEmpty()) {
    return new goog.math.RangeSet();
  }

  return this.difference(set.inverse(this.getBounds()));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a subset of this set over the input range.
***REMOVED***
***REMOVED*** @param {goog.math.Range} range The range to copy into the slice.
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet with a copy of the values in the
***REMOVED***     input range.
***REMOVED***
goog.math.RangeSet.prototype.slice = function(range) {
  var set = new goog.math.RangeSet();
  if (range.start >= range.end) {
    return set;
  }

  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (b.end <= range.start) {
      continue;
    }
    if (b.start > range.end) {
      break;
    }

    set.add(new goog.math.Range(Math.max(range.start, b.start),
                                Math.min(range.end, b.end)));
  }

  return set;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an inverted slice of this set over the input range.
***REMOVED***
***REMOVED*** @param {goog.math.Range} range The range to copy into the slice.
***REMOVED*** @return {!goog.math.RangeSet} A new RangeSet containing inverted values from
***REMOVED***     the original over the input range.
***REMOVED***
goog.math.RangeSet.prototype.inverse = function(range) {
  var set = new goog.math.RangeSet();

  set.add(range);
  for (var i = 0, b; b = this.ranges_[i]; i++) {
    if (range.start >= b.end) {
      continue;
    }
    if (range.end < b.start) {
      break;
    }

    set.remove(b);
  }

  return set;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The sum of the lengths of ranges covered in the set.
***REMOVED***
goog.math.RangeSet.prototype.coveredLength = function() {
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (goog.array.reduce(
      this.ranges_,
      function(res, range) {
        return res + range.end - range.start;
      }, 0));
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Range} The total range this set covers, ignoring any
***REMOVED***     gaps between ranges.
***REMOVED***
goog.math.RangeSet.prototype.getBounds = function() {
  if (this.ranges_.length) {
    return new goog.math.Range(this.ranges_[0].start,
                               goog.array.peek(this.ranges_).end);
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether any ranges are currently in the set.
***REMOVED***
goog.math.RangeSet.prototype.isEmpty = function() {
  return this.ranges_.length == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all values in the set.
***REMOVED***
goog.math.RangeSet.prototype.clear = function() {
  this.ranges_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the ranges in the RangeSet.
***REMOVED***
***REMOVED*** @param {boolean=} opt_keys Ignored for RangeSets.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the values in the set.
***REMOVED***
goog.math.RangeSet.prototype.__iterator__ = function(opt_keys) {
  var i = 0;
  var list = this.ranges_;

  var iterator = new goog.iter.Iterator();
  iterator.next = function() {
    if (i >= list.length) {
      throw goog.iter.StopIteration;
    }
    return list[i++].clone();
 ***REMOVED*****REMOVED***

  return iterator;
***REMOVED***
