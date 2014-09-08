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
***REMOVED*** @fileoverview A utility class for representing a numeric range.
***REMOVED***


goog.provide('goog.math.Range');

goog.require('goog.asserts');



***REMOVED***
***REMOVED*** A number range.
***REMOVED*** @param {number} a One end of the range.
***REMOVED*** @param {number} b The other end of the range.
***REMOVED***
***REMOVED***
goog.math.Range = function(a, b) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The lowest value in the range.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.start = a < b ? a : b;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The highest value in the range.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.end = a < b ? b : a;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a goog.math.Range from an array of two numbers.
***REMOVED*** @param {!Array.<number>} pair
***REMOVED*** @return {!goog.math.Range}
***REMOVED***
goog.math.Range.fromPair = function(pair) {
  goog.asserts.assert(pair.length == 2);
  return new goog.math.Range(pair[0], pair[1]);
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Range} A clone of this Range.
***REMOVED***
goog.math.Range.prototype.clone = function() {
  return new goog.math.Range(this.start, this.end);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Length of the range.
***REMOVED***
goog.math.Range.prototype.getLength = function() {
  return this.end - this.start;
***REMOVED***


***REMOVED***
***REMOVED*** Extends this range to include the given point.
***REMOVED*** @param {number} point
***REMOVED***
goog.math.Range.prototype.includePoint = function(point) {
  this.start = Math.min(this.start, point);
  this.end = Math.max(this.end, point);
***REMOVED***


***REMOVED***
***REMOVED*** Extends this range to include the given range.
***REMOVED*** @param {!goog.math.Range} range
***REMOVED***
goog.math.Range.prototype.includeRange = function(range) {
  this.start = Math.min(this.start, range.start);
  this.end = Math.max(this.end, range.end);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a string representing the range.
  ***REMOVED*** @return {string} In the form [-3.5, 8.13].
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Range.prototype.toString = function() {
    return '[' + this.start + ', ' + this.end + ']';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** Compares ranges for equality.
***REMOVED*** @param {goog.math.Range} a A Range.
***REMOVED*** @param {goog.math.Range} b A Range.
***REMOVED*** @return {boolean} True iff both the starts and the ends of the ranges are
***REMOVED***     equal, or if both ranges are null.
***REMOVED***
goog.math.Range.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.start == b.start && a.end == b.end;
***REMOVED***


***REMOVED***
***REMOVED*** Given two ranges on the same dimension, this method returns the intersection
***REMOVED*** of those ranges.
***REMOVED*** @param {goog.math.Range} a A Range.
***REMOVED*** @param {goog.math.Range} b A Range.
***REMOVED*** @return {goog.math.Range} A new Range representing the intersection of two
***REMOVED***     ranges, or null if there is no intersection. Ranges are assumed to
***REMOVED***     include their end points, and the intersection can be a point.
***REMOVED***
goog.math.Range.intersection = function(a, b) {
  var c0 = Math.max(a.start, b.start);
  var c1 = Math.min(a.end, b.end);
  return (c0 <= c1) ? new goog.math.Range(c0, c1) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Given two ranges on the same dimension, determines whether they intersect.
***REMOVED*** @param {goog.math.Range} a A Range.
***REMOVED*** @param {goog.math.Range} b A Range.
***REMOVED*** @return {boolean} Whether they intersect.
***REMOVED***
goog.math.Range.hasIntersection = function(a, b) {
  return Math.max(a.start, b.start) <= Math.min(a.end, b.end);
***REMOVED***


***REMOVED***
***REMOVED*** Given two ranges on the same dimension, this returns a range that covers
***REMOVED*** both ranges.
***REMOVED*** @param {goog.math.Range} a A Range.
***REMOVED*** @param {goog.math.Range} b A Range.
***REMOVED*** @return {!goog.math.Range} A new Range representing the bounding
***REMOVED***     range.
***REMOVED***
goog.math.Range.boundingRange = function(a, b) {
  return new goog.math.Range(Math.min(a.start, b.start),
                             Math.max(a.end, b.end));
***REMOVED***


***REMOVED***
***REMOVED*** Given two ranges, returns true if the first range completely overlaps the
***REMOVED*** second.
***REMOVED*** @param {goog.math.Range} a The first Range.
***REMOVED*** @param {goog.math.Range} b The second Range.
***REMOVED*** @return {boolean} True if b is contained inside a, false otherwise.
***REMOVED***
goog.math.Range.contains = function(a, b) {
  return a.start <= b.start && a.end >= b.end;
***REMOVED***


***REMOVED***
***REMOVED*** Given a range and a point, returns true if the range contains the point.
***REMOVED*** @param {goog.math.Range} range The range.
***REMOVED*** @param {number} p The point.
***REMOVED*** @return {boolean} True if p is contained inside range, false otherwise.
***REMOVED***
goog.math.Range.containsPoint = function(range, p) {
  return range.start <= p && range.end >= p;
***REMOVED***
