// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A utility class for representing two-dimensional sizes.
***REMOVED***


goog.provide('goog.math.Size');



***REMOVED***
***REMOVED*** Class for representing sizes consisting of a width and height. Undefined
***REMOVED*** width and height support is deprecated and results in compiler warning.
***REMOVED*** @param {number} width Width.
***REMOVED*** @param {number} height Height.
***REMOVED***
***REMOVED***
goog.math.Size = function(width, height) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Width
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.width = width;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Height
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.height = height;
***REMOVED***


***REMOVED***
***REMOVED*** Compares sizes for equality.
***REMOVED*** @param {goog.math.Size} a A Size.
***REMOVED*** @param {goog.math.Size} b A Size.
***REMOVED*** @return {boolean} True iff the sizes have equal widths and equal
***REMOVED***     heights, or if both are null.
***REMOVED***
goog.math.Size.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.width == b.width && a.height == b.height;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.math.Size} A new copy of the Size.
***REMOVED***
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
***REMOVED***


if (goog.DEBUG) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns a nice string representing size.
  ***REMOVED*** @return {string} In the form (50 x 73).
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.math.Size.prototype.toString = function() {
    return '(' + this.width + ' x ' + this.height + ')';
 ***REMOVED*****REMOVED***
}


***REMOVED***
***REMOVED*** @return {number} The longer of the two dimensions in the size.
***REMOVED***
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The shorter of the two dimensions in the size.
***REMOVED***
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The area of the size (width***REMOVED*** height).
***REMOVED***
goog.math.Size.prototype.area = function() {
  return this.width***REMOVED*** this.height;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The perimeter of the size (width + height)***REMOVED*** 2.
***REMOVED***
goog.math.Size.prototype.perimeter = function() {
  return (this.width + this.height)***REMOVED*** 2;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The ratio of the size's width to its height.
***REMOVED***
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the size has zero area, false if both dimensions
***REMOVED***     are non-zero numbers.
***REMOVED***
goog.math.Size.prototype.isEmpty = function() {
  return !this.area();
***REMOVED***


***REMOVED***
***REMOVED*** Clamps the width and height parameters upward to integer values.
***REMOVED*** @return {!goog.math.Size} This size with ceil'd components.
***REMOVED***
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!goog.math.Size} target The target size.
***REMOVED*** @return {boolean} True if this Size is the same size or smaller than the
***REMOVED***     target size in both dimensions.
***REMOVED***
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height;
***REMOVED***


***REMOVED***
***REMOVED*** Clamps the width and height parameters downward to integer values.
***REMOVED*** @return {!goog.math.Size} This size with floored components.
***REMOVED***
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Rounds the width and height parameters to integer values.
***REMOVED*** @return {!goog.math.Size} This size with rounded components.
***REMOVED***
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Scales this size by the given scale factors. The width and height are scaled
***REMOVED*** by {@code sx} and {@code opt_sy} respectively.  If {@code opt_sy} is not
***REMOVED*** given, then {@code sx} is used for both the width and height.
***REMOVED*** @param {number} sx The scale factor to use for the width.
***REMOVED*** @param {number=} opt_sy The scale factor to use for the height.
***REMOVED*** @return {!goog.math.Size} This Size object after scaling.
***REMOVED***
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width***REMOVED***= sx;
  this.height***REMOVED***= sy;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Uniformly scales the size to fit inside the dimensions of a given size. The
***REMOVED*** original aspect ratio will be preserved.
***REMOVED***
***REMOVED*** This function assumes that both Sizes contain strictly positive dimensions.
***REMOVED*** @param {!goog.math.Size} target The target size.
***REMOVED*** @return {!goog.math.Size} This Size object, after optional scaling.
***REMOVED***
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ?
      target.width / this.width :
      target.height / this.height;

  return this.scale(s);
***REMOVED***
