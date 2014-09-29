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
***REMOVED*** @fileoverview Implements a 3D ray that are compatible with WebGL.
***REMOVED*** Each element is a float64 in case high precision is required.
***REMOVED*** The API is structured to avoid unnecessary memory allocations.
***REMOVED*** The last parameter will typically be the output vector and an
***REMOVED*** object can be both an input and output parameter to all methods
***REMOVED*** except where noted.
***REMOVED***
***REMOVED***
goog.provide('goog.vec.Ray');

goog.require('goog.vec.Vec3');



***REMOVED***
***REMOVED*** Constructs a new ray with an optional origin and direction. If not specified,
***REMOVED*** the default is [0, 0, 0].
***REMOVED*** @param {goog.vec.Vec3.AnyType=} opt_origin The optional origin.
***REMOVED*** @param {goog.vec.Vec3.AnyType=} opt_dir The optional direction.
***REMOVED***
***REMOVED***
goog.vec.Ray = function(opt_origin, opt_dir) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.vec.Vec3.Number}
 ***REMOVED*****REMOVED***
  this.origin = goog.vec.Vec3.createNumber();
  if (opt_origin) {
    goog.vec.Vec3.setFromArray(this.origin, opt_origin);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.vec.Vec3.Number}
 ***REMOVED*****REMOVED***
  this.dir = goog.vec.Vec3.createNumber();
  if (opt_dir) {
    goog.vec.Vec3.setFromArray(this.dir, opt_dir);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the origin and direction of the ray.
***REMOVED*** @param {goog.vec.AnyType} origin The new origin.
***REMOVED*** @param {goog.vec.AnyType} dir The new direction.
***REMOVED***
goog.vec.Ray.prototype.set = function(origin, dir) {
  goog.vec.Vec3.setFromArray(this.origin, origin);
  goog.vec.Vec3.setFromArray(this.dir, dir);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the origin of the ray.
***REMOVED*** @param {goog.vec.AnyType} origin the new origin.
***REMOVED***
goog.vec.Ray.prototype.setOrigin = function(origin) {
  goog.vec.Vec3.setFromArray(this.origin, origin);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the direction of the ray.
***REMOVED*** @param {goog.vec.AnyType} dir The new direction.
***REMOVED***
goog.vec.Ray.prototype.setDir = function(dir) {
  goog.vec.Vec3.setFromArray(this.dir, dir);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this ray is equal to the other ray.
***REMOVED*** @param {goog.vec.Ray} other The other ray.
***REMOVED*** @return {boolean} True if this ray is equal to the other ray.
***REMOVED***
goog.vec.Ray.prototype.equals = function(other) {
  return other != null &&
      goog.vec.Vec3.equals(this.origin, other.origin) &&
      goog.vec.Vec3.equals(this.dir, other.dir);
***REMOVED***
