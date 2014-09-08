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
***REMOVED*** @fileoverview A thick wrapper around paths.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.graphics.ext.Path');

goog.require('goog.graphics.AffineTransform');
goog.require('goog.graphics.Path');
goog.require('goog.math');
goog.require('goog.math.Rect');



***REMOVED***
***REMOVED*** Creates a path object
***REMOVED***
***REMOVED*** @extends {goog.graphics.Path}
***REMOVED*** @final
***REMOVED***
goog.graphics.ext.Path = function() {
  goog.graphics.Path.call(this);
***REMOVED***
goog.inherits(goog.graphics.ext.Path, goog.graphics.Path);


***REMOVED***
***REMOVED*** Optional cached or user specified bounding box.  A user may wish to
***REMOVED*** precompute a bounding box to save time and include more accurate
***REMOVED*** computations.
***REMOVED*** @type {goog.math.Rect?}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Path.prototype.bounds_ = null;


***REMOVED***
***REMOVED*** Clones the path.
***REMOVED*** @return {!goog.graphics.ext.Path} A clone of this path.
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Path.prototype.clone = function() {
  var output =***REMOVED*****REMOVED*** @type {goog.graphics.ext.Path}***REMOVED***
      (goog.graphics.ext.Path.superClass_.clone.call(this));
  output.bounds_ = this.bounds_ && this.bounds_.clone();
  return output;
***REMOVED***


***REMOVED***
***REMOVED*** Transforms the path. Only simple paths are transformable. Attempting
***REMOVED*** to transform a non-simple path will throw an error.
***REMOVED*** @param {!goog.graphics.AffineTransform} tx The transformation to perform.
***REMOVED*** @return {!goog.graphics.ext.Path} The path itself.
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Path.prototype.transform = function(tx) {
  goog.graphics.ext.Path.superClass_.transform.call(this, tx);

  // Make sure the precomputed bounds are cleared when the path is transformed.
  this.bounds_ = null;

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Modify the bounding box of the path.  This may cause the path to be
***REMOVED*** simplified (i.e. arcs converted to curves) as a side-effect.
***REMOVED*** @param {number} deltaX How far to translate the x coordinates.
***REMOVED*** @param {number} deltaY How far to translate the y coordinates.
***REMOVED*** @param {number} xFactor After translation, all x coordinates are multiplied
***REMOVED***     by this number.
***REMOVED*** @param {number} yFactor After translation, all y coordinates are multiplied
***REMOVED***     by this number.
***REMOVED*** @return {!goog.graphics.ext.Path} The path itself.
***REMOVED***
goog.graphics.ext.Path.prototype.modifyBounds = function(deltaX, deltaY,
    xFactor, yFactor) {
  if (!this.isSimple()) {
    var simple = goog.graphics.Path.createSimplifiedPath(this);
    this.clear();
    this.appendPath(simple);
  }

  return this.transform(goog.graphics.AffineTransform.getScaleInstance(
      xFactor, yFactor).translate(deltaX, deltaY));
***REMOVED***


***REMOVED***
***REMOVED*** Set the precomputed bounds.
***REMOVED*** @param {goog.math.Rect?} bounds The bounds to use, or set to null to clear
***REMOVED***     and recompute on the next call to getBoundingBox.
***REMOVED***
goog.graphics.ext.Path.prototype.useBoundingBox = function(bounds) {
  this.bounds_ = bounds && bounds.clone();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Rect?} The bounding box of the path, or null if the
***REMOVED***     path is empty.
***REMOVED***
goog.graphics.ext.Path.prototype.getBoundingBox = function() {
  if (!this.bounds_ && !this.isEmpty()) {
    var minY;
    var minX = minY = Number.POSITIVE_INFINITY;
    var maxY;
    var maxX = maxY = Number.NEGATIVE_INFINITY;

    var simplePath = this.isSimple() ? this :
        goog.graphics.Path.createSimplifiedPath(this);
    simplePath.forEachSegment(function(type, points) {
      for (var i = 0, len = points.length; i < len; i += 2) {
        minX = Math.min(minX, points[i]);
        maxX = Math.max(maxX, points[i]);
        minY = Math.min(minY, points[i + 1]);
        maxY = Math.max(maxY, points[i + 1]);
      }
    });

    this.bounds_ = new goog.math.Rect(minX, minY, maxX - minX, maxY - minY);
  }

  return this.bounds_;
***REMOVED***
